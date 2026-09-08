import { createFileRoute } from "@tanstack/react-router";
import LegalPage from "@/components/LegalPage";

export const Route = createFileRoute("/disclaimer")({
  head: () => ({
    meta: [
      { title: "Disclaimer — SewaNadu Independent e-Service Guide" },
      {
        name: "description",
        content:
          "SewaNadu is an independent, non-governmental guide. Read our accuracy, simulation and no-affiliation disclaimer before relying on this site.",
      },
      { property: "og:title", content: "Disclaimer — SewaNadu" },
      {
        property: "og:description",
        content: "No government affiliation, no guarantees of accuracy, and no processing of applications.",
      },
      { property: "og:type", content: "article" },
      { property: "og:url", content: "/disclaimer" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
    links: [{ rel: "canonical", href: "/disclaimer" }],
  }),
  component: () => (
    <LegalPage
      title="Disclaimer"
      subtitle="Please read this carefully — it defines exactly what SewaNadu is and what it is not."
      updated="5 August 2026"
      sections={[
        {
          heading: "1. Not a government website",
          body: (
            <p>
              SewaNadu is a privately operated, independent citizen guide. It is not a Government of
              India or State Government website, and it is not affiliated with, endorsed by, or
              authorised by any ministry, department or public authority. Official information is
              always found on the respective government portal.
            </p>
          ),
        },
        {
          heading: "2. Information only",
          body: (
            <p>
              We publish document checklists, eligibility summaries, indicative fees and timelines
              and links to official portals. We do not accept applications, collect fees, issue
              certificates, or influence the outcome of any government process.
            </p>
          ),
        },
        {
          heading: "3. Demonstration features",
          body: (
            <p>
              Status checks, digital locker previews, application walkthroughs, grievance drafts and
              AI-generated answers on this site are illustrative demonstrations. They do not connect
              to live government systems and must not be treated as official records or advice.
            </p>
          ),
        },
        {
          heading: "4. No professional advice",
          body: (
            <p>
              Nothing here is legal, financial, medical or immigration advice. For decisions with
              legal or financial consequences, consult a qualified professional or the concerned
              government office.
            </p>
          ),
        },
        {
          heading: "5. Accuracy and changes",
          body: (
            <p>
              Rules, fees and document requirements change without notice and vary by state and
              district. While we work to keep content current, we make no warranty of accuracy,
              completeness or fitness for a particular purpose. Verify everything officially before
              acting.
            </p>
          ),
        },
        {
          heading: "6. External links and advertising",
          body: (
            <p>
              We link to official portals and other resources for convenience and display
              third-party advertisements to fund the site. We do not control and are not responsible
              for external content or advertiser claims.
            </p>
          ),
        },
        {
          heading: "7. Report an error",
          body: (
            <p>
              Found something wrong or outdated? Tell us via the <a href="/contact">Contact</a> page
              and we will review and correct it.
            </p>
          ),
        },
      ]}
    />
  ),
});
