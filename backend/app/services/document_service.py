"""
Document Generation Service — 47 document types using Jinja2 templates + ReportLab PDF.
Supports: Employment, Property, Consumer, Criminal, Family, Cyber, RTI, Medical, Environmental.
"""
import io
import json
from datetime import datetime, date
from typing import Optional
import structlog
from jinja2 import Environment, BaseLoader
from app.core.config import settings

logger = structlog.get_logger()

# ──────────────────────────────────────────────────────────
# Jinja2 template strings for each document type
# ──────────────────────────────────────────────────────────
TEMPLATES = {
    "unpaid_salary_notice": """
TO,
The Manager / HR Head,
{{ employer_name }},
{{ employer_address or 'Address as known' }}.

SUB: LEGAL NOTICE — Demand for Payment of Outstanding Wages under Payment of Wages Act 1936, Section 15 & Industrial Disputes Act 1947, Section 33C

Date: {{ today }}

Sir/Madam,

I, {{ employee_name }}, {{ designation }} at your organization, am writing this legal notice to demand payment of outstanding wages amounting to **Rs. {{ amount }}/-** (Rupees {{ amount_words }} Only) for the period of {{ months }} month(s) from {{ start_date or 'the date of employment' }} to {{ end_date or 'date' }}.

Despite repeated verbal and written requests, you have failed to pay the said wages, which is a direct violation of:
1. Payment of Wages Act 1936, Section 3 (Responsibility for Payment)
2. Payment of Wages Act 1936, Section 15 (Authority to hear claims)
3. Minimum Wages Act 1948 (if applicable)

LEGAL CONSEQUENCES OF NON-COMPLIANCE:
Under Section 15 of the Payment of Wages Act 1936, if wages are not paid within the stipulated time, you are liable to pay compensation of up to **20 times** the amount of unpaid wages = Rs. {{ compensation_estimate }}/-

DEMAND: You are hereby required to pay the outstanding amount of Rs. {{ amount }}/- within **15 (Fifteen) days** from the date of receipt of this notice, failing which I shall be constrained to:
a) File a complaint before the Labour Commissioner
b) Institute proceedings before the Labour Court
c) File a police complaint for criminal breach of trust

Yours sincerely,
{{ employee_name }}
Contact: {{ employee_contact }}
Date: {{ today }}

[This notice carries legal weight. Preserve for court records.]
""",

    "wrongful_termination_notice": """
TO,
{{ employer_name }},
{{ employer_address or 'As registered' }}.

SUB: LEGAL NOTICE — Wrongful Termination / Illegal Retrenchment under Industrial Disputes Act 1947

Date: {{ today }}

This notice is issued to you for terminating my services illegally without following due procedure.

I, {{ employee_name }}, was employed as {{ designation }} since {{ joining_date }}, having completed {{ years_of_service }} years of continuous service.

My termination on {{ termination_date }} is ILLEGAL because:
1. No 1-month written notice was given (Industrial Disputes Act 1947, Section 25F)
2. No retrenchment compensation was paid (1 month's wages per year of service)
3. No Form P-1 application was made to Labour Commissioner
4. Mandatory 3-month waiting period was not observed

ENTITLEMENTS DUE (Calculate):
• Notice Pay: Rs. {{ notice_pay }}
• Retrenchment Compensation: Rs. {{ retrenchment_comp }} ({{ years_of_service }} × monthly salary)
• Earned Leave Encashment: Rs. {{ leave_encashment }}
• Gratuity (if > 5 years): Rs. {{ gratuity }}
• PF & ESIC Settlement: As applicable

DEMAND: Pay total Rs. {{ total_dues }}/- within 15 days from receipt of this notice, else I will file a complaint before the Labour Court and pursue criminal action.

{{ employee_name }}
{{ today }}
""",

    "consumer_forum_complaint": """
BEFORE THE DISTRICT CONSUMER DISPUTES REDRESSAL COMMISSION
{{ district }}, {{ state }}

Complaint No.: [To be assigned]
Date: {{ today }}

COMPLAINANT: {{ complainant_name }}, {{ complainant_address }}

VS.

OPPOSITE PARTY: {{ company_name }}, {{ company_address }}

COMPLAINT UNDER CONSUMER PROTECTION ACT 2019, SECTION 35

FACTS OF THE COMPLAINT:
1. The Complainant purchased/availed {{ product_service }} from the Opposite Party on {{ purchase_date }} for Rs. {{ amount }}/-
2. Order/Transaction ID: {{ transaction_id }}
3. Nature of deficiency: {{ issue_description }}

LEGAL GROUNDS:
The Opposite Party has committed:
a) 'Deficiency in Service' as defined under Section 2(11) of Consumer Protection Act 2019
b) 'Unfair Trade Practice' under Section 2(47)

RELIEF SOUGHT:
1. Refund of Rs. {{ amount }}/- with 12% interest from {{ purchase_date }}
2. Compensation for mental agony: Rs. {{ compensation or '10,000' }}/-
3. Litigation costs: Rs. {{ litigation_cost or '5,000' }}/-

DECLARATION: I hereby declare that the facts stated above are true and correct to the best of my knowledge.

{{ complainant_name }}
{{ today }}
""",

    "eviction_reply": """
TO,
{{ landlord_name }},
{{ landlord_address }}.

SUB: REPLY TO ILLEGAL NOTICE OF EVICTION — Tenant Rights under Maharashtra Rent Control Act 1999 / relevant State Rent Act

Date: {{ today }}

I, {{ tenant_name }}, tenant of premises at {{ property_address }}, have received your eviction notice dated {{ notice_date }} and hereby send this LEGAL REPLY:

YOUR NOTICE IS ILLEGAL BECAUSE:
1. Eviction without court order is prohibited — Maharashtra Rent Control Act 1999, Section 16
2. I have been a tenant in good standing since {{ tenancy_start_date }}
3. My rent of Rs. {{ rent_amount }}/- per month is paid regularly
4. The lock-in period as per our agreement extends till {{ lockin_end_date }}

MY RIGHTS AS A TENANT:
• Right to peaceful possession — Transfer of Property Act, Section 108(c)
• Right to 24-hour prior written notice before entry — TPA Section 108
• Protection from forcible eviction — IPC (BNS) Section 329

I WILL NOT VACATE the premises. If you proceed with any coercive action, I will:
1. File an FIR under BNS Section 329 (Trespass)  
2. Apply for injunction before Rent Control Court
3. File complaint with Police Commissioner

{{ tenant_name }}
{{ today }}
""",

    "rti_application": """
TO,
The Central Public Information Officer / State Public Information Officer,
{{ department_name }},
{{ department_address }}.

SUB: APPLICATION UNDER RIGHT TO INFORMATION ACT 2005, SECTION 6

Date: {{ today }}

Name of Applicant: {{ applicant_name }}
Address: {{ applicant_address }}
Contact: {{ applicant_contact }}

I request the following information under RTI Act 2005:

INFORMATION REQUESTED:
{{ information_requested }}

PERIOD: {{ period_from }} to {{ period_to }}

Fee: Rs. 10/- enclosed by IPO/online payment.

If the information is not provided within 30 days from receipt, I will appeal to the Appellate Authority under Section 19 of the RTI Act.

{{ applicant_name }}
{{ today }}
""",
}


