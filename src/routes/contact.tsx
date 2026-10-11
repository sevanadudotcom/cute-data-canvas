import { createFileRoute } from "@tanstack/react-router";
import LegalPage from "@/components/LegalPage";

export const Route = createFileRoute("/contact")({
  head: () => ({
    meta: [
      { title: "Contact SewaNadu — Corrections & Support" },
      {
        name: "description",
        content:
          "Reach the SewaNadu team to report an outdated document checklist, request a missing government service, or raise a privacy question.",
      },
      { property: "og:title", content: "Contact SewaNadu" },
      {
        property: "og:description",
        content: "Report corrections, request services, or contact us about privacy and advertising.",
      },
      { property: "og:type", content: "article" },
      { property: "og:url", content: "/contact" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
    links: [{ rel: "canonical", href: "/contact" }],
  }),
  component: () => (
    <LegalPage
      title="Contact us"
      subtitle="Corrections, missing services, privacy questions and advertising enquiries all reach the same small team."
      updated="5 August 2026"
      sections={[
        {
          heading: "Email",
          body: (
            <ul>
              <li>
                General &amp; corrections:{" "}
                <a href="mailto:support@sewanadu.in">support@sewanadu.in</a>
              </li>
              <li>
                Privacy &amp; data requests: <a href="mailto:privacy@sewanadu.in">privacy@sewanadu.in</a>
              </li>
              <li>
                Advertising: <a href="mailto:ads@sewanadu.in">ads@sewanadu.in</a>
              </li>
            </ul>
          ),
        },
        {
          heading: "Response time",
          body: (
            <p>
              We aim to reply within 3–5 working days. Content corrections backed by a link to the
              official notification are prioritised.
            </p>
          ),
        },
        {
          heading: "What to include in a correction",
          body: (
            <ul>
              <li>The service name and the state it applies to.</li>
              <li>What is wrong on our page today.</li>
              <li>A link to the official source showing the current requirement.</li>
            </ul>
          ),
        },
        {
          heading: "What we cannot help with",
          body: (
            <p>
              We cannot check, expedite or intervene in your government application, and we cannot
              retrieve certificates or Aadhaar records. Please never send us Aadhaar numbers, OTPs,
              passwords, bank details or scanned identity documents — see the{" "}
              <a href="/disclaimer">Disclaimer</a>. For an active application, contact the issuing
              department directly through the official portal linked on the service page.
            </p>
          ),
        },
        {
          heading: "Grievance officer",
          body: (
            <p>
              For complaints regarding content or data handling on this website, write to the
              Grievance Officer at <a href="mailto:grievance@sewanadu.in">grievance@sewanadu.in</a>{" "}
              with the subject line "Grievance" and a description of the issue.
            </p>
          ),
        },
      ]}
    />
  ),
});
