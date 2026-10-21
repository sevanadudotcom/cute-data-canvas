import { createServerFn } from "@tanstack/react-start";
import { createClient } from "@supabase/supabase-js";
import { z } from "zod";
import type { Database } from "@/integrations/supabase/types";

/**
 * AI Service Advisor — a citizen describes their situation in their own
 * words, and the model picks the most relevant services from the live
 * SewaNadu catalogue and explains the next steps.
 *
 * The full catalogue is never sent to the model: a fast keyword pass first
 * narrows it to ~40 candidates, then the model chooses and explains.
 */

export type AdvisedService = {
  id: string;
  title: string;
  department: string;
  category: string;
  jurisdiction: string;
  fees: number;
  processingTime: string;
  documentsRequired: string[];
  why: string;
  fit: number;
};

export type AdvisorResult = {
  summary: string;
  nextSteps: string[];
  matches: AdvisedService[];
  source: "ai" | "keyword";
  note?: string;
};

type ServiceRow = {
  id: string;
  title: string;
  department: string;
  description: string;
  category: string;
  fees: number;
  processing_time: string;
  documents_required: string[];
  jurisdiction: string;
};

const STOP_WORDS = new Set([
  "the", "and", "for", "with", "have", "has", "was", "were", "are", "our", "his", "her", "its",
  "not", "but", "you", "your", "from", "this", "that", "they", "them", "their", "will", "would",
  "can", "could", "should", "need", "want", "want", "get", "got", "how", "what", "when", "where",
  "there", "here", "about", "into", "over", "after", "before", "very", "also", "any", "all",
]);

function tokenize(text: string): string[] {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, " ")
    .split(/\s+/)
    .filter((w) => w.length > 2 && !STOP_WORDS.has(w));
}

function scoreService(row: ServiceRow, tokens: string[]): number {
  if (tokens.length === 0) return 0;
  const title = row.title.toLowerCase();
  const dept = row.department.toLowerCase();
  const desc = row.description.toLowerCase();
  const category = row.category.toLowerCase().replace(/_/g, " ");
  const docs = (row.documents_required ?? []).join(" ").toLowerCase();
  let score = 0;
  for (const token of tokens) {
    if (title.includes(token)) score += 4;
    if (category.includes(token)) score += 3;
    if (dept.includes(token)) score += 2;
    if (desc.includes(token)) score += 2;
    if (docs.includes(token)) score += 1;
  }
  return score;
}

// 10-minute catalogue cache per server isolate.
let cache: { rows: ServiceRow[]; at: number } | null = null;

function publishableClient() {
  const url = process.env["SUPABASE_URL"]!;
  const key = process.env["SUPABASE_PUBLISHABLE_KEY"]!;
  return createClient<Database>(url, key, {
    auth: { persistSession: false },
    // Opaque sb_ keys aren't JWTs; send only apikey, not a bearer header.
    global: {
      fetch: (input, init) => {
        const headers = new Headers(init?.headers);
        if (key.startsWith("sb_") && headers.get("Authorization") === `Bearer ${key}`) {
          headers.delete("Authorization");
        }
        headers.set("apikey", key);
        return fetch(input, { ...init, headers });
      },
    },
  });
}

async function loadCatalogue(): Promise<ServiceRow[]> {
  if (cache && Date.now() - cache.at < 10 * 60 * 1000) return cache.rows;
  const supabase = publishableClient();
  const { data, error } = await supabase
    .from("services")
    .select("id,title,department,description,category,fees,processing_time,documents_required,jurisdiction");
  if (error || !data) throw new Error(`Catalogue unavailable: ${error?.message ?? "no data"}`);
  const rows = data as ServiceRow[];
  cache = { rows, at: Date.now() };
  return rows;
}

function compactCandidate(row: ServiceRow): string {
  const docs = (row.documents_required ?? []).slice(0, 4).join("; ") || "varies";
  return [
    row.id,
    row.title,
    `category=${row.category}`,
    `issuer=${row.department}`,
    `area=${row.jurisdiction}`,
    `fee=₹${row.fees}`,
    `time=${row.processing_time}`,
    `docs=${docs}`,
  ].join(" | ");
}

const SYSTEM_PROMPT = `You are the SewaNadu Service Advisor for an independent Indian civic-services guide.
A citizen describes their situation; you pick the MOST relevant government services from the candidate list and explain what to do next.
Rules:
- Choose at most 3 candidates, ranked by fit. Use ONLY candidate ids that appear in the list.
- If no candidate truly fits, still pick the closest ones and say in "summary" what a citizen should ask for instead.
- "why" must be 1-2 sentences, in plain language, referencing the citizen's situation. No jargon.
- "nextSteps" must be 3-5 short, concrete, numbered-string steps (who to approach, what to bring, what happens after).
- Never claim the portal itself files anything or issues documents; it is guidance only.
- Reply with JSON only, shaped exactly as: {"summary": string, "matches": [{"serviceId": string, "why": string, "fit": number}], "nextSteps": string[]}`;

const inputSchema = z.object({
  situation: z.string().trim().min(10).max(1200),
  stateId: z.string().trim().max(64).optional(),
});