def get_supported_doc_types() -> list[dict]:
    """Return all 47 supported document types with metadata."""
    return [
        # Employment
        {"id": "unpaid_salary_notice", "name": "Unpaid Salary Notice", "category": "employment", "act": "Payment of Wages Act 1936"},
        {"id": "wrongful_termination_notice", "name": "Wrongful Termination Notice", "category": "employment", "act": "Industrial Disputes Act 1947"},
        {"id": "gratuity_demand", "name": "Gratuity Demand Notice", "category": "employment", "act": "Payment of Gratuity Act 1972"},
        {"id": "pf_complaint", "name": "PF Non-Deposit EPFO Complaint", "category": "employment", "act": "Employees PF Act 1952"},
        {"id": "maternity_demand", "name": "Maternity Benefit Demand", "category": "employment", "act": "Maternity Benefit Act 1961"},
        {"id": "labour_court_complaint", "name": "Labour Court Complaint", "category": "employment", "act": "Industrial Disputes Act 1947"},
        {"id": "posh_complaint", "name": "POSH Workplace Harassment Complaint", "category": "employment", "act": "POSH Act 2013"},
        {"id": "overtime_demand", "name": "Overtime Payment Demand", "category": "employment", "act": "Factories Act 1948"},
        # Property
        {"id": "eviction_reply", "name": "Illegal Eviction Reply Notice", "category": "property", "act": "Rent Control Act"},
        {"id": "deposit_refund_notice", "name": "Security Deposit Refund Notice", "category": "property", "act": "Transfer of Property Act"},
        {"id": "rera_complaint", "name": "RERA Builder Complaint", "category": "property", "act": "RERA 2016"},
        {"id": "rent_hike_objection", "name": "Illegal Rent Hike Objection", "category": "property", "act": "Rent Control Act"},
        {"id": "tenant_rights_petition", "name": "Tenant Rights Petition", "category": "property", "act": "Transfer of Property Act"},
        {"id": "property_encroachment_notice", "name": "Property Encroachment Notice", "category": "property", "act": "BNS/IPC"},
        {"id": "society_maintenance_demand", "name": "Society Maintenance Demand", "category": "property", "act": "MOFA"},
        # Consumer
        {"id": "consumer_forum_complaint", "name": "Consumer Forum Complaint", "category": "consumer", "act": "Consumer Protection Act 2019"},
        {"id": "ecommerce_refund_demand", "name": "E-Commerce Refund Demand", "category": "consumer", "act": "Consumer Protection Act 2019"},
        {"id": "banking_ombudsman", "name": "Banking Ombudsman Complaint", "category": "consumer", "act": "Banking Regulation Act"},
        {"id": "insurance_rejection_reply", "name": "Insurance Claim Rejection Reply", "category": "consumer", "act": "Insurance Act 1938"},
        {"id": "loan_harassment_complaint", "name": "Loan Recovery Harassment Complaint", "category": "consumer", "act": "RBI Guidelines"},
        {"id": "upi_fraud_complaint", "name": "UPI/Online Fraud Complaint", "category": "consumer", "act": "IT Act 2000"},
        {"id": "cheque_bounce_notice", "name": "Cheque Bounce Notice", "category": "consumer", "act": "NI Act 1881, Section 138"},
        # Criminal
        {"id": "fir_draft_theft", "name": "FIR Draft — Theft/Robbery", "category": "criminal", "act": "BNS 2023"},
        {"id": "fir_draft_cyber", "name": "FIR Draft — Cyber Crime", "category": "criminal", "act": "IT Act 2000"},
        {"id": "police_harassment_complaint", "name": "Police Harassment Complaint", "category": "criminal", "act": "BNSS 2023"},
        {"id": "magistrate_complaint", "name": "Magistrate Complaint (S.156/190)", "category": "criminal", "act": "BNSS 2023"},
        {"id": "bail_application", "name": "Anticipatory Bail Application", "category": "criminal", "act": "BNSS, Section 484"},
        # Family
        {"id": "domestic_violence_notice", "name": "Domestic Violence Notice", "category": "family", "act": "DV Act 2005"},
        {"id": "maintenance_petition", "name": "Maintenance Petition", "category": "family", "act": "Section 125 CrPC/BNSS"},
        {"id": "child_custody_application", "name": "Child Custody Application", "category": "family", "act": "Guardian & Wards Act"},
        {"id": "dowry_harassment_complaint", "name": "Dowry Harassment Complaint", "category": "family", "act": "BNS Section 85"},
        {"id": "divorce_petition", "name": "Mutual Consent Divorce Petition", "category": "family", "act": "Hindu Marriage Act"},
        # Cyber & Digital
        {"id": "dpdp_data_deletion", "name": "DPDP Data Deletion Request", "category": "cyber", "act": "DPDP Act 2023"},
        {"id": "cyberstalking_complaint", "name": "Cyberstalking FIR Draft", "category": "cyber", "act": "IT Act + BNS 79"},
        {"id": "fake_news_defamation", "name": "Online Defamation Notice", "category": "cyber", "act": "BNS Section 356"},
        {"id": "social_media_takedown", "name": "Platform Content Takedown Notice", "category": "cyber", "act": "IT Intermediary Rules"},
        # RTI & Government
        {"id": "rti_application", "name": "RTI Application", "category": "rti", "act": "RTI Act 2005"},
        {"id": "rti_first_appeal", "name": "RTI First Appeal", "category": "rti", "act": "RTI Act, Section 19"},
        {"id": "govt_scheme_complaint", "name": "Government Scheme Complaint", "category": "rti", "act": "CPC 1908"},
        {"id": "writ_petition_226", "name": "High Court Writ Petition (Art.226)", "category": "rti", "act": "Constitution of India"},
        {"id": "mgnrega_wage_demand", "name": "MGNREGA Wage Demand", "category": "rti", "act": "Mahatma Gandhi NREGA"},
        # Medical & Education
        {"id": "medical_negligence_complaint", "name": "Medical Negligence Complaint", "category": "medical", "act": "Consumer Protection Act 2019"},
        {"id": "hospital_discharge_demand", "name": "Hospital Discharge Demand", "category": "medical", "act": "MCI Guidelines"},
        {"id": "college_fee_refund", "name": "College Fee Refund Demand", "category": "medical", "act": "UGC / AICTE Guidelines"},
        {"id": "neet_admission_grievance", "name": "NEET Admission Grievance", "category": "medical", "act": "MCC Guidelines"},
        # Environmental & Land
        {"id": "pollution_complaint", "name": "Pollution/Environmental Complaint", "category": "environmental", "act": "EP Act 1986"},
        {"id": "land_acquisition_objection", "name": "Land Acquisition Objection", "category": "environmental", "act": "LARR Act 2013"},
    ]


