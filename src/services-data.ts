import { ESevaService } from "./types";

export const JURISDICTIONS = [
  { id: "andhra-pradesh", name: "Andhra Pradesh", short: "AP", isUT: false, deptPrefix: "Department of Revenue & IT, Govt of Andhra Pradesh" },
  { id: "arunachal-pradesh", name: "Arunachal Pradesh", short: "AR", isUT: false, deptPrefix: "State Council of e-Governance Services, Arunachal Pradesh" },
  { id: "assam", name: "Assam", short: "AS", isUT: false, deptPrefix: "Department of Administrative Reforms & Revenue, Assam" },
  { id: "bihar", name: "Bihar", short: "BR", isUT: false, deptPrefix: "Public Grievances & Revenue Authority, Government of Bihar" },
  { id: "chhattisgarh", name: "Chhattisgarh", short: "CG", isUT: false, deptPrefix: "Revenue & Information Technology nodal office, Chhattisgarh" },
  { id: "goa", name: "Goa", short: "GA", isUT: false, deptPrefix: "Directorate of Planning, Statistics & Revenue, Goa" },
  { id: "gujarat", name: "Gujarat", short: "GJ", isUT: false, deptPrefix: "Revenue & Urban Development Department, Govt of Gujarat" },
  { id: "haryana", name: "Haryana", short: "HR", isUT: false, deptPrefix: "Saral e-District Board, Haryana Administration" },
  { id: "himachal-pradesh", name: "Himachal Pradesh", short: "HP", isUT: false, deptPrefix: "Department of Revenue & Digital Himachal Authority" },
  { id: "jharkhand", name: "Jharkhand", short: "JH", isUT: false, deptPrefix: "JharSewa Services Nodal Unit, Jharkhand" },
  { id: "karnataka", name: "Karnataka", short: "KA", isUT: false, deptPrefix: "Seva Sindhu Direct Revenue portal, Government of Karnataka" },
  { id: "kerala", name: "Kerala", short: "KL", isUT: false, deptPrefix: "Akshaya e-Governance Centre, Government of Kerala" },
  { id: "madhya-pradesh", name: "Madhya Pradesh", short: "MP", isUT: false, deptPrefix: "Lok Seva Hub, Revenue Administration, Madhya Pradesh" },
  { id: "maharashtra", name: "Maharashtra", short: "MH", isUT: false, deptPrefix: "Aaple Sarkar Direct Benefit & land records board, Maharashtra" },
  { id: "manipur", name: "Manipur", short: "MN", isUT: false, deptPrefix: "e-District Nodal Department, Manipur Authority" },
  { id: "meghalaya", name: "Meghalaya", short: "ML", isUT: false, deptPrefix: "Department of Information Technology & Communications, Meghalaya" },
  { id: "mizoram", name: "Mizoram", short: "MZ", isUT: false, deptPrefix: "District Administration & Revenue Headquarters, Mizoram" },
  { id: "nagaland", name: "Nagaland", short: "NL", isUT: false, deptPrefix: "State Information Technology & Revenue Cell, Nagaland" },
  { id: "odisha", name: "Odisha", short: "OR", isUT: false, deptPrefix: "Odisha e-District Portal & Land Records wing, Odisha" },
  { id: "punjab", name: "Punjab", short: "PB", isUT: false, deptPrefix: "Sewa Kendra Unified Civic Center, Punjab Government" },
  { id: "rajasthan", name: "Rajasthan", short: "RJ", isUT: false, deptPrefix: "Jan Soochna Board & Revenue Directorate, Rajasthan" },
  { id: "sikkim", name: "Sikkim", short: "SK", isUT: false, deptPrefix: "Department of Information Tech & Revenue, Sikkim" },
  { id: "tamil-nadu", name: "Tamil Nadu", short: "TN", isUT: false, deptPrefix: "e-Sevai Nodal Information Hub, Govt of Tamil Nadu" },
  { id: "telangana", name: "Telangana", short: "TG", isUT: false, deptPrefix: "MeeSeva e-Services Directory, Telangana Government" },
  { id: "tripura", name: "Tripura", short: "TR", isUT: false, deptPrefix: "Directorate of Information Technology & Land Records, Tripura" },
  { id: "uttar-pradesh", name: "Uttar Pradesh", short: "UP", isUT: false, deptPrefix: "e-District Integrated Citizen Portal, Uttar Pradesh" },
  { id: "uttarakhand", name: "Uttarakhand", short: "UK", isUT: false, deptPrefix: "Apuni Sarkar Urban Information Board, Uttarakhand" },
  { id: "west-bengal", name: "West Bengal", short: "WB", isUT: false, deptPrefix: "Banglarbhumi State Land Records & Civic Hub, West Bengal" },
  
  // UTs
  { id: "andaman-nicobar", name: "Andaman and Nicobar Islands", short: "AN", isUT: true, deptPrefix: "Andaman & Nicobar Islands Administration Commissionerate" },
  { id: "chandigarh", name: "Chandigarh", short: "CH", isUT: true, deptPrefix: "e-Jan Sampark Administration Nodal Centre, Chandigarh" },
  { id: "dadra-nagar-haveli-daman-diu", name: "Dadra and Nagar Haveli and Daman and Diu", short: "DN", isUT: true, deptPrefix: "Dadra & Nagar Haveli & Daman & Diu Citizen Portal Authority" },
  { id: "delhi", name: "Delhi", short: "DL", isUT: true, deptPrefix: "e-District Portal, Delhi National Capital Territory Administration" },
  { id: "jammu-kashmir", name: "Jammu and Kashmir", short: "JK", isUT: true, deptPrefix: "e-Seva Board, Jammu & Kashmir UT Administration" },
  { id: "ladakh", name: "Ladakh", short: "LA", isUT: true, deptPrefix: "Ladakh UT Citizen Service Portal & Revenue Branch, Ladakh" },
  { id: "lakshadweep", name: "Lakshadweep", short: "LD", isUT: true, deptPrefix: "Union Territory Administration, Lakshadweep e-Gov board" },
  { id: "puducherry", name: "Puducherry", short: "PY", isUT: true, deptPrefix: "Department of Information Technology, Puducherry Government" }
];

