import { useState } from 'react';
import { SummaryData } from '@/components/SummaryResults';
import { useToast } from '@/hooks/use-toast';

// Mock summarization function - In production, this would call an actual LLM API
const mockSummarize = async (text: string): Promise<SummaryData> => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 2000));
  
  // Extract patterns from the document
  const hasMedications = text.toLowerCase().includes('medication') || 
                         text.toLowerCase().includes('mg') ||
                         text.toLowerCase().includes('daily');
  
  const hasFollowUp = text.toLowerCase().includes('follow-up') || 
                      text.toLowerCase().includes('follow up') ||
                      text.toLowerCase().includes('return');
  
  const isDischarge = text.toLowerCase().includes('discharge');
  const isRadiology = text.toLowerCase().includes('ct ') || 
                      text.toLowerCase().includes('mri') ||
                      text.toLowerCase().includes('x-ray') ||
                      text.toLowerCase().includes('findings:');
  const isLab = text.toLowerCase().includes('laboratory') || 
                text.toLowerCase().includes('mg/dl') ||
                text.toLowerCase().includes('reference:');
  
  // Generate contextual summary based on document type
  let summary = '';
  let keyFindings: string[] = [];
  let medications: string[] = [];
  let followUpInstructions: string[] = [];
  let patientFriendlyExplanation = '';
  
  if (isDischarge) {
    summary = "Patient was hospitalized for cardiac-related symptoms and underwent successful intervention. The clinical course was uncomplicated with stable vital signs at discharge. The patient is being discharged with appropriate medications and follow-up care plan.";
    keyFindings = [
      "Primary diagnosis identified and treated during hospitalization",
      "Intervention performed successfully without complications",
      "Patient stable and meeting discharge criteria",
      "Multiple comorbidities being managed with medication adjustments"
    ];
    medications = [
      "Aspirin 81mg - Take once daily, continue indefinitely for heart protection",
      "Clopidogrel 75mg - Take once daily for 12 months (blood thinner)",
      "Metoprolol succinate 50mg - Take once daily (heart rate control)",
      "Lisinopril 10mg - Take once daily (blood pressure)",
      "Atorvastatin 80mg - Take at bedtime (cholesterol)"
    ];
    followUpInstructions = [
      "Schedule cardiology follow-up within 2 weeks",
      "See primary care physician within 1 week",
      "Attend cardiac rehabilitation sessions as scheduled",
      "Return to emergency department for chest pain, shortness of breath, or palpitations",
      "Follow low-sodium, heart-healthy diet",
      "Avoid heavy lifting and strenuous activity for 2 weeks"
    ];
    patientFriendlyExplanation = "You were in the hospital because of problems with blood flow to your heart. The doctors performed a procedure to open a blocked artery and placed a small mesh tube (stent) to keep it open. You're now going home with new medications that are very important to take every day. These medications help protect your heart and prevent future problems. Make sure to see your heart doctor and regular doctor soon, eat healthy foods with less salt, and take it easy for a couple of weeks. If you have any chest pain or trouble breathing, come back to the hospital right away.";
  } else if (isRadiology) {
    summary = "Imaging study reveals significant findings requiring further evaluation and specialist consultation. The study identifies areas of concern that warrant additional diagnostic workup and clinical correlation.";
    keyFindings = [
      "Abnormal findings identified on imaging requiring follow-up",
      "Additional nodules or lesions noted requiring monitoring",
      "Lymph node findings may indicate need for further evaluation",
      "No acute life-threatening findings identified"
    ];
    medications = [];
    followUpInstructions = [
      "Urgent referral to specialist recommended",
      "Additional imaging studies may be required",
      "Biopsy may be needed for definitive diagnosis",
      "Close follow-up with ordering physician essential"
    ];
    patientFriendlyExplanation = "Your scan showed some spots that the doctors want to look at more closely. This doesn't automatically mean something serious, but it's important to follow up with the specialist doctors your physician is referring you to. They may want to do more tests to get a clearer picture of what's going on. Try not to worry too much while waiting for your appointments - your medical team is working on getting you the answers you need.";
  } else if (isLab) {
    summary = "Laboratory results indicate abnormalities in multiple metabolic parameters requiring clinical attention and potential treatment adjustments. Key findings suggest need for monitoring of kidney function and metabolic control.";
    keyFindings = [
      "Blood sugar levels indicate need for diabetes management optimization",
      "Kidney function tests show mild impairment requiring monitoring",
      "Cholesterol levels elevated, increasing cardiovascular risk",
      "Electrolyte levels require monitoring"
    ];
    medications = [
      "Current diabetes medications may need adjustment",
      "Consider statin therapy optimization for cholesterol",
      "Renal-protective medications may be indicated"
    ];
    followUpInstructions = [
      "Follow up with primary care to discuss results",
      "Repeat labs in 3 months to monitor trends",
      "Consider referral to endocrinology for diabetes optimization",
      "Consider nephrology referral for kidney monitoring",
      "Dietary modifications recommended"
    ];
    patientFriendlyExplanation = "Your blood tests show a few things we need to work on together. Your blood sugar and diabetes control need some attention - we may need to adjust your medications or diet. Your kidney tests are a little off, which sometimes happens with diabetes, so we'll keep a close eye on that. Your cholesterol is also higher than we'd like, which can affect your heart health. The good news is these are all things we can manage with the right treatment and lifestyle changes. Let's schedule a follow-up to talk about next steps.";
  } else {
    summary = "Clinical documentation has been analyzed. The document contains relevant medical information including patient history, examination findings, and clinical recommendations that require appropriate follow-up.";
    keyFindings = [
      "Clinical findings documented requiring attention",
      "Assessment and plan outlined by treating physician",
      "Relevant medical history and examination noted"
    ];
    medications = hasMedications ? ["Medications mentioned in document - see original for details"] : [];
    followUpInstructions = hasFollowUp ? [
      "Follow-up appointments recommended as specified",
      "Continue current treatment plan unless otherwise directed"
    ] : [];
    patientFriendlyExplanation = "This is a summary of your medical document. It contains important information about your health that your doctors have documented. Please review the key points above and make sure to follow any instructions given. If you have questions about anything in this document, don't hesitate to ask your healthcare provider for clarification.";
  }
  
  return {
    summary,
    keyFindings,
    medications,
    followUpInstructions,
    patientFriendlyExplanation
  };
};

export const useSummarize = () => {
  const [isProcessing, setIsProcessing] = useState(false);
  const [summaryData, setSummaryData] = useState<SummaryData | null>(null);
  const { toast } = useToast();

  const summarize = async (documentText: string) => {
    if (!documentText.trim()) {
      toast({
        title: "No content",
        description: "Please provide document text to summarize.",
        variant: "destructive"
      });
      return;
    }

    setIsProcessing(true);
    setSummaryData(null);

    try {
      const result = await mockSummarize(documentText);
      setSummaryData(result);
      toast({
        title: "Summary generated",
        description: "Your document has been analyzed successfully."
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to generate summary. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsProcessing(false);
    }
  };

  const reset = () => {
    setSummaryData(null);
  };

  return {
    isProcessing,
    summaryData,
    summarize,
    reset
  };
};
