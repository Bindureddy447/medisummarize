import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

/* ===================== MEDICAL DICTIONARIES ===================== */

const DISEASE_KEYWORDS = [
  "diabetes", "hypertension", "cancer", "stroke", "infarction",
  "pneumonia", "asthma", "copd", "heart failure", "arrhythmia",
  "anemia", "sepsis", "tuberculosis", "hepatitis", "cirrhosis",
  "nephritis", "alzheimer", "parkinson", "epilepsy", "seizure",
  "dementia", "nstemi", "stemi", "myocardial infarction",
  "coronary artery disease", "cad", "ckd", "chronic kidney disease",
  "malignancy", "carcinoma", "tumor", "lesion",
];

const MEDICATION_KEYWORDS = [
  "aspirin", "metformin", "lisinopril", "atorvastatin",
  "metoprolol", "amlodipine", "clopidogrel", "warfarin",
  "heparin", "insulin", "omeprazole", "gabapentin",
  "levetiracetam", "prednisone", "acetaminophen",
  "ibuprofen", "morphine", "furosemide",
];

const TEST_KEYWORDS = [
  "ct scan", "mri", "x-ray", "ecg", "ekg", "eeg",
  "ultrasound", "biopsy", "blood test", "cbc", "bmp",
  "cmp", "lipid panel", "hba1c", "troponin", "bnp",
];

const SEVERITY_KEYWORDS = {
  high: [
    "icu", "critical", "emergency", "arrest",
    "respiratory failure", "intubated",
  ],
  medium: ["moderate", "abnormal", "elevated"],
  low: ["stable", "normal", "mild"],
};

const ABBREVIATIONS: Record<string, string> = {
  BP: "Blood Pressure",
  HR: "Heart Rate",
  RR: "Respiratory Rate",
  ECG: "Electrocardiogram",
  EKG: "Electrocardiogram",
  EEG: "Electroencephalogram",
  CT: "Computed Tomography",
  MRI: "Magnetic Resonance Imaging",
  CBC: "Complete Blood Count",
  BMP: "Basic Metabolic Panel",
  CMP: "Comprehensive Metabolic Panel",
  BUN: "Blood Urea Nitrogen",
  eGFR: "Estimated Glomerular Filtration Rate",
  HbA1c: "Hemoglobin A1C",
  TIA: "Transient Ischemic Attack",
  CVA: "Cerebrovascular Accident",
  MI: "Myocardial Infarction",
  COPD: "Chronic Obstructive Pulmonary Disease",
  CKD: "Chronic Kidney Disease",
  CAD: "Coronary Artery Disease",
  ICU: "Intensive Care Unit",
  ED: "Emergency Department",
};

/* ===================== HELPERS ===================== */

function extractHighlightedTerms(text: string) {
  const t = text.toLowerCase();
  return {
    diseases: DISEASE_KEYWORDS.filter(d => t.includes(d)),
    medications: MEDICATION_KEYWORDS.filter(m => t.includes(m)),
    tests: TEST_KEYWORDS.filter(tk => t.includes(tk)),
  };
}

function calculateSeverity(text: string) {
  const t = text.toLowerCase();
  let score = 0;
  const indicators: string[] = [];

  SEVERITY_KEYWORDS.high.forEach(k => {
    if (t.includes(k)) {
      score += 3;
      indicators.push(k);
    }
  });

  SEVERITY_KEYWORDS.medium.forEach(k => {
    if (t.includes(k)) {
      score += 2;
      indicators.push(k);
    }
  });

  const level = score >= 6 ? "high" : score >= 3 ? "medium" : "low";
  return { level, score, indicators };
}

function findAbbreviations(text: string) {
  return Object.entries(ABBREVIATIONS)
    .filter(([abbr]) => new RegExp(`\\b${abbr}\\b`, "i").test(text))
    .map(([abbr, full]) => ({ abbr, full }));
}

/* ===================== SERVER ===================== */

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { documentText, questionQuery } = await req.json();
    const GROQ_API_KEY = Deno.env.get("GROQ_API_KEY");

    if (!GROQ_API_KEY) {
      throw new Error("GROQ_API_KEY not set");
    }

    const highlightedTerms = extractHighlightedTerms(documentText);
    const severity = calculateSeverity(documentText);
    const abbreviations = findAbbreviations(documentText);

    /* ===================== Q&A MODE ===================== */
    if (questionQuery) {
      const qaRes = await fetch(
        "https://api.groq.com/openai/v1/chat/completions",
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${GROQ_API_KEY}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            model: "llama3-8b-8192",
            messages: [
              {
                role: "system",
                content:
                  "Answer ONLY from the document. If not found, say not available.",
              },
              {
                role: "user",
                content: `Document:\n${documentText}\n\nQuestion:${questionQuery}`,
              },
            ],
            temperature: 0.2,
          }),
        }
      );

      const qaData = await qaRes.json();
      return new Response(
        JSON.stringify({
          answer: qaData.choices?.[0]?.message?.content ?? "",
        }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    /* ===================== MAIN ANALYSIS ===================== */
    const aiRes = await fetch(
      "https://api.groq.com/openai/v1/chat/completions",
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${GROQ_API_KEY}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model: "llama3-8b-8192",
          messages: [
            {
              role: "system",
              content:
                "You are an expert medical document analyzer. Respond ONLY with valid JSON.",
            },
            {
              role: "user",
              content: `Analyze this clinical document and return structured JSON:\n${documentText}`,
            },
          ],
          temperature: 0.2,
        }),
      }
    );

    const aiData = await aiRes.json();
    let parsed = {};

    try {
      parsed = JSON.parse(aiData.choices?.[0]?.message?.content ?? "{}");
    } catch {
      parsed = {};
    }

    return new Response(
      JSON.stringify({
        aiAnalysis: parsed,
        highlightedTerms,
        severity,
        abbreviations,
        analyzedAt: new Date().toISOString(),
      }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (e) {
    return new Response(
      JSON.stringify({ error: e.message }),
      { status: 500, headers: corsHeaders }
    );
  }
});