async def generate_document(
    doc_type: str,
    form_data: dict,
    language: str = "en",
    conversation_id: Optional[str] = None,
) -> dict:
    """
    Generate a legal document from template + form data.
    Returns: {"content": "...", "title": "...", "doc_type": "...", "word_count": 250}
    """
    template_str = TEMPLATES.get(doc_type)

    # Add computed fields
    form_data["today"] = datetime.now().strftime("%d %B %Y")
    form_data["amount_words"] = _number_to_words(int(form_data.get("amount", 0)))
    if "amount" in form_data:
        form_data["compensation_estimate"] = str(int(float(form_data.get("amount", 0))) * 20)

    if template_str:
        try:
            env = Environment(loader=BaseLoader())
            tmpl = env.from_string(template_str)
            content = tmpl.render(**form_data)
        except Exception as e:
            logger.warning("Template render failed", error=str(e))
            content = _generic_document(doc_type, form_data)
    else:
        # Use Groq to generate document if template not found
        content = await _ai_generate_document(doc_type, form_data, language)

    doc_types = get_supported_doc_types()
    doc_meta = next((d for d in doc_types if d["id"] == doc_type), {})

    return {
        "content": content,
        "title": doc_meta.get("name", doc_type.replace("_", " ").title()),
        "doc_type": doc_type,
        "act": doc_meta.get("act", ""),
        "category": doc_meta.get("category", ""),
        "word_count": len(content.split()),
        "generated_at": datetime.now().isoformat(),
        "language": language,
    }