export const curatedServices: ESevaService[] = [
  {
    id: "uidai-aadhaar",
    title: "Aadhaar Card (New & Update)",
    department: "Unique Identification Authority of India (UIDAI), Delhi",
    description: "12-digit unique identity number issued by UIDAI to every resident of India, verified with live biometrics.",
    category: "IDENTITY",
    processingTime: "15-30 days",
    fees: 50,
    documentsRequired: ["Proof of Address (electricity bill, passport)", "Birth Certificate or Matriculation sheet", "Signed Self-Declaration Letter", "Proof of Identity copy"]
  },
  {
    id: "nsdl-pan",
    title: "Apply for PAN Card",
    department: "Income Tax Department, Govt of India / NSDL",
    description: "Permanent Account Number, a 10-character alphanumeric identifier for all tax-related financial transactions.",
    category: "FINANCE",
    processingTime: "7-15 days",
    fees: 110,
    documentsRequired: ["Aadhaar Card copy", "Two passport size color photos", "Proof of age certificate", "Address Proof", "Income declaration form"]
  },
  {
    id: "mea-passport",
    title: "Passport Application",
    department: "Consular, Passport & Visa Division, Ministry of External Affairs",
    description: "Official biometric travel document issued for international travel, valid for 10 years.",
    category: "IDENTITY",
    processingTime: "30-45 days (Normal) / 7-14 days (Tatkal)",
    fees: 1500,
    documentsRequired: ["Proof of Birth", "Secondary School Certificate", "Address Proof of active flat/room", "Aadhaar copy", "Previous passport references (if any)"]
  },
  {
    id: "rto-dl",
    title: "Driving Licence (RTO)",
    department: "Ministry of Road Transport and Highways (MoRTH)",
    description: "Official permit validation allowing operations of motor vehicles, issued by your regional state RTO licenses board.",
    category: "LABOUR",
    processingTime: "30 days (after LL + test)",
    fees: 250,
    documentsRequired: ["Learner's Licence copy", "Age proof (Aadhaar or Birth Certificate)", "Address proof copy", "Form 1 and 1A medical fitness", "Vehicle details for test", "Passport size photos"]
  },
  {
    id: "eci-voter",
    title: "Voter ID Card",
    department: "Election Commission of India (ECI)",
    description: "Electoral Photo Identity Card issued to eligible Indian citizens to engage in democratic state assemblies.",
    category: "IDENTITY",
    processingTime: "15-30 days",
    fees: 0,
    documentsRequired: ["Aadhaar Card copy", "Age proof (18+ declaration)", "Address proof", "Passport size photograph"]
  },
  {
    id: "pds-ration",
    title: "Ration Card (NFSA)",
    department: "Department of Food and Public Distribution / State PDS",
    description: "Official document enabling access to subsidised food grains and daily cooking products under Public Distribution Systems (PDS).",
    category: "WELFARE",
    processingTime: "15-30 days",
    fees: 20,
    documentsRequired: ["Aadhaar Card of all family members", "Income certificate", "Address proof", "Gas cylinder booklet (if any)", "Rent agreement or property deed"]
  },
  {
    id: "mohfw-abha",
    title: "ABHA Health Card",
    department: "National Health Authority (NHA) / MoHFW",
    description: "Create your unique 14-digit ABHA ID under Pradhan Mantri Jan Arogya Yojana to digitally compile clinical laboratory files, clinical summaries, and treatments.",
    category: "HEALTH",
    processingTime: "Instant / Real-time issuance",
    fees: 0,
    documentsRequired: ["Aadhaar Card with linked active SIM number", "Mobile number for e-KYC Verification"]
  },
  {
    id: "mole-eshram",
    title: "e-Shram Worker Card",
    department: "Ministry of Labour & Employment, India",
    description: "Centralized database mapping of construction workers, street vendors, and agrarian labourers to distribute financial aid, direct subsidies, and accidental cover.",
    category: "LABOUR",
    processingTime: "Instant / Real-time card",
    fees: 0,
    documentsRequired: ["Bank Account Details (IFSC Code)", "Primary Mobile ID number", "Aadhaar Card"]
  },
  {
    id: "revenue-income",
    title: "Caste & Income Certificate",
    department: "State Directorate of Revenue Authorities & District Administration",
    description: "Certified legal validation of family income brackets and category categories, necessary for state scholarships, quotas, and economic subventions.",
    category: "LAND",
    processingTime: "10-15 Working Days (Via state e-District console)",
    fees: 65,
    documentsRequired: ["Ration Card copy", "Proof of yearly family income (Form-16 or salary slips)", "Affidavit by village Patwari/Revenue Inspector"]
  },
  {
    id: "agriculture-pmkisan",
    title: "PM-Kisan Farmer Subsidy",
    department: "Department of Agriculture & Farmers Welfare",
    description: "Direct benefit transfer (DBT) dispatch enrollment providing ₹6,000 yearly to marginal and small cultivator families under direct Aadhaar-linked bank accounts.",
    category: "WELFARE",
    processingTime: "15 Days (Sub-divisional magistrate review)",
    fees: 0,
    documentsRequired: ["Land Records Document / Patta Registry Certificate", "Active Bank Passbook", "Aadhaar card details"]
  }
];

