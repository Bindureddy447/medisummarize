import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

// Medical term dictionaries for highlighting
const DISEASE_KEYWORDS = [
  'diabetes', 'hypertension', 'cancer', 'stroke', 'infarction', 'pneumonia', 
  'asthma', 'copd', 'heart failure', 'arrhythmia', 'anemia', 'sepsis',
  'tuberculosis', 'hepatitis', 'cirrhosis', 'nephritis', 'alzheimer',
  'parkinson', 'epilepsy', 'seizure', 'dementia', 'nstemi', 'stemi',
  'myocardial infarction', 'coronary artery disease', 'cad', 'ckd',
  'chronic kidney disease', 'malignancy', 'carcinoma', 'tumor', 'lesion'
];

const MEDICATION_KEYWORDS = [
  'aspirin', 'metformin', 'lisinopril', 'atorvastatin', 'metoprolol',
  'amlodipine', 'clopidogrel', 'warfarin', 'heparin', 'insulin',
  'omeprazole', 'gabapentin', 'levetiracetam', 'prednisone', 'acetaminophen',
  'ibuprofen', 'morphine', 'furosemide', 'hydrochlorothiazide', 'losartan',
  'mg daily', 'mg twice', 'mg once', 'tablets', 'capsules'
];

const TEST_KEYWORDS = [
  'ct scan', 'mri', 'x-ray', 'ecg', 'ekg', 'eeg', 'ultrasound',
  'biopsy', 'blood test', 'urinalysis', 'cbc', 'bmp', 'cmp',
  'lipid panel', 'a1c', 'hba1c', 'troponin', 'bnp', 'creatinine',
  'bun', 'egfr', 'pft', 'stress test', 'angiogram', 'catheterization',
  'pet scan', 'mammogram', 'colonoscopy', 'endoscopy'
];

const SEVERITY_KEYWORDS = {
  high: ['icu', 'critical', 'emergency', 'code blue', 'arrest', 'hemorrhage', 
         'septic shock', 'respiratory failure', 'intubated', 'ventilator',
         'unstable', 'acute', 'severe', 'malignant', 'metastatic', 'urgent'],
  medium: ['moderate', 'concerning', 'elevated', 'abnormal', 'follow-up required',
           'monitoring', 'worrisome', 'suspicious', 'significant'],
  low: ['stable', 'normal', 'unremarkable', 'within normal limits', 'mild',
        'controlled', 'improved', 'resolving', 'benign']
};

const DEPARTMENT_KEYWORDS: Record<string, string[]> = {
  'Cardiology': ['heart', 'cardiac', 'coronary', 'ecg', 'stent', 'arrhythmia', 'pacemaker', 'myocardial'],
  'Neurology': ['brain', 'seizure', 'stroke', 'neurological', 'eeg', 'dementia', 'neuropathy'],
  'Oncology': ['cancer', 'tumor', 'malignant', 'chemotherapy', 'radiation', 'oncology', 'biopsy'],
  'Pulmonology': ['lung', 'respiratory', 'pulmonary', 'asthma', 'copd', 'pneumonia', 'bronch'],
  'Nephrology': ['kidney', 'renal', 'dialysis', 'creatinine', 'nephro', 'ckd', 'egfr'],
  'Endocrinology': ['diabetes', 'thyroid', 'hormone', 'insulin', 'a1c', 'metabolic'],
  'Gastroenterology': ['liver', 'stomach', 'intestine', 'gastro', 'hepatic', 'gi ', 'bowel'],
  'Orthopedics': ['bone', 'fracture', 'joint', 'spine', 'orthopedic', 'musculoskeletal']
};