async def _ai_generate_document(doc_type: str, form_data: dict, language: str) -> str:
    """Use Groq LLM to generate document when template not available."""
    if not settings.GROQ_API_KEY:
        return _generic_document(doc_type, form_data)

    try:
        from groq import AsyncGroq
        client = AsyncGroq(api_key=settings.GROQ_API_KEY)
        prompt = f"""Generate a professional legal notice/document of type '{doc_type}' for India.
Form data: {json.dumps(form_data, indent=2)}
Language: {language}
Include: proper legal citations, demand amount, timeline, consequences of non-compliance.
Format as a formal legal document."""

        resp = await client.chat.completions.create(
            model=settings.GROQ_MODEL,
            messages=[
                {"role": "system", "content": "You are an expert Indian lawyer generating formal legal documents."},
                {"role": "user", "content": prompt},
            ],
            max_tokens=2048,
            temperature=0.2,
        )
        return resp.choices[0].message.content
    except Exception as e:
        logger.warning("AI document generation failed", error=str(e))
        return _generic_document(doc_type, form_data)


def _generic_document(doc_type: str, form_data: dict) -> str:
    today = datetime.now().strftime("%d %B %Y")
    return f"""LEGAL NOTICE
Date: {today}

Type: {doc_type.replace('_', ' ').upper()}

To: {form_data.get('employer_name', form_data.get('landlord_name', form_data.get('company_name', '[Recipient]')))}

Subject: Legal notice as per applicable Indian law.

This serves as formal notice of your legal obligations. Respond within 15 days.

Sender: {form_data.get('employee_name', form_data.get('tenant_name', form_data.get('complainant_name', '[Your Name]')))}
Date: {today}

[Generated by NyayaMitra — Verify with DLSA before sending]
"""


