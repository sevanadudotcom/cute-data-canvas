import { officialServicesList } from "@/services-data";
import type { ESevaService } from "@/types";

const officialServices: ESevaService[] = officialServicesList;

// ---------------------------------------------------------------
// AI helper (Lovable AI Gateway)
// ---------------------------------------------------------------
export async function generateText(params: {
  prompt: string;
  system?: string;
  messages?: { role: "user" | "assistant"; content: string }[];
  maxTokens?: number;
  temperature?: number;
}): Promise<string> {
  const apiKey = process.env["LOVABLE_API_KEY"];
  if (!apiKey) throw new Error("AI gateway is not configured");

  const messages: { role: string; content: string }[] = [];
  if (params.system) messages.push({ role: "system", content: params.system });
  if (params.messages?.length) messages.push(...params.messages);
  if (params.prompt) messages.push({ role: "user", content: params.prompt });

  const res = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model: "google/gemini-2.5-flash",
      messages,
      max_tokens: params.maxTokens ?? 600,
      temperature: params.temperature ?? 0.7,
    }),
  });

  if (!res.ok) {
    throw new Error(`AI gateway error ${res.status}: ${await res.text()}`);
  }
  const data = (await res.json()) as {
    choices?: { message?: { content?: string } }[];
  };
  return data.choices?.[0]?.message?.content?.trim() ?? "";
}

async function sha256Hex(input: string): Promise<string> {
  const buf = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(input));
  return Array.from(new Uint8Array(buf))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}

// ---------------------------------------------------------------
// In-memory demo collections (simulation data, not real records)
// ---------------------------------------------------------------
let serviceApplications: any[] = [
  {
    id: "app-default-1",
    serviceId: "revenue-income",
    serviceName: "e-Pramaan Revenue Caste & Income Certificate",
    arn: "ARN-2026-984210",
    applicantName: "Shahrukh Khan",
    aadhaarNumber: "XXXX-XXXX-3780",
    state: "Karnataka",
    submissionDate: "2026-06-11T12:00:00Z",
    status: "APPROVED",
    comments:
      "Verified against State Revenue ledger by Tehsildar Indiranagar on 2026-06-12.",
    formData: {
      fatherName: "K. Khan",
      educationQuota: "Yes",
      declaredIncome: "₹3,50,000",
      casteCategory: "General / EWS",
    },
    approvedDate: "2026-06-12T16:45:00Z",
  },
  {
    id: "app-default-2",
    serviceId: "uidai-aadhaar",
    serviceName: "Aadhaar Demographic Update & Address Change",
    arn: "ARN-2026-441029",
    applicantName: "Shahrukh Khan",
    aadhaarNumber: "XXXX-XXXX-3780",
    state: "Karnataka",
    submissionDate: "2026-06-12T19:30:00Z",
    status: "UNDER_VERIFICATION",
    comments:
      "In process. Police Verification clearance and regional UIDAI nodal approval pending.",
    formData: {
      requestedChange: "Address Update",
      newAddress: "Flat 401, Sapphire Palms, Indiranagar, Bengaluru, 560038",
    },
  },
];

let grievanceList: any[] = [
  {
    id: "grievance-1",
    department: "Unique Identification Authority of India (UIDAI)",
    serviceAffected: "Biometric Enrollment Delays",
    refNumber: "CPG-UIDAI-2026-8941",
    subject:
      "Aadhaar center at Indiranagar postal house charging hidden convenience fees",
    description:
      "The appointed executive is demanding ₹150 for scanning thumb impressions whereas the official regulatory circular states biometric update holds standard ₹50 service pricing. Citizen service charter needs close enforcement.",
    stateOfGrievance: "Karnataka",
    status: "RESOLVED",
    dateFiled: "2026-06-10",
    officialReply:
      "Dear Applicant, an inspection was carried out at India Post Office, Indiranagar Branch on 2026-06-11. General notice issued to the vendor desk. Standard UIDAI fee rates have been strictly displayed on prominent billboard banners. Overcharged amount will be processed for refund where relevant credentials support it. Thank you for utilizing CPGRAMS portal.",
    replyDate: "2026-06-12",
  },
  {
    id: "grievance-2",
    department: "Ministry of Road Transport & Highways",
    serviceAffected: "National Highways & Regional Tolls",
    refNumber: "CPG-MORTH-2026-1205",
    subject:
      "Excessive queuing at NH-44 Devanahalli toll gate due to slow Fastag reader",
    description:
      "The digital Fastag RFID scanners at the left-side lanes fail frequently, creating 45-minute bottlenecks for commuters connecting to Bangalore International Airport. It compromises highway service-level metrics.",
    stateOfGrievance: "Karnataka",
    status: "LODGED",
    dateFiled: "2026-06-12",
  },
];

