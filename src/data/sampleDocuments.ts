export interface SampleDocument {
  id: string;
  title: string;
  type: 'discharge' | 'radiology' | 'lab' | 'consultation';
  content: string;
}

export const sampleDocuments: SampleDocument[] = [
  {
    id: 'discharge-1',
    title: 'Hospital Discharge Summary',
    type: 'discharge',
    content: `DISCHARGE SUMMARY

Patient Name: [De-identified]
Medical Record Number: [De-identified]
Date of Admission: 01/15/2024
Date of Discharge: 01/22/2024
Attending Physician: Dr. [De-identified]

CHIEF COMPLAINT:
Chest pain and shortness of breath for 3 days.

HISTORY OF PRESENT ILLNESS:
This is a 65-year-old male with a past medical history of hypertension, type 2 diabetes mellitus, and hyperlipidemia who presented to the emergency department with substernal chest pain radiating to the left arm, associated with diaphoresis and shortness of breath. The pain started 3 days prior to admission and progressively worsened. Patient denied any nausea, vomiting, or syncope.

HOSPITAL COURSE:
Patient was admitted to the Cardiac Care Unit. Initial troponin was elevated at 0.45 ng/mL. ECG showed ST-segment depression in leads V4-V6. Patient was started on dual antiplatelet therapy with aspirin 325mg and clopidogrel 75mg. Cardiac catheterization performed on hospital day 2 revealed 85% stenosis of the left anterior descending artery. Successful percutaneous coronary intervention was performed with drug-eluting stent placement. Post-procedure course was uncomplicated.

DISCHARGE DIAGNOSES:
1. Non-ST elevation myocardial infarction (NSTEMI)
2. Coronary artery disease, single vessel
3. Hypertension, controlled
4. Type 2 diabetes mellitus
5. Hyperlipidemia

DISCHARGE MEDICATIONS:
1. Aspirin 81mg daily - continue indefinitely
2. Clopidogrel 75mg daily - continue for 12 months
3. Metoprolol succinate 50mg daily
4. Lisinopril 10mg daily
5. Atorvastatin 80mg at bedtime
6. Metformin 1000mg twice daily with meals

FOLLOW-UP INSTRUCTIONS:
1. Follow up with Cardiology in 2 weeks
2. Follow up with Primary Care Physician in 1 week
3. Cardiac rehabilitation referral placed
4. Return to ED if experiencing chest pain, shortness of breath, or palpitations
5. Low sodium, heart-healthy diet
6. No heavy lifting or strenuous activity for 2 weeks`
  },
  {
    id: 'radiology-1',
    title: 'CT Chest Report',
    type: 'radiology',
    content: `RADIOLOGY REPORT

CT CHEST WITH CONTRAST

CLINICAL INDICATION: Persistent cough and weight loss. Evaluate for pulmonary pathology.

TECHNIQUE: Helical CT of the chest was performed following IV administration of 100mL of Omnipaque 350 contrast material. Axial images were obtained from the thoracic inlet to the adrenal glands with multiplanar reformations.

COMPARISON: Chest X-ray dated 12/01/2023

FINDINGS:

LUNGS AND AIRWAYS:
- A 2.3 x 1.8 cm spiculated nodule is identified in the right upper lobe. This finding is new compared to prior imaging and is suspicious for primary lung malignancy.
- Multiple sub-centimeter nodules are present in both lungs, the largest measuring 6mm in the left lower lobe. These are indeterminate and may represent metastatic disease versus granulomatous disease.
- No evidence of pulmonary embolism.
- Airways are patent without evidence of endobronchial lesion.

PLEURA:
- Small right pleural effusion measuring approximately 50mL.
- No pneumothorax.

MEDIASTINUM:
- Enlarged right hilar lymph node measuring 1.5 cm (short axis). Additional subcarinal lymph node measuring 1.2 cm.
- Heart size is normal. No pericardial effusion.
- Thoracic aorta is normal in caliber without evidence of aneurysm or dissection.

CHEST WALL:
- No suspicious bone lesions.
- Mild degenerative changes of the thoracic spine.

UPPER ABDOMEN (INCLUDED PORTIONS):
- Liver, spleen, and bilateral adrenal glands appear unremarkable.

IMPRESSION:
1. 2.3 cm spiculated nodule in the right upper lobe, highly suspicious for primary lung malignancy. Recommend PET-CT for staging and tissue sampling.
2. Multiple bilateral pulmonary nodules, indeterminate. May represent metastatic disease.
3. Right hilar and subcarinal lymphadenopathy, concerning for nodal involvement.
4. Small right pleural effusion.

RECOMMENDATION: Urgent referral to Pulmonology and Oncology. PET-CT and biopsy recommended.`
  },
  {
    id: 'lab-1',
    title: 'Comprehensive Metabolic Panel',
    type: 'lab',
    content: `LABORATORY REPORT

COMPREHENSIVE METABOLIC PANEL (CMP)

Collection Date/Time: 01/20/2024 07:30 AM
Specimen Type: Serum
Ordering Physician: Dr. [De-identified]

RESULTS:

GLUCOSE AND KIDNEY FUNCTION:
Glucose, Fasting: 142 mg/dL (H) [Reference: 70-100 mg/dL]
BUN (Blood Urea Nitrogen): 28 mg/dL (H) [Reference: 7-20 mg/dL]
Creatinine: 1.4 mg/dL (H) [Reference: 0.7-1.3 mg/dL]
eGFR: 52 mL/min/1.73m² [Reference: >60 mL/min/1.73m²]
BUN/Creatinine Ratio: 20 [Reference: 10-20]

ELECTROLYTES:
Sodium: 138 mEq/L [Reference: 136-145 mEq/L]
Potassium: 5.2 mEq/L (H) [Reference: 3.5-5.0 mEq/L]
Chloride: 102 mEq/L [Reference: 98-106 mEq/L]
CO2 (Bicarbonate): 22 mEq/L [Reference: 23-29 mEq/L]
Calcium: 9.2 mg/dL [Reference: 8.5-10.5 mg/dL]

LIVER FUNCTION:
Total Protein: 7.1 g/dL [Reference: 6.0-8.3 g/dL]
Albumin: 3.8 g/dL [Reference: 3.5-5.0 g/dL]
Total Bilirubin: 0.8 mg/dL [Reference: 0.1-1.2 mg/dL]
Alkaline Phosphatase: 85 U/L [Reference: 44-147 U/L]
AST (SGOT): 32 U/L [Reference: 10-40 U/L]
ALT (SGPT): 38 U/L [Reference: 7-56 U/L]

HEMOGLOBIN A1C:
HbA1c: 7.8% (H) [Reference: <5.7% Normal, 5.7-6.4% Prediabetes, ≥6.5% Diabetes]

LIPID PANEL:
Total Cholesterol: 212 mg/dL (H) [Reference: <200 mg/dL]
LDL Cholesterol: 142 mg/dL (H) [Reference: <100 mg/dL]
HDL Cholesterol: 38 mg/dL (L) [Reference: >40 mg/dL]
Triglycerides: 178 mg/dL (H) [Reference: <150 mg/dL]

INTERPRETATION:
1. Elevated fasting glucose and HbA1c consistent with poorly controlled Type 2 Diabetes Mellitus
2. Mildly elevated BUN and creatinine with eGFR 52, suggesting Stage 3a Chronic Kidney Disease
3. Borderline elevated potassium - monitor with CKD
4. Dyslipidemia with elevated LDL and triglycerides, low HDL - increased cardiovascular risk
5. Liver function tests within normal limits

RECOMMENDATIONS:
- Consider adjusting diabetes management
- Renal protective measures and close monitoring of kidney function
- Lipid management optimization
- Follow-up with Primary Care and consider Nephrology referral`
  },
  {
    id: 'consultation-1',
    title: 'Neurology Consultation Note',
    type: 'consultation',
    content: `CONSULTATION NOTE

Consulting Service: Neurology
Date of Consultation: 01/18/2024
Requesting Physician: Dr. [De-identified], Internal Medicine

REASON FOR CONSULTATION:
Evaluate for new-onset seizures and altered mental status.

HISTORY OF PRESENT ILLNESS:
The patient is a 72-year-old female with a history of well-controlled hypertension and mild cognitive impairment who was brought to the ED by her family after experiencing a witnessed generalized tonic-clonic seizure lasting approximately 2 minutes with post-ictal confusion lasting 30 minutes. Family reports the patient has been increasingly forgetful over the past 6 months with difficulty managing medications and finances. No prior history of seizures. No recent head trauma. No fever or signs of infection.

PAST MEDICAL HISTORY:
1. Hypertension
2. Mild cognitive impairment diagnosed 1 year ago
3. Osteoarthritis
4. Hyperlipidemia

MEDICATIONS:
1. Amlodipine 5mg daily
2. Atorvastatin 20mg daily
3. Acetaminophen as needed

NEUROLOGICAL EXAMINATION:
- Mental Status: Alert, oriented to person and place, not fully oriented to time. MMSE score 22/30 (baseline was 26/30 six months ago). Difficulty with short-term recall and complex attention tasks.
- Cranial Nerves: II-XII intact
- Motor: 5/5 strength bilateral upper and lower extremities
- Sensory: Intact to light touch and proprioception
- Coordination: Finger-to-nose and heel-to-shin intact
- Reflexes: 2+ symmetric, plantar responses flexor bilaterally
- Gait: Slightly wide-based, mild difficulty with tandem walk

DIAGNOSTIC STUDIES:
- CT Head (non-contrast): Mild generalized cerebral atrophy. No acute intracranial abnormality. No mass or hemorrhage.
- EEG: Diffuse background slowing with intermittent left temporal sharp waves.
- MRI Brain (ordered, pending)
- Basic metabolic panel: Within normal limits
- Complete blood count: Normal

ASSESSMENT:
1. New-onset seizure, likely secondary to underlying neurodegenerative process
2. Progressive cognitive decline - concerning for early Alzheimer's disease versus other dementia
3. EEG findings suggest possible temporal lobe epilepsy

RECOMMENDATIONS:
1. Start Levetiracetam (Keppra) 500mg twice daily for seizure prophylaxis
2. Complete MRI Brain with and without contrast to evaluate for structural abnormalities
3. Neuropsychological testing once stable
4. Consider lumbar puncture for CSF biomarkers if MRI inconclusive
5. Outpatient follow-up in Neurology clinic in 2 weeks
6. Family education regarding seizure precautions
7. Driving restrictions until seizure-free for minimum 6 months per state law

FOLLOW-UP:
Will follow during hospitalization. Available for any questions.`
  }
];

export const getDocumentTypeLabel = (type: SampleDocument['type']): string => {
  const labels = {
    discharge: 'Discharge Summary',
    radiology: 'Radiology Report',
    lab: 'Laboratory Report',
    consultation: 'Consultation Note'
  };
  return labels[type];
};

export const getDocumentTypeColor = (type: SampleDocument['type']): string => {
  const colors = {
    discharge: 'bg-primary/10 text-primary',
    radiology: 'bg-accent/10 text-accent',
    lab: 'bg-success/10 text-success',
    consultation: 'bg-warning/10 text-warning'
  };
  return colors[type];
};
