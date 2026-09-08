import React, { useState } from "react";
import { 
  Award, HelpCircle, BadgeAlert, Sparkles, CheckCircle2, 
  ArrowRight, FileText, IndianRupee, MapPin, UserCheck, Search, Info 
} from "lucide-react";
import { useLanguage } from "../LanguageContext";

interface EligibilityCheckerProps {
  onApplyForScheme: (schemeId: string) => void;
}

interface Scheme {
  id: string;
  name: Record<"en" | "hi", string>;
  description: Record<"en" | "hi", string>;
  benefit: Record<"en" | "hi", string>;
  department: Record<"en" | "hi", string>;
  minAge: number;
  maxAge: number;
  gender: "ANY" | "MALE" | "FEMALE";
  states: string[]; // ["ANY"] or specific states
  occupations: string[]; // ["ANY"] or specific
  maxIncome: number; // 0 for any, otherwise upper limit
  categories: string[]; // ["ANY"] or specific ones
  requiredDocs: Record<"en" | "hi", string[]>;
  associatedServiceId?: string; // Links to direct Apply form
}

const SCHEMES_DATABASE: Scheme[] = [
  {
    id: "pm-kisan",
    name: {
      en: "PM Kisan Samman Nidhi Yojana",
      hi: "प्रधानमंत्री किसान सम्मान निधि योजना"
    },
    description: {
      en: "A flagship central sector scheme to provide direct income reinforcement support to all land-holding farmer families in India.",
      hi: "सभी भूमिधारक किसान परिवारों को प्रत्यक्ष आर्थिक सहायता प्रदान करने की भारत सरकार की एक प्रमुख योजना।"
    },
    benefit: {
      en: "₹6,000 per year in three equal quarterly installments of ₹2,000 directly to bank accounts.",
      hi: "प्रति वर्ष ₹6,000, जो ₹2,000 की तीन समान किस्तों में सीधे बैंक खाते में भेजे जाते हैं।"
    },
    department: {
      en: "Ministry of Agriculture & Farmers Welfare",
      hi: "कृषि एवं किसान कल्याण मंत्रालय"
    },
    minAge: 18,
    maxAge: 120,
    gender: "ANY",
    states: ["ANY"],
    occupations: ["Farmer", "Agriculture Laborer", "Farm Worker"],
    maxIncome: 350000,
    categories: ["ANY"],
    requiredDocs: {
      en: ["Land ownership proof (Khatauni/Patta)", "Aadhaar Card copy", "Active Bank Passbook", "Mobile number linked with Aadhaar"],
      hi: ["भूमि स्वामित्‍व प्रमाण (खतौनी/पट्टा)", "आधार कार्ड की प्रति", "सक्रिय बैंक पासबुक", "आधार से लिंक मोबाइल नंबर"]
    },
    associatedServiceId: "agriculture-pmkisan"
  },
  {
    id: "pmay-housing",
    name: {
      en: "Pradhan Mantri Awas Yojana (Urban & Rural)",
      hi: "प्रधानमंत्री आवास योजना (शहरी और ग्रामीण)"
    },
    description: {
      en: "An initiative by the Government of India with the objective of providing solid, affordable pucca housing for the low-income and middle-income segments.",
      hi: "निम्न और मध्यम वर्ग के परिवारों को पक्का और किफायती घर प्रदान करने की भारत सरकार की एक पहल।"
    },
    benefit: {
      en: "Interest subsidy of up to 6.5% under Credit Linked Subsidy Scheme (CLSS), saving up to ₹2.67 Lakh.",
      hi: "क्रेडिट लिंक्ड सब्सिडी (CLSS) के तहत 6.5% तक ब्याज सब्सिडी, जिससे ₹2.67 लाख तक की बचत होती है।"
    },
    department: {
      en: "Ministry of Housing and Urban Affairs",
      hi: "आवास और शहरी मामलों के मंत्रालय"
    },
    minAge: 18,
    maxAge: 70,
    gender: "ANY",
    states: ["ANY"],
    occupations: ["ANY"],
    maxIncome: 600000,
    categories: ["ANY"],
    requiredDocs: {
      en: ["Income Certificate / Form 16", "Aadhaar Card", "Affidavit declaring no pucca house anywhere in India", "Address Proof"],
      hi: ["आय प्रमाण पत्र / फॉर्म 16", "आधार कार्ड", "शपथ पत्र (कि भारत में कहीं भी पक्का घर नहीं है)", "पते का प्रमाण"]
    }
  },
  {
    id: "sc-st-scholarship",
    name: {
      en: "Post-Matric Scholarship Scheme (SC/ST/OBC)",
      hi: "मैट्रिक-पश्चात छात्रवृत्ति योजना (एससी/एसटी/ओबीसी)"
    },
    description: {
      en: "Provides financial backing to support educational pursuits of students belonging to historically marginalized categories pursuing higher education.",
      hi: "उच्च शिक्षा प्राप्त कर रहे अनुसूचित जाति/जनजाति और पिछड़े वर्ग के छात्रों को वित्तीय सहायता प्रदान की जाती है।"
    },
    benefit: {
      en: "100% tuition fees reimbursement, monthly pocket/maintenance allowances, and special book grants.",
      hi: "100% ट्यूशन शुल्क प्रतिपूर्ति, मासिक रख-रखाव भत्ता और विशेष पुस्तक अनुदान।"
    },
    department: {
      en: "Ministry of Social Justice and Empowerment",
      hi: "सामाजिक न्याय और अधिकारिता मंत्रालय"
    },
    minAge: 15,
    maxAge: 30,
    gender: "ANY",
    states: ["ANY"],
    occupations: ["Student", "Unemployed"],
    maxIncome: 250000,
    categories: ["OBC", "SC", "ST"],
    requiredDocs: {
      en: ["Cast Certificate issued by Tehsildar", "Gross Annual Income Certificate", "Last exam mark sheets", "College Admission Receipt"],
      hi: ["तहसीलदार द्वारा जारी जाति प्रमाण पत्र", "वार्षिक पारिवारिक आय प्रमाण पत्र", "पिछली परीक्षा की मार्कशीट", "कॉलेज प्रवेश रसीद"]
    },
    associatedServiceId: "revenue-income"
  },
  {
    id: "pm-shram-yogi",
    name: {
      en: "Pradhan Mantri Shram Yogi Maan-dhan (PM-SYM)",
      hi: "प्रधानमंत्री श्रम योगी मान-धन योजना"
    },
    description: {
      en: "An old-age pension and security scheme designed for unorganized laborers like construction workers, street vendors, rickshaw pullers, and agricultural daily-wagers.",
      hi: "असंगठित क्षेत्र के श्रमिकों जैसे निर्माण मजदूरों, रेहड़ी-पटरी वालों और रिक्शा चालकों के लिए एक वृद्धावस्था सामाजिक पेंशन योजना।"
    },
    benefit: {
      en: "Assured minimum pension of ₹3,000 per month after attaining the age of 60 years.",
      hi: "60 वर्ष की आयु प्राप्त करने के बाद प्रति माह न्यूनतम ₹3,000 की सुनिश्चित पेंशन।"
    },
    department: {
      en: "Ministry of Labour & Employment",
      hi: "श्रम और रोजगार मंत्रालय"
    },
    minAge: 18,
    maxAge: 40,
    gender: "ANY",
    states: ["ANY"],
    occupations: ["Unorganized Worker", "Labourer", "Construction Worker", "Vendor", "Driver"],
    maxIncome: 180000,
    categories: ["ANY"],
    requiredDocs: {
      en: ["e-Shram card / Registration details", "Aadhaar Card copy", "Savings Bank Account details with auto-debit consent"],
      hi: ["ई-श्रम कार्ड / पंजीकरण विवरण", "आधार कार्ड की प्रति", "ऑटो-डेबिट सहमति के साथ बचत बैंक खाता विवरण"]
    },
    associatedServiceId: "mole-eshram"
  },
  {
    id: "kanya-sumangala",
    name: {
      en: "UP Kanya Sumangala Yojana",
      hi: "यूपी कन्या सुमंगला योजना"
    },
    description: {
      en: "State specific social security program designed to upgrade girls' health and education parameters while reducing female foeticide trends.",
      hi: "बालिकाओं के स्वास्थ्य और शिक्षा स्तर में सुधार करने और कन्या भ्रूण हत्या को कम करने के लिए उत्तर प्रदेश सरकार की योजना।"
    },
    benefit: {
      en: "₹15,000 total cash incentives distributed in 6 progressive educational stages from birth to graduation matriculation.",
      hi: "बालिका के जन्म से लेकर स्नातक में प्रवेश तक 6 चरणों में कुल ₹15,000 की नकद सहायता।"
    },
    department: {
      en: "Women and Child Development Department, Uttar Pradesh",
      hi: "महिला एवं बाल विकास विभाग, उत्तर प्रदेश"
    },
    minAge: 0,
    maxAge: 21,
    gender: "FEMALE",
    states: ["Uttar Pradesh", "UP"],
    occupations: ["ANY", "Student"],
    maxIncome: 300000,
    categories: ["ANY"],
    requiredDocs: {
      en: ["Uttar Pradesh Domicile Certificate", "Parents' Income certificate (< ₹3 Lakh)", "Girl child Birth Certificate", "Aadhaar of Mother and Father"],
      hi: ["उत्तर प्रदेश निवास प्रमाण पत्र", "माता-पिता का आय प्रमाण पत्र (< ₹3 लाख)", "बालिका का जन्म प्रमाण पत्र", "माता और पिता के आधार कार्ड"]
    }
  },
  {
    id: "lpy-rajasthan",
    name: {
      en: "Lado Protsahan Yojana (Rajasthan)",
      hi: "लाडो प्रोत्साहन योजना (राजस्थान)"
    },
    description: {
      en: "Rajasthan state welfare initiative targeting low-income families, providing economic support upon the birth of a girl child to protect child education.",
      hi: "कमजोर आय वर्ग के परिवारों में बेटी के जन्म पर बालिका शिक्षा को बढ़ावा देने और आर्थिक मदद प्रदान करने की राजस्थान सरकार की पहल।"
    },
    benefit: {
      en: "A savings bond of ₹1,00,000 issued at birth which matures into a cash grant on completing secondary education and turning 21.",
      hi: "बेटी के जन्म पर ₹1,00,000 का बचत बांड, जो माध्यमिक शिक्षा पूरी होने और 21 वर्ष की आयु होने पर परिपक्व होकर नकद अनुदान बनता है।"
    },
    department: {
      en: "Department of Women & Child Development, Rajasthan",
      hi: "महिला एवं बाल विकास विभाग, राजस्थान"
    },
    minAge: 0,
    maxAge: 18,
    gender: "FEMALE",
    states: ["Rajasthan"],
    occupations: ["ANY"],
    maxIncome: 200000,
    categories: ["ANY"],
    requiredDocs: {
      en: ["Rajasthan Domicile / Jan Aadhaar Card", "Ration Card copy", "BPL Status certificate (if applicable)", "Hospital birth certificate"],
      hi: ["राजस्थान मूल निवास / जन आधार कार्ड", "राशन कार्ड की प्रति", "बीपीएल श्रेणी प्रमाण पत्र (यदि लागू हो)", "अस्पताल का जन्म प्रमाण पत्र"]
    }
  },
  {
    id: "ladli-behna",
    name: {
      en: "Mukhyamantri Ladli Behna Yojana (MP)",
      hi: "मुख्यमंत्री लाड़ली बहना योजना (मध्य प्रदेश)"
    },
    description: {
      en: "Madhya Pradesh state flagship program aimed at enhancing self-reliance, nutritious levels, and health rights of married women.",
      hi: "मध्य प्रदेश की विवाहित महिलाओं की आत्मनिर्भरता, पोषण स्तर और स्वास्थ्य अधिकारों में सुधार के लिए शुरू की गई प्रमुख योजना।"
    },
    benefit: {
      en: "Direct benefit transfer of ₹1,250 deposited monthly directly into active bank accounts.",
      hi: "प्रति माह ₹1,250 की प्रत्यक्ष सामाजिक सहायता सीधे सक्रिय बैंक खातों में जमा की जाती है।"
    },
    department: {
      en: "Women and Child Development Department, Madhya Pradesh",
      hi: "महिला एवं बाल विकास विभाग, मध्य प्रदेश"
    },
    minAge: 21,
    maxAge: 60,
    gender: "FEMALE",
    states: ["Madhya Pradesh", "MP"],
    occupations: ["ANY", "Housewife"],
    maxIncome: 250000,
    categories: ["ANY"],
    requiredDocs: {
      en: ["Samagra ID code of family", "Madhya Pradesh Local Residence Certificate", "Active bank passbook copy with e-KYC linked"],
      hi: ["परिवार की समग्र आईडी", "मध्य प्रदेश मूल निवास प्रमाण पत्र", "ई-केवाईसी लिंक्ड सक्रिय बैंक पासबुक की प्रति"]
    }
  }
];