let digiLockerVault: any[] = [
  {
    id: "dl-card-1",
    docType: "AADHAAR",
    docNumber: "XXXX-XXXX-3780",
    holderName: "Shahrukh Khan",
    issueDate: "2026-01-10",
    digitalSignature: "SHA256:UIDAI-SIG-f8a4cd399e2",
    qrCodeText:
      "Digital India Verifiable Aadhaar: Holder: Shahrukh Khan, Year: 1995, Mobile Ref: XXXX-XX-55",
    data: {
      gender: "Male",
      fatherName: "K. Khan",
      dateOfBirth: "15-08-1995",
      address: "B-42, Defence Colony, New Delhi - 110024",
    },
  },
  {
    id: "dl-card-2",
    docType: "PAN",
    docNumber: "APYPK3780P",
    holderName: "Shahrukh Khan",
    issueDate: "2026-03-05",
    digitalSignature: "HMAC-INCOMETAX-330a61ef",
    qrCodeText: "PAN-APYPK3780P-HOLDER:SHAHRUKH-KHAN-DOB:15/08/1995",
    data: {
      category: "Individual",
      issuingAuthority: "NSDL / Tax Dept of India",
      panStatus: "Active Verified",
    },
  },
];

const portalFeedbackList: any[] = [];
const serviceIssuesList: any[] = [];

interface DiscussionComment {
  id: string;
  commenterName: string;
  commenterStatus: string;
  text: string;
  timestamp: string;
}

interface DiscussionThread {
  id: string;
  title: string;
  policyArea: string;
  content: string;
  postedBy: string;
  profileStatus: string;
  verificationCount: number;
  verifiedCitizens: string[];
  comments: DiscussionComment[];
  timestamp: string;
  status: "PROPOSED" | "COMMUNITY_VERIFIED" | "FLAGGED";
}

const citizenDiscussions: DiscussionThread[] = [
  {
    id: "thread-1",
    title: "Karnataka New Ration Card (e-Ration) Biometric Update Exemption",
    policyArea: "WELFARE",
    content:
      "Under the new civil supplies food directive, elderly citizens above 75 years are now exempted from mandatory bi-annual biometric profile verification. They can instead opt for mobile Aadhaar OTP authentication starting next Monday.",
    postedBy: "Rajesh Kumar",
    profileStatus: "Aadhaar Verified",
    verificationCount: 5,
    verifiedCitizens: [
      "Shahrukh Khan",
      "Vijay Patil",
      "Ananya Sharma",
      "Amit Shah",
      "Narendra Modi",
    ],
    comments: [
      {
        id: "c-1-1",
        commenterName: "Vijay Patil",
        commenterStatus: "Aadhaar Verified",
        text: "This is a huge relief for my grandfather. We confirmed it at our local e-Seva center yesterday.",
        timestamp: "2026-06-22T14:30:00Z",
      },
    ],
    timestamp: "2026-06-22T10:00:00Z",
    status: "COMMUNITY_VERIFIED",
  },
  {
    id: "thread-2",
    title: "Driving Licence Renewal Timeline Extended to 45 Days",
    policyArea: "LAND",
    content:
      "The regional transport department has reportedly extended the grace period for DL renewal from 30 days to 45 days after expiry without fine penalty. Requesting anyone who renewed today to verify if the server fee waiver is live.",
    postedBy: "Amrita Sen",
    profileStatus: "Aadhaar Verified",
    verificationCount: 2,
    verifiedCitizens: ["Ramesh Shashtri", "Divya Teja"],
    comments: [
      {
        id: "c-2-1",
        commenterName: "Ramesh Shashtri",
        commenterStatus: "Unverified Citizen",
        text: "I just checked the Sarathi portal, and it still shows the old 30-day prompt. Has anyone else verified?",
        timestamp: "2026-06-23T08:15:00Z",
      },
    ],
    timestamp: "2026-06-23T07:00:00Z",
    status: "PROPOSED",
  },
];

