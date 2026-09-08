/**
 * Utility to resolve API endpoints.
 * Legacy paths of the form `/api/eseva/...` are mapped onto the public
 * server routes served by this app at `/api/public/eseva/...`.
 */
export const getApiUrl = (path: string): string => {
  const cleanPath = path.startsWith("/") ? path : `/${path}`;
  return cleanPath.replace(/^\/api\/eseva/, "/api/public/eseva");
};
