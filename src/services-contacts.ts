// Official portal + helpline contact details for every state/UT citizen-service
// portal, and for the main central government services.
// `verified` marks entries confirmed against an official source; the rest are
// widely published numbers that should be re-checked before print use.

export interface ServiceContact {
  portalName: string;
  website: string;
  helpline: string;
  verified: boolean;
}

export const JURISDICTION_CONTACTS: Record<string, ServiceContact> = {
  "andhra-pradesh": { portalName: "MeeSeva", website: "https://ap.meeseva.gov.in", helpline: "1100", verified: true },
  "arunachal-pradesh": { portalName: "e-District Arunachal Pradesh", website: "https://edistrict.arunachal.gov.in", helpline: "1077", verified: false },
  assam: { portalName: "e-District Assam", website: "https://edistrict.assam.gov.in", helpline: "1800-345-3611", verified: false },
  bihar: { portalName: "RTPS / ServicePlus Bihar", website: "https://serviceonline.bihar.gov.in", helpline: "1800-345-6284", verified: true },
  chhattisgarh: { portalName: "e-District Chhattisgarh (Lok Seva)", website: "https://edistrict.cgstate.gov.in", helpline: "1100", verified: false },
  goa: { portalName: "Goa Online", website: "https://goaonline.gov.in", helpline: "1800-233-3202", verified: false },
  gujarat: { portalName: "Digital Gujarat", website: "https://www.digitalgujarat.gov.in", helpline: "1800-233-1000", verified: false },
  haryana: { portalName: "Antyodaya Saral / eDisha", website: "https://edisha.gov.in", helpline: "1800-2000-023", verified: false },
  "himachal-pradesh": { portalName: "e-District Himachal Pradesh", website: "https://edistrict.hp.gov.in", helpline: "1100", verified: false },
  jharkhand: { portalName: "JharSewa", website: "https://jharsewa.jharkhand.gov.in", helpline: "181", verified: false },
  karnataka: { portalName: "Seva Sindhu", website: "https://sevasindhu.karnataka.gov.in", helpline: "1902", verified: false },
  kerala: { portalName: "e-District Kerala / Akshaya", website: "https://edistrict.kerala.gov.in", helpline: "155300", verified: false },
  "madhya-pradesh": { portalName: "MP Online / Lok Seva Kendra", website: "https://edistrict.mp.gov.in", helpline: "181", verified: false },
  maharashtra: { portalName: "Aaple Sarkar", website: "https://aaplesarkar.mahaonline.gov.in", helpline: "1800-120-8040", verified: false },
  manipur: { portalName: "e-District Manipur", website: "https://edistrict.mn.gov.in", helpline: "1070", verified: false },
  meghalaya: { portalName: "e-District Meghalaya", website: "https://meghalaya.gov.in/edistrict", helpline: "1070", verified: false },
  mizoram: { portalName: "e-District Mizoram", website: "https://edistrict.mizoram.gov.in", helpline: "1070", verified: false },
  nagaland: { portalName: "e-District Nagaland", website: "https://edistrict.nagaland.gov.in", helpline: "1070", verified: false },
  odisha: { portalName: "e-District Odisha", website: "https://edistrict.odisha.gov.in", helpline: "1929", verified: false },
  punjab: { portalName: "Punjab Sewa Kendra (Connect)", website: "https://connect.punjab.gov.in", helpline: "1076", verified: false },
  rajasthan: { portalName: "Rajasthan SSO / e-Mitra", website: "https://sso.rajasthan.gov.in", helpline: "181", verified: false },
  sikkim: { portalName: "e-District Sikkim", website: "https://edistrict.sikkim.gov.in", helpline: "1070", verified: false },
  "tamil-nadu": { portalName: "TN e-Sevai", website: "https://www.tnesevai.tn.gov.in", helpline: "1100", verified: false },
  telangana: { portalName: "MeeSeva Telangana", website: "https://meeseva.telangana.gov.in", helpline: "1100", verified: false },
  tripura: { portalName: "e-District Tripura", website: "https://edistrict.tripura.gov.in", helpline: "1070", verified: false },
  "uttar-pradesh": { portalName: "e-District UP / Jansunwai", website: "https://edistrict.up.gov.in", helpline: "1076", verified: false },
  uttarakhand: { portalName: "e-District Uttarakhand", website: "https://edistrict.uk.gov.in", helpline: "1905", verified: false },
  "west-bengal": { portalName: "e-District West Bengal", website: "https://wb.gov.in/e-district", helpline: "1800-345-3376", verified: false },
  "andaman-nicobar": { portalName: "e-District A&N Islands", website: "https://edistrict.andaman.gov.in", helpline: "1077", verified: false },
  chandigarh: { portalName: "Chandigarh Sampark Citizen Services", website: "https://chdcitizenservices.gov.in", helpline: "1100", verified: false },
  "dadra-nagar-haveli-daman-diu": { portalName: "e-District DNH & DD", website: "https://edistrict.dnh.gov.in", helpline: "1077", verified: false },
  delhi: { portalName: "e-District Delhi", website: "https://edistrict.delhigovt.nic.in", helpline: "1076", verified: false },
  "jammu-kashmir": { portalName: "e-District Jammu & Kashmir", website: "https://jk.gov.in", helpline: "1800-180-7011", verified: false },
  ladakh: { portalName: "e-District Ladakh", website: "https://leh.nic.in", helpline: "1077", verified: false },
  lakshadweep: { portalName: "Lakshadweep Administration", website: "https://lakshadweep.gov.in", helpline: "1077", verified: false },
  puducherry: { portalName: "e-District Puducherry", website: "https://edistrict.py.gov.in", helpline: "1100", verified: false },
};

