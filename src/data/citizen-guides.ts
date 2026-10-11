export interface CitizenGuide {
  id: string;
  title: string;
  titleHi: string;
  category: "IDENTITY" | "TAX_FINANCE" | "LEGAL_RTI" | "REVENUE" | "TRANSPORT" | "WELFARE" | "GRIEVANCE";
  categoryLabel: string;
  categoryLabelHi: string;
  readTime: string;
  lastUpdated: string;
  statutoryBasis: string;
  summary: string;
  summaryHi: string;
  officialPortal: string;
  officialPortalName: string;
  sections: {
    heading: string;
    headingHi: string;
    content: string[];
    tips?: string[];
    checklist?: string[];
  }[];
  faqs: {
    question: string;
    questionHi: string;
    answer: string;
    answerHi: string;
  }[];
}

export interface GlossaryTerm {
  term: string;
  termHi: string;
  category: string;
  definition: string;
  definitionHi: string;
  statutoryContext: string;
}

export const CITIZEN_GUIDES: CitizenGuide[] = [
  {
    id: "aadhaar-update-biometrics",
    title: "Aadhaar Demographic & Mandatory Biometric Update (MBU) Guide",
    titleHi: "आधार जनसांख्यिकीय एवं अनिवार्य बायोमेट्रिक अपडेट (MBU) मार्गदर्शिका",
    category: "IDENTITY",
    categoryLabel: "Identity & Demographics",
    categoryLabelHi: "पहचान एवं जनसांख्यिकी",
    readTime: "8 min read",
    lastUpdated: "September 2026",
    statutoryBasis: "Aadhaar (Targeted Delivery of Financial and Other Subsidies, Benefits and Services) Act, 2016 & Regulation 16A",
    summary: "Comprehensive guide to updating your Aadhaar name, address, date of birth, mobile number, and completing mandatory biometric updates for children aged 5 and 15 years.",
    summaryHi: "आधार कार्ड में नाम, पता, जन्म तिथि, मोबाइल नंबर संशोधन तथा 5 व 15 वर्ष के बच्चों के अनिवार्य बायोमेट्रिक अपडेट की संपूर्ण प्रक्रिया।",
    officialPortal: "https://myaadhaar.uidai.gov.in",
    officialPortalName: "myAadhaar Portal (UIDAI)",
    sections: [
      {
        heading: "1. Understanding Demographic vs Biometric Updates",
        headingHi: "1. जनसांख्यिकीय बनाम बायोमेट्रिक अपडेट का अंतर",
        content: [
          "Aadhaar records are categorized into demographic data (Name, Date of Birth, Gender, Address, Mobile Number, Email ID) and biometric data (Iris scans, 10-fingerprints, Facial photograph).",
          "Demographic corrections like address can be done online through the myAadhaar portal using valid Proof of Address (POA). However, mobile number linkage, name corrections exceeding limit, and biometric updates mandatorily require visiting a recognized Aadhaar Seva Kendra (ASK) or authorized bank/post office branch.",
          "UIDAI mandates updating documents every 10 years to maintain demographic integrity under Regulation 16A of the Aadhaar Enrolment & Update Regulations."
        ],
        tips: [
          "Children must undergo Mandatory Biometric Update (MBU) twice: first upon reaching age 5, and again upon reaching age 15. Both MBUs are entirely free of cost at all authorized centers.",
          "Mobile number updates cannot be completed online without visiting an enrollment center with fingerprint/iris verification."
        ]
      },
      {
        heading: "2. Allowed Correction Limits & Exception Process",
        headingHi: "2. अनुमत सुधार सीमाएं एवं अपवाद प्रक्रिया",
        content: [
          "Name corrections: Allowed maximum of two (2) times in a lifetime. Name changes must be supported by gazette notifications in case of major alterations.",
          "Date of Birth (DOB): Can only be corrected once (1) in a lifetime, provided the existing status is 'Declared' and not already 'Verified'. A verified digital Birth Certificate issued by the Registrar of Births & Deaths is mandatory.",
          "Gender: Can only be corrected once (1) in a lifetime.",
          "If a citizen has exhausted the allowed limits due to genuine operational errors, an exception handling route is available through the UIDAI Regional Office with a written appeal, gazette notification, and supporting legal affidavits."
        ],
        checklist: [
          "Valid Proof of Identity (POI) from UIDAI approved list (Passport, PAN, Voter ID, Driving License)",
          "Valid Proof of Address (POA) matching applicant name or Head of Family (HoF) self-declaration",
          "Original digital Birth Certificate for date of birth verification",
          "Active mobile number linked with Aadhaar to receive one-time passwords (OTP)"
        ]
      },
      {
        heading: "3. Step-by-Step Online Address Update Flow",
        headingHi: "3. ऑनलाइन पता अद्यतन की चरणबद्ध प्रक्रिया",
        content: [
          "Step 1: Visit myaadhaar.uidai.gov.in and click 'Login' using your 12-digit Aadhaar number and OTP received on your registered mobile number.",
          "Step 2: Select 'Address Update' from the dashboard services and choose between 'Update Address Online' (with your own POA document) or 'Head of Family (HoF) based Address Update' (if residing with parents or spouse without own documents).",
          "Step 3: Enter the new detailed address matching your supporting document. Ensure district, sub-district, post office, and PIN code match official postal records.",
          "Step 4: Upload a clear, legible color scan of the supporting document in PDF or JPEG format (maximum size 2 MB).",
          "Step 5: Pay the statutory online processing fee of ₹50 through UPI, debit card, or net banking. Note down the 14-digit Service Request Number (SRN) for tracking."
        ]
      },
      {
        heading: "4. Official Fees & Grievance Redressal",
        headingHi: "4. आधिकारिक शुल्क एवं शिकायत निवारण",
        content: [
          "Mandatory Biometric Update (MBU) for ages 5-7 and 15-17: Completely Free (₹0).",
          "Demographic Update at Aadhaar Seva Kendra: ₹50 statutory government fee.",
          "Biometric Update (with or without demographic update) for adults: ₹100 statutory government fee.",
          "Document upload (Proof of Identity / Proof of Address) on myAadhaar portal: Free during special campaigns or ₹50 at centers.",
          "If any center charges in excess of official UIDAI rates, file an immediate complaint by calling UIDAI Toll-Free Helpline 1947 or emailing helpdesk@uidai.gov.in with the center operator ID."
        ]
      }
    ],
    faqs: [
      {
        question: "Can I update my mobile number in Aadhaar online from home?",
        questionHi: "क्या मैं घर बैठे ऑनलाइन आधार में मोबाइल नंबर बदल सकता हूँ?",
        answer: "No. Mobile number updates require live biometric authentication (fingerprint/iris scan) to prevent identity theft. You must visit an Aadhaar Seva Kendra, post office, or designated bank branch. No documents are required for mobile number update.",
        answerHi: "नहीं। पहचान सुरक्षा के कारण मोबाइल नंबर अपडेट हेतु बायोमेट्रिक सत्यापन अनिवार्य है। आपको निकटतम आधार सेवा केंद्र या डाकघर जाना होगा।"
      },
      {
        question: "How long does an Aadhaar update request take to process?",
        questionHi: "आधार अपडेट अनुरोध को स्वीकृत होने में कितना समय लगता है?",
        answer: "Most demographic updates are processed within 48 hours to 15 working days. Once approved, the revised e-Aadhaar can be downloaded immediately from the myAadhaar portal and is legally equivalent to physical PVC cards.",
        answerHi: "अधिकांश अपडेट 48 घंटे से 15 कार्यदिवसों में पूरे हो जाते हैं। स्वीकृति के बाद ई-आधार ऑनलाइन डाउनलोड किया जा सकता है।"
      }
    ]
  },
  {
    id: "pan-aadhaar-link-remedy",
    title: "PAN-Aadhaar Linkage, Penalty Challan & Name Discrepancy Guide",
    titleHi: "पैन-आधार लिंकिंग, जुर्माना चालान एवं नाम विसंगति समाधान",
    category: "TAX_FINANCE",
    categoryLabel: "Tax & Financial Compliance",
    categoryLabelHi: "कर एवं वित्तीय अनुपालन",
    readTime: "7 min read",
    lastUpdated: "September 2026",
    statutoryBasis: "Section 139AA of the Income-tax Act, 1961 & CBDT Circular No. 3/2023",
    summary: "Complete statutory guide to linking your PAN with Aadhaar, resolving inoperative status, paying the ₹1,000 penalty via e-Pay Tax, and fixing spelling mismatches.",
    summaryHi: "पैन-आधार लिंकिंग की कानूनी आवश्यकता, निष्क्रिय पैन को पुनः चालू करने, ₹1000 चालान भुगतान और नाम की स्पेलिंग विसंगति ठीक करने का तरीका।",
    officialPortal: "https://eportal.incometax.gov.in",
    officialPortalName: "Income Tax e-Filing Portal",
    sections: [
      {
        heading: "1. Legal Mandate & Consequences of Inoperative PAN",
        headingHi: "1. कानूनी अधिदेश एवं निष्क्रिय पैन के दुष्प्रभाव",
        content: [
          "Under Section 139AA of the Income-tax Act, 1961, every person who has been allotted a PAN as on 1st July 2017 and is eligible to obtain Aadhaar must link both identifiers.",
          "An inoperative PAN cannot be used for filing Income Tax Returns (ITR), receiving pending tax refunds, opening bank accounts, or completing financial transactions exceeding ₹50,000.",
          "Higher Tax Deducted at Source (TDS) and Tax Collected at Source (TCS) is deducted at a penal rate of 20% or higher under Section 206AA when dealing with an inoperative PAN."
        ]
      },
      {
        heading: "2. Step-by-Step Penalty Payment via e-Pay Tax",
        headingHi: "2. ई-पे टैक्स के माध्यम से चालान भुगतान की प्रक्रिया",
        content: [
          "Step 1: Visit eportal.incometax.gov.in and click on 'Link Aadhaar' under Quick Links.",
          "Step 2: Enter your 10-character alphanumeric PAN and 12-digit Aadhaar number. If not linked, click 'Continue to Pay through e-Pay Tax'.",
          "Step 3: Enter your PAN, confirm PAN, and provide a valid mobile number for OTP verification.",
          "Step 4: Under the 'Income Tax' tile, click 'Proceed'. Select Assessment Year (AY) as the current running financial assessment year.",
          "Step 5: Select 'Type of Payment (Minor Head)' as 'Other Receipts (500)' and Sub-type as 'Fee for delay in linking PAN with Aadhaar'. The fee will automatically populate as ₹1,000.",
          "Step 6: Complete payment using Net Banking, Debit Card, RTGS/NEFT, or UPI. Download the payment receipt (Challan CRN).",
          "Step 7: Allow 24-48 hours for challan settlement in the Protean/e-Filing database, then return to 'Link Aadhaar' to submit the final link request."
        ],
        tips: [
          "Do NOT select Minor Head (100) or Minor Head (400) for PAN-Aadhaar fee. Selecting incorrect minor heads results in rejection of link request without automatic fee refund.",
          "After payment, you MUST re-visit the Link Aadhaar page to link them; paying the fee alone does not automatically link the records."
        ]
      },
      {
        heading: "3. Resolving Demographic Mismatches (Name / DOB / Gender)",
        headingHi: "3. नाम, जन्मतिथि या लिंग में विसंगति का समाधान",
        content: [
          "If linking fails due to a name mismatch (e.g. initials in PAN vs full expansion in Aadhaar), the citizen must harmonize records before submission.",
          "Option A: Correct PAN data online through the Protean (NSDL) or UTIITSL portal using Form 49A (Change/Correction in PAN data) by uploading Aadhaar as proof.",
          "Option B: If the Aadhaar name has typographical errors, update the Aadhaar demographic record via myAadhaar.",
          "Option C (Biometric Authentication): If slight differences exist in names but both belong to the same citizen, visit a designated PAN service agency counter with biometric scanner to authorize linking via iris/fingerprint verification."
        ]
      }
    ],
    faqs: [
      {
        question: "How long does it take for an inoperative PAN to become operative after linking?",
        questionHi: "लिंक करने के बाद निष्क्रिय पैन कितने समय में पुनः सक्रिय होता है?",
        answer: "As per CBDT regulations, once the Link Aadhaar request is successfully submitted after fee payment, the PAN becomes operative within 30 days. Usually, the status updates within 48 to 72 hours.",
        answerHi: "आमतौर पर अनुरोध दर्ज करने के 48 से 72 घंटे में पैन सक्रिय हो जाता है, यद्यपि नियम अनुसार इसमें 30 दिन तक का समय लग सकता है।"
      },
      {
        question: "Are non-resident Indians (NRIs) exempted from linking PAN with Aadhaar?",
        questionHi: "क्या अनिवासी भारतीयों (NRI) को पैन-आधार लिंकिंग से छूट प्राप्त है?",
        answer: "Yes, non-resident individuals as per the Income-tax Act, non-citizens of India, individuals aged 80 years or older, and residents of Assam, Jammu & Kashmir, and Meghalaya are exempted from mandatory linking unless they hold an Aadhaar.",
        answerHi: "हाँ, आयकर अधिनियम अनुसार अनिवासी भारतीय (NRI), 80 वर्ष से अधिक आयु के वरिष्ठ नागरिक और असम, मेघालय तथा जम्मू-कश्मीर के निवासियों को छूट प्राप्त है।"
      }
    ]
  },
  {
    id: "rti-act-filing-manual",
    title: "Right to Information (RTI) Act 2005: Citizen Filing & Appeals Manual",
    titleHi: "सूचना का अधिकार (RTI) अधिनियम 2005: आवेदन एवं अपील मार्गदर्शिका",
    category: "LEGAL_RTI",
    categoryLabel: "Legal Rights & Transparency",
    categoryLabelHi: "कानूनी अधिकार एवं पारदर्शिता",
    readTime: "10 min read",
    lastUpdated: "September 2026",
    statutoryBasis: "Right to Information Act, 2005 (Act No. 22 of 2005)",
    summary: "Comprehensive guide to drafting effective RTI queries, statutory timelines, the ₹10 fee payment, BPL exemptions, First Appeal under Section 19(1), and Second Appeal to Information Commissions.",
    summaryHi: "आरटीआई आवेदन का सही प्रारूप, 30 दिन की समयसीमा, ₹10 का शुल्क, गरीबी रेखा (BPL) छूट, प्रथम अपील और सूचना आयोग में द्वितीय अपील की पूरी प्रक्रिया।",
    officialPortal: "https://rtionline.gov.in",
    officialPortalName: "RTI Online Central Portal",
    sections: [
      {
        heading: "1. Scope of the RTI Act & Eligible Information",
        headingHi: "1. आरटीआई का दायरा एवं कौन सी जानकारी प्राप्त की जा सकती है",
        content: [
          "Under Section 2(f) of the RTI Act 2005, 'information' includes records, documents, memos, emails, opinions, advices, press releases, circulars, orders, logbooks, contracts, reports, papers, samples, models, and data held in any electronic form by a public authority.",
          "Citizens can seek inspection of government works, certified copies of documents, certified samples of civil construction material, and information in electronic formats like CD/pen drive.",
          "Section 8 provides specific exemptions (national security, commercial confidence, trade secrets, personal privacy without public interest). Section 24 exempts certain intelligence and security organizations, except in cases of allegations of corruption and human rights violations."
        ]
      },
      {
        heading: "2. How to Draft an Effective, Unambiguous RTI Query",
        headingHi: "2. स्पष्ट एवं प्रभावी आरटीआई आवेदन कैसे लिखें",
        content: [
          "Address the query to the 'Central Public Information Officer (CPIO)' or 'State Public Information Officer (SPIO)' of the concerned public authority.",
          "Always ask for existing records or facts, not opinions, interpretations, or hypothetical questions. For example, ask 'Provide certified copies of daily progress reports of road construction on XYZ road between Jan 2026 and June 2026' rather than 'Why has the road not been repaired?'.",
          "Structure questions in numbered bullet points. Keep each question concise and reference file numbers or project names whenever available."
        ],
        tips: [
          "Under Section 7(5), citizens Below the Poverty Line (BPL) are exempt from all RTI application and document photocopy fees upon attaching proof of BPL ration card.",
          "For general citizens, the statutory fee for Central Government authorities is ₹10. Additional inspection fees are free for the first hour and ₹5 per each subsequent hour."
        ]
      },
      {
        heading: "3. Statutory Timelines & Mandated Deadlines",
        headingHi: "3. वैधानिक समयसीमा एवं अनिवार्य तिथियां",
        content: [
          "Standard Query: 30 days from the date of receipt of application by the CPIO/SPIO.",
          "Information concerning Life and Liberty: Mandatorily within 48 hours under Section 7(1).",
          "Transfer of Application: If the query belongs to another public authority, the CPIO must transfer it within 5 days under Section 6(3) and inform the applicant.",
          "Third Party Information: If third party rights are involved, the timeline extends up to 40 days under Section 11.",
          "Deemed Refusal: If no reply is received within 30 days, it is legally deemed as refusal without justification, entitling the applicant to file a First Appeal."
        ]
      },
      {
        heading: "4. The Appeals Process: First Appeal & Second Appeal",
        headingHi: "4. अपील प्रक्रिया: प्रथम अपील एवं द्वितीय अपील",
        content: [
          "First Appeal (Section 19(1)): If no response is received within 30 days or you are aggrieved by the decision of the CPIO, file a First Appeal to the First Appellate Authority (FAA) within 30 days. The FAA must decide within 30 days (extendable to 45 days with recorded reasons). No fee is charged for First Appeal.",
          "Second Appeal (Section 19(3)): If the FAA fails to pass an order or passes an unsatisfactory order, file a Second Appeal before the Central Information Commission (CIC) or State Information Commission (SIC) within 90 days.",
          "Penalties under Section 20: The Information Commission can impose a penalty of ₹250 per day up to ₹25,000 on the PIO for unreasonable refusal, malafide denial, or furnishing misleading information."
        ]
      }
    ],
    faqs: [
      {
        question: "Can an RTI application be rejected if I don't give a reason for asking?",
        questionHi: "क्या कारण न बताने पर आरटीआई आवेदन खारिज किया जा सकता है?",
        answer: "No. Section 6(2) of the RTI Act explicitly states that an applicant making a request for information shall not be required to give any reason for requesting the information or any other personal details except those necessary for contacting him.",
        answerHi: "बिल्कुल नहीं। आरटीआई अधिनियम की धारा 6(2) स्पष्ट करती है कि सूचना मांगने के लिए कोई कारण बताना आवश्यक नहीं है।"
      },
      {
        question: "What is the fee for filing an RTI online for Central Government ministries?",
        questionHi: "केंद्र सरकार के मंत्रालयों में ऑनलाइन आरटीआई दाखिल करने का शुल्क क्या है?",
        answer: "The statutory fee is ₹10 per application, payable via Net Banking, Debit/Credit Card, or UPI on rtionline.gov.in. Applicants with BPL category pay ₹0.",
        answerHi: "शुल्क ₹10 है जो ऑनलाइन पोर्टल पर इंटरनेट बैंकिंग या यूपीआई से दिया जा सकता है। बीपीएल आवेदकों के लिए यह पूरी तरह निःशुल्क है।"
      }
    ]
  },
  {
    id: "digilocker-legal-validity",
    title: "DigiLocker Legal Admissibility & Digital Documents Framework",
    titleHi: "डिजिलॉकर की कानूनी वैधता एवं डिजिटल दस्तावेज रूपरेखा",
    category: "LEGAL_RTI",
    categoryLabel: "Digital Governance & Law",
    categoryLabelHi: "डिजिटल शासन एवं कानून",
    readTime: "6 min read",
    lastUpdated: "September 2026",
    statutoryBasis: "Rule 9A of Information Technology (Intermediaries Guidelines) Rules 2016 & IT Act Section 9A",
    summary: "Detailed statutory analysis of why DigiLocker issued documents are legally identical to original physical paper certificates for police checks, RTO verification, airports, and academic admissions.",
    summaryHi: "आईटी एक्ट की धारा 9A के तहत डिजिलॉकर के डिजिटल दस्तावेजों की कानूनी समकक्षता, पुलिस, आरटीओ, एयरपोर्ट और शिक्षण संस्थानों में उनकी मान्यता के नियम।",
    officialPortal: "https://www.digilocker.gov.in",
    officialPortalName: "DigiLocker Official Portal",
    sections: [
      {
        heading: "1. The Statutory Framework of Rule 9A",
        headingHi: "1. नियम 9A का कानूनी ढांचा",
        content: [
          "Under Rule 9A of the Information Technology (Preservation and Retention of Information by Intermediaries Providing Digital Locker Facilities) Rules, 2016, documents issued in DigiLocker are treated on par with original physical documents.",
          "Section 9A empowers departments to digitally sign and push authentic certificates (Driving Licenses, Vehicle Registration Certificates, Marks Sheets, Caste Certificates) directly into a citizen's DigiLocker repository via automated API integration with issuer databases.",
          "These documents carry an authentic cryptographic digital signature (PKI based) and QR code, rendering them tamper-evident and self-verifying."
        ]
      },
      {
        heading: "2. Ministry Notifications on Acceptance",
        headingHi: "2. विभिन्न मंत्रालयों की मान्यता संबंधी अधिसूचनाएं",
        content: [
          "Ministry of Road Transport and Highways (MoRTH): Notification RT-11036/64/2017-MVL dated 17/12/2018 clearly instructs all State Transport Departments and Traffic Police that digital Driving Licenses and Registration Certificates displayed through DigiLocker or mParivahan MUST be accepted as physical equivalents. Seizure of physical licenses is prohibited unless required under court directives.",
          "Bureau of Civil Aviation Security (BCAS): Digital Aadhaar, Driving License, and Passport on DigiLocker are officially recognized as valid identity proofs for terminal entry at all commercial Indian airports.",
          "University Grants Commission (UGC) & CBSE: Circular D.O.No.F.1-4/2021 (QIP) mandates all universities, colleges, and examination boards to accept academic degrees, diplomas, and marks-sheets fetched through National Academic Depository (NAD) DigiLocker."
        ]
      },
      {
        heading: "3. Difference Between 'Issued Documents' vs 'Uploaded Documents'",
        headingHi: "3. 'जारी किए गए दस्तावेज' बनाम 'अपलोड किए गए दस्तावेज' का अंतर",
        content: [
          "'Issued Documents' are pulled directly from the authoritative database of government departments (e.g. UIDAI, State RTO, CBSE, Income Tax Department) using your registration number. These carry statutory equivalence to original paper documents under Rule 9A.",
          "'Uploaded Documents' (Drive) are scanned PDF/images uploaded manually by the user into their 1 GB personal cloud storage. These do NOT carry statutory equivalence under Rule 9A unless accompanied by physical originals or self-attestation."
        ],
        tips: [
          "When presenting proof to traffic police or airport security, always open the official DigiLocker app and show the 'Issued Documents' section. Static screenshots or exported JPG files are not accepted."
        ]
      }
    ],
    faqs: [
      {
        question: "Can traffic police legally demand physical RC or DL if I have it in DigiLocker?",
        questionHi: "क्या ट्रैफिक पुलिस डिजिलॉकर में डीएल/आरसी होने पर भी मूल कागजात मांग सकती है?",
        answer: "No. As per MoRTH Circular No. RT-11036/64/2017-MVL, electronic records presented via DigiLocker are legally binding. In case of e-challans, authorities can impound the license digitally in the Parivahan database without confiscating physical cards.",
        answerHi: "नहीं। सड़क परिवहन मंत्रालय (MoRTH) के आदेशानुसार डिजिलॉकर में उपलब्ध ड्राइविंग लाइसेंस व आरसी पूरी तरह वैध हैं।"
      },
      {
        question: "Is creating a DigiLocker account free for Indian citizens?",
        questionHi: "क्या भारतीय नागरिकों के लिए डिजिलॉकर खाता बनाना निःशुल्क है?",
        answer: "Yes, DigiLocker is an initiative of the Ministry of Electronics and Information Technology (MeitY) under Digital India and is completely free with 1 GB of secure cloud storage.",
        answerHi: "हाँ, डिजिलॉकर भारत सरकार की पूर्णतः निःशुल्क सेवा है।"
      }
    ]
  },
  {
    id: "revenue-caste-income-domicile",
    title: "State Revenue Certificates: Income, Domicile & Non-Creamy Layer (NCL)",
    titleHi: "राज्य राजस्व प्रमाण पत्र: आय, निवास एवं गैर-क्रीमी लेयर (NCL) मार्गदर्शिका",
    category: "REVENUE",
    categoryLabel: "Revenue & Land Administration",
    categoryLabelHi: "राजस्व एवं भूमि प्रशासन",
    readTime: "9 min read",
    lastUpdated: "September 2026",
    statutoryBasis: "State Public Services Guarantee Acts & DoPT OM No. 36012/22/93-Estt.(SCT)",
    summary: "Complete breakdown of issuing authorities, the verification chain (Patwari -> RI -> Tahsildar), income criteria for Non-Creamy Layer (NCL) OBC status, EWS norms, and state SLA delivery times.",
    summaryHi: "आय, जाति, निवास और ईडब्ल्यूएस प्रमाण पत्र जारी करने की प्रक्रिया, पटवारी व तहसीलदार सत्यापन, क्रीमी लेयर नियम और सेवा गारंटी अधिनियम के तहत समयसीमा।",
    officialPortal: "https://edistrict.gov.in",
    officialPortalName: "State e-District Portals Directory",
    sections: [
      {
        heading: "1. The Administrative Verification Chain",
        headingHi: "1. प्रशासनिक सत्यापन शृंखला",
        content: [
          "State revenue certificates (Caste, Income, Domicile/Residence, Solvency, Land Possession) follow a structured administrative hierarchy established under state Land Revenue Codes.",
          "Level 1 (Field Enquiry): Village Administrative Officer (VAO) or Village Patwari / Lekhpal verifies physical residency, local land records (Khasra/Khata), family tree, and agricultural yield.",
          "Level 2 (Scrutiny): Revenue Inspector (RI) / Kanungo reviews the field enquiry report and examines municipal tax receipts, electricity bills, and applicant self-declarations.",
          "Level 3 (Statutory Order): Tahsildar, Taluk Magistrate, or Sub-Divisional Magistrate (SDM) executes the digital signature upon satisfying all legal tests."
        ]
      },
      {
        heading: "2. OBC Non-Creamy Layer (NCL) Criteria & Calculation Rules",
        headingHi: "2. अन्य पिछड़ा वर्ग (OBC) नॉन-क्रीमी लेयर नियम एवं आय गणना",
        content: [
          "The gross annual family income threshold for OBC Non-Creamy Layer status is ₹8,00,000 (Rupees Eight Lakhs) per annum for three consecutive financial years, as per Department of Personnel & Training (DoPT) guidelines.",
          "Income Exclusions: As per DoPT OM No. 36012/22/93, income from agriculture and income from salary are EXCLUDED when determining the Non-Creamy Layer status for central government reservation purposes.",
          "Creamy Layer Status: Direct entry of parents into Group A / Class I central or state civil services before age 40 attracts automatic Creamy Layer status regardless of income."
        ],
        tips: [
          "Central Government OBC NCL certificates must strictly follow the prescribed Central Format and indicate resolution numbers from the National Commission for Backward Classes (NCBC) central list.",
          "State-specific OBC certificates are often not valid for Central civil services, NEET, or UPSC admissions unless issued in the prescribed central format."
        ]
      },
      {
        heading: "3. Economically Weaker Section (EWS) Guidelines",
        headingHi: "3. आर्थिक रूप से कमजोर वर्ग (EWS) दिशानिर्देश",
        content: [
          "Family gross annual income must be below ₹8,00,000 for the financial year prior to the year of application.",
          "Asset Exclusion Criteria: Persons whose family owns or possesses 5 acres of agricultural land and above; residential flat of 1000 sq ft and above; residential plot of 100 sq yards and above in notified municipalities; or residential plot of 200 sq yards and above in other areas are EXCLUDED from EWS reservations.",
          "The term 'Family' for EWS includes the applicant, their parents, spouse, siblings below age 18, and children below age 18."
        ]
      }
    ],
    faqs: [
      {
        question: "What is the validity period of an Income Certificate in most Indian states?",
        questionHi: "अधिकांश राज्यों में आय प्रमाण पत्र की वैधता कितनी होती है?",
        answer: "Income certificates are generally valid for one (1) financial year (April 1 to March 31). Some states like Maharashtra and Tamil Nadu issue 3-year validity certificates based on annual self-declarations.",
        answerHi: "आय प्रमाण पत्र सामान्यतः एक वित्तीय वर्ष (1 अप्रैल से 31 मार्च) के लिए मान्य होता है।"
      },
      {
        question: "Can an SDM or Tahsildar reject an application without giving reasons?",
        questionHi: "क्या सक्षम अधिकारी बिना कारण बताए आवेदन निरस्त कर सकता है?",
        answer: "No. Under the State Right to Public Services Act (RTSA), any rejection must specify unambiguous statutory grounds. The applicant has the statutory right to file a First Appeal before the Sub-Divisional Officer (SDO) within 30 days.",
        answerHi: "नहीं। लोक सेवा गारंटी अधिनियम के तहत निरस्त करने का ठोस कारण आदेश में दर्ज करना अनिवार्य है।"
      }
    ]
  },
  {
    id: "parivahan-driving-licence-rc",
    title: "Parivahan Sewa: Learner License, Permanent DL & RC Transfer Protocol",
    titleHi: "परिवहन सेवा: लर्नर लाइसेंस, पक्का ड्राइविंग लाइसेंस एवं वाहन आरसी ट्रांसफर",
    category: "TRANSPORT",
    categoryLabel: "Transport & Motor Vehicles",
    categoryLabelHi: "परिवहन एवं मोटर वाहन",
    readTime: "8 min read",
    lastUpdated: "September 2026",
    statutoryBasis: "Motor Vehicles Act, 1988 (as amended by MV Amendment Act 2019) & CMVR 1989",
    summary: "Step-by-step statutory handbook on applying for a Learner's License online via Aadhaar e-KYC, slot booking for DL skill test, Form 29/30 RC ownership transfer, and High Security Registration Plates (HSRP).",
    summaryHi: "आधार e-KYC द्वारा घर बैठे लर्नर लाइसेंस, ड्राइविंग टेस्ट स्लॉट बुकिंग, वाहन स्वामित्व अंतरण (फॉर्म 29/30) और हाई सिक्योरिटी नंबर प्लेट (HSRP) की संपूर्ण प्रक्रिया।",
    officialPortal: "https://parivahan.gov.in",
    officialPortalName: "Parivahan Sewa Portal (MoRTH)",
    sections: [
      {
        heading: "1. Contactless Learner's License (LL) Online via Aadhaar e-KYC",
        headingHi: "1. आधार e-KYC द्वारा घर बैठे लर्नर लाइसेंस प्राप्त करना",
        content: [
          "Under the Faceless RTO initiatives of MoRTH, citizens can obtain a Learner's License without visiting an RTO office if they verify their identity through Aadhaar e-KYC.",
          "Step 1: Go to parivahan.gov.in -> Drivers/Learners License -> Select your State.",
          "Step 2: Click 'Apply for Learner License' and authenticate using your 12-digit Aadhaar number and OTP. Address and demographic details are auto-populated from UIDAI records.",
          "Step 3: Select vehicle categories (e.g. Motorcycle with Gear - MCWG, Light Motor Vehicle - LMV for cars).",
          "Step 4: Upload applicant signature and Form 1 medical self-declaration. Pay the statutory fee of ₹150 for application + ₹50 for test.",
          "Step 5: Complete the mandatory Road Safety Tutorial video and take the online computer test (traffic signs, speed limits, right-of-way). Upon scoring 60%+, the Learner License is generated instantly for download."
        ]
      },
      {
        heading: "2. Permanent Driving License (DL) Application & Practical Test",
        headingHi: "2. पक्का ड्राइविंग लाइसेंस आवेदन एवं ड्राइविंग स्किल टेस्ट",
        content: [
          "Eligibility: You can apply for a permanent DL only after thirty (30) days from the issuance of your Learner License, but within its 6-month validity period.",
          "Slot Booking: Book an available test track slot on the Parivahan portal. Pay the permanent DL fee of ₹200 + driving test fee ₹300.",
          "Test Day Requirements: Bring the physical vehicle of the specified category, accompanied by an instructor with valid DL, original LL printout, vehicle insurance, pollution under control certificate (PUCC), and registration certificate (RC).",
          "Upon passing the automated driving test track (ADTT), the DL is dispatched via Speed Post to the Aadhaar-registered address within 7-15 days."
        ]
      },
      {
        heading: "3. Vehicle Ownership Transfer: Form 29 & Form 30",
        headingHi: "3. वाहन स्वामित्व अंतरण: फॉर्म 29 एवं फॉर्म 30",
        content: [
          "Form 29: Notice of transfer of ownership of a motor vehicle. Signed in duplicate by both the seller and buyer.",
          "Form 30: Application for intimation and transfer of ownership of a motor vehicle. Mandatory declaration signed by the purchaser.",
          "Time Limits: Intimation must be filed within 14 days of transfer if both parties reside in the same RTO jurisdiction, or within 30 days if moving across different RTO/state jurisdictions.",
          "Inter-State Transfer: Requires a No Objection Certificate (NOC) under Form 28 from the original registering authority, payment of differential state road tax, and re-registration."
        ]
      }
    ],
    faqs: [
      {
        question: "Can I drive alone on Indian public roads with a Learner's License?",
        questionHi: "क्या मैं लर्नर लाइसेंस के साथ अकेले सार्वजनिक सड़क पर गाड़ी चला सकता हूँ?",
        answer: "No. Rule 3 of the Central Motor Vehicles Rules (CMVR) specifies that an LL holder must be accompanied by an instructor/person holding a valid permanent DL for that category of vehicle, and the vehicle must display a red 'L' plate at front and rear.",
        answerHi: "नहीं। नियम अनुसार आपके साथ एक स्थायी लाइसेंस धारक व्यक्ति का बैठना और वाहन पर लाल 'L' बोर्ड लगाना अनिवार्य है।"
      },
      {
        question: "What is the penalty for driving without a valid driving license under the new MV Act?",
        questionHi: "बिना वैध ड्राइविंग लाइसेंस वाहन चलाने पर कितना जुर्माना है?",
        answer: "Under Section 181 of the amended Motor Vehicles Act, driving without a valid driving license attracts a court challan of up to ₹5,000 and/or community service.",
        answerHi: "मोटर वाहन अधिनियम की धारा 181 के तहत ₹5,000 का चालान या कारावास का प्रावधान है।"
      }
    ]
  },
  {
    id: "cpgrams-public-grievance-redressal",
    title: "Public Grievance Escalation: CPGRAMS Portal & State Lokayukta Guide",
    titleHi: "सार्वजनिक शिकायत निवारण: CPGRAMS पोर्टल एवं लोकायुक्त मार्गदर्शिका",
    category: "GRIEVANCE",
    categoryLabel: "Public Grievances & Redressal",
    categoryLabelHi: "जन शिकायत एवं निवारण",
    readTime: "7 min read",
    lastUpdated: "September 2026",
    statutoryBasis: "Department of Administrative Reforms and Public Grievances (DARPG) Guidelines 2022",
    summary: "Complete operational manual for filing grievances against delayed public services, corruption, banking misconduct, or municipal negligence on CPGRAMS, and escalation to the Director of Public Grievances.",
    summaryHi: "सरकारी कार्यालयों में अटके काम, भ्रष्टाचार या देरी के खिलाफ CPGRAMS पर ऑनलाइन शिकायत दर्ज करने, अपील करने और राज्य लोकायुक्त तक जाने की प्रक्रिया।",
    officialPortal: "https://pgportal.gov.in",
    officialPortalName: "CPGRAMS Portal (DARPG)",
    sections: [
      {
        heading: "1. What is CPGRAMS & What Can Be Addressed?",
        headingHi: "1. CPGRAMS क्या है और किस प्रकार की शिकायतें दर्ज हो सकती हैं",
        content: [
          "CPGRAMS (Centralized Public Grievance Redress and Monitoring System) is a 24x7 online platform managed by the Department of Administrative Reforms and Public Grievances (DARPG), Government of India.",
          "Eligible Grievances: Undue delay in sanctioning pension, EPF settlement refusal, post office money order loss, railway ticketing discrepancies, bank customer service harassment, passport dispatch delay, income tax refund holdups, and telecom broadband billing irregularities.",
          "Non-admissible Grievances: Sub-judice matters pending before courts, commercial arbitration disputes, RTI matters (must use RTI portal), and inter-family property disputes."
        ]
      },
      {
        heading: "2. The 30-Day Mandatory Resolution Timeline (SLA)",
        headingHi: "2. 30 दिन की अनिवार्य समाधान समयसीमा",
        content: [
          "As per revised DARPG guidelines, every central ministry and department must resolve public grievances within a strict maximum timeline of thirty (30) days.",
          "If resolution takes longer due to field inspections, an interim reply with specific justification must be uploaded to the complainant's portal account.",
          "Every grievance is assigned a unique Registration Number (e.g. DARPG/E/2026/00000) through which real-time status and action-taken reports (ATR) can be inspected."
        ]
      },
      {
        heading: "3. Filing an Appeal Against Unsatisfactory Closure",
        headingHi: "3. असंतोषजनक समाधान के विरुद्ध अपील की प्रक्रिया",
        content: [
          "When a grievance is closed by the nodal officer, the citizen receives an SMS/email alert with an invitation to provide feedback (rating from 1 to 5 stars).",
          "If the rating is 1 or 2 stars (Poor / Unsatisfactory), the system automatically activates the 'File Appeal' option.",
          "The appeal is directly routed to an Appellate Authority higher in rank (Joint Secretary or Director level) who conducts an independent review and must dispose of the appeal within 30 days."
        ]
      }
    ],
    faqs: [
      {
        question: "Can I file grievances against state government departments on CPGRAMS?",
        questionHi: "क्या राज्य सरकार के विभागों के खिलाफ CPGRAMS पर शिकायत कर सकते हैं?",
        answer: "Yes. CPGRAMS automatically forwards state-related grievances to the respective State Government's Chief Minister Helpline / Public Grievance Nodal Directorate (e.g. Jan Sunwai in UP, CM Helpline in MP, Spandana in AP).",
        answerHi: "हाँ। केंद्र का CPGRAMS पोर्टल राज्य संबंधी शिकायतों को संबंधित राज्य के सीएम हेल्पलाइन पोर्टल पर स्वतः अग्रेषित कर देता है।"
      },
      {
        question: "Is there any fee to file a public grievance on CPGRAMS?",
        questionHi: "क्या CPGRAMS पर शिकायत दर्ज करने के लिए कोई शुल्क लगता है?",
        answer: "No. Filing a grievance on CPGRAMS is 100% free for all citizens of India.",
        answerHi: "नहीं। CPGRAMS पर जन शिकायत दर्ज करना पूर्णतः निःशुल्क है।"
      }
    ]
  },
  {
    id: "pm-kisan-dbt-troubleshooting",
    title: "PM-Kisan Samman Nidhi: e-KYC, Land Seeding & Aadhaar DBT Guide",
    titleHi: "पीएम किसान सम्मान निधि: ई-केवाईसी, लैंड सीडिंग एवं डीबीटी समाधान",
    category: "WELFARE",
    categoryLabel: "Farmer Welfare & Agriculture",
    categoryLabelHi: "कृषि एवं कृषक कल्याण",
    readTime: "7 min read",
    lastUpdated: "September 2026",
    statutoryBasis: "Pradhan Mantri Kisan Samman Nidhi Operational Guidelines & Aadhaar Section 7 Mandate",
    summary: "Complete troubleshooting manual for farmers facing blocked installments, Land Seeding No status, Aadhaar bank NPCI mapping issues, and mobile OTP e-KYC completion.",
    summaryHi: "पीएम किसान की अटकी हुई किस्तें चालू कराने, लैंड सीडिंग 'No' को ठीक करने, बैंक खाते को NPCI से जोड़ने और फेशियल ई-केवाईसी की पूरी प्रक्रिया।",
    officialPortal: "https://pmkisan.gov.in",
    officialPortalName: "PM-Kisan Official Portal",
    sections: [
      {
        heading: "1. Three Mandatory Conditions for Receiving ₹2,000 Installments",
        headingHi: "1. ₹2,000 की किस्त प्राप्त करने हेतु 3 अनिवार्य शर्तें",
        content: [
          "Condition 1 (Land Seeding Status: YES): The farmer's land records (Khasra, Khatauni, Patta number, Survey number) must be physically verified by the Patwari/Lekhpal and digitized into the state revenue portal.",
          "Condition 2 (e-KYC Status: YES): The beneficiary must complete biometric or OTP-based e-KYC authentication on the PM-Kisan portal.",
          "Condition 3 (Aadhaar Bank Seeding Status: YES): The farmer's active savings bank account must be mapped with the National Payments Corporation of India (NPCI) mapper for Direct Benefit Transfer (DBT)."
        ]
      },
      {
        heading: "2. How to Fix 'Land Seeding: NO'",
        headingHi: "2. 'लैंड सीडिंग: NO' को कैसे ठीक करें",
        content: [
          "Obtain an updated, certified digital copy of your Land Record / RoR / Khatauni from your state's land portal (Bhulekh / Banglarbhumi / MeeBhoomi / Dharani / AnyRoR).",
          "Attach copies of your Aadhaar card, bank passbook, and PM-Kisan Registration Number.",
          "Submit the physical application dossier to your block Agriculture Technology Management Agency (ATMA) officer or Sub-Divisional Agriculture Officer (SDAO).",
          "The state agriculture directorate verifies the survey numbers and updates the national PM-Kisan MIS server within 15-20 working days."
        ]
      },
      {
        heading: "3. Resolving Inactive Bank Account / NPCI DBT Mapping",
        headingHi: "3. निष्क्रिय बैंक खाता एवं NPCI डीबीटी मैपिंग का समाधान",
        content: [
          "DBT funds are sent using Aadhaar payment bridge (APB), NOT IFSC/Account number. Having Aadhaar linked for banking operations does NOT automatically mean it is enabled for NPCI DBT credit.",
          "Visit your bank branch and submit a physical 'Mandate for NPCI Aadhaar Mapping'.",
          "Alternatively, open an India Post Payments Bank (IPPB) DBT savings account at your local post office. IPPB accounts are mapped to the NPCI DBT mapper within 24 hours automatically."
        ]
      }
    ],
    faqs: [
      {
        question: "Can I receive previous unpaid installments once my Land Seeding is approved?",
        questionHi: "क्या लैंड सीडिंग ठीक होने पर पिछली अटकी हुई किस्तें एक साथ मिल जाती हैं?",
        answer: "Yes. Once all three verification parameters show YES (Land Seeding, e-KYC, and Aadhaar Bank account), all backlogged installments are automatically disbursed in the next fund release cycle directly into the bank account.",
        answerHi: "हाँ। सत्यापन पूर्ण होते ही पिछली सभी लंबित किस्तें अगली किस्त के साथ डीबीटी द्वारा खाते में जमा हो जाती हैं।"
      }
    ]
  },
  {
    id: "passport-seva-tatkaal-normal",
    title: "Passport Seva: Normal vs Tatkaal, Police Verification & Annexure Rules",
    titleHi: "पासपोर्ट सेवा: सामान्य बनाम तत्काल, पुलिस सत्यापन एवं जरूरी दस्तावेज",
    category: "IDENTITY",
    categoryLabel: "Travel & Consular Services",
    categoryLabelHi: "यात्रा एवं वाणिज्य दूतावास",
    readTime: "9 min read",
    lastUpdated: "September 2026",
    statutoryBasis: "The Passports Act, 1967 & Passport Rules 1980",
    summary: "Comprehensive guide to applying for an Indian passport, appointment scheduling at Passport Seva Kendra (PSK/POPSK), Tatkaal fast-track requirements, and handling adverse police verification reports.",
    summaryHi: "भारतीय पासपोर्ट आवेदन की संपूर्ण विधि, पीएसके में अपॉइंटमेंट, तत्काल योजना के नियम, पुलिस वेरिफिकेशन प्रक्रिया और प्रतिकूल रिपोर्ट का समाधान।",
    officialPortal: "https://www.passportindia.gov.in",
    officialPortalName: "Passport Seva Official Portal (MEA)",
    sections: [
      {
        heading: "1. Normal vs Tatkaal Scheme Comparison",
        headingHi: "1. सामान्य बनाम तत्काल योजना की तुलना",
        content: [
          "Normal Scheme: Statutory fee of ₹1,500 (for 36-page booklet) or ₹2,000 (for 60-page booklet). Processing timeline is 15-30 days including pre-issuance police verification.",
          "Tatkaal Scheme: Statutory fee of ₹1,500 + ₹2,000 additional Tatkaal surcharge paid at the PSK counter (total ₹3,500). Passport is printed and dispatched within 1-3 working days without waiting for police verification (police verification occurs post-issuance).",
          "Tatkaal Ineligibility: Major change of name, adoption cases, citizens who have returned on emergency certificates, or applicants with pending criminal proceedings under Section 6(2)(f) CANNOT apply under Tatkaal."
        ]
      },
      {
        heading: "2. The Police Verification Process",
        headingHi: "2. पुलिस सत्यापन की प्रक्रिया एवं सावधानियां",
        content: [
          "Clear (Favorable) Report: Local police station beat officer visits applicant's physical residence to verify domicile for the past one (1) year and checks local criminal registers.",
          "Adverse Report: Occurs if the applicant is not found residing at the provided address, or previous addresses in the last 12 months were concealed in the application.",
          "If an Adverse Report is issued, the Regional Passport Office (RPO) sends a Show Cause Notice under Section 12. The applicant must appear before the Public Grievance Officer at the RPO with rental deeds, utility bills, and explanatory affidavit within 30 days."
        ]
      }
    ],
    faqs: [
      {
        question: "Can an Aadhaar card alone be used for proof of date of birth in passport applications?",
        questionHi: "क्या पासपोर्ट आवेदन में जन्मतिथि के प्रमाण हेतु केवल आधार कार्ड मान्य है?",
        answer: "Yes. For citizens born after 26/01/1989, Aadhaar cards containing the full verified Date of Birth (DD/MM/YYYY) are officially accepted as valid proof of birth alongside Birth Certificates and School Leaving Certificates.",
        answerHi: "हाँ। पूर्ण जन्मतिथि (दिन/माह/वर्ष) युक्त आधार कार्ड जन्मतिथि के वैध प्रमाण के रूप में स्वीकार्य है।"
      }
    ]
  }
];

