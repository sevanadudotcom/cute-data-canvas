import { createFileRoute } from "@tanstack/react-router";
import LegalPage from "@/components/LegalPage";

export const Route = createFileRoute("/about")({
  head: () => ({
    meta: [
      { title: "About SewaNadu — Independent Indian e-Service Guide" },
      {
        name: "description",
        content:
          "Who runs SewaNadu, how our government-service content is researched and updated, and our editorial and advertising standards.",
      },
      { property: "og:title", content: "About SewaNadu" },
      {
        property: "og:description",
        content:
          "An independent citizen guide to Indian central and state government services — our mission, method and editorial standards.",
      },
      { property: "og:type", content: "article" },
      { property: "og:url", content: "/about" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
    links: [{ rel: "canonical", href: "/about" }],
  }),
  component: () => (
    <LegalPage
      title="About SewaNadu"
      subtitle="An independent, free guide that tells Indian citizens exactly which documents a government service needs — before they stand in the queue."
      updated="5 August 2026"
      sections={[
        {
          heading: "Why this exists",
          body: (
            <p>
              Most rejected applications fail for a boring reason: one missing paper. Requirements
              are spread across dozens of central and state portals, often only in English, often
              buried in PDFs. SewaNadu collects them in one place, in plain language, in eleven
              Indian languages, with a direct link to the official portal for every service.
            </p>
          ),
        },
        {
          heading: "What you get",
          body: (
            <ul>
              <li>Document checklists for central and state services across all States and UTs.</li>
              <li>Eligibility guidance you can check before you apply.</li>
              <li>Indicative fees, processing timelines and the responsible department.</li>
              <li>Direct links to the official application portal — we never sit in the middle.</li>
              <li>Help content on grievances, RTI and where to escalate.</li>
            </ul>
          ),
        },
        {
          heading: "How content is produced",
          body: (
            <p>
              Every entry is compiled from publicly available official sources — ministry and state
              department portals, service charters and published notifications — and rewritten for
              clarity. Entries are reviewed periodically and corrected when readers report changes.
              Where a rule varies by state or district, we say so instead of guessing.
            </p>
          ),
        },
        {
          heading: "Editorial independence",
          body: (
            <p>
              Advertising pays the hosting bill. It never determines which services we cover or what
              we say about them. Ads are clearly labelled and separated from editorial content, and
              we do not accept payment for favourable placement in the directory.
            </p>
          ),
        },
        {
          heading: "Independence from government",
          body: (
            <p>
              SewaNadu is not a government website and has no official affiliation. Read the full{" "}
              <a href="/disclaimer">Disclaimer</a> for what that means in practice.
            </p>
          ),
        },
        {
          heading: "Talk to us",
          body: (
            <p>
              Corrections, missing services and feedback are genuinely welcome — use the{" "}
              <a href="/contact">Contact</a> page.
            </p>
          ),
        },
      ]}
    />
  ),
});