// Central services: matched by service id keyword.
const CENTRAL_CONTACT_RULES: { match: string[]; contact: ServiceContact }[] = [
  { match: ["uidai", "aadhaar"], contact: { portalName: "UIDAI (Aadhaar)", website: "https://uidai.gov.in", helpline: "1947", verified: true } },
  { match: ["pan", "nsdl"], contact: { portalName: "Protean / NSDL TIN", website: "https://www.protean-tinpan.com", helpline: "020-27218080", verified: false } },
  { match: ["passport", "mea"], contact: { portalName: "Passport Seva", website: "https://www.passportindia.gov.in", helpline: "1800-258-1800", verified: true } },
  { match: ["rto", "parivahan", "vahan", "driving"], contact: { portalName: "Parivahan Sewa (MoRTH)", website: "https://parivahan.gov.in", helpline: "See parivahan.gov.in contact page", verified: true } },
  { match: ["epf", "gpf", "pension"], contact: { portalName: "EPFO", website: "https://www.epfindia.gov.in", helpline: "14470", verified: true } },
  { match: ["digilocker"], contact: { portalName: "DigiLocker", website: "https://www.digilocker.gov.in", helpline: "1800-11-9223", verified: false } },
  { match: ["fastag", "nhai"], contact: { portalName: "NHAI FASTag (IHMCL)", website: "https://www.ihmcl.co.in", helpline: "1033", verified: true } },
  { match: ["post"], contact: { portalName: "India Post", website: "https://www.indiapost.gov.in", helpline: "1800-266-6868", verified: false } },
  { match: ["mca", "company"], contact: { portalName: "Ministry of Corporate Affairs", website: "https://www.mca.gov.in", helpline: "1800-124-6724", verified: false } },
  { match: ["scholarship", "mhrd"], contact: { portalName: "National Scholarship Portal", website: "https://scholarships.gov.in", helpline: "0120-6619540", verified: true } },
  { match: ["irctc", "train"], contact: { portalName: "IRCTC", website: "https://www.irctc.co.in", helpline: "139", verified: true } },
  { match: ["abha", "health", "ayushman"], contact: { portalName: "Ayushman Bharat Digital Mission", website: "https://abdm.gov.in", helpline: "14477", verified: true } },
  { match: ["gst"], contact: { portalName: "GST Portal", website: "https://www.gst.gov.in", helpline: "1800-103-4786", verified: true } },
  { match: ["dgft", "iec", "apeda", "export"], contact: { portalName: "DGFT", website: "https://www.dgft.gov.in", helpline: "1800-111-550", verified: true } },
  { match: ["income-tax", "efiling"], contact: { portalName: "Income Tax e-Filing", website: "https://www.incometax.gov.in", helpline: "1800-103-0025", verified: false } },
];

const NATIONAL_FALLBACK: ServiceContact = {
  portalName: "National Government Services Portal",
  website: "https://services.india.gov.in",
  helpline: "1800-11-3468 (CPGRAMS)",
  verified: true,
};

export function contactForService(serviceId: string, jurisdictionId?: string): ServiceContact {
  if (jurisdictionId && JURISDICTION_CONTACTS[jurisdictionId]) {
    return JURISDICTION_CONTACTS[jurisdictionId];
  }
  const id = serviceId.toLowerCase();
  for (const rule of CENTRAL_CONTACT_RULES) {
    if (rule.match.some((m) => id.includes(m))) return rule.contact;
  }
  return NATIONAL_FALLBACK;
}