// ---------------------------------------------------------------
// Handlers
// ---------------------------------------------------------------
const json = (data: unknown, status = 200) =>
  new Response(JSON.stringify(data), {
    status,
    headers: { "content-type": "application/json" },
  });

export async function handleESevaRequest(request: Request): Promise<Response> {
  const url = new URL(request.url);
  const path = url.pathname.replace(/^\/api\/public\/eseva/, "").replace(/\/$/, "");
  const method = request.method.toUpperCase();
  const body: any =
    method === "GET" || method === "DELETE"
      ? {}
      : await request.json().catch(() => ({}));

  // 1. Services
  if (path === "/services" && method === "GET") return json(officialServices);

  // 2. Applications
  if (path === "/applications" && method === "GET") return json(serviceApplications);

  // 3. Apply
  if (path === "/apply" && method === "POST") {
    const { serviceId, applicantName, aadhaarNumber, state, formData } = body;
    if (!serviceId || !applicantName || !aadhaarNumber) {
      return json(
        { error: "Missing required fields (serviceId, applicantName, aadhaarNumber)." },
        400,
      );
    }
    const selectedService = officialServices.find((s) => s.id === serviceId);
    if (!selectedService) return json({ error: "Service configuration not found." }, 404);

    const randomARN = "ARN-2026-" + Math.floor(100000 + Math.random() * 900000);
    const isInstant =
      selectedService.category === "HEALTH" || selectedService.category === "LABOUR";
    const finalStatus = isInstant ? "APPROVED" : "SUBMITTED";
    const defaultComments = isInstant
      ? "Digitally verified using instant biometric e-KYC. Credential dispatched to your DigiLocker."
      : "Application logged successfully. District revenue officer assigned for desk audit of supplementary documents.";

    const newApp = {
      id: "app-" + Date.now(),
      serviceId: selectedService.id,
      serviceName: selectedService.title,
      arn: randomARN,
      applicantName,
      aadhaarNumber: `XXXX-XXXX-${String(aadhaarNumber).slice(-4) || "0000"}`,
      state,
      submissionDate: new Date().toISOString(),
      status: finalStatus,
      comments: defaultComments,
      formData: formData || {},
      approvedDate: isInstant ? new Date().toISOString() : undefined,
    };
    serviceApplications.unshift(newApp);

    if (finalStatus === "APPROVED") {
      let cardType = "AADHAAR";
      let formattedDocNumber = "XXXX-XXXX-" + Math.floor(1000 + Math.random() * 9000);
      if (selectedService.id === "mohfw-abha") {
        cardType = "ABHA_HEALTH";
        formattedDocNumber = `91-${Math.floor(1000 + Math.random() * 9000)}-${Math.floor(1000 + Math.random() * 9000)}-${Math.floor(1000 + Math.random() * 9000)}`;
      } else if (selectedService.id === "mole-eshram") {
        cardType = "E_SHRAM";
        formattedDocNumber = `UAN-${Math.floor(100000000000 + Math.random() * 900000000000)}`;
      }
      const digitalToken = (await sha256Hex(JSON.stringify(newApp))).slice(0, 24);
      digiLockerVault.unshift({
        id: "dl-card-" + Date.now(),
        docType: cardType,
        docNumber: formattedDocNumber,
        holderName: applicantName,
        issueDate: new Date().toISOString().split("T")[0],
        digitalSignature: `SHA256:GOI-SIG-${digitalToken.toUpperCase()}`,
        qrCodeText: `e-Seva National Verifiable Document: Type: ${cardType}, Holder: ${applicantName}, Ref: ${randomARN}`,
        data: {
          registeredState: state,
          issueChannel: "Pradhan Mantri National e-Seva Console",
          ...formData,
        },
      });
    }

    return json({
      success: true,
      application: newApp,
      toastMessage: isInstant
        ? `Success! Digital Document instantly verified and linked in your DigiLocker locker.`
        : `Application Registered! Reference Code: ${randomARN}. Track status at the dispatch dashboard.`,
    });
  }

  // 4. Admin approve
  if (path === "/admin/approve" && method === "POST") {
    const appItem = serviceApplications.find((a) => a.id === body.appId);
    if (!appItem) return json({ error: "Application tracking data not found." }, 404);

    appItem.status = "APPROVED";
    appItem.approvedDate = new Date().toISOString();
    appItem.comments =
      "Approved by Sub-Divisional Officer. Security digital certificates signed on blockchain vault.";

    let docTypeToAssign = "INCOME_CERT";
    let genNo = `CERT-${Math.floor(10000 + Math.random() * 90000)}`;
    if (appItem.serviceId === "nsdl-pan") {
      docTypeToAssign = "PAN";
      genNo = `PAN-${Math.floor(100000 + Math.random() * 900000)}P`;
    } else if (appItem.serviceId === "uidai-aadhaar") {
      docTypeToAssign = "AADHAAR";
      genNo = `XXXX-XXXX-${Math.floor(1000 + Math.random() * 9000)}`;
    }

    const digitalToken = (await sha256Hex(JSON.stringify(appItem))).slice(0, 20);
    const newDoc = {
      id: "dl-card-" + Date.now(),
      docType: docTypeToAssign,
      docNumber: genNo,
      holderName: appItem.applicantName,
      issueDate: new Date().toISOString().split("T")[0],
      digitalSignature: `SHA256:GOI-CERT-${digitalToken.toUpperCase()}`,
      qrCodeText: `e-Seva Certificate Service APPROVED: Holder: ${appItem.applicantName}, Document Ref: ${appItem.arn}`,
      data: {
        registeredState: appItem.state,
        issueAuthority: "Tahsildar Digital Sign Registry",
        issuedVia: "Rashtriya E-Seva Portal System",
      },
    };
    digiLockerVault.unshift(newDoc);
    return json({ success: true, application: appItem, docCreated: newDoc });
  }

  // 5/6. DigiLocker
  if (path === "/digilocker" && method === "GET") return json(digiLockerVault);
  if (path.startsWith("/digilocker/") && method === "DELETE") {
    const id = path.split("/")[2];
    digiLockerVault = digiLockerVault.filter((doc) => doc.id !== id);
    return json({ success: true, idDeleted: id });
  }

  // 7. Grievances
  if (path === "/grievances" && method === "GET") return json(grievanceList);

  // 8. Lodge grievance
  if (path === "/grievance/lodge" && method === "POST") {
    const { department, serviceAffected, subject, description, stateOfGrievance } = body;
    if (!department || !subject || !description) {
      return json({ error: "Missing required grievance headers." }, 400);
    }
    const refNo = `CPG-${String(department)
      .split(" ")
      .slice(0, 2)
      .map((w: string) => w.replace(/[^A-Za-z]/g, ""))
      .join("")
      .toUpperCase()}-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`;

    const newGrievance: any = {
      id: "grievance-" + Date.now(),
      department,
      serviceAffected: serviceAffected || "General Administrative Efficiency",
      refNumber: refNo,
      subject,
      description,
      stateOfGrievance: stateOfGrievance || "Delhi",
      status: "LODGED",
      dateFiled: new Date().toISOString().split("T")[0],
      officialReply: "",
      replyDate: "",
    };
    grievanceList.unshift(newGrievance);

    let replyText = "";
    try {
      replyText = await generateText({
        maxTokens: 350,
        temperature: 0.7,
        prompt: `You are the appointed Chief Public Grievance Officer / Senior Nodal Officer for the Government of India department: "${department}".
A citizen filed the following complaint on the central e-Seva portal.

Subject: ${subject}
Details: ${description}
State Zone: ${stateOfGrievance}

Please generate an official, bureaucratic official response in a structural government format. Keep the tone helpful, strictly professional, reassuring, and realistic about Indian civil administration. State specific actions being simulated (e.g. appointing a site inspector, investigating files, summoning service vendors, or correcting system databases). Keep response to maximum 100 words. DO NOT output any introduction. Start directly with the official reply body.`,
      });
    } catch {
      replyText = "";
    }
    if (!replyText) {
      replyText = `Dear Applicant, your grievance has been assigned to the Nodal Secretary, Office of ${department}. An administrative desk inspection is active for reference ${refNo}. Necessary actions inside the system logs will compile in 3-5 office working days. Respectfully, National Public Redressal Desk.`;
    }

    newGrievance.status = "RESOLVED";
    newGrievance.officialReply = replyText;
    newGrievance.replyDate = new Date().toISOString().split("T")[0];

    return json({
      success: true,
      grievance: newGrievance,
      toastMessage: `Grievance registered under ID: ${refNo}. Nodal Public Redressal Officer has immediately processed an official response!`,
    });
  }

  // 8b. Feedback
  if (path === "/feedback" && method === "POST") {
    const { rating, comment } = body;
    if (!rating || rating < 1 || rating > 5) {
      return json({ error: "Please provide a valid rating between 1 and 5 stars." }, 400);
    }
    const feedbackEntry = {
      id: "fb-" + Date.now(),
      rating: Number(rating),
      comment: comment?.trim() || "",
      timestamp: new Date().toISOString(),
    };
    portalFeedbackList.push(feedbackEntry);
    return json({
      success: true,
      message: "Feedback submitted successfully!",
      feedback: feedbackEntry,
    });
  }

  // 8b-1. Translate
  if (path === "/translate" && method === "POST") {
    const { text, targetLanguage } = body;
    if (!text || !targetLanguage) {
      return json(
        { error: "Missing required translation fields: text, targetLanguage." },
        400,
      );
    }
    try {
      const translatedText =
        (await generateText({
          maxTokens: 400,
          temperature: 0.3,
          prompt: `You are a professional, high-fidelity administrative translator for Digital India services.
Please translate the following official citizen service description into ${targetLanguage}.
Ensure perfect technical and governmental vocabulary matches, maintaining the exact meaning, tone, and brevity of the original text.

CRITICAL: Return ONLY the raw translated text. Do NOT include any introductions, preamble, explanations, conversational filler, markdown formatting, or surrounding quotes.

Original text:
"${text}"`,
        })) || text;
      return json({ success: true, translatedText });
    } catch (err: any) {
      return json({ error: "Translation failed: " + (err?.message || err) }, 500);
    }
  }

  // 8b-2. Report an issue
  if (path === "/report" && method === "POST") {
    const { serviceId, serviceTitle, issueType, details, email } = body;
    if (!serviceId || !issueType || !details) {
      return json(
        { error: "Missing required fields: serviceId, issueType, details." },
        400,
      );
    }
    const newReport = {
      id: "report-" + Date.now(),
      serviceId,
      serviceTitle: serviceTitle || "Government Service Outpost",
      issueType,
      details: String(details).trim(),
      email: email || "anonymous-citizen",
      timestamp: new Date().toISOString(),
    };
    serviceIssuesList.unshift(newReport);
    return json({
      success: true,
      message:
        "The report has been securely registered. Our developer team will inspect this service outpost details. Thank you!",
      report: newReport,
    });
  }

  // 8c. State governance news
  if (path === "/news" && method === "GET") {
    const stateName = url.searchParams.get("state") || "Karnataka";
    try {
      const raw = await generateText({
        maxTokens: 900,
        temperature: 0.8,
        prompt: `You are an expert on local government policies, citizen schemes, and administrative updates in India.
Generate exactly 3 realistic local governance news updates, welfare schemes, or municipal policy announcements for the state of ${stateName}, India, set specifically in the current year 2026. Make the updates highly specific to ${stateName}.
Provide the response as a strict JSON array of objects. Each object MUST have:
1. "headline" (string, max 80 characters)
2. "summary" (string, max 160 characters)
3. "date" (string, e.g. "June 11, 2026")
4. "category" (string, e.g. "Welfare", "Infrastructure", "Agriculture", "Digital")
5. "impact" (string)

Do NOT include markdown code blocks, conversational text or backticks. Output only valid JSON.`,
      });
      const cleaned = raw.replace(/```json/g, "").replace(/```/g, "").trim();
      const newsList = JSON.parse(cleaned);
      return json({
        success: true,
        state: stateName,
        news: newsList,
        sources: [
          { title: `${stateName} Gazette Portal`, url: "https://www.india.gov.in" },
          { title: "National Portal of India", url: "https://www.india.gov.in" },
        ],
        fallbackUsed: false,
      });
    } catch {
      return json({
        success: true,
        state: stateName,
        news: [
          {
            headline: `${stateName} Administration Elevates e-Seva Outpost Digitalization`,
            summary: `Under the regional digital empowerment act, state administrative centers are linked with unified citizen single-window registration systems.`,
            date: "June 12, 2026",
            category: "Digital",
            impact: "Directly minimizing certificate queue bottlenecks",
          },
          {
            headline: `New State Rural Welfare and Farmer Grants Activated`,
            summary: `Cabinet approves immediate budget layout adjustments directing funds directly into DBT bank accounts using linked Aadhaar IDs.`,
            date: "June 10, 2026",
            category: "Welfare",
            impact: "Targeting thousands of agrarian families",
          },
          {
            headline: `Citizen Redressal Charter Enforces Strict SLA Timelines`,
            summary: `Department secretaries issued instructions enforcing a 48-hour completion SLA check on standard revenue grievances.`,
            date: "June 08, 2026",
            category: "Governance",
            impact: "Benefitting rural citizen grievances",
          },
        ],
        sources: [
          { title: "National Portal of India", url: "https://www.india.gov.in" },
          {
            title: "State Gazette Central Directory",
            url: "https://www.india.gov.in/my-government/state-union-territories-portals",
          },
        ],
        fallbackUsed: true,
      });
    }
  }

  // 8d. Discussions
  if (path === "/discussions" && method === "GET") {
    return json({ success: true, discussions: citizenDiscussions });
  }

  if (path === "/discussions" && method === "POST") {
    const { title, policyArea, content, postedBy, profileStatus } = body;
    if (!title || !policyArea || !content || !postedBy) {
      return json(
        {
          error:
            "Missing required discussion fields: title, policyArea, content, postedBy.",
        },
        400,
      );
    }
    const newThread: DiscussionThread = {
      id: "thread-" + Date.now(),
      title: String(title).trim(),
      policyArea: String(policyArea).trim(),
      content: String(content).trim(),
      postedBy: String(postedBy).trim(),
      profileStatus: profileStatus || "Unverified Citizen",
      verificationCount: profileStatus === "Aadhaar Verified" ? 1 : 0,
      verifiedCitizens:
        profileStatus === "Aadhaar Verified" ? [String(postedBy).trim()] : [],
      comments: [],
      timestamp: new Date().toISOString(),
      status: "PROPOSED",
    };
    citizenDiscussions.unshift(newThread);
    return json({
      success: true,
      discussion: newThread,
      message: "Discussion thread posted successfully!",
    });
  }

  const verifyMatch = path.match(/^\/discussions\/([^/]+)\/verify$/);
  if (verifyMatch && method === "POST") {
    const { citizenName } = body;
    if (!citizenName) return json({ error: "Missing citizenName for verification." }, 400);
    const thread = citizenDiscussions.find((t) => t.id === verifyMatch[1]);
    if (!thread) return json({ error: "Discussion thread not found." }, 404);
    if (thread.verifiedCitizens.includes(citizenName)) {
      return json({ error: "You have already verified this thread." }, 400);
    }
    thread.verifiedCitizens.push(citizenName);
    thread.verificationCount += 1;
    if (thread.verificationCount >= 3) thread.status = "COMMUNITY_VERIFIED";
    return json({
      success: true,
      discussion: thread,
      message: "Policy change thread verified successfully by your citizen ID!",
    });
  }

  const commentMatch = path.match(/^\/discussions\/([^/]+)\/comment$/);
  if (commentMatch && method === "POST") {
    const { text, commenterName, commenterStatus } = body;
    if (!text || !commenterName) {
      return json({ error: "Missing text or commenterName for comment." }, 400);
    }
    const thread = citizenDiscussions.find((t) => t.id === commentMatch[1]);
    if (!thread) return json({ error: "Discussion thread not found." }, 404);
    const newComment: DiscussionComment = {
      id: "comment-" + Date.now(),
      commenterName: String(commenterName).trim(),
      commenterStatus: commenterStatus || "Unverified Citizen",
      text: String(text).trim(),
      timestamp: new Date().toISOString(),
    };
    thread.comments.push(newComment);
    return json({ success: true, discussion: thread, comment: newComment });
  }

  // 9. Suvidha Sahayak chatbot
  if (path === "/chatbot" && method === "POST") {
    const { messages } = body;
    if (!messages || !Array.isArray(messages)) {
      return json({ error: "Messages array required" }, 400);
    }
    const lastUserMsg = messages[messages.length - 1];
    const query: string = lastUserMsg?.text ?? "How to link PAN card?";

    const context = `
You are safe, polite "PM e-Seva Suvidha Sahayak" - the flagship administrative AI chatbot helper of the Digital India e-Seva services gateway.
You help Indian citizens understand government services, criteria, prerequisites, documents, and schemes.

Available e-Seva Services in this specific gateway:
${JSON.stringify(officialServices.map((s) => ({ id: s.id, title: s.title, category: s.category })), null, 2)}

Other Major Indian Citizen Schemes you can guide on:
- Pradhan Mantri Garib Kalyan Anna Yojana (PM-GKAY)
- PM Kisan Samman Nidhi Yojana (₹6,000 yearly benefit)
- Pradhan Mantri Awas Yojana (PMAY affordable houses)
- Ayushman Bharat PM-JAY (₹5 Lakh family medical cover)
- Pradhan Mantri Jan Dhan Yojana (zero-balance bank accounts)
- Atal Pension Yojana (fixed social pension)
- e-Shram worker identification
- UMANG app
- State e-District portal services

Administrative Guidelines:
- Keep your tone humble, authoritative, encouraging, and patriotic.
- Address queries in clean, simple English, with helpful Romanized governance terms.
- Organize document lists or step checklists using clean Markdown bullets and bold keywords.
- Mention that citizens can use the "Online e-Seva Applications" panel in this portal.
- Keep response length under 250 words.`;

    try {
      const reply = await generateText({
        system: context,
        prompt: "",
        maxTokens: 600,
        temperature: 0.7,
        messages: messages.map((m: any) => ({
          role: m.role === "user" ? "user" : "assistant",
          content: m.text,
        })),
      });
      return json({
        text:
          reply ||
          "I apologize. I am unable to connect with the central server directory. Please check back shortly.",
      });
    } catch {
      let fallbackText =
        "Namaste! I am currently operating on offline backup files. Here is helpful information regarding Citizen Services:\n\n";
      const q = query.toLowerCase();
      if (q.includes("aadhaar") || q.includes("uidai")) {
        fallbackText +=
          "### 🆔 Aadhaar Services Guide\n\nTo update your Aadhaar demographic data:\n1. Open our **e-Seva Services Panel** above.\n2. Click 'Apply Now' on **Aadhaar Demographic Update**.\n3. Paste your name and state, and submit your Address Proof image.\n4. Required: UIDAI charges ₹50 standard service charges. Processing finishes in 5-7 working days.";
      } else if (q.includes("pan") || q.includes("tax")) {
        fallbackText +=
          "### 💳 Permanent Account Number (PAN) Guide\n\nPAN cards are issued by NSDL/UTIITSL under the Income Tax Dept. To apply:\n1. Enter your name, Aadhaar card number, and Date of Birth in our online service panel.\n2. Standard government fee is ₹110 for regional Indian delivery.\n3. The PAN card will be digitally printed on verification.";
      } else if (q.includes("health") || q.includes("abha") || q.includes("ayushman")) {
        fallbackText +=
          "### 🏥 Ayushman Bharat (ABHA Health Card) Guide\n\nABHA ID organizes your clinical diagnostics under the National Health Mission. Our simulated portal supports **Instant Approved Issuance**!";
      } else if (q.includes("grievance") || q.includes("complain") || q.includes("help")) {
        fallbackText +=
          "### 📢 Grievance Lodging (CPGRAMS Guide)\n\n1. Transition to the **CPGRAMS Grievance Portal** tab below.\n2. Submit details pointing out the specific Ministry.\n3. You will get an immediate Nodal Officer reply!";
      } else {
        fallbackText +=
          "### 🇮🇳 Digital India e-Seva Portals Map\n\nHow can I help you? I can guide on:\n- **Identity Services**: Aadhaar changes, fresh PAN card requests, Passport Kendra applications.\n- **Welfare Schemes**: PM-KISAN, e-Shram, ABHA health records.\n- **DigiLocker Integration**: Instantly view and download approved certificates!";
      }
      return json({ text: fallbackText });
    }
  }

  return json({ error: "Unknown e-Seva endpoint: " + path }, 404);
}
