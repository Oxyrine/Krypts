"""
Server-side watermarking for images and PDF pages.
Embeds user identity (email/user_id) into content before streaming.
"""
import io
import math
from typing import Optional

from PIL import Image, ImageDraw, ImageFont
from pypdf import PdfReader, PdfWriter
from reportlab.pdfgen import canvas as rl_canvas
from reportlab.lib.pagesizes import letter
from reportlab.lib.colors import Color


def watermark_image(
    image_bytes: bytes,
    text: str,
    opacity: float = 0.25,
) -> bytes:
    """
    Overlay a repeating diagonal watermark text grid on an image.
    Returns PNG bytes.
    """
    img = Image.open(io.BytesIO(image_bytes)).convert("RGBA")
    width, height = img.size

    # Create transparent overlay
    overlay = Image.new("RGBA", img.size, (0, 0, 0, 0))
    draw = ImageDraw.Draw(overlay)

    # Try to get a font, fall back to default
    try:
        font = ImageFont.truetype("arial.ttf", size=max(16, width // 30))
    except (IOError, OSError):
        font = ImageFont.load_default()

    alpha = int(255 * opacity)
    fill_color = (200, 200, 200, alpha)

    # Draw diagonal grid of watermark text
    step_x = max(200, width // 4)
    step_y = max(80, height // 8)
    for y in range(-height, height * 2, step_y):
        for x in range(-width, width * 2, step_x):
            draw.text((x, y), text, font=font, fill=fill_color)

    # Rotate 30 degrees
    overlay = overlay.rotate(30, expand=False)

    # Composite
    watermarked = Image.alpha_composite(img, overlay).convert("RGB")
    buf = io.BytesIO()
    watermarked.save(buf, format="PNG")
    return buf.getvalue()


def watermark_pdf_page(
    pdf_bytes: bytes,
    page_number: int,
    watermark_text: str,
) -> bytes:
    """
    Extract a single page from a PDF and overlay a watermark.
    Returns single-page PDF bytes.
    """
    reader = PdfReader(io.BytesIO(pdf_bytes))
    total_pages = len(reader.pages)

    # Clamp page_number to valid range (1-indexed)
    page_idx = max(0, min(page_number - 1, total_pages - 1))
    page = reader.pages[page_idx]

    # Get page dimensions
    media_box = page.mediabox
    page_width = float(media_box.width)
    page_height = float(media_box.height)

    # Build watermark PDF with reportlab
    wm_buf = io.BytesIO()
    c = rl_canvas.Canvas(wm_buf, pagesize=(page_width, page_height))

    # Semi-transparent gray text
    c.setFillColor(Color(0.6, 0.6, 0.6, alpha=0.3))
    c.setFont("Helvetica", max(12, int(page_width / 30)))

    # Diagonal repeating pattern
    c.saveState()
    c.translate(page_width / 2, page_height / 2)
    c.rotate(30)
    step_x = max(180, page_width // 3)
    step_y = max(60, page_height // 8)
    for xi in range(-3, 4):
        for yi in range(-6, 7):
            c.drawCentredString(xi * step_x, yi * step_y, watermark_text)
    c.restoreState()
    c.save()

    # Merge watermark onto original page
    wm_buf.seek(0)
    wm_reader = PdfReader(wm_buf)
    wm_page = wm_reader.pages[0]
    page.merge_page(wm_page)

    # Write single page to output
    writer = PdfWriter()
    writer.add_page(page)
    out_buf = io.BytesIO()
    writer.write(out_buf)
    return out_buf.getvalue()
