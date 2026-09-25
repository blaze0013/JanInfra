const fs = require('fs');

const en = require('../src/messages/en.json');
const hi = require('../src/messages/hi.json');

// Citizen
en.citizen.reference = "Reference";
hi.citizen.reference = "संदर्भ";
en.citizen.category = "Category";
hi.citizen.category = "श्रेणी";
en.citizen.date = "Date";
hi.citizen.date = "दिनांक";
en.citizen.status = "Status";
hi.citizen.status = "स्थिति";
en.citizen.action = "Action";
hi.citizen.action = "कार्रवाई";
en.citizen.view = "View";
hi.citizen.view = "देखें";
en.citizen.noRequests = "You haven't submitted any requests yet.";
hi.citizen.noRequests = "आपने अभी तक कोई अनुरोध प्रस्तुत नहीं किया है।";

// Analyst
en.analyst.state = "State";
hi.analyst.state = "राज्य";
en.analyst.allStates = "All States";
hi.analyst.allStates = "सभी राज्य";
en.analyst.district = "District";
hi.analyst.district = "जिला";
en.analyst.allDistricts = "All Districts";
hi.analyst.allDistricts = "सभी जिले";
en.analyst.activeHotspots = "Active Hotspots";
hi.analyst.activeHotspots = "सक्रिय हॉटस्पॉट";
en.analyst.highGapAreas = "High-Gap Areas";
hi.analyst.highGapAreas = "उच्च-अंतराल क्षेत्र";
en.analyst.activeGovtProjects = "Active Govt Projects";
hi.analyst.activeGovtProjects = "सक्रिय सरकारी परियोजनाएं";
en.analyst.populationAffected = "Population Affected";
hi.analyst.populationAffected = "प्रभावित जनसंख्या";
en.analyst.criticalAnalysis = "Critical Analysis (Major Reported Problems)";
hi.analyst.criticalAnalysis = "महत्वपूर्ण विश्लेषण (प्रमुख सूचित समस्याएं)";
en.analyst.severityLabel = "Severity: ";
hi.analyst.severityLabel = "गंभीरता: ";
en.analyst.locationLabel = "Location: ";
hi.analyst.locationLabel = "स्थान: ";
en.analyst.noProblems = "No major problems or alerts.";
hi.analyst.noProblems = "कोई बड़ी समस्या या अलर्ट नहीं।";
en.analyst.requestsList = "Requests List";
hi.analyst.requestsList = "अनुरोध सूची";
en.analyst.noRequests = "No requests in this region.";
hi.analyst.noRequests = "इस क्षेत्र में कोई अनुरोध नहीं।";
en.analyst.reference = "Reference";
hi.analyst.reference = "संदर्भ";
en.analyst.geography = "Geography";
hi.analyst.geography = "भूगोल";
en.analyst.downloadReport = "Download Report";
hi.analyst.downloadReport = "रिपोर्ट डाउनलोड करें";

// Admin
en.admin.totalIssues = "Total Issues";
hi.admin.totalIssues = "कुल मुद्दे";
en.admin.issuesSolved = "Issues Solved";
hi.admin.issuesSolved = "मुद्दे हल हो गए";
en.admin.issuesBeingSolved = "Issues Currently Being Solved";
hi.admin.issuesBeingSolved = "मुद्दे वर्तमान में हल किए जा रहे हैं";
en.admin.currentlyBeingSolved = "Currently Being Solved";
hi.admin.currentlyBeingSolved = "वर्तमान में हल किया जा रहा है";
en.admin.noDescription = "No description provided.";
hi.admin.noDescription = "कोई विवरण नहीं दिया गया।";
en.admin.locationLabel = "Location: ";
hi.admin.locationLabel = "स्थान: ";
en.admin.downloadPdf = "Download PDF Report";
hi.admin.downloadPdf = "पीडीएफ रिपोर्ट डाउनलोड करें";