export const otherCentralServices: ESevaService[] = [
  {
    id: "digilocker-account",
    title: "DigiLocker Account Setup",
    department: "Ministry of Electronics & Information Technology (MeitY)",
    description: "Digital wallet enabling access to authentic, digitally signed government documents e-signed and validated across all national agencies.",
    category: "IDENTITY",
    processingTime: "Instant / Real-time",
    fees: 0,
    documentsRequired: ["Aadhaar number", "Active linked mobile number"]
  },
  {
    id: "gstin-reg",
    title: "New GST Registration (GSTIN)",
    department: "Goods and Services Tax Network (GSTN), Govt of India",
    description: "Request standard 15-digit GST Registration Code for small-scale and large commercial business entities operating on domestic commerce portals.",
    category: "FINANCE",
    processingTime: "3-7 days",
    fees: 0,
    documentsRequired: ["PAN Card copy", "Business address utility receipt", "Applicant photograph", "Partnership/Association declaration"]
  },
  {
    id: "msme-udyog",
    title: "MSME Business Registration",
    department: "Ministry of Micro, Small and Medium Enterprises",
    description: "Enlist under MSME register to unlock centralized business credits, credit guarantees, interest subsidies, and priority tenders participation.",
    category: "FINANCE",
    processingTime: "1-2 days",
    fees: 0,
    documentsRequired: ["Aadhaar number of the promoter", "PAN Card of the enterprise", "Operational Bank Account credentials"]
  },
  {
    id: "fssai-licence",
    title: "FSSAI Food License",
    department: "Food Safety and Standards Authority of India (FSSAI)",
    description: "Mandatory regulatory safety license certifying hygienic standards compliance for any small food vendor, caterer, restaurant, or manufacturer.",
    category: "HEALTH",
    processingTime: "10-15 days",
    fees: 100,
    documentsRequired: ["Passport sized color photo", "Government ID copy (Aadhaar or Voter card)", "Location permission certificate / water test note"]
  },
  {
    id: "pmay-housing",
    title: "PMAY Housing Scheme",
    department: "Ministry of Housing and Urban Affairs",
    description: "Enrollment hub for credits-linked municipal housing subsidy assistance programs helping middle and low revenue families afford pucca homes.",
    category: "WELFARE",
    processingTime: "60-90 days",
    fees: 0,
    documentsRequired: ["Aadhaar card details of all family citizens", "Certificate of yearly income", "Declaration of no other pucca residence in India"]
  },
  {
    id: "nps-national",
    title: "NPS Retirement Account",
    department: "Pension Fund Regulatory and Development Authority (PFRDA)",
    description: "Open a voluntary PRAN (Permanent Retirement Account Number) enabling market-linked citizen retirement investment pools with custom equity options.",
    category: "FINANCE",
    processingTime: "2-3 days",
    fees: 500,
    documentsRequired: ["Aadhaar Card", "PAN index", "Active Bank details & cancelled cheque", "Nominee identification details"]
  },
  {
    id: "nta-neet",
    title: "NEET UG Exam Portal",
    department: "National Testing Agency (NTA), India",
    description: "Complete student profiles and application dispatch channels for NEET admissions across public and private Indian healthcare universities.",
    category: "WELFARE",
    processingTime: "Instant / Closed on deadlines",
    fees: 1700,
    documentsRequired: ["Class 10 transcripts certificate", "Class 12 qualifications profile status", "Citizen passport size portrait", "Aadhaar Card copy"]
  },
  {
    id: "cbse-duplicate",
    title: "CBSE Marksheet Copy",
    department: "Central Board of Secondary Education (CBSE)",
    description: "Apply online for certified, legally authentic replacement marksheets or migration files, with direct home delivery options.",
    category: "WELFARE",
    processingTime: "7-10 days",
    fees: 250,
    documentsRequired: ["Enrolment roll number details", "Passing year metadata", "ID proof of candidate"]
  },
  {
    id: "epfo-uan",
    title: "EPF Provident Fund Setup",
    department: "Employees' Provident Fund Organisation (EPFO)",
    description: "Activate your central Universal Account Number (UAN) to review PF balances, initiate salary transfer claims, dynamic passes downloads, and pension options.",
    category: "LABOUR",
    processingTime: "1-2 days",
    fees: 0,
    documentsRequired: ["Active Aadhaar number", "Member PAN link", "Active mobile phone for OTP key confirmation", "Bank details sync"]
  },
  {
    id: "digilocker-driving",
    title: "Link Driving Licence to DigiLocker",
    department: "Ministry of Road Transport & Highways (MoRTH)",
    description: "Direct instant digital sync mapping your local state transport registration license directly into DigiLocker secure pockets for traffic inspection validation.",
    category: "IDENTITY",
    processingTime: "Instant / Real-time",
    fees: 0,
    documentsRequired: ["Driving License parameter index number", "Aadhaar details verification"]
  },
  {
    id: "rto-parivahan",
    title: "Vehicle RC Search (Vahan)",
    department: "Ministry of Road Transport and Highways (MoRTH)",
    description: "Verify digital details of any automotive chassis index, fitness certificates, or state vehicle registration statistics securely.",
    category: "LABOUR",
    processingTime: "Instant / Real-time query",
    fees: 0,
    documentsRequired: ["Automated vehicle registration number", "Chassis number digits references"]
  },
  {
    id: "nhai-fastag",
    title: "Apply for FASTag",
    department: "National Highways Authority of India (NHAI)",
    description: "Apply for standard RFID FASTag transponder attached to your passenger vehicle to automate highway toll payouts safely.",
    category: "LABOUR",
    processingTime: "2-3 days",
    fees: 150,
    documentsRequired: ["Vehicle Registration Certificate (RC) book", "Aadhaar of applicant", "Vehicle profile and category photograph"]
  },
  {
    id: "post-savings",
    title: "Post Office Savings Account",
    department: "Department of Posts, Ministry of Communications",
    description: "Apply to initialize standard small savings deposit books, monthly savings certificates, or Sukanya Samriddhi accounts across Indian post offices.",
    category: "FINANCE",
    processingTime: "3-5 days",
    fees: 500,
    documentsRequired: ["Citizen Identification files (Aadhaar or Voter card)", "Active address utility bill copy", "Two passport size pictures"]
  },
  {
    id: "uidai-update",
    title: "Update Aadhaar Address",
    department: "Unique Identification Authority of India (UIDAI)",
    description: "Request quick, secure address updates on your Aadhaar card using certified home rent sheets, electricity bills, or passport documents.",
    category: "IDENTITY",
    processingTime: "7-10 working days",
    fees: 50,
    documentsRequired: ["Proof of Address document list (PDF or image)", "Aadhaar UID profile", "Mobile verified check"]
  },
  {
    id: "mca-company",
    title: "Register a Company (MCA)",
    department: "Ministry of Corporate Affairs (MCA), Govt of India",
    description: "Integrated online portal to apply for company name approval, corporate register registration, PAN/TAN issuance, and EPFO/ESIC activations.",
    category: "FINANCE",
    processingTime: "7-10 working days",
    fees: 1000,
    documentsRequired: ["Director Identification Files (DIN)", "Address proofs (not older than 2 months)", "Digital Signature Certificates (DSC) of directors", "Registered corporate address NOC document"]
  },
  {
    id: "irctc-booking",
    title: "IRCTC Train Booking Account",
    department: "Indian Railway Catering and Tourism Corporation (IRCTC)",
    description: "Establish official login credentials mapped to national ID parameters to book train tickets across all regional zones securely.",
    category: "WELFARE",
    processingTime: "Instant / Real-time setup",
    fees: 0,
    documentsRequired: ["Email address verification", "Citizen mobile number verification", "Aadhaar link option"]
  },
  {
    id: "mhrd-scholarship",
    title: "National Scholarship Portal",
    department: "Ministry of Education (MoE), India",
    description: "Unified national registration for Central Sector, UGC, and AICTE collegiate and tertiary schooling scholarship programs with direct-benefit transfers.",
    category: "WELFARE",
    processingTime: "30-45 days (Verification cycle)",
    fees: 0,
    documentsRequired: ["Student institute bonafide certificate", "Annual household income dossier", "Caste / Minority category declarations", "Bank account details verification"]
  },
  {
    id: "gpf-provident",
    title: "GPF Provident Fund Statement",
    department: "Department of Pension & Pensioners' Welfare, India",
    description: "Rule dispatch link enabling public sector and administrative professionals to download annual GPF statements and balance indexes of service.",
    category: "FINANCE",
    processingTime: "3-5 days",
    fees: 0,
    documentsRequired: ["GPF Account unique login, PF series index", "Employee PIN authentication code"]
  },
  {
    id: "income-tax-efiling",
    title: "Income Tax filing & Aadhaar Link",
    department: "Income Tax Department, Ministry of Finance",
    description: "Annual verification, submission, and validation of tax assessments with auto-populated Form 16s and seamless Aadhaar linking integration.",
    category: "FINANCE",
    processingTime: "Instant / Filing cycle limits",
    fees: 0,
    documentsRequired: ["PAN Identifier details", "Aadhaar UID details", "Form-16 or salary breakdown file", "Bank accounts lists"]
  },
  {
    id: "cbda-abha-address",
    title: "ABHA Health Address",
    department: "National Health Authority (NHA) / MoHFW",
    description: "Configure your diagnostic mailbox (like name@abdm) to share verified clinical files, tests, and prescriptions seamlessly across public and private hospitals.",
    category: "HEALTH",
    processingTime: "Instant / Real-time",
    fees: 0,
    documentsRequired: ["Active ABHA ID card or Aadhaar link", "Demographic verification check"]
  },
  {
    id: "nid-design-test",
    title: "NID Design Exam Portal",
    department: "National Institute of Design (NID), India",
    description: "Online profile registration and entrance test application for Bachelor & Master of Design courses.",
    category: "WELFARE",
    processingTime: "Instant / Closed on deadlines",
    fees: 3000,
    documentsRequired: ["10+2 Secondary transcripts", "General identification copy", "Category / reservation certificate index (if OBC/SC/ST)"]
  },
  {
    id: "nat-eligibility",
    title: "UGC NET Exam Portal",
    department: "National Testing Agency (NTA), India",
    description: "Submit application portfolios for the biannual examination certifying eligibility for Junior Research Fellowship and Assistant Professor roles.",
    category: "WELFARE",
    processingTime: "Instant / Seasonal cycle",
    fees: 1150,
    documentsRequired: ["Postgraduate marks certificate with 55% average", "Demographic credentials documents", "Identity certificate"]
  },
  {
    id: "bar-council-enroll",
    title: "Advocate Enrollment (BCI)",
    department: "Bar Council of India (BCI)",
    description: "Register LL.B candidates onto state rosters and apply for the mandatory All India Bar Examination (AIBE) license.",
    category: "LABOUR",
    processingTime: "15-20 days",
    fees: 750,
    documentsRequired: ["Graduation LL.B certificate / Provisional marks sheet", "Original collegiate character letter", "Aadhaar ID copy"]
  },
  {
    id: "startup-india-reg",
    title: "Startup India Certificate",
    department: "Department for Promotion of Industry and Internal Trade (DPIIT)",
    description: "Avail key corporate tax reliefs, patent rebate benefits, self-certification privileges under labor nodes, and centralized funding pools.",
    category: "FINANCE",
    processingTime: "10-15 working days",
    fees: 0,
    documentsRequired: ["Corporate registration certificate (COI)", "Detailed startup presentation pitching innovation or service model", "Patent registrations (if any)"]
  },
  {
    id: "apeda-export",
    title: "APEDA Food Export License",
    department: "Agricultural and Processed Food Products Export Development Authority (APEDA)",
    description: "Mandatory corporate registration for exporters of processed agricultural products, securing premium international certificates.",
    category: "FINANCE",
    processingTime: "7-10 working days",
    fees: 5000,
    documentsRequired: ["Import-Export Code (IEC) proof", "Bank verification certificate copy", "Company incorporation outline"]
  },
  {
    id: "dgft-iec",
    title: "Importer-Exporter Code (IEC)",
    department: "Directorate General of Foreign Trade (DGFT)",
    description: "Request the crucial 10-digit primary identity number necessary for any shipping business or corporate export operations.",
    category: "FINANCE",
    processingTime: "2-3 working days",
    fees: 500,
    documentsRequired: ["Corporate PAN identifier", "Partner proofs list", "Active current account check leaf"]
  },
  {
    id: "nielit-exam",
    title: "Computer Literacy Course (CCC)",
    department: "National Institute of Electronics & Information Technology (NIELIT)",
    description: "Public registration for the highly-demanded CCC computer literacy test, valued for municipal and clerical state recruitments.",
    category: "WELFARE",
    processingTime: "Instant / Monthly cycles",
    fees: 590,
    documentsRequired: ["Candidate signature copy in jpg", "Passport sized photo", "Left-hand thumb impression graphic"]
  },
  {
    id: "swayam-education",
    title: "SWAYAM Course Registration",
    department: "Ministry of Education (MoE), India",
    description: "Register for nationwide physical test sessions to transfer official academic micro-credits across standard collegiate degrees.",
    category: "WELFARE",
    processingTime: "Instant / Cycle schedules",
    fees: 1000,
    documentsRequired: ["Student enrollment metadata", "Identity proof card copy", "Enrollment index numbers"]
  },
  {
    id: "uidai-pvc",
    title: "Order PVC Aadhaar Card",
    department: "Unique Identification Authority of India (UIDAI)",
    description: "Order high-durability plastic physical cards from UIDAI featuring multi-layered security printing, holographic layers, micro-text, and secure QR codes.",
    category: "IDENTITY",
    processingTime: "5-10 days (Home dispatched via Speed Post)",
    fees: 50,
    documentsRequired: ["Active Aadhaar UID identifier", "Mobile verification key"]
  },
  {
    id: "esic-medical",
    title: "ESIC Employee Health Benefit",
    department: "Employees' State Insurance Corporation (ESIC)",
    description: "Apply for standard medical benefit cards extending medical insurance coverage and dispensaries care access to low-to-middle income industrial personnel.",
    category: "HEALTH",
    processingTime: "3-5 days",
    fees: 0,
    documentsRequired: ["Employer registration roster copy", "Demographic details of self and nominee elements", "Aadhaar copies"]
  },
  {
    id: "pmsym-shramyogi",
    title: "PM-SYM Pension Scheme",
    department: "Ministry of Labour & Employment",
    description: "Social pension scheme extending voluntary savings and direct government correlation providing ₹3,000 monthly to unorganized workers after age 60.",
    category: "WELFARE",
    processingTime: "3-5 days",
    fees: 0,
    documentsRequired: ["Aadhaar profile check", "Savings Bank passbook IFSC details", "Active dynamic e-Shram Card registration"]
  },
  {
    id: "fssai-foocos",
    title: "Food License Renewal (FoSCoS)",
    department: "Food Safety and Standards Authority of India (FSSAI)",
    description: "Complete compliance portal for state or central level licensing for larger scale hospitality and dairy processing plants.",
    category: "HEALTH",
    processingTime: "15-30 days",
    fees: 2000,
    documentsRequired: ["Commercial blueprints of production hubs", "Analysis certificate of culinary water supply", "List of technical processing machinery"]
  },
  {
    id: "ayush-treatment",
    title: "AYUSH Medical Desk",
    department: "Ministry of Ayush, India",
    description: "Locate nodal regional alternative medicine health desks, book public consultations, or register standard local medical practices.",
    category: "HEALTH",
    processingTime: "1-2 days",
    fees: 0,
    documentsRequired: ["Demographic identity verification details", "Aadhaar link option"]
  },
  {
    id: "pmgdisha-literacy",
    title: "Digital Literacy Course",
    department: "Ministry of Electronics & Information Technology (MeitY)",
    description: "Register village families under the world's largest training scheme to teach operations of mobiles, digital services, and transaction apps.",
    category: "WELFARE",
    processingTime: "Instant / Session based",
    fees: 0,
    documentsRequired: ["Aadhaar UID of member", "Schooling category self certification"]
  },
  {
    id: "meity-cyber-alert",
    title: "Report Cyber Crime (CERT-In)",
    department: "Indian Computer Emergency Response Team (CERT-In) / MeitY",
    description: "Direct official emergency pipeline to report severe ransomware attacks, system compromises, web vulnerabilities, or server integrity breaches.",
    category: "IDENTITY",
    processingTime: "Instant / Active response hours",
    fees: 0,
    documentsRequired: ["Incident parameters reports (txt/logs)", "Diagnostic server traces / headers description", "Affiliated developer coordinates"]
  },
  {
    id: "uidai-child-enroll",
    title: "Child Aadhaar Card (Under 5)",
    department: "Unique Identification Authority of India (UIDAI)",
    description: "Order blue-coloured identification cards for toddlers and children under 5 years old, tied to parental biometric records with biometric updates scheduled at age 5.",
    category: "IDENTITY",
    processingTime: "15-20 days",
    fees: 0,
    documentsRequired: ["Child birth certificate copy", "Aadhaar photo verification of mother or father", "Parental self declaration forms"]
  },
  {
    id: "mea-visa-apply",
    title: "Indian Visa (e-Visa)",
    department: "Consular, Passport & Visa Division, Ministry of External Affairs",
    description: "Process and issue online electronic visas supporting international guests entering India for meetings, tourist adventures, or medical checkups.",
    category: "IDENTITY",
    processingTime: "3-5 days",
    fees: 2000,
    documentsRequired: ["Foreign applicant high-resolution passport scan page", "Sponsor letter or local hotel reference details", "Recent face photograph"]
  },
  {
    id: "pm-svanidhi",
    title: "PM SVANidhi Vendor Loan",
    department: "Ministry of Housing and Urban Affairs",
    description: "Access easy working capital loans up to ₹10,000 with interest subsidies and cash-back rewards for digital transaction adoption.",
    category: "FINANCE",
    processingTime: "7-15 days",
    fees: 0,
    documentsRequired: ["Aadhaar Copy", "Vending Certificate / LoR issued by Urban Municipal bodies", "Bank Passbook"]
  },
  {
    id: "dgca-drone-reg",
    title: "Drone Registration (DGCA)",
    department: "Directorate General of Civil Aviation (DGCA)",
    description: "Request standard UIN (Unique Identification Number) or remote pilot certificates to operate commercial quadcopters in Indian airspace safely.",
    category: "IDENTITY",
    processingTime: "5-7 days",
    fees: 100,
    documentsRequired: ["Drone physical manufacturer specifications list", "Aadhaar Card of the pilot", "Police Verification certificate"]
  }
];

