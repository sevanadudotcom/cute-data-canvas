import { createFileRoute } from "@tanstack/react-router";
import { ClientOnly } from "@tanstack/react-router";
import React, { Suspense } from "react";
import { LanguageProvider } from "@/LanguageContext";
import PortalSSRPreRender from "@/components/PortalSSRPreRender";

const App = React.lazy(() => import("@/App"));

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "SewaNadu — Indian Central & State Citizen e-Service Directory" },
      {
        name: "description",
        content:
          "SewaNadu is an independent guide to Indian central and state citizen e-services: service dossiers, eligibility checks, document lists, RTI help and state governance bulletins.",
      },
      { property: "og:title", content: "SewaNadu — Citizen e-Service Directory for India" },
      {
        property: "og:description",
        content:
          "Explore Indian government services, eligibility, documents and grievance guidance in your language. Independent, non-governmental information portal.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: HomePage,
});

function HomePage() {
  return (
    <ClientOnly fallback={<PortalSSRPreRender />}>
      <Suspense fallback={<PortalSSRPreRender />}>
        <LanguageProvider>
          <App />
        </LanguageProvider>
      </Suspense>
    </ClientOnly>
  );
}