def generate_pdf_bytes(content: str, title: str) -> bytes:
    """Generate PDF from document content using ReportLab."""
    try:
        from reportlab.pdfgen import canvas
        from reportlab.lib.pagesizes import A4
        from reportlab.lib.units import inch
        from reportlab.lib.styles import getSampleStyleSheet
        from reportlab.platypus import SimpleDocTemplate, Paragraph, Spacer
        from reportlab.lib import colors

        buffer = io.BytesIO()
        doc = SimpleDocTemplate(buffer, pagesize=A4,
                                rightMargin=inch, leftMargin=inch,
                                topMargin=inch, bottomMargin=inch)

        styles = getSampleStyleSheet()
        story = []

        # Title
        from reportlab.platypus import Paragraph
        from reportlab.lib.styles import ParagraphStyle
        title_style = ParagraphStyle("Title", parent=styles["Heading1"],
                                      textColor=colors.HexColor("#1a2545"),
                                      fontSize=16, spaceAfter=20, alignment=1)
        story.append(Paragraph(title, title_style))
        story.append(Spacer(1, 0.3 * inch))

        # NyayaMitra header
        header_style = ParagraphStyle("Header", parent=styles["Normal"],
                                       fontSize=8, textColor=colors.HexColor("#ff9933"),
                                       alignment=1)
        story.append(Paragraph("Generated by NyayaMitra — AI Legal Justice Platform | nyayamitra.in", header_style))
        story.append(Spacer(1, 0.3 * inch))

        # Content
        body_style = ParagraphStyle("Body", parent=styles["Normal"],
                                     fontSize=11, leading=16, spaceAfter=8)
        for line in content.split("\n"):
            line = line.strip()
            if line:
                para_text = line.replace("**", "<b>").replace("**", "</b>")
                story.append(Paragraph(para_text, body_style))
            else:
                story.append(Spacer(1, 0.1 * inch))

        # Footer
        footer_style = ParagraphStyle("Footer", parent=styles["Normal"],
                                       fontSize=8, textColor=colors.grey, alignment=1)
        story.append(Spacer(1, 0.5 * inch))
        story.append(Paragraph(
            "⚠ This document is AI-generated. Have it reviewed by a lawyer before submission. "
            "Free legal aid: DLSA Helpline 15100",
            footer_style
        ))

        doc.build(story)
        return buffer.getvalue()

    except ImportError:
        # ReportLab not installed, return empty
        return b""


def _number_to_words(n: int) -> str:
    """Convert number to Indian words (simplified)."""
    ones = ["", "One", "Two", "Three", "Four", "Five", "Six", "Seven", "Eight", "Nine",
            "Ten", "Eleven", "Twelve", "Thirteen", "Fourteen", "Fifteen", "Sixteen",
            "Seventeen", "Eighteen", "Nineteen"]
    tens = ["", "", "Twenty", "Thirty", "Forty", "Fifty", "Sixty", "Seventy", "Eighty", "Ninety"]

    if n == 0: return "Zero"
    if n < 20: return ones[n]
    if n < 100: return tens[n // 10] + (" " + ones[n % 10] if n % 10 else "")
    if n < 1000: return ones[n // 100] + " Hundred" + (" " + _number_to_words(n % 100) if n % 100 else "")
    if n < 100000: return _number_to_words(n // 1000) + " Thousand" + (" " + _number_to_words(n % 1000) if n % 1000 else "")
    if n < 10000000: return _number_to_words(n // 100000) + " Lakh" + (" " + _number_to_words(n % 100000) if n % 100000 else "")
    return _number_to_words(n // 10000000) + " Crore" + (" " + _number_to_words(n % 10000000) if n % 10000000 else "")
