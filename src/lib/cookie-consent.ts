export type CookieConsent = {
  necessary: true;
  analytics: boolean;
  advertising: boolean;
  updatedAt: string;
  version: number;
};

export const CONSENT_STORAGE_KEY = "sewanadu_cookie_consent_v1";
export const CONSENT_VERSION = 1;
export const CONSENT_EVENT = "sewanadu:cookie-consent";

export function readConsent(): CookieConsent | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = window.localStorage.getItem(CONSENT_STORAGE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as CookieConsent;
    if (!parsed || parsed.version !== CONSENT_VERSION) return null;
    return { ...parsed, necessary: true };
  } catch {
    return null;
  }
}

export function saveConsent(choice: { analytics: boolean; advertising: boolean }): CookieConsent {
  const value: CookieConsent = {
    necessary: true,
    analytics: choice.analytics,
    advertising: choice.advertising,
    updatedAt: new Date().toISOString(),
    version: CONSENT_VERSION,
  };
  try {
    window.localStorage.setItem(CONSENT_STORAGE_KEY, JSON.stringify(value));
  } catch {
    /* storage blocked — consent stays session-only */
  }
  try {
    window.dispatchEvent(new CustomEvent(CONSENT_EVENT, { detail: value }));
  } catch {
    /* noop */
  }
  // Google Consent Mode v2 signal (no-op when gtag is absent)
  try {
    const w = window as unknown as { gtag?: (...args: unknown[]) => void };
    w.gtag?.("consent", "update", {
      analytics_storage: value.analytics ? "granted" : "denied",
      ad_storage: value.advertising ? "granted" : "denied",
      ad_user_data: value.advertising ? "granted" : "denied",
      ad_personalization: value.advertising ? "granted" : "denied",
    });
  } catch {
    /* noop */
  }
  return value;
}

export function clearConsent() {
  try {
    window.localStorage.removeItem(CONSENT_STORAGE_KEY);
  } catch {
    /* noop */
  }
}

export function openCookieSettings() {
  try {
    window.dispatchEvent(new CustomEvent(`${CONSENT_EVENT}:open`));
  } catch {
    /* noop */
  }
}