const STATE_TEMPLATES = [
  {
    suffix: "domicile",
    titleTemplate: "Domicile Certificate",
    descTemplate: "Official administrative certificate validating regular residency in the state/UT, necessary for regional educational seats and native quotas.",
    category: "IDENTITY" as const,
    processingTime: "10-15 Working Days",
    fees: 30,
    documentsRequired: ["Aadhaar Card copy", "Last 5 years residence proof matching address (school TC or electric bill)", "Affidavit signed by Gazetted Clerk"]
  },
  {
    suffix: "caste",
    titleTemplate: "Caste Certificate",
    descTemplate: "Inclusion ledger card certifying demographic category status (OBC / SC / ST), crucial for availing reserved central and regional quotas.",
    category: "IDENTITY" as const,
    processingTime: "12-15 Working Days",
    fees: 40,
    documentsRequired: ["Aadhaar Card", "Father's legacy Caste Certificate or school admission document", "Self-declaration affidavit", "Address Proof"]
  },
  {
    suffix: "income",
    titleTemplate: "Income Certificate",
    descTemplate: "Official evaluation record verifying cumulative yearly family income, essential for state scholarships, tuition waivers, and welfare registrations.",
    category: "FINANCE" as const,
    processingTime: "10-12 Working Days",
    fees: 50,
    documentsRequired: ["Proof of salary structure / Income tax return copy / Form 16", "Active gas index copy or land bill", "Verification report of Patwari / Revenue Inspector"]
  },
  {
    suffix: "ews",
    titleTemplate: "EWS Certificate",
    descTemplate: "Priority document certifying reservation criteria under Economically Weaker Section classes, valid for general tier employment reservations.",
    category: "FINANCE" as const,
    processingTime: "15-20 Working Days",
    fees: 60,
    documentsRequired: ["Aadhaar card copy", "Income certificate proof showing less than 8 Lakhs yearly", "Agricultural land holdings records", "Two passport photos"]
  },
  {
    suffix: "birth",
    titleTemplate: "Birth Certificate",
    descTemplate: "Authentic demographic record certifying the occurrence of life and parent lineage data, issued via state birth registry branches.",
    category: "IDENTITY" as const,
    processingTime: "5-7 Working Days",
    fees: 20,
    documentsRequired: ["Hospital birth slip or institutional admission report", "Aadhaar of both parents", "Vaccination records", "Duly counter-signed affidavit (if delayed verification)"]
  },
  {
    suffix: "death",
    titleTemplate: "Death Certificate",
    descTemplate: "Legal notification acknowledging individual life termination, necessary for assets disbursement, family pension transitions, and active locker transfers.",
    category: "IDENTITY" as const,
    processingTime: "5-7 Working Days",
    fees: 20,
    documentsRequired: ["Medical certificate specifying death etiology", "Cremation or burial spot authorization receipt", "Deceased Aadhaar / Identity files", "Informant statement copy"]
  },
  {
    suffix: "marriage",
    titleTemplate: "Marriage Certificate",
    descTemplate: "Formal civic registration of marital union under Hindu / Special Marriage Act frameworks, valuable for joint accounts and visa applications.",
    category: "IDENTITY" as const,
    processingTime: "20-30 Working Days",
    fees: 150,
    documentsRequired: ["Marriage ceremony invitation photograph", "Age files (18+/21+) of both bride & groom", "Affidavit of separate residence before union", "Witness identification files (3 citizens)"]
  },
  {
    suffix: "ration",
    titleTemplate: "Ration Card (New / Update)",
    descTemplate: "Allocation parameters mapping for NFSA subsidised fuel and food items, catering to priority and BPL index families under State Food Civil Supplies.",
    category: "WELFARE" as const,
    processingTime: "15-30 Working Days",
    fees: 25,
    documentsRequired: ["Aadhaar copies of all household elements", "Family head single portrait picture", "Landed rent ledger or water receipt", "Previous cancellation card (if migrating)"]
  },
  {
    suffix: "pension-oldage",
    titleTemplate: "Old-Age Pension",
    descTemplate: "Direct monthly budget disbursement targeting senior citizens (60+) below targeted middle and low household revenue indices under Social Welfare boards.",
    category: "WELFARE" as const,
    processingTime: "25-30 Working Days",
    fees: 0,
    documentsRequired: ["Aadhaar registration", "Age Verification certification", "Aadhaar-linked active savings account passbook", "District income clearance dossier"]
  },
  {
    suffix: "pension-widow",
    titleTemplate: "Widow Pension",
    descTemplate: "Monthly financial social assistance to destitute widows destitute of active livelihood, managed directly under State Welfare funds.",
    category: "WELFARE" as const,
    processingTime: "20-25 Working Days",
    fees: 0,
    documentsRequired: ["Deceased husband's Death Certificate", "Aadhaar of active applicant", "No re-marriage certificate proof", "Income declaration form under regional SDM review"]
  },
  {
    suffix: "pension-disability",
    titleTemplate: "Disability Pension",
    descTemplate: "Dedicated welfare subsidy supporting citizens presenting with 40%+ permanent physiological/cognitive impairment conditions.",
    category: "WELFARE" as const,
    processingTime: "20-30 Working Days",
    fees: 0,
    documentsRequired: ["UDID Card (Unique Disability Card) copy", "Medical assessment certificate issued by Chief District Medical Officer", "Aadhaar", "Bank passbook"]
  },
  {
    suffix: "land-records",
    titleTemplate: "Land Records (7/12 & RoR)",
    descTemplate: "Digitally certified Record of Rights (RoR), containing complete agrarian land ownership, survey boundaries, soil details, and tax assessments.",
    category: "LAND" as const,
    processingTime: "3-5 Working Days",
    fees: 15,
    documentsRequired: ["Original Khata / Patta reference code", "Survey / Khasra plot allocation number", "Active ID parameter for verification"]
  },
  {
    suffix: "land-mutation",
    titleTemplate: "Land Mutation",
    descTemplate: "Administrative updating of land holding title parameters inside municipal records following real estate sales, inheritance transitions, or division grids.",
    category: "LAND" as const,
    processingTime: "30-45 Working Days",
    fees: 120,
    documentsRequired: ["Registered sale agreement or division deed", "Affidavits of all adjacent boundary owners", "Clearance Certificate of land revenue charges"]
  },
  {
    suffix: "land-ec",
    titleTemplate: "Encumbrance Certificate (EC)",
    descTemplate: "Verification document checking historical deeds on any land asset to establish absolute legal ownership clarity without any active litigation pledges.",
    category: "LAND" as const,
    processingTime: "7-10 Working Days",
    fees: 75,
    documentsRequired: ["Property boundary details map copy", "Prior registration copies (last 15-30 years)", "Khata certificate reference"]
  },
  {
    suffix: "trade-licence",
    titleTemplate: "Trade License (Municipal)",
    descTemplate: "Mandatory corporate operational permit allowing businesses to conduct specified commerce in designated municipal land limits safely.",
    category: "LABOUR" as const,
    processingTime: "15-20 Working Days",
    fees: 250,
    documentsRequired: ["Property tax payment receipts certificate", "Occupancy certificate / NOC by Fire department", "Incorporation files or Partnership deed outline"]
  },
  {
    suffix: "building-approval",
    titleTemplate: "Building Plan Approval",
    descTemplate: "Nodal municipal verification of building plans to confirm safety, line restrictions, layout norms, and civil engineering compliance.",
    category: "LAND" as const,
    processingTime: "30-50 Working Days",
    fees: 500,
    documentsRequired: ["Blueprint architecture drawn by certified structural planner", "Clearance from State Fire and Ecology nodes", "Demographic land patta copy"]
  },
  {
    suffix: "water-noc",
    titleTemplate: "New Water Connection",
    descTemplate: "Municipal approval allowing direct secondary plumbing layout connection to the public fresh water grid safely.",
    category: "WELFARE" as const,
    processingTime: "10-14 Working Days",
    fees: 60,
    documentsRequired: ["Property tax clearance statement", "Demographic site road maps for pipelines", "Aadhaar Card"]
  },
  {
    suffix: "electricity-con",
    titleTemplate: "New Electricity Connection",
    descTemplate: "Nodal application linking regional power distribution nodes to active estates with meters installation and security certificates.",
    category: "WELFARE" as const,
    processingTime: "7-10 Working Days",
    fees: 115,
    documentsRequired: ["Ownership deed copy of property flat", "Active fire compliance certificate (if multi-storey or commercial)", "Aadhaar Copy"]
  },
  {
    suffix: "scholarship-pre",
    titleTemplate: "Pre-Matric Scholarship",
    descTemplate: "Financial tuition subvention supporting school education (Grades 1 to 10) for children belonging to underprivileged categories or economically weak classes.",
    category: "WELFARE" as const,
    processingTime: "15-20 Working Days",
    fees: 0,
    documentsRequired: ["Income Certificate proof", "Admission tuition index slip", "Aadhaar Card", "Previous year academic grades document"]
  },
  {
    suffix: "scholarship-post",
    titleTemplate: "Post-Matric Scholarship",
    descTemplate: "Direct benefit transfer tuition subvention assisting university, college, and technical students following secondary board verification.",
    category: "WELFARE" as const,
    processingTime: "25-30 Working Days",
    fees: 0,
    documentsRequired: ["Higher secondary grades sheet copy", "Caste / reservation certificate", "Active college enrollment fee slip", "Aadhaar card verification"]
  },
  {
    suffix: "transport-permit",
    titleTemplate: "State Vehicle Permit",
    descTemplate: "Regional Transport Office trade clearance per vehicles operating public transit, freight freighting or commercial taxis on state arterials.",
    category: "LABOUR" as const,
    processingTime: "15-20 Working Days",
    fees: 300,
    documentsRequired: ["Active Vehicle Registration Certificate (RC)", "Valid fitness index dossier", "Drivers commercial license references", "PUC copy"]
  },
  {
    suffix: "employment-reg",
    titleTemplate: "Employment Exchange Registry",
    descTemplate: "Nodal placement registry database listing matching candidate backgrounds for various regional government work schemes and job boards.",
    category: "LABOUR" as const,
    processingTime: "Instant / Real-time registry",
    fees: 0,
    documentsRequired: ["Primary secondary qualification transcripts", "Residential domicile copy", "Aadhaar Card with photo verification"]
  }
];

