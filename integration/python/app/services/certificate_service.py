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
    Generate a PDF training certificate.
    Returns the absolute file path of the generated certificate.
    Raises ValueError if score is below passing_score.
    """
    if score < passing_score:
        raise ValueError(
            f"Score {score:.1f}% is below the passing threshold of {passing_score:.1f}%."
        )

    os.makedirs(UPLOAD_DIR, exist_ok=True)

    safe_name  = "".join(c if c.isalnum() else "_" for c in employee_name.lower())
    safe_topic = "".join(c if c.isalnum() else "_" for c in sop_topic.lower())
    timestamp  = datetime.now().strftime("%Y%m%d_%H%M%S")
    filename   = os.path.join(UPLOAD_DIR, f"cert_{safe_name}_{safe_topic}_{timestamp}.pdf")

    completion_date = datetime.now().strftime("%d %B %Y")

    c = canvas.Canvas(filename, pagesize=landscape(A4))
    W, H = landscape(A4)

    # ── Background ──────────────────────────────────────────────────
    c.setFillColor(colors.HexColor("#F7F9FC"))
    c.rect(0, 0, W, H, fill=True, stroke=False)

    # ── Outer border ────────────────────────────────────────────────
    c.setStrokeColor(colors.HexColor("#1A3C6E"))
    c.setLineWidth(6)
    c.rect(20, 20, W - 40, H - 40, fill=False, stroke=True)

    # ── Inner decorative border ─────────────────────────────────────
    c.setStrokeColor(colors.HexColor("#C9A84C"))
    c.setLineWidth(2)
    c.rect(30, 30, W - 60, H - 60, fill=False, stroke=True)

    # ── Header ──────────────────────────────────────────────────────
    c.setFillColor(colors.HexColor("#1A3C6E"))
    c.setFont("Helvetica-Bold", 36)
    c.drawCentredString(W / 2, H - 100, "Certificate of Completion")

    c.setFont("Helvetica", 16)
    c.setFillColor(colors.HexColor("#555555"))
    c.drawCentredString(W / 2, H - 130, "Master Control & Training Platform  ·  Team Symmetry")

    # ── Gold divider ────────────────────────────────────────────────
    c.setStrokeColor(colors.HexColor("#C9A84C"))
    c.setLineWidth(1.5)
    c.line(80, H - 150, W - 80, H - 150)

    # ── Body ────────────────────────────────────────────────────────
    c.setFillColor(colors.HexColor("#333333"))
    c.setFont("Helvetica", 18)
    c.drawCentredString(W / 2, H - 195, "This is to certify that")

    c.setFillColor(colors.HexColor("#1A3C6E"))
    c.setFont("Helvetica-Bold", 34)
    c.drawCentredString(W / 2, H - 242, employee_name)

    c.setFillColor(colors.HexColor("#333333"))
    c.setFont("Helvetica", 18)
    c.drawCentredString(W / 2, H - 282, "has successfully completed the SOP training on")

    c.setFillColor(colors.HexColor("#C9A84C"))
    c.setFont("Helvetica-Bold", 24)
    c.drawCentredString(W / 2, H - 322, sop_topic)

    # ── Score + Date ────────────────────────────────────────────────
    c.setFillColor(colors.HexColor("#333333"))
    c.setFont("Helvetica", 16)
    c.drawCentredString(
        W / 2, H - 368,
        f"Assessment Score: {score:.1f}%     |     Date of Completion: {completion_date}"
    )

    # ── GMP badge (simple text box) ─────────────────────────────────
    badge_x, badge_y = W / 2 - 55, H - 415
    c.setFillColor(colors.HexColor("#E8F4E8"))
    c.roundRect(badge_x, badge_y, 110, 28, 6, fill=True, stroke=False)
    c.setFillColor(colors.HexColor("#2D7A2D"))
    c.setFont("Helvetica-Bold", 11)
    c.drawCentredString(W / 2, badge_y + 8, "✓ GMP Compliant")

    # ── Footer ──────────────────────────────────────────────────────
    c.setStrokeColor(colors.HexColor("#C9A84C"))
    c.setLineWidth(1)
    c.line(80, 100, W - 80, 100)

    c.setFillColor(colors.HexColor("#555555"))
    c.setFont("Helvetica", 12)
    c.drawString(100, 80, "_______________________")
    c.drawString(100, 62, "Authorized Signatory")
    c.drawRightString(W - 100, 80, "_______________________")
    c.drawRightString(W - 100, 62, "Training Manager")

    c.setFont("Helvetica-Oblique", 10)
    c.drawCentredString(W / 2, 45,
                        "This certificate is digitally generated and GMP compliant · 21 CFR Part 11")

    c.save()
    logger.info(f"Certificate generated: {filename}")
    return filename