en.admin.importNewDataset = "Import New Dataset";
hi.admin.importNewDataset = "नया डेटासेट आयात करें";
en.admin.datasetType = "Dataset Type";
hi.admin.datasetType = "डेटासेट प्रकार";
en.admin.sourceName = "Source Name";
hi.admin.sourceName = "स्रोत का नाम";
en.admin.fileCsv = "File (CSV)";
hi.admin.fileCsv = "फ़ाइल (CSV)";
en.admin.uploadProcess = "Upload & Process";
hi.admin.uploadProcess = "अपलोड और प्रोसेस करें";
en.admin.importHistory = "Import History";
hi.admin.importHistory = "आयात इतिहास";
en.admin.rows = "Rows";
hi.admin.rows = "पंक्तियाँ";
en.admin.date = "Date";
hi.admin.date = "दिनांक";
en.admin.status = "Status";
hi.admin.status = "स्थिति";
en.admin.infraType = "Infrastructure Indicators (CSV)";
hi.admin.infraType = "बुनियादी ढांचा संकेतक (CSV)";
en.admin.govtType = "Government Projects (CSV)";
hi.admin.govtType = "सरकारी परियोजनाएं (CSV)";

// Layout & Menu
en.citizen.title = "JanInfra Insight - Citizen";
hi.citizen.title = "जन-इन्फ्रा इनसाइट - नागरिक";
en.analyst.demandSupply = "Demand vs Supply";
hi.analyst.demandSupply = "मांग बनाम आपूर्ति";
en.analyst.demandTrends = "Demand Trends";
hi.analyst.demandTrends = "मांग के रुझान";
en.analyst.scenarioAnalysis = "Scenario Analysis";
hi.analyst.scenarioAnalysis = "परिदृश्य विश्लेषण";

en.submit.textInput = "Text Input";
hi.submit.textInput = "पाठ इनपुट";
en.submit.voiceRecord = "Voice Record";
hi.submit.voiceRecord = "आवाज़ रिकॉर्ड करें";
en.submit.transcript = "Transcript (You can edit before submitting)";
hi.submit.transcript = "ट्रांसक्रिप्ट (आप सबमिट करने से पहले संपादित कर सकते हैं)";

en.common = {
  profile: "Profile",
  settings: "Settings",
  signOut: "Sign out"
};
hi.common = {
  profile: "प्रोफ़ाइल",
  settings: "सेटिंग्स",
  signOut: "लॉग आउट"
};

en.requestDetail = {
  notFound: "Request not found or you don't have permission.",
  requestTitle: "Request",
  submittedOn: "Submitted on",
  originalSubmission: "Original Submission",
  voiceUnavailable: "Voice request (transcript not available)",
  category: "Category",
  uncategorized: "Uncategorized",
  severity: "Severity",
  location: "Location",
  language: "Language",
  aiSummary: "AI Summary",
  actionStatus: "Action Status",
  resolvedMsg: "This request has been resolved. You can download the full action report below.",
  processingMsg: "This request is currently being processed. You can download the interim action report below.",
  downloadPdf: "Download PDF Report"
};
hi.requestDetail = {
  notFound: "अनुरोध नहीं मिला या आपके पास अनुमति नहीं है।",
  requestTitle: "अनुरोध",
  submittedOn: "प्रस्तुत किया गया",
  originalSubmission: "मूल प्रस्तुतीकरण",
  voiceUnavailable: "ध्वनि अनुरोध (प्रतिलेख उपलब्ध नहीं)",
  category: "श्रेणी",
  uncategorized: "अवर्गीकृत",
  severity: "गंभीरता",
  location: "स्थान",
  language: "भाषा",
  aiSummary: "एआई सारांश",
  actionStatus: "कार्रवाई की स्थिति",
  resolvedMsg: "यह अनुरोध हल कर दिया गया है। आप नीचे पूरी कार्रवाई रिपोर्ट डाउनलोड कर सकते हैं।",
  processingMsg: "यह अनुरोध वर्तमान में संसाधित किया जा रहा है। आप नीचे अंतरिम कार्रवाई रिपोर्ट डाउनलोड कर सकते हैं।",
  downloadPdf: "पीडीएफ रिपोर्ट डाउनलोड करें"
};

en.settings = {
  title: "Settings",
  langPref: "Language Preferences",
  save: "Save",
  langHelp: "Changes the UI language globally across all dashboards.",
  notifications: "Notifications",
  emailAlerts: "Email Alerts",
  smsAlerts: "SMS Alerts"
};
hi.settings = {
  title: "सेटिंग्स",
  langPref: "भाषा प्राथमिकताएँ",
  save: "सहेजें",
  langHelp: "सभी डैशबोर्ड में UI भाषा को विश्व स्तर पर बदलता है।",
  notifications: "सूचनाएं",
  emailAlerts: "ईमेल अलर्ट",
  smsAlerts: "एसएमएस अलर्ट"
};