export const ESEVA_GLOSSARY: GlossaryTerm[] = [
  {
    term: "Patta / Khatauni",
    termHi: "पट्टा / खतौनी",
    category: "Land & Revenue",
    definition: "Legal title deed and record of rights (RoR) issued by state revenue authorities confirming individual or joint ownership over agricultural land parcels.",
    definitionHi: "राज्य के राजस्व विभाग द्वारा जारी वह कानूनी दस्तावेज जो भूमि पर किसान या नागरिक के मालिकाना हक को प्रमाणित करता है।",
    statutoryContext: "State Land Revenue Codes & Digital India Land Records Modernization Programme (DILRMP)."
  },
  {
    term: "Khasra Number",
    termHi: "खसरा नंबर",
    category: "Land & Revenue",
    definition: "Unique alphanumeric parcel identification number assigned to a specific geographical plot of agricultural land in village cadastral survey maps.",
    definitionHi: "गांव के भू-नक्शे में प्रत्येक विशिष्ट भूमि के टुकड़े को दिया जाने वाला विशिष्ट पहचान क्रमांक।",
    statutoryContext: "Cadastral Survey Act & State Revenue Administration."
  },
  {
    term: "Non-Creamy Layer (NCL)",
    termHi: "नॉन-क्रीमी लेयर (NCL)",
    category: "Reservations & Welfare",
    definition: "Statutory income classification under Other Backward Classes (OBC) reservations where family annual income is below ₹8 Lakhs, making candidate eligible for quotas.",
    definitionHi: "ओबीसी आरक्षण के अंतर्गत वह वर्ग जिनकी पारिवारिक वार्षिक आय ₹8 लाख से कम है और वे आरक्षण लाभ के पात्र हैं।",
    statutoryContext: "DoPT Office Memorandum No. 36012/22/93-Estt.(SCT)."
  },
  {
    term: "Direct Benefit Transfer (DBT)",
    termHi: "प्रत्यक्ष लाभ अंतरण (DBT)",
    category: "Welfare & Subsidies",
    definition: "Government mechanism of transferring welfare subsidies, scholarships, and grants directly into beneficiary bank accounts mapped with Aadhaar through NPCI.",
    definitionHi: "सरकारी योजनाओं की वित्तीय सहायता एवं सब्सिडी को सीधे लाभार्थी के बैंक खाते में भेजने की इलेक्ट्रॉनिक प्रणाली।",
    statutoryContext: "Aadhaar Act Section 7 & Public Financial Management System (PFMS)."
  },
  {
    term: "Service Level Agreement (SLA)",
    termHi: "सेवा स्तर समझौता (SLA)",
    category: "Public Governance",
    definition: "Legally enforceable maximum time limit within which a designated public servant must process, verify, and deliver a citizen e-service certificate.",
    definitionHi: "नागरिक सेवा गारंटी अधिनियम के तहत तय की गई वह अनिवार्य समयसीमा जिसके भीतर अधिकारी को सेवा प्रदान करनी होती है।",
    statutoryContext: "State Right to Public Services Guarantee Acts (RTSA)."
  },
  {
    term: "First Appellate Authority (FAA)",
    termHi: "प्रथम अपीलीय अधिकारी (FAA)",
    category: "Legal & Transparency",
    definition: "Senior departmental officer appointed under Section 19(1) of the RTI Act to hear appeals from citizens dissatisfied with the Public Information Officer's decision.",
    definitionHi: "आरटीआई अधिनियम की धारा 19(1) के तहत जन सूचना अधिकारी के निर्णय के खिलाफ सुनवाई करने वाला वरिष्ठ विभागीय अधिकारी।",
    statutoryContext: "Right to Information Act, 2005 Section 19(1)."
  },
  {
    term: "CPGRAMS",
    termHi: "सीपीजीआरएएमएस",
    category: "Grievances",
    definition: "Centralized Public Grievance Redress and Monitoring System, an apex portal managed by DARPG for citizen complaints against central ministries and departments.",
    definitionHi: "केंद्र सरकार के प्रशासनिक सुधार और लोक शिकायत विभाग द्वारा संचालित सर्वोच्च जन शिकायत निवारण पोर्टल।",
    statutoryContext: "DARPG Comprehensive Citizen Redress Guidelines."
  },
  {
    term: "Economically Weaker Section (EWS)",
    termHi: "आर्थिक रूप से कमजोर वर्ग (EWS)",
    category: "Reservations",
    definition: "10% reservation category in civil posts and educational admissions for general category citizens with annual family gross income below ₹8 Lakhs and specified land limits.",
    definitionHi: "सामान्य वर्ग के आर्थिक रूप से कमजोर परिवारों के लिए 10% आरक्षण की कानूनी व्यवस्था।",
    statutoryContext: "Constitution (103rd Amendment) Act, 2019."
  },
  {
    term: "Domicile / Nativity Certificate",
    termHi: "मूल निवास / अधिवास प्रमाण पत्र",
    category: "Revenue & Identity",
    definition: "Statutory certificate issued by an Executive Magistrate or Tehsildar establishing an individual's permanent residence within a specific Indian state/UT.",
    definitionHi: "तहसीलदार द्वारा जारी वह प्रमाण पत्र जो सिद्ध करता है कि संबंधित नागरिक अमुक राज्य का स्थायी निवासी है।",
    statutoryContext: "State Public Administration & Domicile Rules."
  },
  {
    term: "Common Service Centre (CSC)",
    termHi: "जन सेवा केंद्र (CSC)",
    category: "Digital Governance",
    definition: "Physical access point operated by Village Level Entrepreneurs (VLEs) under Digital India delivering essential public utility and social welfare e-services to rural citizens.",
    definitionHi: "डिजिटल इंडिया के अंतर्गत ग्रामीण व शहरी नागरिकों को डिजिटल सरकारी सेवाएं प्रदान करने वाले अधिकृत केंद्र।",
    statutoryContext: "Ministry of Electronics & IT (MeitY) CSC 2.0 Scheme."
  },
  {
    term: "One Nation One Ration Card (ONORC)",
    termHi: "एक राष्ट्र एक राशन कार्ड",
    category: "Food & Welfare",
    definition: "Nationwide ration card portability allowing migrant workers and NFSA beneficiaries to lift their entitled foodgrains from any Fair Price Shop across India using biometric e-PoS.",
    definitionHi: "देश के किसी भी राज्य में किसी भी उचित मूल्य की दुकान से राशन प्राप्त करने की राष्ट्रीय बायोमेट्रिक पोर्टेबिलिटी योजना।",
    statutoryContext: "National Food Security Act, 2013 (NFSA)."
  },
  {
    term: "Sub-Divisional Magistrate (SDM)",
    termHi: "उप-विभागीय दंडाधिकारी (SDM)",
    category: "Administration",
    definition: "Executive officer in charge of a revenue subdivision of a district, possessing statutory authority to issue land titles, order criminal investigations, and execute appeals.",
    definitionHi: "जिले के अनुमंडल का प्रमुख प्रशासनिक व दंडाधिकारी अधिकारी जो अपीलीय व राजस्व शक्तियों का निर्वहन करता है।",
    statutoryContext: "Code of Criminal Procedure (CrPC) & Land Revenue Code."
  }
];
