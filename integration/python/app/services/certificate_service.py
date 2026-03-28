import os
from datetime import datetime
from reportlab.lib.pagesizes import A4, landscape
from reportlab.lib import colors
from reportlab.lib.units import inch
from reportlab.pdfgen import canvas
from app.config import UPLOAD_DIR
from app.utils.logger import logger


def generate_certificate(
    employee_name: str,
    sop_topic: str,
    score: float,
    passing_score: float = 80.0
) -> str:
    """
    Generate a PDF training certificate if score >= passing_score.
    Returns the file path of the generated certificate.
    """
    if score < passing_score:
        raise ValueError(
            f"Score {score}% is below passing threshold of {passing_score}%."
        )

    os.makedirs(UPLOAD_DIR, exist_ok=True)

    safe_name = employee_name.replace(" ", "_").lower()
    safe_topic = sop_topic.replace(" ", "_").lower()
    timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
    filename = f"{UPLOAD_DIR}/cert_{safe_name}_{safe_topic}_{timestamp}.pdf"

    completion_date = datetime.now().strftime("%d %B %Y")

    c = canvas.Canvas(filename, pagesize=landscape(A4))
    width, height = landscape(A4)

    # --- Background ---
    c.setFillColor(colors.HexColor("#F7F9FC"))
    c.rect(0, 0, width, height, fill=True, stroke=False)

    # --- Outer border ---
    c.setStrokeColor(colors.HexColor("#1A3C6E"))
    c.setLineWidth(6)
    c.rect(20, 20, width - 40, height - 40, fill=False, stroke=True)

    # --- Inner border ---
    c.setStrokeColor(colors.HexColor("#C9A84C"))
    c.setLineWidth(2)
    c.rect(30, 30, width - 60, height - 60, fill=False, stroke=True)

    # --- Header ---
    c.setFillColor(colors.HexColor("#1A3C6E"))
    c.setFont("Helvetica-Bold", 36)
    c.drawCentredString(width / 2, height - 100, "Certificate of Completion")

    c.setFont("Helvetica", 16)
    c.setFillColor(colors.HexColor("#555555"))
    c.drawCentredString(width / 2, height - 130, "Master Control & Training Platform")

    # --- Divider ---
    c.setStrokeColor(colors.HexColor("#C9A84C"))
    c.setLineWidth(1.5)
    c.line(80, height - 150, width - 80, height - 150)

    # --- Body ---
    c.setFillColor(colors.HexColor("#333333"))
    c.setFont("Helvetica", 18)
    c.drawCentredString(width / 2, height - 195, "This is to certify that")

    c.setFillColor(colors.HexColor("#1A3C6E"))
    c.setFont("Helvetica-Bold", 32)
    c.drawCentredString(width / 2, height - 240, employee_name)

    c.setFillColor(colors.HexColor("#333333"))
    c.setFont("Helvetica", 18)
    c.drawCentredString(width / 2, height - 280,
                        "has successfully completed the SOP training on")

    c.setFillColor(colors.HexColor("#C9A84C"))
    c.setFont("Helvetica-Bold", 24)
    c.drawCentredString(width / 2, height - 320, sop_topic)

    # --- Score & Date ---
    c.setFillColor(colors.HexColor("#333333"))
    c.setFont("Helvetica", 16)
    c.drawCentredString(width / 2, height - 365,
                        f"Assessment Score: {score:.1f}%     |     Date of Completion: {completion_date}")

    # --- Footer divider ---
    c.setStrokeColor(colors.HexColor("#C9A84C"))
    c.line(80, 100, width - 80, 100)

    # --- Signature lines ---
    c.setFillColor(colors.HexColor("#555555"))
    c.setFont("Helvetica", 12)
    c.drawString(100, 80, "_______________________")
    c.drawString(100, 62, "Authorized Signatory")

    c.drawRightString(width - 100, 80, "_______________________")
    c.drawRightString(width - 100, 62, "Training Manager")

    c.setFont("Helvetica-Oblique", 10)
    c.drawCentredString(width / 2, 45,
                        "This certificate is digitally generated and GMP compliant.")

    c.save()
    logger.info(f"Certificate generated: {filename}")
    return filename