en.profile = {
  title: "User Profile",
  username: "Username",
  email: "Email Address",
  role: "Role",
  idVerification: "ID Verification",
  verified: "Verified ✓",
  na: "N/A"
};
hi.profile = {
  title: "उपयोगकर्ता प्रोफ़ाइल",
  username: "उपयोगकर्ता नाम",
  email: "ईमेल पता",
  role: "भूमिका",
  idVerification: "आईडी सत्यापन",
  verified: "सत्यापित ✓",
  na: "लागू नहीं"
};

en.analyst.state = "State";
hi.analyst.state = "राज्य";
en.analyst.allStates = "All States";
hi.analyst.allStates = "सभी राज्य";
en.analyst.district = "District";
hi.analyst.district = "जिला";
en.analyst.allDistricts = "All Districts";
hi.analyst.allDistricts = "सभी जिले";
en.analyst.activeHotspots = "Active Hotspots";
hi.analyst.activeHotspots = "सक्रिय हॉटस्पॉट";
en.analyst.highGapAreas = "High-Gap Areas";
hi.analyst.highGapAreas = "उच्च-अंतराल क्षेत्र";
en.analyst.activeGovtProjects = "Active Govt Projects";
hi.analyst.activeGovtProjects = "सक्रिय सरकारी परियोजनाएं";
en.analyst.populationAffected = "Population Affected";
hi.analyst.populationAffected = "प्रभावित जनसंख्या";
en.analyst.criticalAnalysis = "Critical Analysis (Major Reported Problems)";
hi.analyst.criticalAnalysis = "महत्वपूर्ण विश्लेषण (प्रमुख रिपोर्ट की गई समस्याएँ)";
en.analyst.severityLabel = "Severity: ";
hi.analyst.severityLabel = "गंभीरता: ";
en.analyst.noProblems = "No major problems or alerts.";
hi.analyst.noProblems = "कोई बड़ी समस्या या अलर्ट नहीं।";
en.analyst.requestsList = "Requests List";
hi.analyst.requestsList = "अनुरोध सूची";
en.analyst.noRequests = "No requests in this region.";
hi.analyst.noRequests = "इस क्षेत्र में कोई अनुरोध नहीं।";
en.analyst.downloadReport = "Download Report";
hi.analyst.downloadReport = "रिपोर्ट डाउनलोड करें";

en.demandSupply = {
  title: "Demand vs Supply Analysis",
  filterByDistrict: "Filter by District",
  allDistricts: "All Districts",
  analyze: "Analyze",
  citizenDemand: "Citizen Demand",
  totalCitizenRequests: "Total Citizen Requests",
  uniqueCitizens: "Unique Citizens",
  avgSeverity: "Average Severity",
  infraSupply: "Infrastructure Supply (Projects)",
  matchingProjects: "Matching Govt Projects",
  active: "Active",
  planned: "Planned",
  completed: "Completed",
  totalInvestment: "Total Investment",
  dataUnavailable: "Investment data unavailable.",
  planningGap: "Planning Gap Analysis",
  gapWarning: "High citizen demand exists, but no relevant government project was found in the available dataset. This represents a potential planning gap."
};
hi.demandSupply = {
  title: "मांग बनाम आपूर्ति विश्लेषण",
  filterByDistrict: "जिले के अनुसार फ़िल्टर करें",
  allDistricts: "सभी जिले",
  analyze: "विश्लेषण करें",
  citizenDemand: "नागरिक मांग",
  totalCitizenRequests: "कुल नागरिक अनुरोध",
  uniqueCitizens: "अद्वितीय नागरिक",
  avgSeverity: "औसत गंभीरता",
  infraSupply: "बुनियादी ढांचा आपूर्ति (परियोजनाएं)",
  matchingProjects: "मिलान सरकारी परियोजनाएं",
  active: "सक्रिय",
  planned: "नियोजित",
  completed: "पूरा",
  totalInvestment: "कुल निवेश",
  dataUnavailable: "निवेश डेटा अनुपलब्ध है।",
  planningGap: "योजना अंतराल विश्लेषण",
  gapWarning: "उच्च नागरिक मांग मौजूद है, लेकिन उपलब्ध डेटासेट में कोई प्रासंगिक सरकारी परियोजना नहीं मिली। यह एक संभावित योजना अंतराल का प्रतिनिधित्व करता है।"
};

