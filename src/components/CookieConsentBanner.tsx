import React, { useCallback, useEffect, useId, useRef, useState } from "react";
import { Cookie, Check, SlidersHorizontal, X } from "lucide-react";
import {
  CONSENT_EVENT,
  readConsent,
  saveConsent,
  type CookieConsent,
} from "@/lib/cookie-consent";

interface Props {
  language?: string;
  onSaved?: (consent: CookieConsent) => void;
}

export default function CookieConsentBanner({ language = "en", onSaved }: Props) {
  const isHi = language === "hi";
  const [visible, setVisible] = useState(false);
  const [showDetails, setShowDetails] = useState(false);
  const [analytics, setAnalytics] = useState(false);
  const [advertising, setAdvertising] = useState(false);
  const [status, setStatus] = useState("");
  const [dismissible, setDismissible] = useState(false);

  const headingId = useId();
  const descId = useId();
  const containerRef = useRef<HTMLDivElement | null>(null);
  const headingRef = useRef<HTMLHeadingElement | null>(null);
  const lastFocused = useRef<HTMLElement | null>(null);

  const t = useCallback((en: string, hi: string) => (isHi ? hi : en), [isHi]);

  useEffect(() => {
    const existing = readConsent();
    if (!existing) {
      setVisible(true);
    } else {
      setAnalytics(existing.analytics);
      setAdvertising(existing.advertising);
      setDismissible(true);
    }
    const open = () => {
      const current = readConsent();
      lastFocused.current = (document.activeElement as HTMLElement) ?? null;
      setAnalytics(current?.analytics ?? false);
      setAdvertising(current?.advertising ?? false);
      setDismissible(!!current);
      setShowDetails(true);
      setVisible(true);
    };
    window.addEventListener(`${CONSENT_EVENT}:open`, open as EventListener);
    return () => window.removeEventListener(`${CONSENT_EVENT}:open`, open as EventListener);
  }, []);

  // Move focus into the banner when it appears so keyboard users reach it immediately.
  useEffect(() => {
    if (visible) headingRef.current?.focus();
  }, [visible]);

  const close = useCallback(() => {
    setVisible(false);
    setShowDetails(false);
    const prev = lastFocused.current;
    lastFocused.current = null;
    if (prev && document.contains(prev)) prev.focus();
  }, []);

  const commit = useCallback(
    (choice: { analytics: boolean; advertising: boolean }) => {
      const saved = saveConsent(choice);
      setStatus(t("Your cookie preferences have been saved.", "आपकी कुकी प्राथमिकताएँ सहेज ली गई हैं।"));
      close();
      onSaved?.(saved);
    },
    [close, onSaved, t]
  );

  // Escape closes only when a prior choice exists (banner stays until first decision).
  useEffect(() => {
    if (!visible) return;
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && dismissible) {
        e.stopPropagation();
        close();
      }
    };
    const node = containerRef.current;
    node?.addEventListener("keydown", onKeyDown);
    return () => node?.removeEventListener("keydown", onKeyDown);
  }, [visible, dismissible, close]);

  const Toggle = ({
    checked,
    onChange,
    disabled,
    label,
    describedBy,
  }: {
    checked: boolean;
    onChange?: () => void;
    disabled?: boolean;
    label: string;
    describedBy?: string;
  }) => (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      aria-label={label}
      aria-describedby={describedBy}
      aria-disabled={disabled || undefined}
      disabled={disabled}
      onClick={onChange}
      onKeyDown={(e) => {
        // Space/Enter are native; add explicit on/off keys for screen-reader users.
        if (disabled || !onChange) return;
        if (e.key === "ArrowRight" || e.key === "ArrowUp") {
          e.preventDefault();
          if (!checked) onChange();
        } else if (e.key === "ArrowLeft" || e.key === "ArrowDown") {
          e.preventDefault();
          if (checked) onChange();
        }
      }}
      className={`relative h-6 w-11 shrink-0 rounded-full transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-500 focus-visible:ring-offset-2 ${
        checked ? "bg-amber-500" : "bg-stone-300 dark:bg-stone-700"
      } ${disabled ? "opacity-60 cursor-not-allowed" : "cursor-pointer"}`}
    >
      <span
        aria-hidden="true"
        className={`absolute top-0.5 h-5 w-5 rounded-full bg-white shadow transition-all ${
          checked ? "left-[22px]" : "left-0.5"
        }`}
      />
      <span className="sr-only">{checked ? t("On", "चालू") : t("Off", "बंद")}</span>
    </button>
  );

  const btnFocus =
    "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-500 focus-visible:ring-offset-2";

  return (
    <>
      <div aria-live="polite" role="status" className="sr-only">
        {status}
      </div>
      {visible && (
        <div
          ref={containerRef}
          role="dialog"
          aria-modal="false"
          aria-labelledby={headingId}
          aria-describedby={descId}
          className="fixed inset-x-0 bottom-0 z-[99998] p-3 sm:p-4"
        >
          <div className="mx-auto w-full max-w-3xl rounded-2xl border border-stone-200 bg-white/98 shadow-2xl backdrop-blur dark:border-stone-800 dark:bg-stone-900/98">
            <div className="flex items-start gap-3 p-4 sm:p-5">
              <div className="hidden sm:flex p-2 rounded-xl bg-amber-500/10 shrink-0" aria-hidden="true">
                <Cookie className="h-5 w-5 text-amber-600 dark:text-amber-500" />
              </div>
              <div className="min-w-0 flex-1">
                <h2
                  id={headingId}
                  ref={headingRef}
                  tabIndex={-1}
                  className="text-sm font-extrabold text-stone-900 dark:text-white focus-visible:outline-none"
                >
                  {t("We use cookies", "हम कुकीज़ का उपयोग करते हैं")}
                </h2>
                <p id={descId} className="mt-1 text-[12px] leading-relaxed text-stone-600 dark:text-slate-400">
                  {t(
                    "Essential cookies keep SewaNadu working. With your permission we also use analytics cookies and advertising cookies (including Google and its partners) to measure traffic and show ads. You can accept, reject, or choose individually — and change your mind anytime.",
                    "आवश्यक कुकीज़ SewaNadu को चालू रखती हैं। आपकी अनुमति से हम विश्लेषण और विज्ञापन कुकीज़ (Google और उसके साझेदारों सहित) का भी उपयोग करते हैं। आप स्वीकार, अस्वीकार या अलग-अलग चयन कर सकते हैं।"
                  )}{" "}
                  <a
                    href="/privacy"
                    className={`font-semibold text-amber-600 underline dark:text-amber-500 rounded ${btnFocus}`}
                  >
                    {t("Privacy Policy", "गोपनीयता नीति")}
                  </a>{" "}
                  ·{" "}
                  <a
                    href="/cookies"
                    className={`font-semibold text-amber-600 underline dark:text-amber-500 rounded ${btnFocus}`}
                  >
                    {t("Cookie Policy", "कुकी नीति")}
                  </a>
                </p>

                {showDetails && (
                  <div
                    role="group"
                    aria-label={t("Cookie categories", "कुकी श्रेणियाँ")}
                    className="mt-3 space-y-2"
                  >
                    <div className="flex items-center gap-3 rounded-xl border border-stone-200 p-3 dark:border-stone-800">
                      <Toggle
                        checked
                        disabled
                        label={t(
                          "Strictly necessary cookies (always on, cannot be disabled)",
                          "आवश्यक कुकीज़ (हमेशा चालू, बंद नहीं की जा सकतीं)"
                        )}
                        describedBy={`${headingId}-nec-desc`}
                      />
                      <div className="min-w-0">
                        <p className="text-[12px] font-bold text-stone-900 dark:text-white">
                          {t("Strictly necessary", "आवश्यक")}{" "}
                          <span className="font-mono text-[9px] uppercase text-stone-400">
                            {t("always on", "हमेशा चालू")}
                          </span>
                        </p>
                        <p
                          id={`${headingId}-nec-desc`}
                          className="text-[11px] text-stone-500 dark:text-slate-400"
                        >
                          {t(
                            "Security, language and saved preferences stored on your device.",
                            "सुरक्षा, भाषा और आपकी सहेजी गई प्राथमिकताएँ आपके डिवाइस पर संग्रहीत।"
                          )}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-3 rounded-xl border border-stone-200 p-3 dark:border-stone-800">
                      <Toggle
                        checked={analytics}
                        onChange={() => setAnalytics((v) => !v)}
                        label={t("Analytics cookies", "विश्लेषण कुकीज़")}
                        describedBy={`${headingId}-ana-desc`}
                      />
                      <div className="min-w-0">
                        <p className="text-[12px] font-bold text-stone-900 dark:text-white">
                          {t("Analytics", "विश्लेषण")}
                        </p>
                        <p
                          id={`${headingId}-ana-desc`}
                          className="text-[11px] text-stone-500 dark:text-slate-400"
                        >
                          {t(
                            "Aggregate, non-identifying traffic measurement to improve content.",
                            "सामग्री सुधारने के लिए गैर-पहचान योग्य ट्रैफ़िक माप।"
                          )}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-3 rounded-xl border border-stone-200 p-3 dark:border-stone-800">
                      <Toggle
                        checked={advertising}
                        onChange={() => setAdvertising((v) => !v)}
                        label={t("Advertising cookies", "विज्ञापन कुकीज़")}
                        describedBy={`${headingId}-ads-desc`}
                      />
                      <div className="min-w-0">
                        <p className="text-[12px] font-bold text-stone-900 dark:text-white">
                          {t("Advertising", "विज्ञापन")}
                        </p>
                        <p
                          id={`${headingId}-ads-desc`}
                          className="text-[11px] text-stone-500 dark:text-slate-400"
                        >
                          {t(
                            "Used by Google and third-party vendors to serve and measure ads, including personalised ads.",
                            "Google और तृतीय-पक्ष विक्रेताओं द्वारा विज्ञापन दिखाने और मापने के लिए।"
                          )}
                        </p>
                      </div>
                    </div>
                  </div>
                )}

                <div className="mt-3 flex flex-wrap items-center gap-2">
                  <button
                    type="button"
                    onClick={() => commit({ analytics: true, advertising: true })}
                    className={`inline-flex items-center gap-1.5 rounded-xl bg-amber-500 px-4 py-2 text-[12px] font-extrabold text-neutral-900 transition hover:bg-amber-400 ${btnFocus}`}
                  >
                    <Check className="h-3.5 w-3.5 stroke-[3]" aria-hidden="true" />
                    {t("Accept all", "सभी स्वीकारें")}
                  </button>
                  <button
                    type="button"
                    onClick={() => commit({ analytics: false, advertising: false })}
                    className={`rounded-xl border border-stone-300 px-4 py-2 text-[12px] font-bold text-stone-700 transition hover:bg-stone-100 dark:border-stone-700 dark:text-slate-200 dark:hover:bg-stone-800 ${btnFocus}`}
                  >
                    {t("Reject non-essential", "केवल आवश्यक")}
                  </button>
                  {showDetails ? (
                    <button
                      type="button"
                      onClick={() => commit({ analytics, advertising })}
                      className={`rounded-xl border border-amber-500/50 px-4 py-2 text-[12px] font-bold text-amber-700 transition hover:bg-amber-50 dark:text-amber-400 dark:hover:bg-amber-500/10 ${btnFocus}`}
                    >
                      {t("Save my choices", "मेरी पसंद सहेजें")}
                    </button>
                  ) : (
                    <button
                      type="button"
                      onClick={() => setShowDetails(true)}
                      aria-expanded={showDetails}
                      className={`inline-flex items-center gap-1.5 rounded-xl px-3 py-2 text-[12px] font-bold text-stone-600 underline transition hover:text-stone-900 dark:text-slate-400 dark:hover:text-white ${btnFocus}`}
                    >
                      <SlidersHorizontal className="h-3.5 w-3.5" aria-hidden="true" />
                      {t("Customise", "अनुकूलित करें")}
                      <span className="sr-only">
                        {t(" cookie preferences", " कुकी प्राथमिकताएँ")}
                      </span>
                    </button>
                  )}
                </div>
              </div>

              {dismissible && (
                <button
                  type="button"
                  onClick={close}
                  aria-label={t("Close cookie settings", "कुकी सेटिंग बंद करें")}
                  className={`rounded-lg p-1 text-stone-400 transition hover:text-stone-700 dark:hover:text-white ${btnFocus}`}
                >
                  <X className="h-4 w-4" aria-hidden="true" />
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
