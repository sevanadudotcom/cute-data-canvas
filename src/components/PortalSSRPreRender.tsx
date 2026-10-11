import React from "react";
import { CITIZEN_GUIDES, ESEVA_GLOSSARY } from "@/data/citizen-guides";

export default function PortalSSRPreRender() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "WebApplication",
        "@id": "https://sewanadu.in/#webapp",
        "name": "SewaNadu",
        "url": "https://sewanadu.in",
        "description":
          "SewaNadu is an independent citizen guide to Indian Central and State government e-services, statutory document requirements, RTI filing simulator, and public grievance escalation manuals.",
        "applicationCategory": "GovernmentApplication",
        "operatingSystem": "All",
        "offers": {
          "@type": "Offer",
          "price": "0",
          "priceCurrency": "INR",
        },
      },
      {
        "@type": "FAQPage",
        "@id": "https://sewanadu.in/#faq",
        "mainEntity": [
          {
            "@type": "Question",
            "name": "Is SewaNadu an official government portal?",
            "acceptedAnswer": {
              "@type": "Answer",
              "text":
                "No. SewaNadu is an independent, non-governmental public information directory and educational resource. All services link directly to verified official .gov.in and .nic.in portals.",
            },
          },
          {
            "@type": "Question",
            "name": "Are digital documents in DigiLocker legally accepted across India?",
            "acceptedAnswer": {
              "@type": "Answer",
              "text":
                "Yes. Under Rule 9A of the Information Technology Rules 2016 and Section 9A of the IT Act, electronic records issued into DigiLocker are treated on par with original physical documents for traffic police checks, airports, and academic admissions.",
            },
          },
          {
            "@type": "Question",
            "name": "What is the statutory fee and timeline for filing an RTI request?",
            "acceptedAnswer": {
              "@type": "Answer",
              "text":
                "For Central Government authorities, the statutory fee is ₹10 (free for citizens Below Poverty Line). The Public Information Officer must respond within 30 days (or 48 hours if concerning life and liberty).",
            },
          },
        ],
      },
    ],
  };

  return (
    <div className="min-h-screen bg-[#FDFBF7] text-[#1C1917] font-sans antialiased">
      {/* Schema.org Structured Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      {/* Authentic Indian Sovereign Tricolor Accent Strip */}
      <div className="h-1 w-full grid grid-cols-3 select-none" aria-hidden="true">
        <span className="bg-[#FF671F]" title="Tiranga Saffron (Kesari)" />
        <span className="bg-white border-y border-stone-200/50" title="Tiranga White" />
        <span className="bg-[#046A38]" title="Tiranga Green" />
      </div>

      {/* Top Header */}
      <header className="border-b border-stone-200 bg-white/95 backdrop-blur px-4 sm:px-8 py-3.5 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="relative h-9 w-9 rounded-xl bg-gradient-to-br from-[#0A2E5C] to-[#061F3F] flex items-center justify-center text-amber-300 shadow-xs ring-1 ring-[#0A2E5C]/20">
            <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="1.6">
              <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="1.6" />
              <circle cx="12" cy="12" r="2.5" fill="currentColor" />
              {[0, 30, 60, 90, 120, 150, 180, 210, 240, 270, 300, 330].map((deg) => (
                <line
                  key={deg}
                  x1="12"
                  y1="12"
                  x2={12 + 9 * Math.cos((deg * Math.PI) / 180)}
                  y2={12 + 9 * Math.sin((deg * Math.PI) / 180)}
                  stroke="currentColor"
                  strokeWidth="0.8"
                />
              ))}
            </svg>
            <span className="absolute -bottom-0.5 -right-0.5 flex h-3 w-3 items-center justify-center rounded-full bg-[#E85D04] ring-2 ring-white text-[7px] text-white font-black">
              ✓
            </span>
          </div>
          <div>
            <div className="font-bold text-base tracking-tight text-stone-900">
              SewaNadu <span className="text-xs font-bold text-[#C84700]">सेवानाडु</span>
            </div>
            <div className="text-[11px] text-stone-600 font-semibold">Citizen e-Services & Statutory Directory</div>
          </div>
        </div>
        <nav className="flex items-center gap-4 text-xs font-bold text-stone-700">
          <a href="/guides" className="hover:text-stone-950">Citizen Guides</a>
          <a href="/rti" className="hover:text-stone-950">RTI Simulator</a>
          <a href="/status" className="hover:text-stone-950">Status Tracker</a>
          <a href="/about" className="hover:text-stone-950">About</a>
        </nav>
      </header>

      {/* Hero Section */}
      <main className="max-w-6xl mx-auto px-4 sm:px-6 py-10 space-y-12">
        <section className="text-center max-w-3xl mx-auto space-y-4">
          <span className="inline-block px-3 py-1 rounded-full bg-orange-100 text-orange-900 text-xs font-mono font-bold">
            NATIONAL CITIZEN SERVICES & STATUTORY DIRECTORY
          </span>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-stone-900 tracking-tight leading-tight">
            Indian Central & State Public e-Services Guide
          </h1>
          <p className="text-sm sm:text-base text-stone-700 leading-relaxed font-sans">
            Empowering citizens across 28 States and 8 Union Territories with verified document requirements, statutory timelines (SLA), eligibility criteria, official government portal links, and step-by-step administrative procedures.
          </p>
        </section>

        {/* Directory Metrics Strip */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
          <div className="p-4 bg-white rounded-2xl border border-stone-200">
            <div className="text-2xl font-black text-stone-900">100+</div>
            <div className="text-xs text-stone-700 font-semibold">Cataloged Citizen Services</div>
          </div>
          <div className="p-4 bg-white rounded-2xl border border-stone-200">
            <div className="text-2xl font-black text-stone-900">36</div>
            <div className="text-xs text-stone-700 font-semibold">States & UTs Covered</div>
          </div>
          <div className="p-4 bg-white rounded-2xl border border-stone-200">
            <div className="text-2xl font-black text-stone-900">100% Free</div>
            <div className="text-xs text-stone-700 font-semibold">Public Information Directory</div>
          </div>
          <div className="p-4 bg-white rounded-2xl border border-stone-200">
            <div className="text-2xl font-black text-stone-900">Act 2005</div>
            <div className="text-xs text-stone-700 font-semibold">RTI & CPGRAMS Grounding</div>
          </div>
        </div>

        {/* Key Citizen Service Pillars */}
        <section className="space-y-6">
          <div className="space-y-1">
            <h2 className="text-2xl font-bold text-stone-900">Core Central & State e-Governance Services</h2>
            <p className="text-xs sm:text-sm text-stone-600 font-medium">
              Direct access to essential government identity, taxation, welfare, and transport services.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            <article className="p-5 bg-white rounded-2xl border border-stone-200 space-y-3">
              <div className="flex items-center justify-between text-[11px] font-mono font-bold text-[#C84700]">
                <span>UIDAI</span>
                <span>48H - 15 DAYS</span>
              </div>
              <h3 className="text-base font-bold text-stone-900">Aadhaar Services & Biometrics</h3>
              <p className="text-xs text-stone-700 leading-relaxed font-sans">
                Demographic updates (address, name, DOB), mandatory biometric updates (MBU for ages 5 & 15), PVC card ordering, and biometric locking on myAadhaar.
              </p>
              <div className="text-[11px] text-stone-600 pt-2 border-t border-stone-100 font-medium">
                Official: myaadhaar.uidai.gov.in
              </div>
            </article>

            <article className="p-5 bg-white rounded-2xl border border-stone-200 space-y-3">
              <div className="flex items-center justify-between text-[11px] font-mono font-bold text-orange-600">
                <span>INCOME TAX DEPT</span>
                <span>STATUTORY</span>
              </div>
              <h3 className="text-base font-bold text-stone-900">PAN Card & Aadhaar Linkage</h3>
              <p className="text-xs text-stone-600 leading-relaxed">
                Form 49A instant e-PAN, PAN correction, resolving inoperative status via ₹1,000 penalty challan (e-Pay Tax Minor Head 500), and demographic harmonization.
              </p>
              <div className="text-[11px] text-stone-500 pt-2 border-t border-stone-100">
                Official: incometax.gov.in
              </div>
            </article>

            <article className="p-5 bg-white rounded-2xl border border-stone-200 space-y-3">
              <div className="flex items-center justify-between text-[11px] font-mono font-bold text-orange-600">
                <span>MORTH</span>
                <span>30 DAYS</span>
              </div>
              <h3 className="text-base font-bold text-stone-900">Parivahan Driving Licence & RC</h3>
              <p className="text-xs text-stone-600 leading-relaxed">
                Contactless Learner License (LL) via Aadhaar e-KYC, driving test slot booking, permanent DL dispatch, Form 29/30 ownership transfer, and NOC Form 28.
              </p>
              <div className="text-[11px] text-stone-500 pt-2 border-t border-stone-100">
                Official: parivahan.gov.in
              </div>
            </article>

            <article className="p-5 bg-white rounded-2xl border border-stone-200 space-y-3">
              <div className="flex items-center justify-between text-[11px] font-mono font-bold text-orange-600">
                <span>MEITY</span>
                <span>INSTANT</span>
              </div>
              <h3 className="text-base font-bold text-stone-900">DigiLocker Digital Records</h3>
              <p className="text-xs text-stone-600 leading-relaxed">
                Access to cryptographically signed official certificates (DL, RC, CBSE mark sheets, caste certificates) legally equivalent to original paper documents under Rule 9A.
              </p>
              <div className="text-[11px] text-stone-500 pt-2 border-t border-stone-100">
                Official: digilocker.gov.in
              </div>
            </article>

            <article className="p-5 bg-white rounded-2xl border border-stone-200 space-y-3">
              <div className="flex items-center justify-between text-[11px] font-mono font-bold text-orange-600">
                <span>ECI</span>
                <span>15-30 DAYS</span>
              </div>
              <h3 className="text-base font-bold text-stone-900">Voter ID (EPIC) & Electoral Services</h3>
              <p className="text-xs text-stone-600 leading-relaxed">
                Form 6 new voter registration, Form 8 constituency shifting and demographic correction, digital e-EPIC download, and tracking BLO field verification status.
              </p>
              <div className="text-[11px] text-stone-500 pt-2 border-t border-stone-100">
                Official: voters.eci.gov.in
              </div>
            </article>

            <article className="p-5 bg-white rounded-2xl border border-stone-200 space-y-3">
              <div className="flex items-center justify-between text-[11px] font-mono font-bold text-orange-600">
                <span>AGRICULTURE DEPT</span>
                <span>₹2,000 / CYCLE</span>
              </div>
              <h3 className="text-base font-bold text-stone-900">PM-Kisan Samman Nidhi</h3>
              <p className="text-xs text-stone-600 leading-relaxed">
                Small and marginal farmer financial assistance, mandatory face e-KYC authentication, Land Seeding record resolution, and NPCI Aadhaar bank mapping.
              </p>
              <div className="text-[11px] text-stone-500 pt-2 border-t border-stone-100">
                Official: pmkisan.gov.in
              </div>
            </article>
          </div>
        </section>

        {/* In-Depth Citizen Handbooks Highlight */}
        <section className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold text-stone-900">In-Depth Citizen Handbooks & Guides</h2>
              <p className="text-xs sm:text-sm text-stone-500">
                Exhaustive operational references grounded in statutory rules and government notifications.
              </p>
            </div>
            <a
              href="/guides"
              className="text-xs font-bold text-orange-600 hover:underline"
            >
              Browse All Guides →
            </a>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {CITIZEN_GUIDES.slice(0, 4).map((guide) => (
              <div key={guide.id} className="p-5 bg-white rounded-2xl border border-stone-200 space-y-2">
                <span className="text-[10px] font-mono font-bold uppercase text-orange-600">
                  {guide.categoryLabel} • {guide.readTime}
                </span>
                <h3 className="text-base font-bold text-stone-900">{guide.title}</h3>
                <p className="text-xs text-stone-600 leading-relaxed">{guide.summary}</p>
                <div className="text-[11px] font-mono text-stone-400 pt-1">
                  Basis: {guide.statutoryBasis}
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Administrative & Revenue Glossary Preview */}
        <section className="space-y-4">
          <h2 className="text-2xl font-bold text-stone-900">e-Governance & Revenue Glossary</h2>
          <p className="text-xs sm:text-sm text-stone-500">
            Crucial administrative terms explained with statutory context.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {ESEVA_GLOSSARY.slice(0, 6).map((term, i) => (
              <div key={i} className="p-3.5 bg-white rounded-xl border border-stone-200 space-y-1">
                <div className="text-xs font-bold text-stone-900 font-display">
                  {term.term} <span className="text-stone-400 font-normal">({term.termHi})</span>
                </div>
                <div className="text-[11px] text-stone-600">{term.definition}</div>
              </div>
            ))}
          </div>
        </section>

        {/* Comprehensive FAQs Section */}
        <section className="space-y-4 bg-white p-6 sm:p-8 rounded-3xl border border-stone-200">
          <h2 className="text-2xl font-bold text-stone-900">Frequently Asked Citizen Questions</h2>
          <div className="space-y-4 text-xs sm:text-sm">
            <div className="space-y-1">
              <strong className="font-bold text-stone-900 block">
                How do I know if an e-service website is authentic?
              </strong>
              <p className="text-stone-600 leading-relaxed">
                Legitimate Indian government portals almost exclusively end with the <code>.gov.in</code> or <code>.nic.in</code> domain suffixes (such as <code>uidai.gov.in</code>, <code>incometax.gov.in</code>, or <code>parivahan.gov.in</code>). Never enter OTPs or sensitive personal data on commercial third-party portals masquerading as official services.
              </p>
            </div>
            <div className="space-y-1">
              <strong className="font-bold text-stone-900 block">
                What should I do if my government application is delayed beyond the citizen charter deadline?
              </strong>
              <p className="text-stone-600 leading-relaxed">
                Most states enforce a Right to Public Services Act (RTSA) guaranteeing delivery within fixed days (e.g. 15-30 days for caste or income certificates). If delayed, you can lodge a formal grievance on the central CPGRAMS portal or your state's CM Helpline / Jan Sunwai portal, or submit a First Appeal under the state service guarantee act.
              </p>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t border-stone-200 bg-white py-8 text-xs text-stone-500 text-center mt-12">
        <div className="max-w-6xl mx-auto px-4 space-y-2">
          <p>© 2026 SewaNadu. Independent Citizen Public Governance & Reference Directory.</p>
          <div className="flex justify-center gap-4 text-stone-600 font-medium">
            <a href="/guides" className="hover:underline">Citizen Guides</a>
            <a href="/rti" className="hover:underline">RTI Filing</a>
            <a href="/status" className="hover:underline">Status Tracker</a>
            <a href="/about" className="hover:underline">About</a>
            <a href="/privacy" className="hover:underline">Privacy Policy</a>
            <a href="/terms" className="hover:underline">Terms of Use</a>
            <a href="/disclaimer" className="hover:underline">Disclaimer</a>
          </div>
        </div>
      </footer>
    </div>
  );
}
