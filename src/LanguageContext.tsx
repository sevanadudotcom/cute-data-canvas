import React, { createContext, useContext, useState, useEffect } from "react";
import { ESevaService, ServiceApplication, GrievanceRecord, DigiLockerDocument } from "./types";

export type Language = "en" | "hi" | "ta" | "te" | "bn" | "mr" | "gu" | "kn" | "ml" | "pa" | "or";

interface LanguageContextProps {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string, variables?: Record<string, string>) => string;
  translateService: (service: ESevaService) => ESevaService;
  translateDoc: (doc: DigiLockerDocument) => DigiLockerDocument;
  translateApplication: (app: ServiceApplication) => ServiceApplication;
  translateGrievance: (g: GrievanceRecord) => GrievanceRecord;
}

const LanguageContext = createContext<LanguageContextProps | null>(null);

const dictionary: Record<string, Record<string, string>> = {
  en: {
    // 1. App Header
    "app.national_portal": "National E-Services Portal",
    "app.gateway_title": "Rashtriya e-Sewa Gateway",
    "app.digital_india": "| Digital India",
    "app.logo_subtext": "Citizen Service Guide",
    "app.search_placeholder": "Search services (e.g. Aadhaar, PAN, Passport)",
    "menu.all_services": "All Services",
    "menu.compare": "Compare",
    "app.zone": "Zone",
    "app.ref": "UIDAI Ref",
    
    // 2. Navigation Tabs
    "tab.services": "Verified e-Seva Applications",
    "tab.eligibility": "Eligibility Checker",
    "tab.doc_wizard": "Document Wizard",
    "tab.lockers": "My DigiLocker Wallet",
    "tab.grievances": "CPGRAMS Redressal Desk",
    "tab.chatbot": "e-Seva Suvidha Assistant",
    "tab.faq": "Help & FAQ",

    // 3. Alerts & Toasts
    "toast.header": "National Registry Alert",
    "toast.approved": "Administrative Approved! Your verifiable Card for \"{serviceName}\" has been issued to DigiLocker.",
    "toast.approved_override": "Administrative Approved! Your verifiable Card for \"{serviceName}\" has been issued to DigiLocker.",
    "toast.override_failed": "Failed to override administrative state.",
    "toast.network_failed": "Network link failed during signature override.",
    "toast.revoked": "Digital document revoked and deleted from DigiLocker successfully.",
    "toast.revoke_failed": "Failed to delete document from DigiLocker.",
    "toast.revoke_error": "Error contacting DigiLocker backend database.",
    "toast.chatbot_busy": "AI Service temporary busy. Rule engine loaded instead.",
    "toast.chatbot_error": "Error connecting with AI services.",
    "toast.reset_chat": "Conversation thread reset successfully.",
    "alert.legal_notice_short": "Filing inaccurate/fabricated complaints is an offense.",
    "alert.demo": "A PDF digital audit copy has been successfully download simulated. Saved to your device downloads",

    // 4. Service list view
    "directory.title": "National Citizen Services Directory",
    "directory.desc": "Browse active welfare subventions, document re-issuances, and identity databases validated under Indian public service charters.",
    "directory.search_placeholder": "Search credentials, UIDAI, Income...",
    "directory.no_match": "No Match Found",
    "directory.no_match_desc": "We couldn't identify e-Seva services mirroring your terminology. Revise your search query or reset filter pills.",
    "directory.mandatory_paperwork": "Mandatory Paperwork Needed:",
    "directory.govt_fee": "Government Fee",
    "directory.free": "FREE / No Charge",
    "directory.apply_online": "Apply Online",
    "directory.pro_tip_title": "💡 Pro Tip for Indian Citizens:",
    "directory.pro_tip_desc": "Direct integrations like **Ayushman Bharat Health Card (ABHA ID)** and **e-Shram Registration UAN Card** generate credentials instantly on submitting. Others (like Caste Certificates or PAN registrations) are processed sequentially – click \"Lodge Administrative Approval\" on the status page to simulate localized district officer verifications!",

    // 5. Service categories
    "cat.ALL": "All Schemes / Services",
    "cat.IDENTITY": "National ID & Passports",
    "cat.FINANCE": "Tax & Financial IDs",
    "cat.HEALTH": "National Health Mission",
    "cat.LABOUR": "Workers & Employment",
    "cat.LAND": "State Revenue Certs",
    "cat.WELFARE": "Farmers & Welfare DBT",

    // 6. Application form
    "form.back": "Back to Directory",
    "form.regulation": "Form Form-5A Central Regulation",
    "form.target_header": "APPLICATION TARGET",
    "form.bureaucracy": "Bureaucracy Host:",
    "form.part_a": "PART A: Applicant Demographics",
    "form.part_b": "PART B: Revenue Category Income declaration",
    "form.part_c": "PART C: Biometric & Security e-KYC Verification",
    "form.name_label": "Full Legal Citizen Name (as in Aadhaar)",
    "form.name_placeholder": "e.g. Shahrukh Khan",
    "form.name_hint": "Mismatches will trigger administrative reject.",
    "form.aadhaar_label": "12-Digit UIDAI Aadhaar ID Code",
    "form.aadhaar_placeholder": "e.g. 129034803780",
    "form.aadhaar_hint": "Your records are completely sandboxed.",
    "form.father_label": "Father's / Spouse's Legal Name",
    "form.father_placeholder": "e.g. K. Khan",
    "form.jurisdiction_label": "Resident Jurisdiction / Indian State",
    "form.earnings_label": "Yearly Family Gross Earnings",
    "form.earnings_hint": "* Mandatory proof requirement: Village accountant audit declarations or salary payslip ledger files.",
    "form.kyc_desc": "To prevent administrative delays, authenticate using digital Aadhaar OTP or virtual biometric scanning simulation.",
    "form.method1": "Method 1: Aadhaar-Linked SMS OTP",
    "form.mobile_placeholder": "Enter 10-digit Mobile No",
    "form.btn_send_otp": "Send OTP",
    "form.btn_resend_otp": "Resend OTP",
    "form.otp_placeholder": "6-Digit OTP",
    "form.btn_verify_otp": "Verify Code",
    "form.otp_verified": "Aadhaar Mobile Linkage Verified!",
    "form.method2": "Method 2: Virtual Biometric (Thumb/Iris)",
    "form.method2_desc": "Perfect for instant e-Shram worker identity certification hubs.",
    "form.btn_scan": "Simulate Central Fingerprint Scan",
    "form.scanning": "Position Finger on Scanner...",
    "form.scan_verified": "Biometric Signature Matches!",
    "form.is_instant": "⚡ Real-time / Approved issuance",
    "form.is_delay": "⌛ Regional tahsildar audit queue required",
    "form.btn_cancel": "Cancel",
    "form.btn_submit": "File E-Application",
    "form.logging": "Logging Registry...",
    "form.error_name": "Full Legal Name is required to declare on official certificates.",
    "form.error_aadhaar": "Aadhaar Number must hold the full 12 digits mapping.",
    "form.error_otp": "Identity protection rules demand verified Mobile OTP linkage to avoid credential fraud.",

    // 7. DigiLocker Console
    "locker.title": "Your Digital DigiLocker Vault",
    "locker.desc": "Access the cryptographically verifiable representations of your authentic government documents issued via e-Seva online portals.",
    "locker.badge": "Verified e-KYC Linked",
    "locker.secured_count": "Secured Credentials",
    "locker.gov_signed": "Gov Crypt-Signed Verified",
    "locker.empty_title": "No Documents in Locker",
    "locker.empty_desc": "You haven't issued any digital credentials during this session yet! Use our **Indian Citizen Services Center** directory to apply for cards like the **Ayushman Bharat ABHA Health Card** or **e-Shram Identification Card** to get instant approvals and live copies generated on-the-fly here.",
    "locker.card_gov": "GOVERNMENT OF INDIA",
    "locker.issued_date": "Issued:",
    "locker.holder_name": "Holder Name",
    "locker.doc_id": "Document ID No",
    "locker.qr_active": "Secure Gov QR Active",
    "locker.btn_inspect": "inspect Card",
    "locker.btn_pdf": "PDF",
    "locker.modal_header": "Metadata Authentication QR Card",
    "locker.modal_audit": "DigiLocker Audit Hub",
    "locker.encrypted_tag": "ENCRYPTED VAULT FILE",
    "locker.crypt_verified": "CRYPTOGRAPHICALLY VERIFIED",
    "locker.blockchain_sig": "Verifiable On-Ledger Blockchain Signature",
    "locker.sig_hash": "Signature Hash",
    "locker.issued_lbl": "Issued Date",
    "locker.channel_lbl": "Channel Code",
    "locker.legal_warning": "This card representation is signed by our central Digital India E-Seva licensing authority key. It functions as valid credential evidence across domestic transport, bank counter openings, and state registrations.",
    "locker.close_btn": "Close Authentication Deck",

    // 8. CPGRAMS Redressal Central Bureau
    "grievance.status_resolved": "RESOLVED",
    "grievance.status_investigation": "UNDER INVESTIGATION",
    "grievance.status_assigned": "ASSIGNED",
    "grievance.status_lodged": "LODGED",
    "grievance.badge": "CPGRAMS Redressal Central Bureau",
    "grievance.title": "Centralized Public Grievance Desk",
    "grievance.desc": "Lodge grievances regarding delays, overcharges, or operational corruption directly into ministerial dashboards. Enabled with immediate Nodal Legal Officer resolution audits powered by local central registries.",
    "grievance.btn_lodge": "Lodge New Grievance",
    "grievance.modal_title": "Lodge Form: PM-CPG-REFORM",
    "grievance.modal_subtitle": "Central Grievance Record",
    "grievance.target_ministry": "Target Ministry / Authority Department",
    "grievance.affected_lbl": "Affected Specific Service",
    "grievance.occurrence_lbl": "State of Grievance Occurrence",
    "grievance.subject_lbl": "Grievance Central Subject Heading",
    "grievance.subject_placeholder": "Summarize the core grievance issue in 1 sentence",
    "grievance.desc_lbl": "Detailed Grievance Narrative (Exhaustive description)",
    "grievance.desc_placeholder": "Provide chronological details, officer desk names, dates, standard costs violated, and overall impact...",
    "grievance.legal_hint": "Under the Indian Information Technology Act (2000), filing deliberately inaccurate or fabricated charges on official Public Service Portals constitutes a compoundable offense. Verify specifications before lodging.",
    "grievance.btn_submit": "Lodge Complaint",
    "grievance.dispatching": "Dispatching CPGRAMS...",
    "grievance.active_title": "Active Registry",
    "grievance.lodged_count": "Grievances Lodged",
    "grievance.no_grievance": "No Filed Grievances",
    "grievance.no_grievance_desc": "Your record does not list any lodged public complaints. Tap 'Lodge New Grievance' to start a simulated audit review!",
    "grievance.ref_lbl": "Ref No",
    "grievance.filed_lbl": "Filed",
    "grievance.zone_lbl": "Zone",
    "grievance.ministry_lbl": "Ministry",
    "grievance.resolution_title": "Official Administrative Resolution File",
    "grievance.resolution_officer": "Verified Officer: Nodal Secretary, Grievance Cell",
    "grievance.resolution_reply_prefix": "Replied",
    "grievance.pending_msg_title": "Desks Verification Pending",
    "grievance.pending_msg_body": "This case is routed to the designated nodal officer of {department}. The desk is compiling regulatory registers. Resolution logs will refresh here in 1-2 business hours.",

    // 9. Support Chatbot
    "chat.ai_badge": "AI Assistant",
    "chat.sub_title": "Digital India Public Helpdesk Service",
    "chat.safety_hdr": "Digital Safety Caution:",
    "chat.safety_txt": "This AI assistant helps navigate public procedures. Under no circumstances should you type exact passwords, credit balances, or OTP numbers.",
    "chat.welcome_hdr": "Lodge an Inquiry with Suvidha Sahayak",
    "chat.welcome_txt": "Namaste! I am your administrative AI helper. Ask me questions about documents needed, standard timelines, or criteria for any of India’s central welfare initiatives.",
    "chat.suggestions_lbl": "Common Public Inquiries:",
    "chat.input_placeholder": "Write your policy or application query here (e-District, PVC linkers)...",
    "chat.thinking": "Desk checking regulations directory...",

    // 10. Sidebar
    "sidebar.header": "Recent e-Applications",
    "sidebar.sub_header": "Track live approval timeline of submitted credentials",
    "sidebar.empty_title": "No active applications",
    "sidebar.empty_desc": "Click online services column above to initiate demographic updates or health registrations.",
    "sidebar.comments_lbl": "Office Comments",
    "sidebar.initiated": "Initiated",
    "sidebar.sdo_approval": "SDO Signed Approval",
    "sidebar.btn_approve": "Lodge SDO Desk Verification Approval",
    "sidebar.directory_header": "Digital India Directory",
    "sidebar.directory_desc": "For official physical inquiries or emergency assistance, reference parameters below:",
    "sidebar.directory_note": "* Note: Under Digital India program standards, all electronic certifications undergo direct asymmetric key signatures verified dynamically on government nodes.",

    // 11. Footer
    "footer.title": "SewaNadu - Indian Citizen's e-Sewa Directory",
    "footer.rights": "Developed by an Indian for Indians with AI assistance. Not associated with Government of India.",
    "footer.node": "Active Portal Directory",
    "footer.ssl": "Secure Sandbox Connection",
    "footer.charter": "Civic Informational Purpose",

    // 12. Filters, Sorts, and Live Actions
    "filter.status": "Filter Status",
    "filter.all": "All Applications",
    "filter.approved": "Approved",
    "filter.under_verification": "Under Verification",
    "filter.submitted": "Submitted",
    "sort.date": "Sort Date",
    "sort.newest": "Newest First",
    "sort.oldest": "Oldest First",
    "quick.actions": "Quick Actions",
    "quick.track_new": "Track New Application",
    "quick.track_new_desc": "Apply for new citizen schemes",
    "quick.report_grievance": "Report Grievance",
    "quick.report_grievance_desc": "Lodge complaints with ministries",
    "quick.upload_doc": "Upload Document",
    "quick.upload_doc_desc": "Keep files safe in DigiLocker",
    "quick.no_results": "No results matched",
    "quick.no_results_desc": "No applications exist with the selected status.",
    "quick.services_opened": "Services directory opened - select a service to apply",
    "quick.cpgrams_opened": "CPGRAMS Public Grievance Desk opened",
    "quick.locker_opened": "DigiLocker Wallet opened"
  },
  hi: {
    // 1. App Header
    "app.national_portal": "राष्ट्रीय ई-सेवा पोर्टल",
    "app.gateway_title": "राष्ट्रीय ई-सेवा गेटवे",
    "app.digital_india": "| डिजिटल इंडिया",
    "app.logo_subtext": "नागरिक सेवा मार्गदर्शिका",
    "app.search_placeholder": "सेवाएं खोजें (जैसे आधार, पैन, पासपोर्ट)",
    "menu.all_services": "सभी सेवाएं",
    "menu.compare": "तुलना करें",
    "app.zone": "क्षेत्र",
    "app.ref": "यूआईडीएआई संदर्भ",
    
    // 2. Navigation Tabs
    "tab.services": "सत्यापित ई-सेवा आवेदन",
    "tab.eligibility": "पात्रता कैलकुलेटर",
    "tab.doc_wizard": "दस्तावेज विज़ार्ड",
    "tab.lockers": "मेरा डिजीलॉकर वॉलेट",
    "tab.grievances": "सीपीजीआरएएमएस निवारण डेस्क",
    "tab.chatbot": "ई-सेवा सुविधा सहायक",
    "tab.faq": "सहायता एवं प्रश्नोत्तरी",

    // 3. Alerts & Toasts
    "toast.header": "राष्ट्रीय रजिस्ट्री अलर्ट",
    "toast.approved": "प्रशासनिक रूप से स्वीकृत! \"{serviceName}\" के लिए आपका सत्यापन योग्य कार्ड डिजीलॉकर में जारी कर दिया गया है।",
    "toast.approved_override": "प्रशासनिक रूप से स्वीकृत! \"{serviceName}\" के लिए आपका सत्यापन योग्य कार्ड डिजीलॉकर में जारी कर दिया गया है।",
    "toast.override_failed": "प्रशासनिक ओवरराइड स्थिति बदलने में विफल।",
    "toast.network_failed": "हस्ताक्षर ओवरराइड के दौरान नेटवर्क लिंक विफल रहा।",
    "toast.revoked": "डिजिटल दस्तावेज़ को सफलतापूर्वक रद्द कर दिया गया है और डिजीलॉकर से हटा दिया गया है।",
    "toast.revoke_failed": "डिजीलॉकर से दस्तावेज़ हटाने में विफल।",
    "toast.revoke_error": "डिजीलॉकर बैकएंड डेटाबेस से संपर्क करने में त्रुटि।",
    "toast.chatbot_busy": "एआई सेवा अस्थायी रूप से व्यस्त है। इसके बदले नियम इंजन लोड किया गया है।",
    "toast.chatbot_error": "एआई सेवाओं से जुड़ने में त्रुटि।",
    "toast.reset_chat": "बातचीत का इतिहास सफलतापूर्वक रीसेट कर दिया गया।",
    "alert.legal_notice_short": "झूठी या मनगढ़ंत शिकायतें दर्ज करना एक दंडनीय अपराध है।",
    "alert.demo": "पीडीएफ डिजिटल ऑडिट प्रति सफलतापूर्वक डाउनलोड की गई। इसे आपके डिवाइस के 'डाउनलोड' फ़ोल्डर में सहेजा गया है।",

    // 4. Service list view
    "directory.title": "राष्ट्रीय नागरिक सेवा निर्देशिका",
    "directory.desc": "भारतीय सार्वजनिक सेवा चार्टर के तहत मान्य सक्रिय कल्याणकारी सहायता, दस्तावेज़ों को पुनः जारी करने और पहचान डेटाबेस को ब्राउज़ करें।",
    "directory.search_placeholder": "प्रमाण-पत्र, यूआईडीएआई, आय आदि खोजें...",
    "directory.no_match": "कोई परिणाम नहीं मिला",
    "directory.no_match_desc": "हम आपकी शब्दावली से मेल खाती ई-सेवा सेवाएं नहीं ढूंढ सके। अपनी खोज को सुधारें या फिल्टर को रीसेट करें।",
    "directory.mandatory_paperwork": "अनिवार्य प्रमाणपत्रों की आवश्यकता:",
    "directory.govt_fee": "सरकारी शुल्क",
    "directory.free": "मुफ़्त / कोई शुल्क नहीं",
    "directory.apply_online": "ऑनलाइन आवेदन करें",
    "directory.pro_tip_title": "💡 भारतीय नागरिकों के लिए सुझाव:",
    "directory.pro_tip_desc": "आयुष्मान भारत स्वास्थ्य कार्ड (आभा आईडी) और ई-श्रम पंजीकरण यूएएन कार्ड जैसे प्रत्यक्ष एकीकरण आवेदन जमा करते ही तुरंत प्रमाण पत्र उत्पन्न करते हैं। अन्य (जैसे जाति प्रमाण पत्र या पैन पंजीकरण) क्रमिक रूप से संसाधित होते हैं - स्थानीय जिला अधिकारी सत्यापन को सिम्युलेट करने के लिए स्थिति पृष्ठ पर 'एसडीओ डेस्क सत्यापन अनुमोदन' पर क्लिक करें!",

    // 5. Service categories
    "cat.ALL": "सभी योजनाएं / सेवाएं",
    "cat.IDENTITY": "राष्ट्रीय पहचान और पासपोर्ट",
    "cat.FINANCE": "कर और वित्तीय पहचान पत्र",
    "cat.HEALTH": "राष्ट्रीय स्वास्थ्य मिशन",
    "cat.LABOUR": "श्रमिक और रोजगार",
    "cat.LAND": "राज्य राजस्व प्रमाण पत्र",
    "cat.WELFARE": "किसान और कल्याण डीबीटी",

    // 6. Application form
    "form.back": "निर्देशिका पर वापस जाएं",
    "form.regulation": "फॉर्म 5A केंद्रीय विनियमन",
    "form.target_header": "आवेदन का लक्ष्य",
    "form.bureaucracy": "नोडल विभाग:",
    "form.part_a": "भाग क: आवेदक का जनसांख्यिकीय विवरण",
    "form.part_b": "भाग ख: राजस्व श्रेणी आय घोषणा",
    "form.part_c": "भाग ग: बायोमेट्रिक और सुरक्षा ई-केवाईसी सत्यापन",
    "form.name_label": "पूरा कानूनी नागरिक नाम (आधार के अनुसार)",
    "form.name_placeholder": "जैसे: शाहरुख खान",
    "form.name_hint": "कोई भी विसंगति होने पर प्रशासनिक रूप से आवेदन अस्वीकृत कर दिया जाएगा।",
    "form.aadhaar_label": "12-अंकीय यूआईडीएआई आधार आईडी कोड",
    "form.aadhaar_placeholder": "जैसे: 129034803780",
    "form.aadhaar_hint": "आपके रिकॉर्ड पूरी तरह से सुरक्षित हैं।",
    "form.father_label": "पिता या जीवनसाथी का कानूनी नाम",
    "form.father_placeholder": "जैसे: के. खान",
    "form.jurisdiction_label": "निवास क्षेत्र / भारतीय राज्य",
    "form.earnings_label": "वार्षिक पारिवारिक सकल आय",
    "form.earnings_hint": "* अनिवार्य आवश्यकता: ग्राम पटवारी/राजस्व निरीक्षक द्वारा प्रमाणपत्र या वेतन पर्ची।",
    "form.kyc_desc": "प्रशासनिक देरी से बचने के लिए, डिजिटल आधार ओटीपी या वर्चुअल बायोमेट्रिक स्कैनिंग सिमुलेशन का उपयोग करके प्रमाणित करें।",
    "form.method1": "विधि 1: आधार-संबद्ध एसएमएस ओटीपी",
    "form.mobile_placeholder": "10-अंकीय मोबाइल नंबर दर्ज करें",
    "form.btn_send_otp": "ओटीपी भेजें",
    "form.btn_resend_otp": "ओटीपी पुनः भेजें",
    "form.otp_placeholder": "6-अंकीय ओटीपी",
    "form.btn_verify_otp": "सत्यापित करें",
    "form.otp_verified": "आधार मोबाइल लिंकिंग सफलतापूर्वक सत्यापित!",
    "form.method2": "विधि 2: वर्चुअल बायोमेट्रिक (अंगूठा/आंख)",
    "form.method2_desc": "यह तत्काल ई-श्रम श्रमिक पहचान प्रमाणन के लिए उपयुक्त है।",
    "form.btn_scan": "वर्चुअल फिंगरप्रिंट स्कैन शुरू करें",
    "form.scanning": "स्कैनर पर उंगली रखें...",
    "form.scan_verified": "बायोमेट्रिक हस्ताक्षर मेल खाता है!",
    "form.is_instant": "⚡ तत्काल / स्वीकृत जारीकरण",
    "form.is_delay": "⌛ क्षेत्रीय तहसीलदार ऑडिट कतार आवश्यक",
    "form.btn_cancel": "रद्द करें",
    "form.btn_submit": "ई-आवेदन जमा करें",
    "form.logging": "रजिस्ट्री दर्ज की जा रही है...",
    "form.error_name": "आधिकारिक प्रमाण पत्र पर घोषणा करने के लिए पूरा कानूनी नाम आवश्यक है।",
    "form.error_aadhaar": "आधार संख्या में पूरे 12 अंक होने चाहिए।",
    "form.error_otp": "धोखाधड़ी से बचने के लिए सुरक्षा नियमों के तहत सत्यापित मोबाइल ओटीपी लिंक की आवश्यकता होती है।",

    // 7. DigiLocker Console
    "locker.title": "आपका डिजिटल डिजीलॉकर वॉलेट",
    "locker.desc": "ई-सेवा ऑनलाइन पोर्टलों के माध्यम से जारी किए गए अपने प्रामाणिक सरकारी दस्तावेजों की क्रिप्टोग्राफ़िक रूप से सत्यापन योग्य डिजिटल प्रतियों तक पहुँचें।",
    "locker.badge": "सत्यापित ई-केवाईसी संबद्ध",
    "locker.secured_count": "सुरक्षित दस्तावेज",
    "locker.gov_signed": "सरकार द्वारा हस्ताक्षरित एवं सत्यापित",
    "locker.empty_title": "लॉकर में कोई दस्तावेज़ नहीं है",
    "locker.empty_desc": "आपने अभी तक इस सत्र में कोई दस्तावेज़ जारी नहीं किया है! आयुष्मान भारत आभा स्वास्थ्य कार्ड या ई-श्रम पहचान कार्ड जैसी सेवाओं के लिए आवेदन करने हेतु राष्ट्रीय नागरिक सेवा निर्देशिका का उपयोग करें तथा अपने कार्ड तुरंत यहाँ प्राप्त करें।",
    "locker.card_gov": "भारत सरकार",
    "locker.issued_date": "जारी तिथि:",
    "locker.holder_name": "धारक का नाम",
    "locker.doc_id": "दस्तावेज़ आईडी संख्या",
    "locker.qr_active": "सुरक्षित सरकारी क्यूआर सक्रिय",
    "locker.btn_inspect": "कार्ड का निरीक्षण करें",
    "locker.btn_pdf": "पीडीएफ",
    "locker.modal_header": "मेटाडेटा सत्यापन क्यूआर कार्ड",
    "locker.modal_audit": "डिजीलॉकर ऑडिट हब",
    "locker.encrypted_tag": "एन्क्रिप्टेड सुरक्षित फ़ाइल",
    "locker.crypt_verified": "क्रिप्टोग्राफ़िक रूप से सत्यापित",
    "locker.blockchain_sig": "सत्यापन योग्य ऑन-लेजर ब्लॉकचेन हस्ताक्षर",
    "locker.sig_hash": "हस्ताक्षर हैश",
    "locker.issued_lbl": "जारी की गई तिथि",
    "locker.channel_lbl": "चैनल कोड",
    "locker.legal_warning": "यह कार्ड हमारे केंद्रीय डिजिटल इंडिया जनसेवा लाइसेंसिंग प्राधिकरण की कुंजी द्वारा हस्ताक्षरित है। यह देश भर में परिवहन, बैंक खाते खोलने और राज्य पंजीकरणों में पूरी तरह मान्य प्रमाण पत्र के रूप में कार्य करता है।",
    "locker.close_btn": "सत्यापन डेक बंद करें",

    // 8. CPGRAMS Redressal Central Bureau
    "grievance.status_resolved": "समाधानित",
    "grievance.status_investigation": "जांच के अधीन",
    "grievance.status_assigned": "असाइन किया गया",
    "grievance.status_lodged": "पंजीकृत",
    "grievance.badge": "सीपीजीआरएएमएस निवारण केंद्रीय ब्यूरो",
    "grievance.title": "केंद्रीकृत लोक शिकायत डेस्क",
    "grievance.desc": "देरी, अतिरिक्त शुल्क या परिचालन भ्रष्टाचार के संबंध में शिकायतें सीधे मंत्रालयों के डैशबोर्ड में दर्ज करें। स्थानीय केंद्रीय वाहिनी प्रशासन द्वारा समर्थित त्वरित नोडल अधिकारी समाधान ऑडिट की सुविधा।",
    "grievance.btn_lodge": "नई शिकायत दर्ज करें",
    "grievance.modal_title": "शिकायत फॉर्म: PM-CPG-REFORM",
    "grievance.modal_subtitle": "केंद्रीय शिकायत रिकॉर्ड",
    "grievance.target_ministry": "लक्षित मंत्रालय / विभाग",
    "grievance.affected_lbl": "प्रभावित विशिष्ट सेवा",
    "grievance.occurrence_lbl": "शिकायत होने का राज्य/क्षेत्र",
    "grievance.subject_lbl": "शिकायत का मुख्य विषय शीर्षक",
    "grievance.subject_placeholder": "मुख्य शिकायत के मुद्दे को एक वाक्य में संक्षिप्त करें",
    "grievance.desc_lbl": "विस्तृत शिकायत विवरण (विस्तृत विवरण दें)",
    "grievance.desc_placeholder": "तिथि, शामिल अधिकारियों के नाम, उल्लंघन किए गए शुल्क मानकों और समग्र प्रभाव का कालानुक्रमिक विवरण प्रदान करें...",
    "grievance.legal_hint": "भारतीय सूचना प्रौद्योगिकी अधिनियम (2000) के तहत, आधिकारिक सार्वजनिक सेवा पोर्टलों पर जानबूझकर गलत या मनगढ़ंत शिकायत दर्ज करना एक दंडनीय अपराध है। दर्ज करने से पहले विवरण सत्यापित करें।",
    "grievance.btn_submit": "शिकायत पंजीकृत करें",
    "grievance.dispatching": "सीपीजीआरएएमएस पर प्रेषित की जा रही है...",
    "grievance.active_title": "सक्रिय रजिस्ट्री",
    "grievance.lodged_count": "शिकायतें दर्ज",
    "grievance.no_grievance": "कोई दर्ज शिकायत नहीं है",
    "grievance.no_grievance_desc": "आपके रिकॉर्ड में दर्ज सार्वजनिक शिकायतों की कोई सूची नहीं है। कतार की समीक्षा शुरू करने के लिए 'नई शिकायत दर्ज करें' पर क्लिक करें!",
    "grievance.ref_lbl": "संदर्भ संख्या",
    "grievance.filed_lbl": "पंजीकरण",
    "grievance.zone_lbl": "क्षेत्र",
    "grievance.ministry_lbl": "मंत्रालय",
    "grievance.resolution_title": "आधिकारिक प्रशासनिक समाधान रिपोर्ट",
    "grievance.resolution_officer": "सत्यापित अधिकारी: नोडल सचिव, शिकायत प्रकोष्ठ",
    "grievance.resolution_reply_prefix": "प्रतिक्रिया तिथि",
    "grievance.pending_msg_title": "डेस्क सत्यापन लंबित",
    "grievance.pending_msg_body": "यह मामला {department} के नामित नोडल अधिकारी को भेज दिया गया है। कार्यालय स्तर पर रिकॉर्ड संकलित किए जा रहे हैं। समाधान लॉग अगले 1-2 घंटों में यहाँ उपलब्ध हो जाएगा।",

    // 9. Support Chatbot
    "chat.ai_badge": "एआई सहायक",
    "chat.sub_title": "डिजिटल इंडिया सार्वजनिक सहायता सेवा",
    "chat.safety_hdr": "डिजिटल सुरक्षा चेतावनी:",
    "chat.safety_txt": "यह एआई सहायक आपको सार्वजनिक प्रक्रियाओं को समझने में मदद करता है। किसी भी परिस्थिति में पासवर्ड, बैंक बैलेंस या अपना निजी ओटीपी नंबर यहाँ टाइप न करें।",
    "chat.welcome_hdr": "सुविधा सहायक से संपर्क करें",
    "chat.welcome_txt": "नमस्ते! मैं आपका प्रशासनिक एआई सहायक हूँ। भारत की कल्याणकारी योजनाओं के लिए आवश्यक दस्तावेजों, समय-सीमाओं अथवा मानदंडों के बारे में मुझसे कोई भी प्रश्न पूछें।",
    "chat.suggestions_lbl": "सामान्य नागरिक प्रश्न:",
    "chat.input_placeholder": "अपनी नीति या आवेदन संबंधी प्रश्न यहाँ लिखें (ई-डिस्ट्रिक्ट, पीवीसी प्रमाण पत्र)...",
    "chat.thinking": "कार्यालय नियमों की निर्देशिकाओं की जांच की जा रही है...",

    // 10. Sidebar
    "sidebar.header": "हालिया ई-आवेदन",
    "sidebar.sub_header": "जमा किए गए प्रमाण-पत्रों की लाइव अनुमोदन समयरेखा ट्रैक करें",
    "sidebar.empty_title": "कोई सक्रिय आवेदन नहीं है",
    "sidebar.empty_desc": "डेमोग्राफिक अपडेट या स्वास्थ्य पंजीकरण शुरू करने के लिए ऊपर सेवा सूची से ऑनलाइन आवेदन करें।",
    "sidebar.comments_lbl": "कार्यालय की टिप्पणी",
    "sidebar.initiated": "प्रारंभ",
    "sidebar.sdo_approval": "एसडीओ हस्ताक्षरित स्वीकृति",
    "sidebar.btn_approve": "एसडीओ डेस्क सत्यापन अनुमोदन दर्ज करें",
    "sidebar.directory_header": "डिजिटल इंडिया निर्देशिका",
    "sidebar.directory_desc": "आधिकारिक पूछताछ या आपातकालीन सहायता के लिए नीचे दिए गए सेवा संपर्क और हॉटलाइनों का संदर्भ लें:",
    "sidebar.directory_note": "* नोट: डिजिटल इंडिया कार्यक्रम के मानकों के तहत, सभी इलेक्ट्रॉनिक प्रमाणपत्रों को सरकारी नोड्स पर गतिशील रूप से सत्यापित डिजिटल हस्ताक्षरों द्वारा प्रमाणित किया जाता है।",

    // 11. Footer
    "footer.title": "SewaNadu - भारतीय नागरिक ई-सेवा गाइड",
    "footer.rights": "एक भारतीय द्वारा भारतीयों के लिए एआई (AI) की सहायता से विकसित। भारत सरकार से संबद्ध नहीं।",
    "footer.node": "प्रचालन पोर्टल डायरेक्टरी",
    "footer.ssl": "सुरक्षित सैंडबॉक्स नेटवर्क",
    "footer.charter": "नागरिक सूचनात्मक उद्देश्य",

    // 12. Filters, Sorts, and Live Actions
    "filter.status": "स्थिति फ़िल्टर",
    "filter.all": "सभी आवेदन",
    "filter.approved": "स्वीकृत",
    "filter.under_verification": "सत्यापन प्रक्रिया",
    "filter.submitted": "जमा किया गया",
    "sort.date": "क्रमबद्ध करें",
    "sort.newest": "नवीनतम",
    "sort.oldest": "सबसे पुराना",
    "quick.actions": "त्वरित कार्रवाई",
    "quick.track_new": "नया आवेदन शुरू करें",
    "quick.track_new_desc": "नई ई-सेवा नागरिक योजना",
    "quick.report_grievance": "शिकायत दर्ज करें (CPGRAMS)",
    "quick.report_grievance_desc": "मंत्रालयों में समस्या दर्ज करें",
    "quick.upload_doc": "दस्तावेज अपलोड करें",
    "quick.upload_doc_desc": "डिजीलॉकर सुरक्षा भंडार",
    "quick.no_results": "कोई परिणाम नहीं मिला",
    "quick.no_results_desc": "चयनित स्थिति में कोई आवेदन मौजूद नहीं है।",
    "quick.services_opened": "ई-सेवा निर्देशिका खुली - आवेदन करने के लिए एक सेवा चुनें",
    "quick.cpgrams_opened": "सीपीजीआरएएमएस शिकायत डेस्क खुला",
    "quick.locker_opened": "डिजीलॉकर वॉलेट खुला"
  },
  ta: {
    "app.national_portal": "தேசிய மின்-சேவைகள் போர்டல்",
    "app.gateway_title": "தேசிய ஈ-சேவை நுழைவாயில்",
    "app.digital_india": "| டிஜிட்டல் இந்தியா",
    "app.logo_subtext": "தேசிய நுழைவாயில்",
    "app.search_placeholder": "சேவைகளைத் தேடுங்கள் (எ.கா. ஆதார், பான், பாஸ்போர்ட்)",
    "tab.services": "மின்-சேவை விண்ணப்பங்கள்",
    "tab.eligibility": "தகுதி சரிபார்ப்பு",
    "tab.doc_wizard": "ஆவண வழிகாட்டி",
    "tab.lockers": "டிஜிலாக்கர் வாலட்",
    "tab.grievances": "முறைப்பாட்டு தீர்வு",
    "tab.chatbot": "சுவிதா உதவிப்பாளர்",
    "menu.all_services": "அனைத்து சேவைகள்",
    "menu.compare": "ஒப்பீடு",
    "menu.locker": "லாக்கர்",
    "menu.complaints": "புகார்கள்",
    "footer.title": "இந்தியாவின் தேசிய ஈ-சேவை நுழைவாயில்",
    "footer.rights": "© 2026 மின்னணு மற்றும் தகவல் தொழில்நுட்ப அமைச்சகம். அனைத்து உரிமைகளும் பாதுகாக்கப்பட்டவை."
  },
  te: {
    "app.national_portal": "జాతీయ ఇ-సేవల పోర్టల్",
    "app.gateway_title": "రాష్ట్రీయ ఇ-సేవ గేట్‌వే",
    "app.digital_india": "| డిజిటల్ ఇండియా",
    "app.logo_subtext": "జాతీయ గేట్‌వే",
    "app.search_placeholder": "సేవలను శోధించండి (ఉదా. ఆధార్, పాన్, పాస్‌పోర్ట్)",
    "tab.services": "ఇ-సేవ అప్లికేషన్లు",
    "tab.eligibility": "అర్హత తనిఖీ",
    "tab.doc_wizard": "డాక్యుమెంట్ విజార్డ్",
    "tab.lockers": "డిజిలాకర్ వాలెట్",
    "tab.grievances": "ఫిర్యాదుల పరిష్కారం",
    "tab.chatbot": "సువిధా సహాయకుడు",
    "menu.all_services": "అన్ని సేవలు",
    "menu.compare": "సరిపోల్చండి",
    "menu.locker": "లాకర్",
    "menu.complaints": "ఫిర్యాదులు",
    "footer.title": "భారత జాతీయ ఇ-సేవ గేట్‌വേ",
    "footer.rights": "© 2026 ఎలక్ట్రానిక్స్ మరియు సమాచార సాంకేతిక మంత్రిత్వ శాఖ. అన్ని హಕ್ಕುలూ ప్రత్యేకించుకోవడమైనది."
  },
  bn: {
    "app.national_portal": "জাতীয় ই-পরিষেবা পোর্টাল",
    "app.gateway_title": "রাষ্ট্রীয় ই-সেবা গেটওয়ে",
    "app.digital_india": "| ডিজিটাল ইন্ডিয়া",
    "app.logo_subtext": "জাতীয় গেটওয়ে",
    "app.search_placeholder": "পরিষেবা খুঁজুন (যেমন আধার, প্যান, পাসপোর্ট)",
    "tab.services": "অনলাইন ই-সেবা আবেদন",
    "tab.eligibility": "যোগ্যতা যাচাইকারী",
    "tab.doc_wizard": "ডকুমেন্ট উইজার্ড",
    "tab.lockers": "ডিজিলকার ওয়ালেট",
    "tab.grievances": "গ্রিভান্স রিড্রেসাল ডেস্ক",
    "tab.chatbot": "সুবিধা সহায়ক",
    "menu.all_services": "সমস্ত পরিষেবা",
    "menu.compare": "তুলনা করুন",
    "menu.locker": "লকার",
    "menu.complaints": "অভিযোগ",
    "footer.title": "ভারতের জাতীয় ই-সেবা গেটওয়ে",
    "footer.rights": "© 2026 ইলেকট্রনিক্স এবং তথ্য প্রযুক্তি মন্ত্রক, ভারত সরকার।"
  },
  mr: {
    "app.national_portal": "राष्ट्रीय ई-सेवा पोर्टल",
    "app.gateway_title": "राष्ट्रीय ई-सेवा प्रवेशद्वार",
    "app.digital_india": "| डिजिटल इंडिया",
    "app.logo_subtext": "राष्ट्रीय गेटवे",
    "app.search_placeholder": "सेवा शोधा (उदा. आधार, पॅन, पासपोर्ट)",
    "tab.services": "ई-सेवा अर्ज प्रणाली",
    "tab.eligibility": "पात्रता तपासणी",
    "tab.doc_wizard": "दस्तऐवज विझार्ड",
    "tab.lockers": "माझे डिजिलॉकर वॉलेट",
    "tab.grievances": "तक्रार निवारण कक्ष",
    "tab.chatbot": "ई-सेवा सुविधा सहाय्यक",
    "menu.all_services": "सर्व सेवा",
    "menu.compare": "तुलना करा",
    "menu.locker": "लॉकर",
    "menu.complaints": "तक्रारी",
    "footer.title": "भारताचे राष्ट्रीय ई-सेवा प्रवेशद्वार",
    "footer.rights": "© 2026 इलेक्ट्रॉनिक्स आणि माहिती तंत्रज्ञान मंत्रालय, भारत सरकार."
  },
  gu: {
    "app.national_portal": "રાષ્ટ્રીય ઈ-સેવા પોર્ટલ",
    "app.gateway_title": "રાષ્ટ્રીય ઈ-સેવા ગેટવે",
    "app.digital_india": "| ડિજิตલ ઇન્ડિયા",
    "app.logo_subtext": "રાષ્ટ્રીય ગેટવે",
    "app.search_placeholder": "સેવા શોધો (જેમ કે આધાર, પાન, પાસપોર્ટ)",
    "tab.services": "ઓનલાઇન ઈ-સેવાઓ",
    "tab.eligibility": "પાત્રતા કેલ્ક્યુલેટર",
    "tab.doc_wizard": "દસ્તાવેજ વિઝાર્ડ",
    "tab.lockers": "માય ડિજીલોકર વોલેટ",
    "tab.grievances": "ફરિયાદ નિવારણ ડેસ્ક",
    "tab.chatbot": "ઈ-સેવા સુવિધા સહાયક",
    "menu.all_services": "તમામ સેવાઓ",
    "menu.compare": "સરખામણી",
    "menu.locker": "લોકર",
    "menu.complaints": "ફરિયાદો",
    "footer.title": "ભારતનું રાષ્ટ્રીય ઈ-સેવા ગેટવે",
    "footer.rights": "© 2026 ઇલેક્ટ્રોનિક્સ અને આઇટી મંત્રાલય, ભારત સરકાર."
  },
  kn: {
    "app.national_portal": "ರಾಷ್ಟ್ರೀಯ ಇ-ಸೇವೆಗಳ ಪೋರ್ಟಲ್",
    "app.gateway_title": "ರಾಷ್ಟ್ರೀಯ ಇ-ಸೇವಾ ದ್ವಾರ",
    "app.digital_india": "| ಡಿಜಿಟಲ್ ಇಂಡಿಯಾ",
    "app.logo_subtext": "ರಾಷ್ಟ್ರೀಯ ಗೇಟ್‌ವೇ",
    "app.search_placeholder": "ಸೇವೆಯನ್ನು ಹುಡುಕಿ (ಉದಾ. ಆಧಾರ್, ಪಾನ್, ಪಾಸ್‌ಪೋರ್ಟ್)",
    "tab.services": "ಇ-ಸೇವಾ ಅರ್ಜಿಗಳು",
    "tab.eligibility": "ಅರ್ಹತಾ ಪರಿಶೀಲಕ",
    "tab.doc_wizard": "ದಾಖಲೆ ವಿಝಾರ್ಡ್",
    "tab.lockers": "ಡಿಜಿಲಾಕರ್ ವಾಲೆಟ್",
    "tab.grievances": "ಕುಂದು ಕೊರತೆ ನಿವಾರಣೆ",
    "tab.chatbot": "ಸುವಿಧಾ ಸಹಾಯಕ",
    "menu.all_services": "ಎಲ್ಲಾ ಸೇವೆಗಳು",
    "menu.compare": "ಹೋಲಿಸಿ",
    "menu.locker": "ಲಾಕರ್",
    "menu.complaints": "ದೂರುಗಳು",
    "footer.title": "ಭಾರತದ ರಾಷ್ಟ್ರೀಯ ಇ-ಸೇವಾ ದ್ವಾರ",
    "footer.rights": "© 2026 ಎಲೆಕ್ಟ್ರಾನಿಕ್ಸ್ ಮತ್ತು ಮಾಹಿತಿ ತಂತ್ರಜ್ಞಾನ ಸಚಿವಾಲಯ."
  },
  ml: {
    "app.national_portal": "ദേശീയ ഇ-സേവന പോർട്ടൽ",
    "app.gateway_title": "ദേശീയ ഇ-സേവ ഗേറ്റ്‌വേ",
    "app.digital_india": "| ഡിജിറ്റൽ ഇന്ത്യ",
    "app.logo_subtext": "ദേശീയ ഗേറ്റ്‌വേ",
    "app.search_placeholder": "സേവനങ്ങൾ തിരയുക (ഉദാ: ആധാർ, പാൻ, പാസ്‌പോർട്ട്)",
    "tab.services": "ഇ-സേവ അപേക്ഷകൾ",
    "tab.eligibility": "അർഹത പരിശോധന",
    "tab.doc_wizard": "ഡോക്യുമെന്റ് വിസാർഡ്",
    "tab.lockers": "ഡിജിലോക്കർ വാലറ്റ്",
    "tab.grievances": "പരാതി പരിഹാര ഡെസ്ക്",
    "tab.chatbot": "സുവീധ സഹായകൻ",
    "menu.all_services": "എല്ലാ സേവനങ്ങളും",
    "menu.compare": "താരതമ്യം",
    "menu.locker": "ലോക്കർ",
    "menu.complaints": "പരാതികൾ",
    "footer.title": "ഭാരതത്തിന്റെ ദേശീയ ഇ-സേവ ഗേറ്റ്‌വേ",
    "footer.rights": "© 2026 ഇലക്ട്രോണിക്സ് ആൻഡ് ഇൻഫർമേഷൻ ടെക്നോളജി മന്ത്രാലയം."
  },
  pa: {
    "app.national_portal": "ਰਾਸ਼ਟਰੀ ਈ-ਸੇਵਾਵਾਂ ਪੋਰਟਲ",
    "app.gateway_title": "ਰਾਸ਼ਟਰੀ ਈ-ਸੇਵਾ ਗੇਟਵੇ",
    "app.digital_india": "| ਡਿਜੀਟਲ ਇੰਡੀਆ",
    "app.logo_subtext": "ਰਾਸ਼ਟਰੀ ਗੇਟਵੇ",
    "app.search_placeholder": "ਸੇਵਾ ਦੀ ਖੋਜ ਕਰੋ (ਜਿਵੇਂ ਕਿ ਆਧਾਰ, ਪੈਨ, ਪਾਸਪੋਰਟ)",
    "tab.services": "ਈ-ਸੇਵਾ ਅਰਜ਼ੀਆਂ",
    "tab.eligibility": "ਪਾਤਰਤਾ ਕੈਲਕੁਲੇਟਰ",
    "tab.doc_wizard": "ਦਸਤਾਵੇਜ਼ ਵਿਜ਼ਾਰਡ",
    "tab.lockers": "ਮੇਰਾ ਡਿਜੀਲਾਕਰ ਵਾਲਿਟ",
    "tab.grievances": "ਸ਼ਿਕਾਇਤ ਨਿਵਾਰਣ ਡੈਸਕ",
    "tab.chatbot": "ਸੁਵਿਧਾ ਸਹਾਇਕ",
    "menu.all_services": "ਸਾਰੀਆਂ ਸੇਵਾਵਾਂ",
    "menu.compare": "ਤੁਲਨਾ ਕਰੋ",
    "menu.locker": "ਲਾਕਰ",
    "menu.complaints": "ਸ਼ਿਕਾਇਤਾਂ",
    "footer.title": "ਭਾਰਤ ਦਾ ਰਾਸ਼ਟਰੀ ਈ-ਸੇਵਾ ਗੇਟਵੇ",
    "footer.rights": "© 2026 ਇਲੈਕਟ੍ਰਾਨਿਕസ് ਅਤੇ ਆਈ ਟੀ ਮੰਤਰਾਲਾ, ਭਾਰਤ ਸਰਕਾਰ।"
  },
  or: {
    "app.national_portal": "ଜାତୀୟ ଇ-ସେବା ପୋର୍ଟାଲ",
    "app.gateway_title": "ଜାତୀୟ ଇ-ସେବା ଗେଟୱେ",
    "app.digital_india": "| ଡିଜିଟାଲ୍ ଇଣ୍ଡିଆ",
    "app.logo_subtext": "ଜାତୀୟ ଗେଟୱେ",
    "app.search_placeholder": "ସେବା ଖୋଜନ୍ତୁ (ଯେପରିକି ଆଧାର, ପ୍ୟାନ, ପାସପୋର୍ଟ)",
    "tab.services": "ଇ-ସେବା ଆବେਦନ",
    "tab.eligibility": "ଯୋଗ୍ୟତା ଯାଞ୍ଚକାରୀ",
    "tab.doc_wizard": "ଦସ୍ତାବେଜ ୱିଜାର୍ଡ",
    "tab.lockers": "ଡିଜିଲକର ୱାଲେଟ",
    "tab.grievances": "ଅଭିଯୋગ ନિବାରଣ ଡେସ୍କ",
    "tab.chatbot": "ସୁବିଧା ସହାୟਕ",
    "menu.all_services": "ସମସ୍ତ ସେବା",
    "menu.compare": "ତୁଳନା କରନ୍ତು",
    "menu.locker": "ଲକର",
    "menu.complaints": "ଅଭିଯୋଗ",
    "footer.title": "ଭାରତର ଜାତୀୟ ଇ-ସେବା ଗେଟୱେ",
    "footer.rights": "© 2026 ଇଲେକ୍տ୍ରୋନିକ୍ସ ଏବଂ ଆଇଟି ମନ୍ତ୍ରଣାଳୟ, ଭାରତ ସରକାର।"
  }
};