export const getAiServiceAdvice = createServerFn({ method: "POST" })
  .inputValidator((input) => inputSchema.parse(input))
  .handler(async ({ data }): Promise<AdvisorResult> => {
    const rows = await loadCatalogue();

    // Narrow to the chosen state/UT (plus central services) before scoring.
    const scoped =
      data.stateId && data.stateId !== "all"
        ? rows.filter((r) => r.jurisdiction === data.stateId || r.jurisdiction === "central")
        : rows;

    const tokens = tokenize(data.situation);
    const scored = scoped
      .map((row) => ({ row, score: scoreService(row, tokens) }))
      .sort((a, b) => b.score - a.score);

    let candidates = scored.slice(0, 40).map((s) => s.row);

    // Weak keyword matches (or a non-English situation): pad with a spread of
    // central + first-letter-of-state services so the model still has options.
    if (candidates.length < 12) {
      const chosen = new Set(candidates.map((c) => c.id));
      const pad = scoped.filter((r) => !chosen.has(r.id));
      // Prefer central services, then anything from the scope, up to 40 total.
      const padRows = [...pad.filter((r) => r.jurisdiction === "central"), ...pad].slice(
        0,
        40 - candidates.length,
      );
      candidates = [...candidates, ...padRows];
    }

    if (candidates.length === 0) {
      return {
        summary: "No services matched that description yet — try naming the document or scheme you are looking for.",
        nextSteps: [],
        matches: [],
        source: "keyword",
        note: "Try mentioning the state and the purpose (identity, income, farming, school, health).",
      };
    }

    const userPrompt = `Citizen's situation: """${data.situation}"""
${data.stateId && data.stateId !== "all" ? `Preferred jurisdiction id: ${data.stateId} (also consider central government services when they apply nationwide).` : "No state selected — consider both central and state-level options and mention where each applies."}

Candidate services (id | title | ...):
${candidates.map(compactCandidate).join("\n")}`;

    const apiKey = process.env["LOVABLE_API_KEY"];
    if (!apiKey) {
      return keywordFallback(scored, candidates);
    }

    try {
      const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${apiKey}`,
        },
        body: JSON.stringify({
          model: "google/gemini-3.8-flash",
          temperature: 0.4,
          max_tokens: 1400,
          response_format: { type: "json_object" },
          messages: [
            { role: "system", content: SYSTEM_PROMPT },
            { role: "user", content: userPrompt },
          ],
        }),
      });

      if (!response.ok) throw new Error(`Gateway responded ${response.status}`);
      const payload = (await response.json()) as {
        choices?: { message?: { content?: string } }[];
      };
      const content = payload.choices?.[0]?.message?.content;
      if (!content) throw new Error("Empty model response");

      const parsed = JSON.parse(content) as {
        summary?: string;
        matches?: { serviceId?: string; why?: string; fit?: number }[];
        nextSteps?: string[];
      };

      const byId = new Map(candidates.map((c) => [c.id, c]));
      const matches: AdvisedService[] = (parsed.matches ?? [])
        .filter((m): m is { serviceId: string; why: string; fit: number } => !!m.serviceId)
        .map((m) => {
          const row = byId.get(m.serviceId);
          if (!row) return null;
          return {
            id: row.id,
            title: row.title,
            department: row.department,
            category: row.category,
            jurisdiction: row.jurisdiction,
            fees: row.fees,
            processingTime: row.processing_time,
            documentsRequired: row.documents_required ?? [],
            why: m.why ?? "Closest match to your description.",
            fit: typeof m.fit === "number" ? Math.max(0, Math.min(100, Math.round(m.fit))) : 70,
          } satisfies AdvisedService;
        })
        .filter((m): m is AdvisedService => m !== null)
        .slice(0, 3);

      if (matches.length === 0) return keywordFallback(scored, candidates);

      return {
        summary: parsed.summary?.trim() || "Here is what fits your situation.",
        nextSteps: (parsed.nextSteps ?? []).filter((s) => typeof s === "string" && s.trim()).slice(0, 6),
        matches,
        source: "ai",
      };
    } catch (err) {
      console.error("[advisor] gateway call failed:", err instanceof Error ? err.message : err);
      return keywordFallback(scored, candidates);
    }
  });

// If the model call fails, still give the citizen the keyword matches so the
// page degrades gracefully instead of erroring out.
function keywordFallback(
  scored: { row: ServiceRow; score: number }[],
  candidates: ServiceRow[],
): AdvisorResult {
  const pool = candidates.length > 0 ? candidates : scored.map((s) => s.row);
  const ranked = scored.filter((s) => s.score > 0).slice(0, 3);
  const fallbackRows = ranked.length > 0 ? ranked.map((s) => s.row) : pool.slice(0, 3);
  return {
    summary:
      "The AI advisor is briefly unavailable, so here are the closest catalogue matches based on your words. Please double-check details on the official portal.",
    nextSteps: [
      "Open the service card below and note the documents and fee listed.",
      "Visit the issuing department's official portal or nearest service centre.",
      "Carry originals plus photocopies of the listed documents.",
    ],
    matches: fallbackRows.map((row) => ({
      id: row.id,
      title: row.title,
      department: row.department,
      category: row.category,
      jurisdiction: row.jurisdiction,
      fees: row.fees,
      processingTime: row.processing_time,
      documentsRequired: row.documents_required ?? [],
      why: "Matched keywords from your description (offline matching).",
      fit: 45,
    })),
    source: "keyword",
    note: "AI recommendation is temporarily unavailable.",
  };
}