const ABBREVIATIONS: Record<string, string> = {
  'BP': 'Blood Pressure',
  'HR': 'Heart Rate',
  'RR': 'Respiratory Rate',
  'ECG': 'Electrocardiogram',
  'EKG': 'Electrocardiogram',
  'EEG': 'Electroencephalogram',
  'CT': 'Computed Tomography',
  'MRI': 'Magnetic Resonance Imaging',
  'CBC': 'Complete Blood Count',
  'BMP': 'Basic Metabolic Panel',
  'CMP': 'Comprehensive Metabolic Panel',
  'BUN': 'Blood Urea Nitrogen',
  'eGFR': 'Estimated Glomerular Filtration Rate',
  'A1C': 'Hemoglobin A1C (Glycated Hemoglobin)',
  'HbA1c': 'Hemoglobin A1C',
  'LDL': 'Low-Density Lipoprotein',
  'HDL': 'High-Density Lipoprotein',
  'TIA': 'Transient Ischemic Attack',
  'CVA': 'Cerebrovascular Accident (Stroke)',
  'MI': 'Myocardial Infarction (Heart Attack)',
  'NSTEMI': 'Non-ST Elevation Myocardial Infarction',
  'STEMI': 'ST Elevation Myocardial Infarction',
  'CHF': 'Congestive Heart Failure',
  'COPD': 'Chronic Obstructive Pulmonary Disease',
  'CKD': 'Chronic Kidney Disease',
  'CAD': 'Coronary Artery Disease',
  'DVT': 'Deep Vein Thrombosis',
  'PE': 'Pulmonary Embolism',
  'UTI': 'Urinary Tract Infection',
  'PCI': 'Percutaneous Coronary Intervention',
  'CABG': 'Coronary Artery Bypass Grafting',
  'PRN': 'As Needed (Pro Re Nata)',
  'BID': 'Twice Daily',
  'TID': 'Three Times Daily',
  'QID': 'Four Times Daily',
  'PO': 'By Mouth (Per Os)',
  'IV': 'Intravenous',
  'IM': 'Intramuscular',
  'SC': 'Subcutaneous',
  'NPO': 'Nothing By Mouth',
  'SOB': 'Shortness of Breath',
  'DOE': 'Dyspnea on Exertion',
  'WNL': 'Within Normal Limits',
  'NAD': 'No Acute Distress',
  'ROS': 'Review of Systems',
  'HPI': 'History of Present Illness',
  'PMH': 'Past Medical History',
  'FH': 'Family History',
  'SH': 'Social History',
  'CC': 'Chief Complaint',
  'Dx': 'Diagnosis',
  'Rx': 'Prescription/Treatment',
  'Tx': 'Treatment',
  'Hx': 'History',
  'Sx': 'Symptoms',
  'Px': 'Prognosis',
  'ICU': 'Intensive Care Unit',
  'ED': 'Emergency Department',
  'OR': 'Operating Room',
  'OPD': 'Outpatient Department'
};

const DRUG_INTERACTIONS: Record<string, string[]> = {
  'aspirin': ['warfarin', 'heparin', 'clopidogrel', 'ibuprofen'],
  'warfarin': ['aspirin', 'ibuprofen', 'vitamin k', 'nsaid'],
  'metformin': ['contrast dye', 'alcohol'],
  'lisinopril': ['potassium', 'spironolactone', 'nsaid'],
  'metoprolol': ['verapamil', 'diltiazem', 'clonidine']
};

function extractHighlightedTerms(text: string) {
  const textLower = text.toLowerCase();
  
  const diseases = DISEASE_KEYWORDS.filter(d => textLower.includes(d.toLowerCase()));
  const medications = MEDICATION_KEYWORDS.filter(m => textLower.includes(m.toLowerCase()));
  const tests = TEST_KEYWORDS.filter(t => textLower.includes(t.toLowerCase()));
  
  return { diseases, medications, tests };
}

function calculateSeverity(text: string): { level: 'low' | 'medium' | 'high', score: number, indicators: string[] } {
  const textLower = text.toLowerCase();
  let score = 0;
  const indicators: string[] = [];
  
  SEVERITY_KEYWORDS.high.forEach(keyword => {
    if (textLower.includes(keyword)) {
      score += 3;
      indicators.push(keyword);
    }
  });
  
  SEVERITY_KEYWORDS.medium.forEach(keyword => {
    if (textLower.includes(keyword)) {
      score += 2;
      indicators.push(keyword);
    }
  });
  
  SEVERITY_KEYWORDS.low.forEach(keyword => {
    if (textLower.includes(keyword)) {
      score += 0.5;
    }
  });
  
  const level = score >= 6 ? 'high' : score >= 3 ? 'medium' : 'low';
  return { level, score, indicators: indicators.slice(0, 5) };
}