// Helper to compile the entire merged dataset with full slug-collision protection. Curated keeps absolute priority.
export const generateBulkServices = (): ESevaService[] => {
  const registry = new Map<string, ESevaService>();

  // 1. Seed existing curated high-priority services first
  curatedServices.forEach(s => {
    registry.set(s.id, s);
  });

  // 2. Add other central services
  otherCentralServices.forEach(s => {
    if (!registry.has(s.id)) {
      registry.set(s.id, s);
    }
  });

  // 3. Loop over all 36 JURISDICTIONS (28 States + 8 UTs) and apply 22 templates each (792 combinations)
  JURISDICTIONS.forEach(state => {
    STATE_TEMPLATES.forEach(tmpl => {
      // Create local slug e.g. "delhi-domicile" or "uttar-pradesh-ews"
      const slug = `${state.id}-${tmpl.suffix}`;
      
      // If we already have this slug registered in prioritized curated list, skip it! (Collision Protection)
      if (registry.has(slug)) {
        return;
      }

      // Format stateized department title nicely
      const isUTLetter = state.isUT ? "UT" : "State";
      const customizedDept = `${state.deptPrefix}, Civil Welfare Bureau`;
      const customizedTitle = `${state.name} ${tmpl.titleTemplate}`;

      const generatedService: ESevaService = {
        id: slug,
        title: customizedTitle,
        department: customizedDept,
        description: tmpl.descTemplate.replace("the state/UT", `${state.name} ${isUTLetter}`),
        category: tmpl.category,
        processingTime: tmpl.processingTime,
        fees: tmpl.fees,
        documentsRequired: [...tmpl.documentsRequired]
      };

      registry.set(slug, generatedService);
    });
  });

  return Array.from(registry.values());
};

// Ready-to-go single complete array of services!
export const officialServicesList: ESevaService[] = generateBulkServices();
