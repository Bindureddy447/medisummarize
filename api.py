from flask import Flask, request, jsonify
from flask_cors import CORS
import sqlite3
import re
import os

app = Flask(__name__)
CORS(app)

DB_FILE = "summaries.db"

# -------------------- DATABASE --------------------
def init_db():
    conn = sqlite3.connect(DB_FILE)
    cur = conn.cursor()
    cur.execute("""
        CREATE TABLE IF NOT EXISTS summaries (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            document TEXT,
            summary TEXT
        )
    """)
    conn.commit()
    conn.close()

init_db()

# -------------------- MEDICAL ABBREVIATIONS --------------------
ABBREVIATIONS = {
    "TIA": "Transient Ischemic Attack",
    "CAD": "Coronary Artery Disease",
    "HTN": "Hypertension",
    "DM": "Diabetes Mellitus",
    "MI": "Myocardial Infarction",
    "NSTEMI": "Non-ST Elevation Myocardial Infarction",
    "STEMI": "ST Elevation Myocardial Infarction",
    "CKD": "Chronic Kidney Disease",
    "COPD": "Chronic Obstructive Pulmonary Disease",
    "CHF": "Congestive Heart Failure",
    "CVA": "Cerebrovascular Accident"
}

MEDICATIONS = [
    "aspirin", "atorvastatin", "metformin",
    "insulin", "clopidogrel", "heparin"
]

# -------------------- NLP LOGIC --------------------
def analyze_document(text: str):
    found_abbr = {}
    detected_diseases = []
    meds = []

    for abbr, full in ABBREVIATIONS.items():
        if re.search(rf"\b{abbr}\b", text, re.IGNORECASE):
            found_abbr[abbr] = full
            detected_diseases.append(full)

    for med in MEDICATIONS:
        if re.search(rf"\b{med}\b", text, re.IGNORECASE):
            meds.append(med.capitalize())

    summary = (
        f"Patient with {', '.join(detected_diseases)}. "
        f"Medications include {', '.join(meds)}."
        if detected_diseases or meds
        else "Unable to extract meaningful clinical information."
    )

    return {
        "summary": summary,
        "detected_diseases": detected_diseases,
        "medications": meds,
        "expanded_abbreviations": found_abbr
    }

# -------------------- ROUTES --------------------
@app.route("/", methods=["GET"])
def home():
    return jsonify({
        "status": "OK",
        "message": "Clinical Document Summarizer API is running",
        "endpoint": "/summarize (POST)"
    })

@app.route("/summarize", methods=["POST"])
def summarize():
    data = request.get_json()
    if not data or "document" not in data:
        return jsonify({"error": "Document text is required"}), 400

    document = data["document"]
    analysis = analyze_document(document)

    conn = sqlite3.connect(DB_FILE)
    cur = conn.cursor()
    cur.execute(
        "INSERT INTO summaries (document, summary) VALUES (?, ?)",
        (document, analysis["summary"])
    )
    conn.commit()
    conn.close()

    return jsonify({
        "analysis": analysis,
        "abbreviation_reference": ABBREVIATIONS
    })

# -------------------- RUN --------------------
if __name__ == "__main__":
    app.run(debug=True, port=5000)