function extractDates(text: string): { type: string, date: string }[] {
  const datePatterns = [
    { pattern: /(?:admission|admitted)[:\s]*(\d{1,2}\/\d{1,2}\/\d{2,4})/gi, type: 'Admission' },
    { pattern: /(?:discharge|discharged)[:\s]*(\d{1,2}\/\d{1,2}\/\d{2,4})/gi, type: 'Discharge' },
    { pattern: /date of admission[:\s]*(\d{1,2}\/\d{1,2}\/\d{2,4})/gi, type: 'Admission' },
    { pattern: /date of discharge[:\s]*(\d{1,2}\/\d{1,2}\/\d{2,4})/gi, type: 'Discharge' },
    { pattern: /(?:procedure|surgery|operation)[:\s]*(?:on\s+)?(\d{1,2}\/\d{1,2}\/\d{2,4})/gi, type: 'Procedure' },
    { pattern: /follow[- ]?up[:\s]*(?:in\s+)?(\d+\s+(?:days?|weeks?|months?))/gi, type: 'Follow-up' },
    { pattern: /(\d{1,2}\/\d{1,2}\/\d{2,4})/g, type: 'Date mentioned' }
  ];
  
  const dates: { type: string, date: string }[] = [];
  
  datePatterns.forEach(({ pattern, type }) => {
    let match: RegExpExecArray | null;
    while ((match = pattern.exec(text)) !== null) {
      const matchedDate = match[1];
      if (!dates.find(d => d.date === matchedDate && d.type === type)) {
        dates.push({ type, date: matchedDate });
      }
    }
  });
  
  return dates.slice(0, 10);
}

function detectDepartment(text: string): string {
  const textLower = text.toLowerCase();
  const scores: Record<string, number> = {};
  
  Object.entries(DEPARTMENT_KEYWORDS).forEach(([dept, keywords]) => {
    scores[dept] = keywords.filter(k => textLower.includes(k)).length;
  });
  
  const maxDept = Object.entries(scores).reduce((a, b) => a[1] > b[1] ? a : b);
  return maxDept[1] > 0 ? maxDept[0] : 'General Medicine';
}

function findAbbreviations(text: string): { abbr: string, full: string }[] {
  const found: { abbr: string, full: string }[] = [];
  
  Object.entries(ABBREVIATIONS).forEach(([abbr, full]) => {
    const regex = new RegExp(`\\b${abbr}\\b`, 'gi');
    if (regex.test(text)) {
      found.push({ abbr, full });
    }
  });
  
  return found;
}

