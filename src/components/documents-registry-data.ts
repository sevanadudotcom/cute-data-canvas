export interface DocumentInfo {
  id: string;
  name: Record<"en" | "hi", string>;
  category: "REVENUE" | "IDENTITY" | "CIVIL" | "SOCIAL";
  description: Record<"en" | "hi", string>;
  fees: { amount: number; notes: Record<"en" | "hi", string> };
  processingTime: Record<"en" | "hi", string>;
  designatedOffice: Record<"en" | "hi", string>;
  requirements: Record<"en" | "hi", string[]>;
  externalLinks: { label: string; url: string }[];
  stepByStep: Record<"en" | "hi", string[]>;
}

export const DOCUMENTS_REGISTRY: DocumentInfo[] = [
  {
    id: "domicile",
    name: {
      en: "Domicile / Resident Certificate (मूल निवास / अधिवास प्रमाण पत्र)",
      hi: "मूल निवास / अधिवास प्रमाण पत्र (Domicile Certificate)"
    },
    category: "REVENUE",
    description: {
      en: "An official statement certifying that a citizen is a legal and permanent resident of a specific Indian State or Union Territory.",
      hi: "एक आधिकारिक प्रमाण पत्र जो प्रमाणित करता है कि नागरिक किसी विशिष्ट भारतीय राज्य या केंद्र शासित प्रदेश का कानूनी और स्थायी निवासी है।"
    },
    fees: {
      amount: 15,
      notes: {
        en: "₹15 standard fee on official state e-District portals (and small administrative fee at citizen kiosk CSCs).",
        hi: "आधिकारिक ई-डिस्ट्रिक्ट पोर्टल पर ₹15 मानक शुल्क (तथा जन सेवा केंद्रों (CSC) पर सामान्य नाममात्र सेवा शुल्क)।"
      }
    },
    processingTime: {
      en: "7 to 15 Working Days",
      hi: "7 से 15 कार्य दिवस"
    },
    designatedOffice: {
      en: "Office of the local Tehsildar / Revenue Sub-Collector (Revenue Department)",
      hi: "स्थानीय तहसीलदार / राजस्व उप-कलेक्टर कार्यालय (राजस्व विभाग)"
    },
    requirements: {
      en: [
        "Aadhaar Card copy",
        "Voter ID / Electricity Bill / Gas Bill showing address in state for >10 years",
        "Birth Certificate or Secondary School Transfer sheet",
        "Self-Declaration affidavit certified by a municipal counselor or Village Pradhan"
      ],
      hi: [
        "आधार कार्ड की प्रति",
        "मतदाता पहचान पत्र / बिजली बिल / गैस बिल जिसमें राज्य में >10 वर्षों से निवास दर्शाया गया हो",
        "जन्म प्रमाण पत्र या माध्यमिक विद्यालय स्थानांतरण प्रमाण पत्र",
        "नगर पार्षद या ग्राम प्रधान द्वारा प्रमाणित स्व-घोषणा पत्र (शपथ पत्र)"
      ]
    },
    externalLinks: [
      { label: "Uttar Pradesh e-District", url: "https://edistrict.up.gov.in" },
      { label: "Karnataka Seva Sindhu", url: "https://sevasindhu.karnataka.gov.in" },
      { label: "Madhya Pradesh Lok Seva", url: "https://www.mpedistrict.gov.in" }
    ],
    stepByStep: {
      en: [
        "Collect Address Evidence: Compile 10-years-old voter lists or utility receipts mapping to your specific pin code.",
        "Prepare Self-Declaration Affidavit: Write or print the specified localized non-judicial self-declaration template.",
        "File application: Register on your resident state's e-District portal or take physical sheets to the nearest Common Service Center (CSC).",
        "Administrative verification: The application is routed to the village Patwari or Lekhpal who conducts field inspections.",
        "SDM Approval: Upon Patwari clearance, the Tehsildar physically signs the digital certificate, which is auto-dispatched."
      ],
      hi: [
        "पते का दस्तावेजी प्रमाण एकत्र करें: अपने विशिष्ट पिन कोड से जुड़े 10 वर्ष पुराने वोटर कार्ड या पानी/बिजली बिल संकलित करें।",
        "स्व-घोषणा शपथ पत्र तैयार करें: स्थानीय गैर-न्यायिक स्व-घोषणा प्रारूप पर घोषणा लिखें या प्रिंट करें।",
        "आवेदन दर्ज करें: अपने राज्य के ई-डिस्ट्रिक्ट पोर्टल पर ऑनलाइन पंजीकरण करें या नजदीकी जन सेवा केंद्र (CSC) पर जाएं।",
        "प्रशासनिक सत्यापन: आपका आवेदन ग्राम पटवारी या लेखपाल को भेजा जाता है जो भौतिक निवास की पुष्टि करते हैं।",
        "स्वीकृति व प्रमाणपत्र: लेखपाल की रिपोर्ट के बाद तहसीलदार डिजिटल प्रमाणपत्र पर हस्ताक्षर करते हैं, जिसे आप डाउनलोड कर सकते हैं।"
      ]
    }
  },
  {
    id: "caste-certificate",
    name: {
      en: "Caste / Social Category Certificate (जाति प्रमाण पत्र)",
      hi: "जाति प्रमाण पत्र (Caste / Category Certificate)"
    },
    category: "SOCIAL",
    description: {
      en: "Essential legal document confirming a citizen belongs to specific Reserved Social Categories (OBC, SC, or ST) under national or state records.",
      hi: "राष्ट्रीय या राज्य रिकॉर्ड के तहत नागरिक की अनुसूचित जाति (SC), अनुसूचित जनजाति (ST), या पिछड़े वर्ग (OBC) की संबद्धता प्रमाणित करने वाला अनिवार्य कानूनी दस्तावेज।"
    },
    fees: {
      amount: 20,
      notes: {
        en: "₹20 processing cost. Free for Below Poverty Line (BPL) card holders in selected states.",
        hi: "₹20 प्रसंस्करण शुल्क। चयनित राज्यों में गरीबी रेखा से नीचे (BPL) कार्ड धारकों के लिए पूर्णतः निःशुल्क।"
      }
    },
    processingTime: {
      en: "10 to 15 Working Days",
      hi: "10 से 15 कार्य दिवस"
    },
    designatedOffice: {
      en: "Revenue Department / Office of the District Magistrate or Sub-Divisional Officer (SDO)",
      hi: "राजस्व विभाग / जिला मजिस्ट्रेट या अनुविभागीय अधिकारी (SDO) कार्यालय"
    },
    requirements: {
      en: [
        "Aadhaar Card with matching family spellings",
        "Father's Caste Certificate copy (vital baseline validation document)",
        "School Leaving Certificate (LC) containing Caste/Ref category",
        "Affidavit validating lineage details and declaring category tier"
      ],
      hi: [
        "पारिवारिक विवरणों से मेल खाता आधार कार्ड",
        "पिता के जाति प्रमाण पत्र की प्रति (सबसे महत्वपूर्ण सहायक दस्तावेज)",
        "स्कूल छोड़ने का प्रमाण पत्र (LC) जिसमें जाति/श्रेणी का स्पष्ट उल्लेख हो",
        "वंशावली विवरण को प्रमाणित करने वाला और सामाजिक श्रेणी घोषित करने वाला शपथ पत्र"
      ]
    },
    externalLinks: [
      { label: "Bihar ServicePlus portal", url: "https://serviceonline.bihar.gov.in" },
      { label: "Maharashtra Aaple Sarkar", url: "https://aaplesarkar.mahaonline.gov.in" },
      { label: "Delhi e-District Console", url: "https://edistrict.delhigovt.nic.in" }
    ],
    stepByStep: {
      en: [
        "Establish Bloodline Proof: Acquire your father's, sibling's, or direct paternal uncle's official Caste Certificate.",
        "Obtain Caste Affidavit: Prepare an official affidavit declaring lineage in front of an Executive Magistrate.",
        "Submit to Center: File the application packet with supporting e-District forms online or via CSC.",
        "Field Level Verification: The Revenue Inspector checks village family records or consults local elders.",
        "Digital Issuance: SDO signs the secure electronic certificate with an asymmetric digital signature key."
      ],
      hi: [
        "रक्त संबंध का प्रमाण जुटाएं: अपने पिता, सगे भाई या सीधे पैतृक चाचा का आधिकारिक जाति प्रमाण पत्र प्राप्त करें।",
        "शपथ पत्र प्राप्त करें: कार्यकारी मजिस्ट्रेट या नोटरी के समक्ष वंशावली घोषित करने वाला आधिकारिक शपथ पत्र तैयार करें।",
        "पोर्टल पर जमा करें: ई-डिस्ट्रिक्ट पोर्टल या नजदीकी जन सेवा केंद्र (CSC) के माध्यम से सहायक दस्तावेजों के साथ आवेदन जमा करें।",
        "अधिकारी सत्यापन: राजस्व अधिकारी ग्राम परिवार रजिस्टर या स्थानीय पंचायत रिकॉर्ड से जाति की पुष्टि करते हैं।",
        "डिजिटल हस्ताक्षर: सब-डिवीजनल अधिकारी (SDO) डिजिटल की-हस्ताक्षर द्वारा प्रमाणपत्र जारी करते हैं।"
      ]
    }
  },
  {
    id: "income-certificate",
    name: {
      en: "Income & Asset Certificate (आय प्रमाण पत्र)",
      hi: "आय प्रमाण पत्र (Income & Asset Certificate)"
    },
    category: "REVENUE",
    description: {
      en: "Validates the total annual collective earnings of an entire household. Mandated for public scholarships, ration subsystems, and social quotas.",
      hi: "संपूर्ण परिवार की कुल वार्षिक सामूहिक कमाई को प्रमाणित करता है। सार्वजनिक छात्रवृत्तियों, राशन कार्ड आवंटन और आर्थिक आरक्षण (EWS) के लिए अनिवार्य।"
    },
    fees: {
      amount: 30,
      notes: {
        en: "₹30-₹50 state portal application fees.",
        hi: "₹30-₹50 राज्य पोर्टल सेवा शुल्क।"
      }
    },
    processingTime: {
      en: "7 to 10 Working Days",
      hi: "7 से 10 कार्य दिवस"
    },
    designatedOffice: {
      en: "Tahsildar Desk / Resident Revenue Inspector (Revenue Administration)",
      hi: "तहसीलदार कार्यालय / स्थानीय राजस्व निरीक्षक डेस्क (राजस्व प्रशासन)"
    },
    requirements: {
      en: [
        "Aadhaar Card of the family head and working members",
        "Salary slip / Form-16 (for salaried individuals) or Agricultural Land Record assessment",
        "Ration Card copy (BPL / APL / Antyodaya)",
        "Affidavit by village Patwari or Lekhpal verifying land produce or small trading earnings"
      ],
      hi: [
        "परिवार के मुखिया और सभी कामकाजी सदस्यों का आधार कार्ड",
        "वेतन पर्ची / फॉर्म-16 (वेतनभोगी लोगों के लिए) या कृषि उपज/भूमि रिकॉर्ड का मूल्यांकन",
        "राशन कार्ड की प्रति (बीपीएल / एपीएल / अंत्योदय)",
        "भूमि उपज या छोटे व्यापारिक स्रोतों की आय सत्यापित करने वाला पटवारी / ग्राम सचिव का प्रमाणपत्र"
      ]
    },
    externalLinks: [
      { label: "Rajasthan SSO ID Portal", url: "https://sso.rajasthan.gov.in" },
      { label: "Haryana SARAL Portal", url: "https://saralharyana.gov.in" },
      { label: "Uttarakhand Apuni Sarkar", url: "https://apuni-sarkar.uk.gov.in" }
    ],
    stepByStep: {
      en: [
        "Compile Personal Income: Collect bank account statements, salary sheets, Form 16, or small trading income logs.",
        "Patwari Verification Routing: Secure an initial certified income appraisal statement from the local Patwari/Lekhpal.",
        "Portal Registration: Fill out the application on your state's digital revenue portal with the Patwari certificate attached.",
        "Tahsildar Assessment: Revenue officials evaluate filed assets against geographic and property databases.",
        "Certificate Delivery: Released digitally with verified signature mapping directly to the applicant's resident credentials."
      ],
      hi: [
        "सकल आय दस्तावेज संकलित करें: बैंक विवरण, वेतन पर्ची, फॉर्म 16 या छोटे स्थानीय व्यवसाय की आय विवरणिका जुटाएं।",
        "पटवारी से प्राथमिक सत्यापन: स्थानीय पटवारी/लेखपाल से परिवार की वास्तविक कृषि या अनौपचारिक आय का मूल्य प्रमाणपत्र प्राप्त करें।",
        "डिजिटल आवेदन: राज्य के राजस्व पोर्टल पर जाकर आवेदन पत्र भरें और पटवारी का प्रमाण संलग्न करें।",
        "तहसीलदार मूल्यांकन: राजस्व अधिकारी भौगोलिक और पंजीकृत संपत्ति डेटाबेस के विरुद्ध घोषित संपत्तियों का मूल्यांकन करते हैं।",
        "डिजिटल प्रमाणपत्र प्राप्ति: तहसीलदार के अंतिम अनुमोदन के बाद डिजिटल आय प्रमाण पत्र जारी कर दिया जाता है जिसे डाउनलोड कर सकते हैं।"
      ]
    }
  },
  {
    id: "ews-certificate",
    name: {
      en: "Economically Weaker Section (EWS) Certificate (ईडब्ल्यूएस प्रमाण पत्र)",
      hi: "ईडब्ल्यूएस प्रमाण पत्र (Economically Weaker Section Certificate)"
    },
    category: "REVENUE",
    description: {
      en: "Issues 10% Reservation in central/state government employment and higher educational institutes for General Category families with low income.",
      hi: "सामान्य वर्ग के आर्थिक रूप से कमजोर परिवारों को केंद्र और राज्य सरकार की नौकरियों और उच्च शैक्षणिक संस्थानों में 10% आरक्षण की सुविधा प्रदान करने वाला दस्तावेज।"
    },
    fees: {
      amount: 50,
      notes: {
        en: "₹50 application processing cost. Valid for exactly 1 financial year.",
        hi: "₹50 आवेदन प्रसंस्करण शुल्क। यह प्रमाण पत्र केवल 1 वित्त वर्ष के लिए वैध रहता है।"
      }
    },
    processingTime: {
      en: "15 to 21 Working Days",
      hi: "15 से 21 कार्य दिवस"
    },
    designatedOffice: {
      en: "Office of the Sub-Divisional Magistrate (SDM) / Revenue Collector",
      hi: "अनुविभागीय मजिस्ट्रेट (SDM) / राजस्व कलेक्टर कार्यालय"
    },
    requirements: {
      en: [
        "Family income certificate validating annual earnings < ₹8 Lakh",
        "Agricultural land holding records showing area < 5 acres",
        "Residential flat dimension declaration form (< 1000 sq ft)",
        "Aadhaar Card and localized domicile certificates"
      ],
      hi: [
        "वार्षिक आय ₹8 लाख से कम दर्शाने वाला पारिवारिक आय प्रमाण पत्र",
        "कृषि भूमि जोत रिकॉर्ड (जो कुल 5 एकड़ से कम होनी चाहिए)",
        "शहरी आवासीय फ्लैट का क्षेत्रफल घोषणा पत्र (जो 1000 वर्ग फुट से कम होना चाहिए)",
        "आधार कार्ड, पैन कार्ड तथा मूल निवास प्रमाण पत्र"
      ]
    },
    externalLinks: [
      { label: "National Government Services India", url: "https://services.india.gov.in" },
      { label: "E-Mitra Rajasthan Desk", url: "https://emitra.rajasthan.gov.in" }
    ],
    stepByStep: {
      en: [
        "Validate EWS Criteria: Confirm gross annual income is less than ₹8 Lakh and agricultural layout fits below the 5-acre limit.",
        "Secure Revenue Proofs: Gather verified local land registry records (Jamabandi or Patta) and active income reports.",
        "File EWS Request: Submit the application detailing assets and family members directly to the regional Circle Officer / Tehsildar.",
        "Physical Field Audit: Revenue Inspector inspects residential sites to verify plot sizing and declarations.",
        "Final SDO Approval: SDM/Revenue Division signs the national EWS certificate format."
      ],
      hi: [
        "ईडब्ल्यूएस मानकों की जांच करें: पुष्टि करें कि वार्षिक पारिवारिक आय ₹8 लाख से कम है और कृषि भूमि जोत 5 एकड़ से कम है।",
        "राजस्व रिकॉर्ड जुटाएं: स्थानीय जमाबंदी या पट्टा खतौनी दस्तावेजी प्रमाण तथा प्रमाणित वार्षिक पारिवारिक आय रिपोर्ट संकलित करें।",
        "आवेदन जमा करें: क्षेत्रीय अंचल अधिकारी या तहसीलदार के पास संपत्तियों और परिवार के सदस्यों का विवरण ऑनलाइन पंजीकृत करें।",
        "भौतिक संपत्ति ऑडिट: राजस्व निरीक्षक फ्लैट के क्षेत्रफल तथा कृषि जोत की पुष्टि के लिए स्थल का भौतिक सत्यापन करते हैं।",
        "एसडीओ अंतिम हस्ताक्षर: भौतिक समीक्षा संपन्न होने के बाद अनुविभागीय अधिकारी (SDM) द्वारा राष्ट्रीय ईडब्ल्यूएस प्रमाण पत्र जारी किया जाता है।"
      ]
    }
  }
];
