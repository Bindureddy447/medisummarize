import os
from groq import Groq

# 1. Create Groq client
client = Groq(api_key=os.getenv("GROQ_API_KEY"))

# 2. Function to summarize clinical document
def summarize_clinical_document(document_text):
    response = client.chat.completions.create(
        model="llama-3.1-8b-instant",
        messages=[
            {
                "role": "system",
                "content": (
                    "You are an expert medical document analyzer. "
                    "Respond ONLY with valid JSON."
                )
            },
            {
                "role": "user",
                "content": f"""
Analyze the following clinical document and return JSON with:
- patient_name
- age
- gender
- diagnosis
- symptoms
- medications
- test_results
- summary

Clinical Document:
{document_text}
"""
            }
        ],
        temperature=0.2
    )

    return response.choices[0].message.content


# 3. Test block (this runs only when file is executed)
if __name__ == "__main__":
    sample_document = """
    Patient Name: Ramesh Kumar
    Age: 62
    Gender: Male
    Diagnosis: Transient Ischemic Attack (TIA)
    Symptoms: Sudden weakness, slurred speech
    Medications: Aspirin, Atorvastatin
    CT Scan: No hemorrhage detected
    """

    result = summarize_clinical_document(sample_document)
    print(result)
