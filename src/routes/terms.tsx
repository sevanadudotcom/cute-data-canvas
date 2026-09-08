import { createFileRoute } from "@tanstack/react-router";
import LegalPage from "@/components/LegalPage";

export const Route = createFileRoute("/terms")({
  head: () => ({
    meta: [
      { title: "Terms & Conditions — SewaNadu" },
      {
        name: "description",
        content:
          "The terms governing use of SewaNadu, an independent guide to Indian government service documents, eligibility and application procedures.",
      },
      { property: "og:title", content: "Terms & Conditions — SewaNadu" },
      {
        property: "og:description",
        content: "Acceptable use, accuracy limits, intellectual property and liability terms for SewaNadu.",
      },
      { property: "og:type", content: "article" },
      { property: "og:url", content: "/terms" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
    links: [{ rel: "canonical", href: "/terms" }],
  }),
  component: () => (
    <LegalPage
      title="Terms & Conditions"
      subtitle="By using SewaNadu you agree to the terms below. Please read them before relying on any information on this site."
      updated="5 August 2026"
      sections={[
        {
          heading: "1. Nature of the service",
          body: (
            <p>
              SewaNadu provides general reference information about Indian central and state
              government services — required documents, eligibility guidance, indicative fees and
              links to official portals. It is an editorial guide, not a government service, not a
              legal advisory, and not an application agent.
            </p>
          ),
        },
        {
          heading: "2. No government affiliation",
          body: (
            <p>
              We are not affiliated with, endorsed by, or acting on behalf of the Government of
              India, any State Government, UIDAI, DigiLocker, or any ministry or department. All
              government names, portals and marks referenced belong to their respective owners and
              are used only for identification and navigation.
            </p>
          ),
        },
        {
          heading: "3. Accuracy and simulated features",
          body: (
            <>
              <p>
                Government rules, fees and document lists change frequently. Information here may be
                incomplete or out of date. Always confirm requirements on the relevant official
                portal before acting.
              </p>
              <p>
                Certain features on this site — including application status demonstrations, digital
                locker previews and AI-generated replies — are illustrative simulations for
                learning purposes. They do not create, submit or track any real government record.
              </p>
            </>
          ),
        },
        {
          heading: "4. Acceptable use",
          body: (
            <ul>
              <li>Do not submit false, unlawful, abusive, hateful or misleading content.</li>
              <li>
                Do not upload or enter sensitive identifiers such as Aadhaar numbers, OTPs,
                passwords, bank details or scanned identity documents.
              </li>
              <li>Do not scrape, overload, reverse-engineer or disrupt the service.</li>
              <li>Do not impersonate a government officer or any other person.</li>
            </ul>
          ),
        },
        {
          heading: "5. Intellectual property",
          body: (
            <p>
              Original text, layout, design and code on SewaNadu belong to the site operator. You
              may share links and quote short extracts with attribution. Bulk reproduction or
              republication of the catalogue without permission is not permitted.
            </p>
          ),
        },
        {
          heading: "6. Advertising",
          body: (
            <p>
              This site is supported by advertising, which may include Google AdSense. Ads are
              labelled and kept visually distinct from editorial content. We do not endorse
              advertisers and are not responsible for their offerings. See our{" "}
              <a href="/privacy">Privacy Policy</a> for advertising cookie disclosures.
            </p>
          ),
        },
        {
          heading: "7. Third-party links",
          body: (
            <p>
              Outbound links to official portals and other sites are provided for convenience. We do
              not control their content, availability or privacy practices and accept no
              responsibility for them.
            </p>
          ),
        },
        {
          heading: "8. Limitation of liability",
          body: (
            <p>
              The service is provided "as is" without warranties of any kind. To the maximum extent
              permitted by law, the operator is not liable for any loss, rejected application,
              missed deadline, fee or damage arising from reliance on this site.
            </p>
          ),
        },
        {
          heading: "9. Governing law",
          body: (
            <p>
              These terms are governed by the laws of India, and the courts of India shall have
              exclusive jurisdiction over any dispute arising from use of this site.
            </p>
          ),
        },
      ]}
    />
  ),
});
