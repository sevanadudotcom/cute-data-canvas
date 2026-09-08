import { createFileRoute } from "@tanstack/react-router";
import LegalPage from "@/components/LegalPage";

export const Route = createFileRoute("/privacy")({
  head: () => ({
    meta: [
      { title: "Privacy Policy — SewaNadu Citizen e-Service Guide" },
      {
        name: "description",
        content:
          "How SewaNadu handles browser storage, cookies, analytics and third-party advertising (including Google AdSense) for visitors in India.",
      },
      { property: "og:title", content: "Privacy Policy — SewaNadu" },
      {
        property: "og:description",
        content:
          "Our privacy practices: local browser storage, cookies, Google AdSense and third-party vendor disclosures.",
      },
      { property: "og:type", content: "article" },
      { property: "og:url", content: "/privacy" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
    links: [{ rel: "canonical", href: "/privacy" }],
  }),
  component: () => (
    <LegalPage
      title="Privacy Policy"
      subtitle="This policy explains what information SewaNadu collects, how it is used, and the choices available to you."
      updated="5 August 2026"
      sections={[
        {
          heading: "1. Who we are",
          body: (
            <p>
              SewaNadu is an independent, privately operated information portal that helps citizens
              understand the documents, eligibility and procedures involved in Indian central and
              state government services. We are not a government body and we do not process
              government applications on your behalf.
            </p>
          ),
        },
        {
          heading: "2. Information we collect",
          body: (
            <>
              <p>
                We deliberately keep data collection minimal. We do not require registration and we
                do not ask you to upload identity documents.
              </p>
              <ul>
                <li>
                  <strong>Locally stored preferences.</strong> Language choice, dark mode, saved
                  services and consent status are stored in your own browser (localStorage) and are
                  never transmitted to us.
                </li>
                <li>
                  <strong>Information you type into optional tools.</strong> Text entered into the
                  eligibility checker, grievance helper or AI assistant is sent to our servers only
                  to generate a response and is not used to build an advertising profile.
                </li>
                <li>
                  <strong>Standard technical logs.</strong> Our hosting provider records IP address,
                  browser type and requested pages for security and abuse prevention.
                </li>
              </ul>
            </>
          ),
        },
        {
          heading: "3. Cookies and advertising",
          body: (
            <>
              <ul>
                <li>
                  Third-party vendors, including Google, use cookies to serve ads based on a user's
                  prior visits to this or other websites.
                </li>
                <li>
                  Google's use of advertising cookies enables it and its partners to serve ads to
                  users based on their visit to this site and/or other sites on the Internet.
                </li>
                <li>
                  Users may opt out of personalised advertising by visiting{" "}
                  <a href="https://www.google.com/settings/ads" target="_blank" rel="noopener noreferrer nofollow">
                    Google Ads Settings
                  </a>
                  , or opt out of third-party vendor cookies at{" "}
                  <a href="https://www.aboutads.info/choices/" target="_blank" rel="noopener noreferrer nofollow">
                    aboutads.info/choices
                  </a>
                  .
                </li>
                <li>
                  Visitors in the EEA, UK and Switzerland are shown a consent notice; non-essential
                  and advertising cookies are only set after consent is granted, and consent can be
                  withdrawn at any time by clearing site data.
                </li>
              </ul>
              <p>
                See our <a href="/cookies">Cookie Policy</a> for the full list of cookie categories.
              </p>
            </>
          ),
        },
        {
          heading: "4. How we use information",
          body: (
            <ul>
              <li>To display the service directory in your chosen language.</li>
              <li>To answer questions asked through the assistant and eligibility tools.</li>
              <li>To measure aggregate traffic and improve content quality.</li>
              <li>To protect the site from abuse, spam and automated attacks.</li>
            </ul>
          ),
        },
        {
          heading: "5. Children's privacy",
          body: (
            <p>
              SewaNadu is intended for a general audience and is not directed at children under 13.
              We do not knowingly collect personal information from children. If you believe a child
              has provided information, contact us and we will remove it.
            </p>
          ),
        },
        {
          heading: "6. Your rights and choices",
          body: (
            <ul>
              <li>Clear browser storage to delete every preference this site has saved.</li>
              <li>Use your browser's cookie controls to block or delete cookies.</li>
              <li>
                Request deletion of anything you sent us through the contact form by writing to the
                address on our <a href="/contact">Contact</a> page.
              </li>
            </ul>
          ),
        },
        {
          heading: "7. Data security and retention",
          body: (
            <p>
              Traffic is served over HTTPS. Content submitted to interactive tools is retained only
              as long as needed to produce a response and for short-term abuse prevention. No
              government credentials, Aadhaar numbers or scanned documents should ever be submitted
              to this site.
            </p>
          ),
        },
        {
          heading: "8. Changes to this policy",
          body: (
            <p>
              We may update this policy as the site evolves. Material changes will be reflected in
              the "last updated" date above. Continued use of the site after an update constitutes
              acceptance of the revised policy.
            </p>
          ),
        },
      ]}
    />
  ),
});