export const serviceTranslations: Record<string, Partial<Record<Language, { title: string; department: string; description: string; documentsRequired: string[]; processingTime: string }>>> = {
  "uidai-aadhaar": {
    en: {
      title: "Aadhaar Demographic Update & Address Change",
      department: "Unique Identification Authority of India (UIDAI)",
      description: "Update critical details like Permanent Home Address, legal spelling, and primary mobile linking to keep your 12-digit Aadhaar card up to date.",
      documentsRequired: ["Proof of Address (electricity bill, passport)", "Birth Certificate or Matriculation sheet", "Signed Self-Declaration Letter"],
      processingTime: "5 - 7 Working Days"
    },
    hi: {
      title: "आधार जनसांख्यिकीय अपडेट और पता परिवर्तन",
      department: "भारतीय विशिष्ट पहचान प्राधिकरण (यूआईडीएआई)",
      description: "अपने 12-अंकीय आधार कार्ड को अपडेट रखने के लिए स्थायी घर का पता, नाम की कानूनी वर्तनी और प्राथमिक मोबाइल लिंकिंग जैसे महत्वपूर्ण विवरण अपडेट करें।",
      documentsRequired: ["पते का प्रमाण (बिजली बिल, पासपोर्ट)", "जन्म प्रमाण पत्र या मैट्रिकुलेशन प्रमाण पत्र", "हस्ताक्षरित स्व-घोषणा पत्र"],
      processingTime: "5 - 7 कार्य दिवस"
    }
  },
  "nsdl-pan": {
    en: {
      title: "Permanent Account Number (PAN Card) Fresh Registration",
      department: "Income Tax Department, Govt of India / NSDL",
      description: "Issuance of permanent 10-character alphanumeric ID mandated for Indian financial transactions, bank accounts, and IT filings.",
      documentsRequired: ["Aadhaar Card copy", "Two passport size color photos", "Proof of age certificate"],
      processingTime: "2 - 3 Working Days"
    },
    hi: {
      title: "स्थायी खाता संख्या (पैन कार्ड) नया पंजीकरण",
      department: "आयकर विभाग, भारत सरकार / एनएसडीएल",
      description: "वित्तीय लेनदेन, बैंक खाते व आयकर रिटर्न भरने के लिए भारत सरकार द्वारा अनिवार्य 10-अक्षर के अल्फ़ान्यूमेरिक स्थायी पहचान पत्र (पैन) का जारीकरण।",
      documentsRequired: ["आधार कार्ड की प्रति", "दो पासपोर्ट आकार के रंगीन फोटो", "आयु प्रमाण पत्र"],
      processingTime: "2 - 3 कार्य दिवस"
    }
  },
  "mohfw-abha": {
    en: {
      title: "Ayushman Bharat Health Account Card registration",
      department: "National Health Authority (NHA) / MoHFW",
      description: "Create your unique 14-digit ABHA ID under Pradhan Mantri Jan Arogya Yojana to digitally compile clinical laboratory files, clinical summaries, and treatments.",
      documentsRequired: ["Aadhaar Card with linked active SIM number", "Mobile number for e-KYC Verification"],
      processingTime: "Instant / Real-time issuance"
    },
    hi: {
      title: "आयुष्मान भारत स्वास्थ्य खाता (आभा) कार्ड पंजीकरण",
      department: "राष्ट्रीय स्वास्थ्य प्राधिकरण (एनएचए) / स्वास्थ्य मंत्रालय",
      description: "प्रधानमंत्री जन आरोग्य योजना के तहत अपनी विशिष्ट 14-अंकीय आभा आईडी बनाएं ताकि लैब रिपोटों, चिकित्सा पर्चियों और उपचार इतिहास को सुरक्षित रूप से डिजिटल रूप से संकलित किया जा सके।",
      documentsRequired: ["लिंक्ड सक्रिय मोबाइल नंबर के साथ आधार कार्ड", "ई-केवाईसी सत्यापन के लिए सक्रिय मोबाइल नंबर"],
      processingTime: "तत्काल / वास्तविक समय जारीकरण"
    }
  },
  "mole-eshram": {
    en: {
      title: "e-Shram National Unorganized Workers Enrollment",
      department: "Ministry of Labour & Employment, India",
      description: "Centralized database mapping of construction workers, street vendors, and agrarian labourers to distribute financial aid, direct subsidies, and accidental cover.",
      documentsRequired: ["Bank Account Details (IFSC Code)", "Primary Mobile ID number", "Aadhaar Card"],
      processingTime: "Instant / Real-time card"
    },
    hi: {
      title: "ई-श्रम राष्ट्रीय असंगठित श्रमिक नामांकन",
      department: "श्रम और रोजगार मंत्रालय, भारत सरकार",
      description: "निर्माण श्रमिकों, रेहड़ी-पटरी वालों और कृषि श्रमिकों का राष्ट्रीय डेटाबेस संकलन ताकि सीधे वित्तीय लाभ, अनुदान और ₹2 लाख तक का आकस्मिक मृत्यु बीमा कवर प्रदान किया जा सके।",
      documentsRequired: ["बैंक खाते का विवरण (आईएफएससी कोड)", "प्राथमिक मोबाइल नंबर", "आधार कार्ड"],
      processingTime: "तत्काल / वास्तविक समय कार्ड"
    }
  },
  "revenue-income": {
    en: {
      title: "e-Pramaan Revenue Caste & Income Certificate",
      department: "State Directorate of Revenue Authorities & District Administration",
      description: "Certified legal validation of family income brackets and category categories, necessary for state scholarships, quotas, and economic subventions.",
      documentsRequired: ["Ration Card copy", "Proof of yearly family income (Form-16 or salary slips)", "Affidavit by village Patwari/Revenue Inspector"],
      processingTime: "10 - 15 Working Days (Via state e-District console)"
    },
    hi: {
      title: "ई-प्रमाण राजस्व जाति और आय प्रमाण पत्र",
      department: "राज्य राजस्व प्राधिकरण निदेशालय और जिला प्रशासन",
      description: "पारिवारिक वार्षिक आय स्तर और सामाजिक श्रेणी का विधिवत कानूनी सत्यापन, जो राज्य छात्रवृत्ति, कोटा और पिछड़े वर्ग के लिए आर्थिक सहायता में आवश्यक है।",
      documentsRequired: ["राशन कार्ड की प्रति", "वार्षिक पारिवारिक आय का प्रमाण (फॉर्म-16 या वेतन पर्ची)", "ग्राम पटवारी/राजस्व निरीक्षक द्वारा शपथ पत्र"],
      processingTime: "10 - 15 कार्य दिवस (राज्य ई-डिस्ट्रिक्ट कंसोल के माध्यम से)"
    }
  },
  "mea-passport": {
    en: {
      title: "Appointment & Fresh Passport Seva Filing",
      department: "Consular, Passport & Visa Division, Ministry of External Affairs",
      description: "Register and book immediate appointment desk slots at the nearest PSK (Passport Seva Kendra) for verification of foreign travel cards.",
      documentsRequired: ["Proof of Birth", "Secondary School Certificate", "Address Proof of active flat/room"],
      processingTime: "15-20 Days (Subject to local Police verification)"
    },
    hi: {
      title: "नवीन पासपोर्ट अपॉइंटमेंट और पासपोर्ट सेवा फाइलिंग",
      department: "विदेश मंत्रालय, कांसुलर, पासपोर्ट और वीजा प्रभाग",
      description: "अंतरराष्ट्रीय यात्रा प्रमाण-पत्रों के भौतिक सत्यापन हेतु अपने निकटतम पीएसके (पासपोर्ट सेवा केंद्र) पर तत्काल नियुक्ति समय बुक करें।",
      documentsRequired: ["जन्म तिथि का प्रमाण", "माध्यमिक शिक्षा बोर्ड प्रमाणपत्र (मार्कशीट)", "सक्रिय फ्लैट/निवास प्रमाण पत्र"],
      processingTime: "15-20 दिन (स्थानीय पुलिस और खुफिया विभाग सत्यापन के अधीन)"
    }
  },
  "agriculture-pmkisan": {
    en: {
      title: "PM Kisan Samman Nidhi Yojana Enlistment Assistance",
      department: "Department of Agriculture & Farmers Welfare",
      description: "Direct benefit transfer (DBT) dispatch enrollment providing ₹6,000 yearly to marginal and small cultivator families under direct Aadhaar-linked bank accounts.",
      documentsRequired: ["Land Records Document / Patta Registry Certificate", "Active Bank Passbook", "Aadhaar card details"],
      processingTime: "15 Days (Sub-divisional magistrate review)"
    },
    hi: {
      title: "प्रधानमंत्री किसान सम्मान निधि योजना नामांकन सहायता",
      department: "कृषि और किसान कल्याण विभाग",
      description: "प्रत्यक्ष लाभ हस्तांतरण (डीबीटी) प्रेषण नामांकन, जिसके तहत पात्र छोटे एवं सीमांत कृषक परिवारों को सीधे बैंक खाते में ₹6,000 की वार्षिक सहायता राशि दी जाती है।",
      documentsRequired: ["भूमि रिकॉर्ड दस्तावेज / पट्टा रजिस्ट्री प्रमाणपत्र", "सक्रिय बैंक पासबुक", "आधार कार्ड विवरण"],
      processingTime: "15 दिन (उपमंडल मजिस्ट्रेट की समीक्षा के अधीन)"
    }
  }
};