export default function EligibilityChecker({ onApplyForScheme }: EligibilityCheckerProps) {
  const { language } = useLanguage();

  // Inputs state
  const [age, setAge] = useState<number | "">("");
  const [state, setState] = useState<string>("All");
  const [gender, setGender] = useState<"ANY" | "MALE" | "FEMALE">("ANY");
  const [occupation, setOccupation] = useState<string>("All");
  const [income, setIncome] = useState<number | "">("");
  const [category, setCategory] = useState<string>("All");

  const [hasChecked, setHasChecked] = useState(false);
  const [matchingSchemes, setMatchingSchemes] = useState<Scheme[]>([]);

  const statesList = [
    "All", "Karnataka", "Uttar Pradesh", "Madhya Pradesh", "Rajasthan", "Delhi", "Maharashtra", "Tamil Nadu", "Bihar", "West Bengal", "Gujarat"
  ];

  const occupationsList = [
    "All", "Student", "Farmer", "Unorganized Worker", "Labourer", "Vendor", "Serviceman", "Self Employed", "Unemployed"
  ];

  const categoriesList = [
    "All", "General", "OBC", "SC", "ST", "EWS"
  ];

  const handleClear = () => {
    setAge("");
    setState("All");
    setGender("ANY");
    setOccupation("All");
    setIncome("");
    setCategory("All");
    setHasChecked(false);
    setMatchingSchemes([]);
  };

  const handleCheck = (e: React.FormEvent) => {
    e.preventDefault();

    const userAge = Number(age) || 0;
    const userIncome = Number(income) || 0;

    const filtered = SCHEMES_DATABASE.filter((scheme) => {
      // 1. Age condition
      if (userAge < scheme.minAge || userAge > scheme.maxAge) return false;

      // 2. Gender condition
      if (scheme.gender !== "ANY" && gender !== "ANY" && scheme.gender !== gender) {
        return false;
      }

      // 3. State condition
      const hasSpecificState = !scheme.states.includes("ANY");
      if (hasSpecificState && state !== "All") {
        const matchesSpecificState = scheme.states.some(
          (s) => s.toLowerCase() === state.toLowerCase() || (state === "Uttar Pradesh" && s === "UP") || (state === "Madhya Pradesh" && s === "MP")
        );
        if (!matchesSpecificState) return false;
      }

      // 4. Occupation condition
      const hasSpecificOcc = !scheme.occupations.includes("ANY");
      if (hasSpecificOcc && occupation !== "All") {
        const matchesSpecificOcc = scheme.occupations.some(
          (o) => o.toLowerCase() === occupation.toLowerCase() || (occupation === "Unorganized Worker" && (o === "Labourer" || o === "Construction Worker" || o === "Vendor" || o === "Driver"))
        );
        if (!matchesSpecificOcc) return false;
      }

      // 5. Income condition
      if (scheme.maxIncome > 0 && userIncome > scheme.maxIncome) {
        return false;
      }

      // 6. Social Category condition
      const hasSpecificCat = !scheme.categories.includes("ANY");
      if (hasSpecificCat && category !== "All") {
        const matchesSpecificCat = scheme.categories.some(
          (c) => c.toLowerCase() === category.toLowerCase()
        );
        if (!matchesSpecificCat) return false;
      }

      return true;
    });

    setMatchingSchemes(filtered);
    setHasChecked(true);
  };

  return (
    <div className="bg-white border border-gray-150 rounded-2xl p-5 md:p-6 shadow-sm space-y-6 animate-fade-in" id="eligibility-checker-tool">
      
      {/* Header section */}
      <div className="border-b border-gray-100 pb-4 space-y-1">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-orange-100 flex items-center justify-center text-orange-600">
            <Award className="w-5 h-5" />
          </div>
          <h2 className="font-extrabold text-slate-900 text-lg tracking-tight font-sans">
            {language === "hi" ? "स्मार्ट राष्ट्रीय पात्रता कैलकुलेटर" : "Smart National Eligibility Checker"}
          </h2>
        </div>
        <p className="text-xs text-slate-500 max-w-2xl leading-relaxed">
          {language === "hi" 
            ? "अपनी जनसांख्यिकीय जानकारी दर्ज करें और तुरंत वे सभी सरकारी योजनाएं और सब्सिडी देखें जिनके लिए आप या आपके माता-पिता पात्र हैं।" 
            : "Declare your demographic profile parameters below to instantly evaluate and filter matches among central and state social protection programs."}
        </p>
      </div>

      {/* Inputs Form */}
      <form onSubmit={handleCheck} className="space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          
          {/* Age field */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-700 block select-none">
              {language === "hi" ? "आवेदक की आयु (वर्षों में)" : "Applicant's Age (in years)"} *
            </label>
            <input 
              type="number"
              placeholder={language === "hi" ? "जैसे: 24" : "e.g. 24"}
              required
              value={age}
              onChange={(e) => setAge(e.target.value === "" ? "" : Number(e.target.value))}
              min="0"
              max="120"
              className="w-full bg-slate-50 border border-gray-350 focus:border-orange-550 rounded-xl px-3 py-2.5 text-xs font-sans outline-none text-slate-800"
            />
          </div>

          {/* Resident State select */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-700 block select-none">
              {language === "hi" ? "निवास का राज्य" : "Resident Indian State"}
            </label>
            <select
              value={state}
              onChange={(e) => setState(e.target.value)}
              className="w-full bg-slate-50 border border-gray-350 focus:border-orange-550 rounded-xl px-3 py-2.5 text-xs font-sans outline-none text-slate-800 cursor-pointer"
            >
              {statesList.map((st) => (
                <option key={st} value={st}>
                  {st === "All" ? (language === "hi" ? "सभी राज्य" : "All States") : st}
                </option>
              ))}
            </select>
          </div>

          {/* Gender select */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-700 block select-none">
              {language === "hi" ? "आवेदक का लिंग" : "Applicant's Gender"}
            </label>
            <div className="grid grid-cols-3 gap-1 bg-slate-100 rounded-xl p-1 text-[10.5px]">
              <button
                type="button"
                onClick={() => setGender("ANY")}
                className={`py-2 rounded-lg font-bold transition ${gender === "ANY" ? "bg-white text-slate-900 shadow-xs" : "text-slate-500"}`}
              >
                {language === "hi" ? "सभी" : "All"}
              </button>
              <button
                type="button"
                onClick={() => setGender("MALE")}
                className={`py-2 rounded-lg font-bold transition ${gender === "MALE" ? "bg-white text-slate-900 shadow-xs" : "text-slate-505"}`}
              >
                {language === "hi" ? "पुरुष" : "Male"}
              </button>
              <button
                type="button"
                onClick={() => setGender("FEMALE")}
                className={`py-2 rounded-lg font-bold transition ${gender === "FEMALE" ? "bg-white text-slate-900 shadow-xs" : "text-slate-505"}`}
              >
                {language === "hi" ? "महिला" : "Female"}
              </button>
            </div>
          </div>

          {/* Primary Occupation select */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-700 block select-none">
              {language === "hi" ? "मुख्य व्यवसाय / काम" : "Primary Occupation"}
            </label>
            <select
              value={occupation}
              onChange={(e) => setOccupation(e.target.value)}
              className="w-full bg-slate-50 border border-gray-350 focus:border-orange-550 rounded-xl px-3 py-2.5 text-xs font-sans outline-none text-slate-800 cursor-pointer"
            >
              {occupationsList.map((occ) => (
                <option key={occ} value={occ}>
                  {occ === "All" 
                    ? (language === "hi" ? "सभी व्यवसाय" : "All Occupations") 
                    : occ === "Student" ? (language === "hi" ? "छात्र" : "Student")
                    : occ === "Farmer" ? (language === "hi" ? "किसान" : "Farmer")
                    : occ === "Unorganized Worker" ? (language === "hi" ? "असंगठित मजदूर" : "Unorganized Worker")
                    : occ === "Labourer" ? (language === "hi" ? "दैनिक मजदूर" : "Labourer")
                    : occ === "Vendor" ? (language === "hi" ? "रेहड़ी-पटरी वाला" : "Vendor")
                    : occ === "Serviceman" ? (language === "hi" ? "सरकारी/निजी सेवा" : "Serviceman")
                    : occ === "Self Employed" ? (language === "hi" ? "स्व-नियोजित" : "Self Employed")
                    : occ === "Unemployed" ? (language === "hi" ? "बेरोजगार" : "Unemployed")
                    : occ}
                </option>
              ))}
            </select>
          </div>

          {/* Household Annual Income */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-700 block select-none">
              {language === "hi" ? "वार्षिक सकल पारिवारिक आय (₹)" : "Household Annual Gross Income (₹)"}
            </label>
            <div className="relative">
              <span className="absolute left-3 top-2.5 text-xs font-bold text-gray-400">₹</span>
              <input 
                type="number"
                placeholder={language === "hi" ? "जैसे: 1,50,050" : "e.g. 150000"}
                value={income}
                onChange={(e) => setIncome(e.target.value === "" ? "" : Number(e.target.value))}
                min="0"
                className="w-full bg-slate-50 border border-gray-350 focus:border-orange-550 rounded-xl pl-6 pr-3 py-2.5 text-xs font-sans outline-none text-slate-800"
              />
            </div>
          </div>

          {/* Social Category select */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-700 block select-none">
              {language === "hi" ? "सामाजिक वर्ग श्रेणी" : "Social Category"}
            </label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full bg-slate-50 border border-gray-350 focus:border-orange-550 rounded-xl px-3 py-2.5 text-xs font-sans outline-none text-slate-800 cursor-pointer"
            >
              {categoriesList.map((cat) => (
                <option key={cat} value={cat}>
                  {cat === "All" ? (language === "hi" ? "सभी वर्ग" : "All Categories") : cat}
                </option>
              ))}
            </select>
          </div>

        </div>

        {/* Action Buttons */}
        <div className="pt-2 flex justify-end gap-3 select-none">
          <button
            type="button"
            onClick={handleClear}
            className="px-4 py-2.5 hover:bg-slate-100 border border-gray-200 text-slate-705 font-bold rounded-xl text-xs transition cursor-pointer"
          >
            {language === "hi" ? "साफ़ करें" : "Reset Form"}
          </button>
          <button
            type="submit"
            className="px-5 py-2.5 bg-orange-600 hover:bg-orange-750 text-white font-bold rounded-xl text-xs transition cursor-pointer flex items-center gap-1.5 border-0"
          >
            <UserCheck className="w-4 h-4 text-white" />
            {language === "hi" ? "पात्रता जाँचें" : "Check Eligibility"}
          </button>
        </div>
      </form>

      {/* Results Display */}
      {hasChecked && (
        <div className="space-y-4 pt-4 border-t border-dashed border-gray-250 animate-fade-in" id="eligibility-results">
          
          <div className="flex items-center justify-between">
            <h3 className="font-extrabold text-slate-900 text-sm font-sans">
              {language === "hi" 
                ? `खोज परिणाम: ${matchingSchemes.length} योजनाएं योग्य पाई गईं` 
                : `Matched Result: Found ${matchingSchemes.length} Eligible Scheme(s)`}
            </h3>
            <span className="text-[10px] font-bold font-mono text-emerald-600 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-100">
              {language === "hi" ? "परिशुद्धता परिणाम" : "Live Matches Checked"}
            </span>
          </div>

          {matchingSchemes.length === 0 ? (
            <div className="p-8 text-center rounded-2xl border border-dashed border-gray-200 bg-slate-50 text-slate-500 space-y-2">
              <BadgeAlert className="w-8 h-8 text-amber-500 mx-auto" />
              <p className="font-bold text-xs">{language === "hi" ? "कोई योजना मेल नहीं खाई" : "No Precise Match Found"}</p>
              <p className="text-[11px] max-w-sm mx-auto leading-relaxed">
                {language === "hi"
                  ? "आपके दर्ज आंकड़ों के आधार पर कोई विशिष्ट लाभ नहीं मिला। कृपया आयु बढ़ाएं या सकल वार्षिक आय सीमा को कम करके पुन: प्रयास करें।"
                  : "We couldn't locate specific programmatic allocations matching your exact declarations. Try scaling down annual income thresholds or updating occupations."}
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {matchingSchemes.map((scheme) => (
                <div 
                  key={scheme.id}
                  className="bg-slate-50/50 border border-gray-200 hover:border-orange-200 hover:bg-orange-50/10 rounded-2xl p-4 flex flex-col justify-between space-y-4 transition"
                >
                  <div className="space-y-2.5">
                    
                    {/* Upper row */}
                    <div className="flex justify-between items-start gap-2">
                      <span className="bg-orange-50 text-orange-700 font-bold font-mono text-[9.5px] px-2 py-0.5 rounded border border-orange-100 uppercase">
                        {scheme.id.toUpperCase()}
                      </span>
                      <span className="text-[9px] font-mono text-slate-400 block max-w-[150px] truncate text-right">
                        {language === "hi" ? scheme.department.hi : scheme.department.en}
                      </span>
                    </div>

                    {/* Title & description */}
                    <div className="space-y-1">
                      <h4 className="font-extrabold text-slate-900 text-xs sm:text-sm font-sans leading-tight">
                        {language === "hi" ? scheme.name.hi : scheme.name.en}
                      </h4>
                      <p className="text-xs text-slate-505 leading-relaxed font-sans font-normal">
                        {language === "hi" ? scheme.description.hi : scheme.description.en}
                      </p>
                    </div>

                    {/* Benefit card */}
                    <div className="p-3 bg-white border border-gray-150 rounded-xl flex items-start gap-2 text-xs">
                      <IndianRupee className="w-4 h-4 text-emerald-600 mt-0.5 shrink-0" />
                      <div>
                        <strong className="text-emerald-700 block text-[10px] font-mono uppercase tracking-neutral-3">{language === "hi" ? "सरकारी लाभ वित्तीय सहायता" : "FINANCIAL SOCIAL BENEFIT"}</strong>
                        <p className="text-slate-700 leading-snug mt-0.5 text-[11px] font-medium">
                          {language === "hi" ? scheme.benefit.hi : scheme.benefit.en}
                        </p>
                      </div>
                    </div>

                    {/* Mandatory documents */}
                    <div className="space-y-1">
                      <span className="text-[9.5px] font-mono font-bold uppercase text-gray-400 tracking-wider block leading-none">
                        {language === "hi" ? "सत्यापन हेतु आवश्यक दस्तावेज:" : "Mandated Verification Documents:"}
                      </span>
                      <div className="flex flex-wrap gap-1.5 pt-1">
                        {(language === "hi" ? scheme.requiredDocs.hi : scheme.requiredDocs.en).map((doc, dIdx) => (
                          <span key={dIdx} className="bg-slate-105 border border-gray-200 text-slate-650 px-2 py-0.8 rounded-lg text-[10px] uppercase font-bold tracking-tight">
                            {doc}
                          </span>
                        ))}
                      </div>
                    </div>

                  </div>

                  {/* Apply actions info */}
                  {scheme.associatedServiceId && (
                    <div className="pt-3 border-t border-dashed border-gray-200 flex items-center justify-between bg-white/40 -mx-4 -mb-4 p-3 rounded-b-2xl">
                      <span className="text-[10px] text-emerald-600 font-bold flex items-center gap-1">
                        <CheckCircle2 className="w-4.5 h-4.5 text-emerald-500" />
                        {language === "hi" ? "इस पोर्टल पर तत्काल आवेदन खोलें!" : "Directly Apply via Portal App"}
                      </span>
                      <button
                        type="button"
                        onClick={() => onApplyForScheme(scheme.associatedServiceId!)}
                        className="px-3.5 py-1.5 bg-slate-900 hover:bg-orange-600 font-bold rounded-lg text-white text-[10.5px] transition hover:scale-103 cursor-pointer select-none border-0"
                      >
                        {language === "hi" ? "आवेदन फॉर्म भरें" : "Apply Now"}
                      </button>
                    </div>
                  )}

                </div>
              ))}
            </div>
          )}

        </div>
      )}

    </div>
  );
}
