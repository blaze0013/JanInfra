import sys
import json
from datetime import datetime
from reportlab.lib.pagesizes import letter
from reportlab.pdfgen import canvas
from reportlab.lib import colors

def hex_to_rgb(hex_str):
    hex_str = hex_str.lstrip('#')
    return [int(hex_str[i:i+2], 16)/255.0 for i in (0, 2, 4)]

def draw_wrapped_text(c, text, x, y, max_width, font="Helvetica", size=10, line_height=14, color=colors.black):
    c.setFont(font, size)
    c.setFillColor(color)
    words = text.split()
    line = ""
    drawn_y = y
    for word in words:
        if c.stringWidth(line + " " + word, font, size) < max_width:
            line += " " + word
        else:
            c.drawString(x, drawn_y, line.strip())
            line = word
            drawn_y -= line_height
    if line:
        c.drawString(x, drawn_y, line.strip())
    return drawn_y - line_height

def generate_pdf():
    if len(sys.argv) < 2:
        sys.exit(1)
        
    output_path = sys.argv[1]
    
    input_data = sys.stdin.read()
    if not input_data:
        sys.exit(1)
        
    data = json.loads(input_data)
    
    ref = data.get('reference', 'REQ-1000')
    status = data.get('status', 'SUBMITTED').replace('_', ' ')
    severity = int(data.get('severity', 1))
    category = data.get('category', 'Infrastructure')
    district = data.get('district', 'Unknown')
    state = data.get('state', 'Unknown')
    original_text = data.get('originalText') or "No description provided."
    
    c = canvas.Canvas(output_path, pagesize=letter)
    width, height = letter
    
    # ---------------- PAGE 1 ----------------
    # Background
    c.setFillColorRGB(*hex_to_rgb('#F8FAFC'))
    c.rect(0, 0, width, height, fill=1, stroke=0)
    
    # Blue Header
    c.setFillColorRGB(*hex_to_rgb('#3B82F6'))
    c.roundRect(30, height - 130, width - 60, 100, 8, fill=1, stroke=0)
    
    c.setFillColor(colors.white)
    c.setFont("Helvetica-Bold", 10)
    c.drawString(50, height - 60, "PUBLIC WORKS & CITIZEN GRIEVANCE PORTAL")
    
    c.setFont("Helvetica", 10)
    date_str = datetime.now().strftime("%b %d, %Y | %I:%M %p")
    c.drawRightString(width - 50, height - 60, f"Generated: {date_str}")
    
    c.setFont("Helvetica-Bold", 22)
    c.drawString(50, height - 100, f"Grievance Action Report: {ref}")
    
    # 4 Stats Boxes
    box_w = (width - 60 - 30) / 4
    for i in range(4):
        x = 30 + i * (box_w + 10)
        c.setFillColor(colors.white)
        c.setStrokeColorRGB(*hex_to_rgb('#E2E8F0'))
        c.setLineWidth(1)
        c.roundRect(x, height - 210, box_w, 65, 8, fill=1, stroke=1)
        
    # Box 1: Status
    c.setFont("Helvetica-Bold", 8)
    c.setFillColorRGB(*hex_to_rgb('#64748B'))
    c.drawString(40, height - 165, "CURRENT STATUS")
    
    c.setFillColorRGB(*hex_to_rgb('#FEF3C7'))
    c.roundRect(40, height - 195, box_w - 20, 22, 4, fill=1, stroke=0)
    c.setFillColorRGB(*hex_to_rgb('#B45309'))
    c.setFont("Helvetica-Bold", 9)
    c.drawString(45, height - 188, status)
    
    # Box 2: Severity
    c.setFont("Helvetica-Bold", 8)
    c.setFillColorRGB(*hex_to_rgb('#64748B'))
    c.drawString(40 + box_w + 10, height - 165, "SEVERITY INDEX")
    
    sev_text = "Critical" if severity >= 4 else "Moderate" if severity >= 3 else "Low"
    c.setFillColorRGB(*hex_to_rgb('#FEE2E2'))
    c.roundRect(40 + box_w + 10, height - 195, box_w - 20, 22, 4, fill=1, stroke=0)
    c.setFillColorRGB(*hex_to_rgb('#B91C1C'))
    c.setFont("Helvetica-Bold", 9)
    c.drawString(45 + box_w + 10, height - 188, f"{severity} / 5 ({sev_text})")
    
    # Box 3: Category
    c.setFont("Helvetica-Bold", 8)
    c.setFillColorRGB(*hex_to_rgb('#64748B'))
    c.drawString(40 + 2*(box_w + 10), height - 165, "CATEGORY")
    
    c.setFillColorRGB(*hex_to_rgb('#DBEAFE'))
    c.roundRect(40 + 2*(box_w + 10), height - 195, box_w - 20, 22, 4, fill=1, stroke=0)
    c.setFillColorRGB(*hex_to_rgb('#1D4ED8'))
    c.setFont("Helvetica-Bold", 9)
    # Truncate category if needed
    disp_cat = category[:18] + '...' if len(category) > 18 else category
    c.drawString(45 + 2*(box_w + 10), height - 188, disp_cat)
    
    # Box 4: Location
    c.setFont("Helvetica-Bold", 8)
    c.setFillColorRGB(*hex_to_rgb('#64748B'))
    c.drawString(40 + 3*(box_w + 10), height - 165, "LOCATION")
    
    c.setFillColor(colors.black)
    c.setFont("Helvetica-Bold", 10)
    c.drawString(40 + 3*(box_w + 10), height - 182, district + ",")
    c.drawString(40 + 3*(box_w + 10), height - 196, state)
    
    # Card 1: Assessment
    c.setFillColor(colors.white)
    c.setStrokeColorRGB(*hex_to_rgb('#E2E8F0'))
    c.roundRect(30, height - 480, width - 60, 250, 8, fill=1, stroke=1)
    
    c.setFillColorRGB(*hex_to_rgb('#3B82F6'))
    c.rect(40, height - 262, 4, 16, fill=1, stroke=0)
    c.setFillColorRGB(*hex_to_rgb('#0F172A'))
    c.setFont("Helvetica-Bold", 12)
    c.drawString(50, height - 260, "1. Grievance & Immediate Assessment")
    
    # Table inside Card 1
    # Line 1
    c.setFillColorRGB(*hex_to_rgb('#F8FAFC'))
    c.rect(40, height - 305, width - 80, 25, fill=1, stroke=0)
    c.setFillColorRGB(*hex_to_rgb('#475569'))
    c.setFont("Helvetica-Bold", 10)
    c.drawString(50, height - 297, "Reference ID")
    c.setFillColor(colors.black)
    c.drawString(180, height - 297, ref)
    
    # Line 2
    c.setFillColorRGB(*hex_to_rgb('#475569'))
    c.setFont("Helvetica-Bold", 10)
    c.drawString(50, height - 332, "Incident Location")
    c.setFillColor(colors.black)
    c.setFont("Helvetica", 10)
    c.drawString(180, height - 332, f"Reported in {district}, {state}")
    
    # Line 3 (Summary)
    c.setFillColorRGB(*hex_to_rgb('#F8FAFC'))
    c.rect(40, height - 375, width - 80, 30, fill=1, stroke=0)
    c.setFillColorRGB(*hex_to_rgb('#475569'))
    c.setFont("Helvetica-Bold", 10)
    c.drawString(50, height - 362, "Grievance Summary")
    c.setFillColor(colors.black)
    c.setFont("Helvetica", 10)
    draw_wrapped_text(c, f"A {category} related grievance logged at severity {severity}.", 180, height - 357, width - 200, "Helvetica", 10, 14, colors.black)
    
    # Citizen Statement
    c.setFillColorRGB(*hex_to_rgb('#64748B'))
    c.setFont("Helvetica-Bold", 9)
    c.drawString(40, height - 405, "CITIZEN COMPLAINT STATEMENT:")
    
    c.setFillColorRGB(*hex_to_rgb('#F1F5F9'))
    c.roundRect(40, height - 460, width - 80, 45, 4, fill=1, stroke=0)
    c.setFillColorRGB(*hex_to_rgb('#F59E0B'))
    c.rect(40, height - 460, 4, 45, fill=1, stroke=0)
    
    c.setFillColorRGB(*hex_to_rgb('#334155'))
    c.setFont("Helvetica-Oblique", 10)
    draw_wrapped_text(c, f'"{original_text}"', 55, height - 430, width - 110, "Helvetica-Oblique", 10, 14, hex_to_rgb('#334155'))
    
    # Card 2: Action Breakdown
    c.setFillColor(colors.white)
    c.setStrokeColorRGB(*hex_to_rgb('#E2E8F0'))
    c.roundRect(30, height - 760, width - 60, 265, 8, fill=1, stroke=1)
    
    c.setFillColorRGB(*hex_to_rgb('#3B82F6'))
    c.rect(40, height - 532, 4, 16, fill=1, stroke=0)
    c.setFillColorRGB(*hex_to_rgb('#0F172A'))
    c.setFont("Helvetica-Bold", 12)
    c.drawString(50, height - 530, "2. Official Action Taken & Status Breakdown")
    
    action_p1 = f"The issue {ref} is currently {status}. Public works engineers are active on-site"
    action_p2 = "evaluating infrastructure gaps to formulate a sanctioned government project proposal."
    
    c.setFont("Helvetica", 10)
    c.setFillColorRGB(*hex_to_rgb('#334155'))
    c.drawString(40, height - 555, action_p1)
    c.drawString(40, height - 570, action_p2)
    
    c.setFont("Helvetica-Bold", 10)
    c.setFillColor(colors.black)
    c.drawString(40, height - 600, "Engineering Assessment & Progress Tracking")
    
    # Timeline
    timeline_x = 45
    c.setStrokeColorRGB(*hex_to_rgb('#E2E8F0'))
    c.setLineWidth(2)
    c.line(timeline_x, height - 615, timeline_x, height - 740)
    
    # Phase 1
    c.setFillColorRGB(*hex_to_rgb('#3B82F6'))
    c.circle(timeline_x, height - 620, 4, fill=1, stroke=0)
    c.setFont("Helvetica-Bold", 10)
    c.setFillColorRGB(*hex_to_rgb('#0F172A'))
    c.drawString(60, height - 624, "Phase 1: Initial Complaint Registration & Classification")
    c.setFont("Helvetica", 9)
    c.setFillColorRGB(*hex_to_rgb('#64748B'))
    c.drawString(60, height - 638, f"Logged as Priority {severity} under {category}. Assigned to regional division.")
    
    # Phase 2
    c.setFillColorRGB(*hex_to_rgb('#F59E0B')) # Orange
    c.circle(timeline_x, height - 660, 4, fill=1, stroke=0)
    c.setFont("Helvetica-Bold", 10)
    c.setFillColorRGB(*hex_to_rgb('#0F172A'))
    c.drawString(60, height - 664, "Phase 2: On-Site Gap Evaluation & Field Survey (In Progress)")
    c.setFont("Helvetica", 9)
    c.setFillColorRGB(*hex_to_rgb('#64748B'))
    c.drawString(60, height - 678, "Engineers evaluating structural damage depth, drainage failure causes, and gaps.")
    
    # Phase 3
    c.setFillColorRGB(*hex_to_rgb('#94A3B8')) # Gray
    c.circle(timeline_x, height - 700, 4, fill=1, stroke=0)
    c.setFont("Helvetica-Bold", 10)
    c.setFillColorRGB(*hex_to_rgb('#0F172A'))
    c.drawString(60, height - 704, "Phase 3: Formal Project Proposal & Budget Allocation")
    c.setFont("Helvetica", 9)
    c.setFillColorRGB(*hex_to_rgb('#64748B'))
    c.drawString(60, height - 718, "Drafting DPR (Detailed Project Report) for government sanction.")
    
    # Phase 4
    c.setFillColorRGB(*hex_to_rgb('#94A3B8'))
    c.circle(timeline_x, height - 740, 4, fill=1, stroke=0)
    c.setFont("Helvetica-Bold", 10)
    c.setFillColorRGB(*hex_to_rgb('#0F172A'))
    c.drawString(60, height - 744, "Phase 4: Tender & Construction Execution")
    c.setFont("Helvetica", 9)
    c.setFillColorRGB(*hex_to_rgb('#64748B'))
    c.drawString(60, height - 758, "Contractor bidding, site preparation, and reconstruction work.")
    
    c.showPage()
    
    # ---------------- PAGE 2 ----------------
    c.setFillColorRGB(*hex_to_rgb('#F8FAFC'))
    c.rect(0, 0, width, height, fill=1, stroke=0)
    
    # Card 3
    c.setFillColor(colors.white)
    c.setStrokeColorRGB(*hex_to_rgb('#E2E8F0'))
    c.roundRect(30, height - 260, width - 60, 210, 8, fill=1, stroke=1)
    
    c.setFillColorRGB(*hex_to_rgb('#3B82F6'))
    c.rect(40, height - 82, 4, 16, fill=1, stroke=0)
    c.setFillColorRGB(*hex_to_rgb('#0F172A'))
    c.setFont("Helvetica-Bold", 12)
    c.drawString(50, height - 80, "3. Recommended Actions & Next Milestones")
    
    # Table inside Card 3
    # Row 1
    c.setFillColorRGB(*hex_to_rgb('#F8FAFC'))
    c.rect(40, height - 120, width - 80, 25, fill=1, stroke=0)
    c.setFillColorRGB(*hex_to_rgb('#475569'))
    c.setFont("Helvetica-Bold", 10)
    c.drawString(50, height - 112, "Responsible Agency")
    c.setFillColor(colors.black)
    c.setFont("Helvetica", 10)
    c.drawString(200, height - 112, f"Public Works Department (PWD) - {district} Division")
    
    # Row 2
    c.setFillColorRGB(*hex_to_rgb('#475569'))
    c.setFont("Helvetica-Bold", 10)
    c.drawString(50, height - 147, "Immediate Objective")
    c.setFillColor(colors.black)
    c.setFont("Helvetica", 10)
    c.drawString(200, height - 147, "Complete survey gap report and submit DPR within 7 business days.")
    
    # Row 3
    c.setFillColorRGB(*hex_to_rgb('#F8FAFC'))
    c.rect(40, height - 190, width - 80, 30, fill=1, stroke=0)
    c.setFillColorRGB(*hex_to_rgb('#475569'))
    c.setFont("Helvetica-Bold", 10)
    c.drawString(50, height - 177, "Interim Measures")
    c.setFillColor(colors.black)
    c.setFont("Helvetica", 10)
    c.drawString(200, height - 177, "Assess feasibility of temporary maintenance for emergency passage.")
    
    # Row 4
    c.setFillColorRGB(*hex_to_rgb('#475569'))
    c.setFont("Helvetica-Bold", 10)
    c.drawString(50, height - 222, "Target Completion")
    c.setFillColor(colors.black)
    c.setFont("Helvetica", 10)
    c.drawString(200, height - 222, "Pending final project approval & tender allocation.")
    
    # Footer
    c.setFont("Helvetica", 8)
    c.setFillColorRGB(*hex_to_rgb('#94A3B8'))
    c.drawCentredString(width / 2, height - 290, f"Official Administrative Record • Public Works Department Grievance Management System • Document Ref: {ref}-AR")
    
    c.save()

if __name__ == "__main__":
    generate_pdf()