export const valueTranslations: Record<string, Partial<Record<Language, string>>> = {
  // Service affected / Department fallback maps
  "Unique Identification Authority of India (UIDAI)": {
    en: "Unique Identification Authority of India (UIDAI)",
    hi: "भारतीय विशिष्ट पहचान प्राधिकरण (यूआईडीएआई)"
  },
  "Ministry of Road Transport & Highways": {
    en: "Ministry of Road Transport & Highways",
    hi: "सड़क परिवहन और राजमार्ग मंत्रालय"
  },
  "Ministry of Finance (Banking Division / Income Tax)": {
    en: "Ministry of Finance (Banking Division / Income Tax)",
    hi: "वित्त मंत्रालय (बैंकिंग प्रभाग / आयकर विभाग)"
  },
  "National Health Authority (Ayushman Bharat Systems)": {
    en: "National Health Authority (Ayushman Bharat Systems)",
    hi: "राष्ट्रीय स्वास्थ्य प्राधिकरण (आयुष्मान भारत प्रणाली)"
  },
  "Ministry of Labour & Employment": {
    en: "Ministry of Labour & Employment",
    hi: "श्रम और रोजगार मंत्रालय"
  },
  "Department of Agriculture & Farmers Welfare": {
    en: "Department of Agriculture & Farmers Welfare",
    hi: "कृषि और किसान कल्याण विभाग"
  },
  "Ministry of Electronics & Information Technology": {
    en: "Ministry of Electronics & Information Technology",
    hi: "इलेक्ट्रॉनिक्स और सूचना प्रौद्योगिकी मंत्रालय"
  },
  "Ministry of Electronics & IT": {
    en: "Ministry of Electronics & IT",
    hi: "इलेक्ट्रॉनिक्स और आईटी मंत्रालय"
  },
  "Consular, Passport & Visa Division, Ministry of External Affairs": {
    en: "Consular, Passport & Visa Division, Ministry of External Affairs",
    hi: "विदेश मंत्रालय, कांसुलर, पासपोर्ट और वीजा प्रभाग"
  },
  "State Directorate of Revenue Authorities & District Administration": {
    en: "State Directorate of Revenue Authorities & District Administration",
    hi: "राज्य राजस्व प्राधिकरण निदेशालय और जिला प्रशासन"
  },
  "Revenue Department & Administration": {
    en: "Revenue Department & Administration",
    hi: "राजस्व विभाग एवं प्रशासन"
  },
  "National Health Authority (NHA)": {
    en: "National Health Authority (NHA)",
    hi: "राष्ट्रीय स्वास्थ्य प्राधिकरण (एनएचए)"
  },
  "Unique Identification Authority of India": {
    en: "Unique Identification Authority of India",
    hi: "भारतीय विशिष्ट पहचान प्राधिकरण"
  },
  "Income Tax Department, Govt of India": {
    en: "Income Tax Department, Govt of India",
    hi: "आयकर विभाग, भारत सरकार"
  },
  "Ministry of Labour & Employment, India": {
    en: "Ministry of Labour & Employment, India",
    hi: "श्रम और रोजगार मंत्रालय, भारत सरकार"
  },

  // State maps
  "Karnataka": { en: "Karnataka", hi: "कर्नाटक" },
  "Delhi": { en: "Delhi", hi: "दिल्ली" },
  "Maharashtra": { en: "Maharashtra", hi: "महाराष्ट्र" },
  "Uttar Pradesh": { en: "Uttar Pradesh", hi: "उत्तर प्रदेश" },
  "Tamil Nadu": { en: "Tamil Nadu", hi: "तमिलनाडु" },
  "Rajasthan": { en: "Rajasthan", hi: "राजस्थान" },

  // Status values
  "SUBMITTED": { en: "SUBMITTED", hi: "जमा किया गया" },
  "UNDER_VERIFICATION": { en: "UNDER VERIFICATION", hi: "सत्यापन प्रक्रिया में" },
  "APPROVED": { en: "APPROVED", hi: "स्वीकृत" },
  "REJECTED": { en: "REJECTED", hi: "अस्वीकृत" },
  "LODGED": { en: "LODGED", hi: "पंजीकृत" },
  "ASSIGNED": { en: "ASSIGNED", hi: "असाइन किया गया" },
  "UNDER_INVESTIGATION": { en: "UNDER INVESTIGATION", hi: "जांच जारी है" },
  "RESOLVED": { en: "RESOLVED", hi: "समाधानित" },

  // Document names
  "AADHAAR": { en: "Aadhaar Card", hi: "आधार कार्ड" },
  "PAN": { en: "PAN Card", hi: "पैन कार्ड" },
  "ABHA_HEALTH": { en: "ABHA Health Account ID", hi: "आभा स्वास्थ्य खाता आईडी" },
  "INCOME_CERT": { en: "Income e-Pramaan Cert", hi: "आय ई-प्रमाण पत्र" },
  "E_SHRAM": { en: "e-Shram Worker UAN", hi: "ई-श्रम श्रमिक यूएएन" },

  // Static comments
  "Verified against State Revenue ledger by Tehsildar Indiranagar on 2026-06-12.": {
    en: "Verified against State Revenue ledger by Tehsildar Indiranagar on 2026-06-12.",
    hi: "इन्दिरानगर तहसीलदार द्वारा दिनांक 12-06-2026 को राज्य राजस्व खाता बही से सत्यापित।"
  },
  "In process. Police Verification clearance and regional UIDAI nodal approval pending.": {
    en: "In process. Police Verification clearance and regional UIDAI nodal approval pending.",
    hi: "प्रक्रिया जारी है। स्थानीय पुलिस और यूआईडीएआई क्षेत्रीय नोडल अधिकारी की मंजूरी लंबित है।"
  },
  "Digitally verified using instant e-KYC. Credential dispatched to your DigiLocker.": {
    en: "Digitally verified using instant e-KYC. Credential dispatched to your DigiLocker.",
    hi: "तत्काल ई-केवाईसी सत्यापन पूरा। डिजिटल प्रमाणपत्र आपके डिजीलॉकर में भेज दिया गया है।"
  },
  "Application logged successfully. District revenue officer assigned for desk audit of supplementary documents.": {
    en: "Application logged successfully. District revenue officer assigned for desk audit of supplementary documents.",
    hi: "आवेदन सफलतापूर्वक पंजीकृत। सहायक दस्तावेजों की समीक्षा हेतु जिला राजस्व अधिकारी नियुक्त।"
  },
  "Approved by Sub-Divisional Officer. Security digital certificates signed on blockchain vault.": {
    en: "Approved by Sub-Divisional Officer. Security digital certificates signed on blockchain vault.",
    hi: "उप-विभागीय अधिकारी (एसडीओ) द्वारा अनुमोदित। डिजिटल सुरक्षा प्रमाणपत्रों पर सुरक्षित हस्ताक्षर किए गए।"
  },
  "Dear Applicant, an inspection was carried out at India Post Office, Indiranagar Branch on 2026-06-11. General notice issued to the vendor desk. Standard UIDAI fee rates have been strictly displayed on prominent billboard banners. Overcharged amount will be processed for refund where relevant credentials support it. Thank you for utilizing CPGRAMS portal.": {
    en: "Dear Applicant, an inspection was carried out at India Post Office, Indiranagar Branch on 2026-06-11. General notice issued to the vendor desk. Standard UIDAI fee rates have been strictly displayed on prominent billboard banners. Overcharged amount will be processed for refund where relevant credentials support it. Thank you for utilizing CPGRAMS portal.",
    hi: "प्रिय आवेदक, दिनांक 11-06-2026 को इन्दिरानगर मुख्य डाकघर केंद्र का भौतिक निरीक्षण किया गया। डेस्क को कारण बताओ नोटिस जारी। आधार अपडेट के मानक शुल्क बोर्ड को प्रमुखता से प्रदर्शित कराया गया है। अतिरिक्त वसूला गया पैसा रिफंड किया जाएगा। सीपीजीआरएएमएस उपयोग के लिए धन्यवाद।"
  }
};

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [language, setLang] = useState<Language>(() => {
    try {
      const stored = localStorage.getItem("eseva_language");
      const validLangs = ["en", "hi", "ta", "te", "bn", "mr", "gu", "kn", "ml", "pa", "or"];
      if (stored && validLangs.includes(stored)) return stored as Language;
    } catch (_) {}
    return "en";
  });

  const setLanguage = (lang: Language) => {
    setLang(lang);
    try {
      localStorage.setItem("eseva_language", lang);
    } catch (_) {}
  };

  const t = (key: string, variables?: Record<string, string>): string => {
    const langDict = dictionary[language];
    let text = (langDict && langDict[key]) || dictionary["en"]?.[key] || key;
    if (variables) {
      Object.entries(variables).forEach(([k, v]) => {
        text = text.replace(new RegExp(`{${k}}`, "g"), v);
      });
    }
    return text;
  };

  const translateService = (service: ESevaService): ESevaService => {
    if (language === "en") return service;
    const trans = serviceTranslations[service.id];
    if (trans) {
      const data = trans[language] || trans.hi;
      if (data) {
        return {
          ...service,
          title: data.title,
          department: data.department,
          description: data.description,
          documentsRequired: data.documentsRequired,
          processingTime: data.processingTime
        };
      }
    }
    // Fallback if no specific translation mapping but we should translate category/department
    const translatedDept = valueTranslations[service.department]?.[language] || service.department;
    return {
      ...service,
      department: translatedDept
    };
  };

  const translateDoc = (doc: DigiLockerDocument): DigiLockerDocument => {
    if (language === "en") return doc;
    const translatedHolder = doc.holderName === "Shahrukh Khan" ? "शाहरुख खान" : doc.holderName;
    const translatedState = valueTranslations[doc.data.registeredState]?.[language] || doc.data.registeredState;
    const translatedAuth = valueTranslations[doc.data.issuingAuthority]?.[language] || doc.data.issuingAuthority;
    const translatedIssue = valueTranslations[doc.data.issueAuthority]?.[language] || doc.data.issueAuthority;
    const translatedChannel = valueTranslations[doc.data.issueChannel]?.[language] || doc.data.issueChannel;
    
    const translatedData: Record<string, string> = {};
    Object.entries(doc.data).forEach(([k, v]) => {
      translatedData[k] = valueTranslations[v]?.[language] || v;
    });

    if (translatedState) translatedData["registeredState"] = translatedState;
    if (translatedAuth) translatedData["issuingAuthority"] = translatedAuth;
    if (translatedIssue) translatedData["issueAuthority"] = translatedIssue;
    if (translatedChannel) translatedData["issueChannel"] = translatedChannel;

    return {
      ...doc,
      holderName: translatedHolder,
      data: translatedData
    };
  };

  const translateApplication = (app: ServiceApplication): ServiceApplication => {
    if (language === "en") return app;
    const transService = serviceTranslations[app.serviceId];
    const translatedName = transService?.[language]?.title || transService?.hi?.title || app.serviceName;
    const translatedHolder = app.applicantName === "Shahrukh Khan" ? "शाहरुख खान" : app.applicantName;
    const translatedState = valueTranslations[app.state]?.[language] || app.state;
    const translatedComments = valueTranslations[app.comments]?.[language] || app.comments;
    const translatedStatus = (valueTranslations[app.status]?.[language] || app.status) as any;

    return {
      ...app,
      serviceName: translatedName,
      applicantName: translatedHolder,
      state: translatedState,
      comments: translatedComments,
      status: translatedStatus
    };
  };

  const translateGrievance = (g: GrievanceRecord): GrievanceRecord => {
    if (language === "en") return g;
    const translatedDept = valueTranslations[g.department]?.[language] || g.department;
    const translatedState = valueTranslations[g.stateOfGrievance]?.[language] || g.stateOfGrievance;
    const translatedReply = g.officialReply ? (valueTranslations[g.officialReply]?.[language] || g.officialReply) : undefined;
    const translatedStatus = (valueTranslations[g.status]?.[language] || g.status) as any;

    // Direct string keyword translates for typical grievance topics
    let translatedSubject = g.subject;
    let translatedDesc = g.description;
    if (g.subject.includes("Aadhaar center at Indiranagar postal house charging hidden convenience fees")) {
      translatedSubject = "इन्दिरानगर डाकघर आधार केंद्र द्वारा अवैध सेवा शुल्क वसूलना";
      translatedDesc = "वहाँ के कर्मचारी बायोमेट्रिक अपडेट के लिए ₹150 की मांग कर रहे हैं, जो सरकारी मानक मूल्य ₹50 के नियम पत्र का स्पष्ट उल्लंघन है। कृपया कार्रवाई करें।";
    } else if (g.subject.includes("Excessive queuing at NH-44 Devanahalli toll gate due to slow Fastag reader")) {
      translatedSubject = "धीमी गति फास्टैग स्कैनर के कारण राष्ट्रीय राजमार्ग NH-44 देवनाहल्ली टोल प्लाजा पर लंबी कतारें";
      translatedDesc = "बाएं लेन के आरएफआईडी स्कैनर बार-बार खराब होते हैं, जिससे हवाई अड्डे जाने वाले यात्रियों को 45 मिनट के जाम का सामना करना पड़ता है।";
    }

    return {
      ...g,
      department: translatedDept,
      stateOfGrievance: translatedState,
      officialReply: translatedReply,
      status: translatedStatus,
      subject: translatedSubject,
      description: translatedDesc
    };
  };

  return (
    <LanguageContext.Provider 
      value={{ 
        language, 
        setLanguage, 
        t, 
        translateService, 
        translateDoc, 
        translateApplication, 
        translateGrievance 
      }}
    >
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error("useLanguage must be used within a LanguageProvider");
  }
  return context;
};