en.scenarios = {
  title: "Scenario & What-If Analysis",
  warning: "Scenario analysis — does not modify the official/default score.",
  warningDesc: "Use this tool to adjust analytical weighting parameters and simulate how priority scores would change under different policy focuses (e.g., Demand vs. Infrastructure Gap).",
  createScenario: "Create Scenario",
  scenarioName: "Scenario Name",
  demandWeight: "Demand Weight (%)",
  infraWeight: "Infra Gap Weight (%)",
  severityWeight: "Severity Weight (%)",
  simulate: "Simulate Score",
  savedScenarios: "Saved Scenarios",
  noScenarios: "No scenarios saved yet.",
  demand: "Demand",
  infra: "Infra",
  severity: "Severity",
  applyFilter: "Apply Filter"
};
hi.scenarios = {
  title: "परिदृश्य और क्या-अगर विश्लेषण",
  warning: "परिदृश्य विश्लेषण - आधिकारिक/डिफ़ॉल्ट स्कोर को संशोधित नहीं करता है।",
  warningDesc: "विभिन्न नीतिगत फ़ोकस के तहत प्राथमिकता स्कोर कैसे बदलेंगे, इसका अनुकरण करने के लिए इस टूल का उपयोग करें।",
  createScenario: "परिदृश्य बनाएँ",
  scenarioName: "परिदृश्य का नाम",
  demandWeight: "मांग वजन (%)",
  infraWeight: "इंफ्रा गैप वजन (%)",
  severityWeight: "गंभीरता वजन (%)",
  simulate: "स्कोर अनुकरण करें",
  savedScenarios: "सहेजे गए परिदृश्य",
  noScenarios: "अभी तक कोई परिदृश्य नहीं सहेजा गया है।",
  demand: "मांग",
  infra: "इंफ्रा",
  severity: "गंभीरता",
  applyFilter: "फ़िल्टर लागू करें"
};

en.trends = {
  title: "Demand Trends & Deduplication",
  requestVolume: "Request Volume (Last 30 Days)",
  newRequests: "new requests",
  trend: "Trend: ",
  categoryGrowth: "Category Growth",
  uncategorized: "Uncategorized",
  duplicateAnalysis: "Duplicate vs Distributed Demand Analysis",
  duplicateDesc: "This analytical layer groups similar requests to distinguish between repeated submissions and distributed geographic demand. Original records are preserved.",
  noDuplicates: "No duplicate groups identified in the current period."
};
hi.trends = {
  title: "मांग के रुझान और डिडुप्लीकेशन",
  requestVolume: "अनुरोध मात्रा (पिछले 30 दिन)",
  newRequests: "नए अनुरोध",
  trend: "रुझान: ",
  categoryGrowth: "श्रेणी वृद्धि",
  uncategorized: "अवर्गीकृत",
  duplicateAnalysis: "डुप्लिकेट बनाम वितरित मांग विश्लेषण",
  duplicateDesc: "यह विश्लेषणात्मक परत बार-बार सबमिशन और वितरित भौगोलिक मांग के बीच अंतर करने के लिए समान अनुरोधों को समूहित करती है। मूल रिकॉर्ड संरक्षित हैं।",
  noDuplicates: "वर्तमान अवधि में कोई डुप्लिकेट समूह नहीं पहचाने गए।"
};

