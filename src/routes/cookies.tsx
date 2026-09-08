import { createFileRoute } from "@tanstack/react-router";
import LegalPage from "@/components/LegalPage";

export const Route = createFileRoute("/cookies")({
  head: () => ({
    meta: [
      { title: "Cookie Policy — SewaNadu" },
      {
        name: "description",
        content:
          "Which cookies and browser storage SewaNadu uses, why they exist, and how to control or remove them.",
      },
      { property: "og:title", content: "Cookie Policy — SewaNadu" },
      {
        property: "og:description",
        content: "Essential, preference and advertising cookies used on SewaNadu, and how to opt out.",
      },
      { property: "og:type", content: "article" },
      { property: "og:url", content: "/cookies" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
    links: [{ rel: "canonical", href: "/cookies" }],
  }),
  component: () => (
    <LegalPage
      title="Cookie Policy"
      subtitle="Cookies and local storage keep your language, theme and saved services working. Advertising cookies are optional."
      updated="5 August 2026"
      sections={[
        {
          heading: "1. What cookies are",
          body: (
            <p>
              Cookies are small text files stored by your browser. SewaNadu also uses localStorage,
              which works similarly but stays entirely on your device and is never sent to us.
            </p>
          ),
        },
        {
          heading: "2. Categories we use",
          body: (
            <ul>
              <li>
                <strong>Strictly necessary.</strong> Security, load balancing and remembering that
                you dismissed the consent notice. These cannot be switched off.
              </li>
              <li>
                <strong>Preferences.</strong> Language, dark mode and saved/bookmarked services,
                stored locally in your browser.
              </li>
              <li>
                <strong>Analytics.</strong> Aggregate, non-identifying page and traffic counts used
                to improve content.
              </li>
              <li>
                <strong>Advertising.</strong> Set by Google and other third-party vendors to serve
                and measure ads. Only set where permitted, and after consent in regions that require
                it.
              </li>
            </ul>
          ),
        },
        {
          heading: "3. Third-party advertising cookies",
          body: (
            <p>
              Third-party vendors, including Google, use cookies to serve ads based on your prior
              visits to this and other websites. You can opt out of personalised advertising at{" "}
              <a href="https://www.google.com/settings/ads" target="_blank" rel="noopener noreferrer nofollow">
                Google Ads Settings
              </a>{" "}
              or{" "}
              <a href="https://www.aboutads.info/choices/" target="_blank" rel="noopener noreferrer nofollow">
                aboutads.info/choices
              </a>
              .
            </p>
          ),
        },
        {
          heading: "4. Managing cookies",
          body: (
            <ul>
              <li>Use your browser settings to block or delete cookies for this site.</li>
              <li>Clearing site data removes every preference SewaNadu has stored locally.</li>
              <li>
                Blocking strictly necessary cookies may cause parts of the portal to behave
                unexpectedly.
              </li>
            </ul>
          ),
        },
        {
          heading: "5. Questions",
          body: (
            <p>
              For anything unclear here, reach us through the <a href="/contact">Contact</a> page.
              This policy sits alongside our <a href="/privacy">Privacy Policy</a>.
            </p>
          ),
        },
      ]}
    />
  ),
});
