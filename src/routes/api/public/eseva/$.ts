import { createFileRoute } from "@tanstack/react-router";
import { handleESevaRequest } from "@/lib/eseva-api.server";

export const Route = createFileRoute("/api/public/eseva/$")({
  server: {
    handlers: {
      GET: ({ request }) => handleESevaRequest(request),
      POST: ({ request }) => handleESevaRequest(request),
      DELETE: ({ request }) => handleESevaRequest(request),
    },
  },
});