en.hotspotDetail = {
  hotspot: "Hotspot: ",
  analyticalScore: "Analytical Priority Score",
  demand: "Demand",
  totalRequests: "Total Requests",
  uniqueCitizens: "Unique Citizens",
  avgSeverity: "Avg Severity",
  demandScore: "Demand Score",
  infraGap: "Infrastructure Gap",
  infraUnavail: "Infrastructure indicator unavailable.",
  infraGapScore: "Infra Gap Score",
  scoreBreakdown: "Score Breakdown",
  severity: "Severity",
  priorityScore: "Priority Score",
  notOfficial: "Not an official government ranking.",
  govtPlans: "Government Plans",
  noMatch: "No matching government project found in imported dataset.",
  projectName: "Project Name",
  status: "Status",
  budget: "Budget",
  source: "Source"
};
hi.hotspotDetail = {
  hotspot: "हॉटस्पॉट: ",
  analyticalScore: "विश्लेषणात्मक प्राथमिकता स्कोर",
  demand: "मांग",
  totalRequests: "कुल अनुरोध",
  uniqueCitizens: "अद्वितीय नागरिक",
  avgSeverity: "औसत गंभीरता",
  demandScore: "मांग स्कोर",
  infraGap: "बुनियादी ढांचा अंतराल",
  infraUnavail: "बुनियादी ढांचा संकेतक अनुपलब्ध है।",
  infraGapScore: "इंफ्रा गैप स्कोर",
  scoreBreakdown: "स्कोर ब्रेकडाउन",
  severity: "गंभीरता",
  priorityScore: "प्राथमिकता स्कोर",
  notOfficial: "आधिकारिक सरकारी रैंकिंग नहीं।",
  govtPlans: "सरकारी योजनाएं",
  noMatch: "आयातित डेटासेट में कोई मिलान सरकारी परियोजना नहीं मिली।",
  projectName: "परियोजना का नाम",
  status: "स्थिति",
  budget: "बजट",
  source: "स्रोत"
};

en.analystRequests = {
  title: "All Requests",
  reference: "Reference",
  location: "Location",
  category: "Category",
  severity: "Severity",
  status: "Status",
  action: "Action",
  review: "Review"
};
hi.analystRequests = {
  title: "सभी अनुरोध",
  reference: "संदर्भ",
  location: "स्थान",
  category: "श्रेणी",
  severity: "गंभीरता",
  status: "स्थिति",
  action: "कार्रवाई",
  review: "समीक्षा"
};

en.analystRequestDetail = {
  notFound: "Request not found.",
  reviewReq: "Review Request: ",
  citizenSub: "Citizen Submission",
  originalText: "Original Text",
  noText: "No text provided (voice).",
  location: "Location",
  submitted: "Submitted",
  severity: "Citizen Severity",
  aiAnalysis: "AI Analysis",
  suggCategory: "Suggested Category",
  aiSummary: "AI Summary",
  none: "None",
  humanReview: "⚠️ This request requires human review.",
  analystAction: "Analyst Action",
  overrideCat: "Override Category",
  status: "Status",
  statusOptions: {
    submitted: "Submitted",
    underAnalysis: "Under Analysis",
    reviewed: "Reviewed",
    closed: "Closed"
  },
  analystNotes: "Analyst Notes",
  saveReview: "Save Review"
};
hi.analystRequestDetail = {
  notFound: "अनुरोध नहीं मिला।",
  reviewReq: "समीक्षा अनुरोध: ",
  citizenSub: "नागरिक सबमिशन",
  originalText: "मूल पाठ",
  noText: "कोई पाठ नहीं दिया गया (आवाज)।",
  location: "स्थान",
  submitted: "प्रस्तुत",
  severity: "नागरिक गंभीरता",
  aiAnalysis: "AI विश्लेषण",
  suggCategory: "सुझाई गई श्रेणी",
  aiSummary: "AI सारांश",
  none: "कोई नहीं",
  humanReview: "⚠️ इस अनुरोध के लिए मानवीय समीक्षा की आवश्यकता है।",
  analystAction: "विश्लेषक कार्रवाई",
  overrideCat: "श्रेणी ओवरराइड करें",
  status: "स्थिति",
  statusOptions: {
    submitted: "प्रस्तुत",
    underAnalysis: "विश्लेषण के तहत",
    reviewed: "समीक्षा की गई",
    closed: "बंद"
  },
  analystNotes: "विश्लेषक नोट्स",
  saveReview: "समीक्षा सहेजें"
};

fs.writeFileSync('./src/messages/en.json', JSON.stringify(en, null, 2));
fs.writeFileSync('./src/messages/hi.json', JSON.stringify(hi, null, 2));

const langs = {
  'bn': 'Bengali',
  'mr': 'Marathi',
  'te': 'Telugu',
  'ta': 'Tamil'
};

function traverse(obj, prefix) {
  const result = {};
  for (const key in obj) {
    if (typeof obj[key] === 'string') {
      result[key] = `[${prefix}] ${obj[key]}`;
    } else {
      result[key] = traverse(obj[key], prefix);
    }
  }
  return result;
}

for (const [code, name] of Object.entries(langs)) {
  fs.writeFileSync(`./src/messages/${code}.json`, JSON.stringify(traverse(en, name), null, 2));
}

console.log('Done');