function checkDrugInteractions(medications: string[]): { drug1: string, drug2: string, warning: string }[] {
  const warnings: { drug1: string, drug2: string, warning: string }[] = [];
  const medsLower = medications.map(m => m.toLowerCase());
  
  Object.entries(DRUG_INTERACTIONS).forEach(([drug, interactions]) => {
    if (medsLower.some(m => m.includes(drug))) {
      interactions.forEach(interacting => {
        if (medsLower.some(m => m.includes(interacting))) {
          warnings.push({
            drug1: drug,
            drug2: interacting,
            warning: `Potential interaction between ${drug} and ${interacting}. Consult with healthcare provider.`
          });
        }
      });
    }
  });
  
  // Check for duplicate medications
  const medCounts: Record<string, number> = {};
  medsLower.forEach(m => {
    const baseMed = m.split(' ')[0];
    medCounts[baseMed] = (medCounts[baseMed] || 0) + 1;
  });
  
  Object.entries(medCounts).forEach(([med, count]) => {
    if (count > 1) {
      warnings.push({
        drug1: med,
        drug2: med,
        warning: `${med} appears to be listed ${count} times. Verify dosage and frequency.`
      });
    }
  });
  
  return warnings;
}

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { documentText, questionQuery } = await req.json();
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    
    if (!LOVABLE_API_KEY) {
      throw new Error("LOVABLE_API_KEY is not configured");
    }

    // Extract local analysis first
    const highlightedTerms = extractHighlightedTerms(documentText);
    const severity = calculateSeverity(documentText);
    const timeline = extractDates(documentText);
    const department = detectDepartment(documentText);
    const abbreviations = findAbbreviations(documentText);
    const drugWarnings = checkDrugInteractions(highlightedTerms.medications);

    // If this is a Q&A query, handle separately
    if (questionQuery) {
      console.log("Processing Q&A query:", questionQuery);
      
      const qaResponse = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${LOVABLE_API_KEY}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model: "google/gemini-3-flash-preview",
          messages: [
            {
              role: "system",
              content: `You are a medical document assistant. Answer questions ONLY based on the provided clinical document. 
If the information is not in the document, say "This information is not available in the document."
Keep answers concise but complete. Use bullet points for lists.`
            },
            {
              role: "user",
              content: `Clinical Document:\n${documentText}\n\nQuestion: ${questionQuery}`
            }
          ]
        }),
      });

      if (!qaResponse.ok) {
        const errorText = await qaResponse.text();
        console.error("AI gateway error:", qaResponse.status, errorText);
        throw new Error("Failed to get answer from AI");
      }

      const qaData = await qaResponse.json();
      const answer = qaData.choices?.[0]?.message?.content || "Unable to answer this question.";
      
      return new Response(JSON.stringify({ answer }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Main document analysis using AI
    console.log("Analyzing document with AI...");
    
    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-3-flash-preview",
        messages: [
          {
            role: "system",
            content: `You are an expert medical document analyzer for a Clinical Document Summarization system. 
Analyze the provided clinical document and extract structured information.
You MUST respond with valid JSON only, no markdown or explanations.`
          },
          {
            role: "user",
            content: `Analyze this clinical document and provide a JSON response with these exact fields:
{
  "clinicalSummary": "A comprehensive 2-3 paragraph clinical summary for healthcare professionals",
  "patientSummary": "A simplified 2-3 paragraph explanation that a patient can understand, avoiding medical jargon",
  "emergencySummary": "A one-line emergency summary with the most critical information",
  "keyFindings": ["array of 4-6 key clinical findings"],
  "medications": ["array of all medications with dosages mentioned"],
  "followUpInstructions": ["array of follow-up instructions and appointments"],
  "diagnoses": ["array of diagnoses mentioned"],
  "vitalSigns": {"any vital signs found as key-value pairs"},
  "procedures": ["any procedures performed"]
}

Document:
${documentText}`
          }
        ]
      }),
    });

    if (!response.ok) {
      if (response.status === 429) {
        return new Response(JSON.stringify({ error: "Rate limit exceeded. Please try again later." }), {
          status: 429,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      if (response.status === 402) {
        return new Response(JSON.stringify({ error: "Service quota exceeded. Please try again later." }), {
          status: 402,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      const errorText = await response.text();
      console.error("AI gateway error:", response.status, errorText);
      throw new Error("AI analysis failed");
    }

    const aiData = await response.json();
    let aiAnalysis;
    
    try {
      const content = aiData.choices?.[0]?.message?.content || "{}";
      // Remove markdown code blocks if present
      const cleanedContent = content.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();
      aiAnalysis = JSON.parse(cleanedContent);
    } catch (e) {
      console.error("Failed to parse AI response:", e);
      aiAnalysis = {
        clinicalSummary: "Analysis completed. Please review the document details below.",
        patientSummary: "Your medical document has been analyzed. Please review the findings with your healthcare provider.",
        emergencySummary: "Medical document analyzed - review findings below",
        keyFindings: [],
        medications: [],
        followUpInstructions: [],
        diagnoses: [],
        vitalSigns: {},
        procedures: []
      };
    }

    // Combine AI analysis with local processing
    const result = {
      // AI-generated summaries
      summaries: {
        clinical: aiAnalysis.clinicalSummary,
        patient: aiAnalysis.patientSummary,
        emergency: aiAnalysis.emergencySummary
      },
      
      // Key findings and medical info
      keyFindings: aiAnalysis.keyFindings || [],
      medications: aiAnalysis.medications || highlightedTerms.medications,
      followUpInstructions: aiAnalysis.followUpInstructions || [],
      diagnoses: aiAnalysis.diagnoses || [],
      procedures: aiAnalysis.procedures || [],
      vitalSigns: aiAnalysis.vitalSigns || {},
      
      // Local processing results
      highlightedTerms,
      severity,
      timeline,
      department,
      abbreviations,
      drugWarnings,
      
      // Metadata
      analyzedAt: new Date().toISOString()
    };

    console.log("Analysis complete:", JSON.stringify(result).slice(0, 500) + "...");
    
    return new Response(JSON.stringify(result), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (e) {
    console.error("analyze-document error:", e);
    return new Response(JSON.stringify({ 
      error: e instanceof Error ? e.message : "Unknown error occurred" 
    }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
