from reportlab.lib.pagesizes import letter
from reportlab.lib import colors
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.lib.units import inch
from reportlab.platypus import (
    SimpleDocTemplate, Paragraph, Spacer, Table, TableStyle,
    HRFlowable, KeepTogether
)
from reportlab.lib.enums import TA_CENTER, TA_LEFT, TA_JUSTIFY

OUTPUT = r"D:\VS Code\VS Code Project\BU\699 HW\Project_New\Project_Overview.pdf"

# ── Colours ──────────────────────────────────────────────────────────────────
NAVY   = colors.HexColor("#1E2761")
BLUE   = colors.HexColor("#408EC6")
ACCENT = colors.HexColor("#E85D04")
LIGHT  = colors.HexColor("#F2F4F8")
WHITE  = colors.white
DARK   = colors.HexColor("#333333")
MUTED  = colors.HexColor("#777777")

# ── Document ─────────────────────────────────────────────────────────────────
doc = SimpleDocTemplate(
    OUTPUT,
    pagesize=letter,
    leftMargin=0.9*inch, rightMargin=0.9*inch,
    topMargin=0.8*inch,  bottomMargin=0.8*inch,
    title="CS699 Data Mining — Complete Project Overview",
    author="Ho Man Cheng & Weitao Peng",
)

W = letter[0] - 1.8*inch   # usable width

# ── Styles ───────────────────────────────────────────────────────────────────
base = getSampleStyleSheet()

def ps(name, **kw):
    return ParagraphStyle(name, **kw)

sTitle = ps("sTitle",
    fontName="Times-Bold", fontSize=26, leading=32,
    textColor=WHITE, alignment=TA_CENTER, spaceAfter=4)

sSubtitle = ps("sSubtitle",
    fontName="Times-Italic", fontSize=13, leading=17,
    textColor=colors.HexColor("#CCDDEE"), alignment=TA_CENTER, spaceAfter=4)

sAuthor = ps("sAuthor",
    fontName="Helvetica", fontSize=10, leading=14,
    textColor=colors.HexColor("#AABBCC"), alignment=TA_CENTER)

sSectionH = ps("sSectionH",
    fontName="Times-Bold", fontSize=15, leading=20,
    textColor=WHITE, spaceBefore=0, spaceAfter=0)

sStepH = ps("sStepH",
    fontName="Helvetica-Bold", fontSize=11, leading=15,
    textColor=NAVY, spaceBefore=10, spaceAfter=2)

sBody = ps("sBody",
    fontName="Helvetica", fontSize=10, leading=15,
    textColor=DARK, alignment=TA_JUSTIFY, spaceBefore=4, spaceAfter=4)

sBullet = ps("sBullet",
    fontName="Helvetica", fontSize=10, leading=15,
    textColor=DARK, leftIndent=16, firstLineIndent=-8, spaceBefore=2)

sLabel = ps("sLabel",
    fontName="Helvetica-Bold", fontSize=10, leading=14,
    textColor=NAVY, spaceBefore=4)

sCaption = ps("sCaption",
    fontName="Helvetica-Oblique", fontSize=9, leading=12,
    textColor=MUTED, alignment=TA_CENTER, spaceBefore=2, spaceAfter=6)

sKeynum = ps("sKeynum",
    fontName="Helvetica-Bold", fontSize=10.5, leading=14,
    textColor=ACCENT, spaceBefore=8)

sFooter = ps("sFooter",
    fontName="Helvetica", fontSize=8, leading=11,
    textColor=MUTED, alignment=TA_CENTER)

# ── Helper builders ───────────────────────────────────────────────────────────

def cover_banner():
    """Navy cover block as a single-cell Table."""
    inner = [
        Spacer(1, 0.25*inch),
        Paragraph("CS699 Data Mining", sTitle),
        Paragraph("Complete Project Overview", sTitle),
        Spacer(1, 0.08*inch),
        Paragraph("Classification of Disability Status in U.S. Households", sSubtitle),
        Spacer(1, 0.12*inch),
        Paragraph("Ho Man Cheng &amp; Weitao Peng", sAuthor),
        Paragraph("Boston University Metropolitan College  |  Spring 2026", sAuthor),
        Spacer(1, 0.25*inch),
    ]
    t = Table([[inner]], colWidths=[W])
    t.setStyle(TableStyle([
        ("BACKGROUND", (0,0), (-1,-1), NAVY),
        ("LEFTPADDING",  (0,0), (-1,-1), 24),
        ("RIGHTPADDING", (0,0), (-1,-1), 24),
        ("TOPPADDING",   (0,0), (-1,-1), 0),
        ("BOTTOMPADDING",(0,0), (-1,-1), 0),
        ("ROUNDEDCORNERS", (0,0), (-1,-1), [6,6,6,6]),
    ]))
    return t

def section_header(num, title):
    """Coloured section banner."""
    label = Paragraph(f"Section {num} — {title}", sSectionH)
    t = Table([[label]], colWidths=[W])
    t.setStyle(TableStyle([
        ("BACKGROUND",   (0,0), (-1,-1), NAVY),
        ("LEFTPADDING",  (0,0), (-1,-1), 14),
        ("RIGHTPADDING", (0,0), (-1,-1), 14),
        ("TOPPADDING",   (0,0), (-1,-1), 8),
        ("BOTTOMPADDING",(0,0), (-1,-1), 8),
    ]))
    return t

def bullet(text):
    return Paragraph(f"<bullet>•</bullet> {text}", sBullet)

def step_box(tag, what, why, result=None, note=None):
    """Coloured left-border step card."""
    rows = [
        [Paragraph(tag, sStepH)],
        [Paragraph(f"<b>What:</b> {what}", sBody)],
        [Paragraph(f"<b>Why:</b> {why}", sBody)],
    ]
    if note:
        rows.append([Paragraph(f"<b>Critical decision:</b> {note}", sBody)])
    if result:
        rows.append([Paragraph(f"<b>Result:</b> {result}", sBody)])

    inner = Table(rows, colWidths=[W - 20])
    inner.setStyle(TableStyle([
        ("LEFTPADDING",  (0,0), (-1,-1), 0),
        ("RIGHTPADDING", (0,0), (-1,-1), 0),
        ("TOPPADDING",   (0,0), (-1,-1), 1),
        ("BOTTOMPADDING",(0,0), (-1,-1), 1),
    ]))

    outer = Table([[inner]], colWidths=[W])
    outer.setStyle(TableStyle([
        ("BACKGROUND",   (0,0), (-1,-1), LIGHT),
        ("LEFTPADDING",  (0,0), (-1,-1), 12),
        ("RIGHTPADDING", (0,0), (-1,-1), 12),
        ("TOPPADDING",   (0,0), (-1,-1), 6),
        ("BOTTOMPADDING",(0,0), (-1,-1), 6),
        ("LINEBEFORETABLE", (0,0), (0,-1), 4, BLUE),
    ]))
    return outer

def method_box(title, what, why, col=NAVY):
    rows = [
        [Paragraph(title, ps("mh", fontName="Helvetica-Bold", fontSize=10.5,
                             textColor=WHITE, leading=14))],
        [Paragraph(f"<b><font color='#AADDFF'>What:</font></b> {what}",
                   ps("mb", fontName="Helvetica", fontSize=10, textColor=WHITE,
                      leading=14, spaceBefore=4, alignment=TA_JUSTIFY))],
        [Paragraph(f"<b><font color='#AADDFF'>Why:</font></b> {why}",
                   ps("mb2", fontName="Helvetica", fontSize=10, textColor=WHITE,
                      leading=14, spaceBefore=4, alignment=TA_JUSTIFY))],
    ]
    inner = Table(rows, colWidths=[W//2 - 22])
    inner.setStyle(TableStyle([
        ("LEFTPADDING",  (0,0), (-1,-1), 0),
        ("RIGHTPADDING", (0,0), (-1,-1), 0),
        ("TOPPADDING",   (0,0), (-1,-1), 2),
        ("BOTTOMPADDING",(0,0), (-1,-1), 2),
    ]))
    return inner

def two_method_row(t1, w1, y1, t2, w2, y2):
    left  = method_box(t1, w1, y1, NAVY)
    right = method_box(t2, w2, y2, BLUE)
    row = Table([[left, right]], colWidths=[W/2 - 6, W/2 - 6],
                hAlign="LEFT")
    row.setStyle(TableStyle([
        ("BACKGROUND",   (0,0), (0,-1), NAVY),
        ("BACKGROUND",   (1,0), (1,-1), BLUE),
        ("LEFTPADDING",  (0,0), (-1,-1), 10),
        ("RIGHTPADDING", (0,0), (-1,-1), 10),
        ("TOPPADDING",   (0,0), (-1,-1), 8),
        ("BOTTOMPADDING",(0,0), (-1,-1), 8),
        ("VALIGN",       (0,0), (-1,-1), "TOP"),
        ("ROUNDEDCORNERS", (0,0), (-1,-1), [4,4,4,4]),
    ]))
    return row

def algo_table(rows_data):
    header = [
        Paragraph("#", ps("th", fontName="Helvetica-Bold", fontSize=10,
                           textColor=WHITE, alignment=TA_CENTER)),
        Paragraph("Algorithm", ps("th2", fontName="Helvetica-Bold", fontSize=10,
                                   textColor=WHITE)),
        Paragraph("Family", ps("th3", fontName="Helvetica-Bold", fontSize=10,
                                textColor=WHITE)),
        Paragraph("Why Included", ps("th4", fontName="Helvetica-Bold", fontSize=10,
                                      textColor=WHITE)),
    ]
    body_style = ps("td", fontName="Helvetica", fontSize=9.5, textColor=DARK, leading=13)
    body_c     = ps("tdc", fontName="Helvetica", fontSize=9.5, textColor=DARK,
                    leading=13, alignment=TA_CENTER)
    table_data = [header]
    for i, (algo, family, why) in enumerate(rows_data):
        table_data.append([
            Paragraph(str(i+1), body_c),
            Paragraph(algo, body_style),
            Paragraph(family, body_style),
            Paragraph(why,  body_style),
        ])
    t = Table(table_data, colWidths=[0.35*inch, 1.6*inch, 1.4*inch, W-3.35*inch])
    t.setStyle(TableStyle([
        ("BACKGROUND",   (0,0), (-1,0), NAVY),
        ("TEXTCOLOR",    (0,0), (-1,0), WHITE),
        ("ROWBACKGROUNDS",(0,1),(-1,-1),[WHITE, LIGHT]),
        ("GRID",         (0,0), (-1,-1), 0.4, colors.HexColor("#D0D8E8")),
        ("LEFTPADDING",  (0,0), (-1,-1), 7),
        ("RIGHTPADDING", (0,0), (-1,-1), 7),
        ("TOPPADDING",   (0,0), (-1,-1), 5),
        ("BOTTOMPADDING",(0,0), (-1,-1), 5),
        ("VALIGN",       (0,0), (-1,-1), "TOP"),
    ]))
    return t

def metrics_table():
    hdr_s = ps("mth", fontName="Helvetica-Bold", fontSize=10, textColor=WHITE)
    cell_s = ps("mtd", fontName="Helvetica", fontSize=9.5, textColor=DARK, leading=13)
    data = [
        [Paragraph("Metric", hdr_s), Paragraph("What It Measures", hdr_s)],
        [Paragraph("Yes TPR", cell_s), Paragraph("Of all actual Yes households, how many did we correctly call Yes? (most important)", cell_s)],
        [Paragraph("No TPR",  cell_s), Paragraph("Of all actual No households, how many did we correctly call No?", cell_s)],
        [Paragraph("Precision",cell_s),Paragraph("Of all households we called Yes, how many actually were Yes?", cell_s)],
        [Paragraph("F1 Score", cell_s),Paragraph("Harmonic mean of Precision and Recall", cell_s)],
        [Paragraph("AUC",      cell_s),Paragraph("Overall ranking ability across all possible thresholds", cell_s)],
        [Paragraph("Kappa",    cell_s),Paragraph("Agreement above chance level", cell_s)],
        [Paragraph("MCC",      cell_s),Paragraph("Matthews Correlation Coefficient — robust overall score", cell_s)],
    ]
    t = Table(data, colWidths=[1.4*inch, W - 1.4*inch])
    t.setStyle(TableStyle([
        ("BACKGROUND",    (0,0), (-1,0), NAVY),
        ("ROWBACKGROUNDS",(0,1),(-1,-1),[WHITE, LIGHT]),
        ("GRID",          (0,0),(-1,-1), 0.4, colors.HexColor("#D0D8E8")),
        ("LEFTPADDING",   (0,0),(-1,-1), 7),
        ("RIGHTPADDING",  (0,0),(-1,-1), 7),
        ("TOPPADDING",    (0,0),(-1,-1), 5),
        ("BOTTOMPADDING", (0,0),(-1,-1), 5),
        ("VALIGN",        (0,0),(-1,-1), "TOP"),
    ]))
    return t

def best_model_table():
    hdr_s  = ps("bmh", fontName="Helvetica-Bold", fontSize=10, textColor=WHITE, alignment=TA_CENTER)
    val_s  = ps("bmv", fontName="Helvetica-Bold", fontSize=11, textColor=ACCENT, alignment=TA_CENTER)
    lbl_s  = ps("bml", fontName="Helvetica",      fontSize=10, textColor=DARK,  alignment=TA_CENTER)
    pass_s = ps("bmp", fontName="Helvetica-Bold",  fontSize=9,  textColor=colors.HexColor("#007700"), alignment=TA_CENTER)
    data = [
        [Paragraph("Metric", hdr_s), Paragraph("Score", hdr_s),
         Paragraph("Required", hdr_s), Paragraph("Status", hdr_s)],
        [Paragraph("Yes TPR", lbl_s), Paragraph("0.7730", val_s),
         Paragraph(">= 0.77", lbl_s), Paragraph("PASSED", pass_s)],
        [Paragraph("No TPR",  lbl_s), Paragraph("0.7322", val_s),
         Paragraph(">= 0.73", lbl_s), Paragraph("PASSED", pass_s)],
        [Paragraph("AUC",     lbl_s), Paragraph("0.7990", val_s),
         Paragraph("—", lbl_s),       Paragraph("", lbl_s)],
        [Paragraph("F1 (Yes)",lbl_s), Paragraph("0.6140", val_s),
         Paragraph("—", lbl_s),       Paragraph("", lbl_s)],
        [Paragraph("Kappa",   lbl_s), Paragraph("0.4582", val_s),
         Paragraph("—", lbl_s),       Paragraph("", lbl_s)],
    ]
    t = Table(data, colWidths=[1.5*inch, 1.3*inch, 1.5*inch, 1.3*inch],
              hAlign="CENTER")
    t.setStyle(TableStyle([
        ("BACKGROUND",    (0,0), (-1,0), NAVY),
        ("ROWBACKGROUNDS",(0,1),(-1,-1),[WHITE, LIGHT]),
        ("GRID",          (0,0),(-1,-1), 0.4, colors.HexColor("#D0D8E8")),
        ("LEFTPADDING",   (0,0),(-1,-1), 8),
        ("RIGHTPADDING",  (0,0),(-1,-1), 8),
        ("TOPPADDING",    (0,0),(-1,-1), 6),
        ("BOTTOMPADDING", (0,0),(-1,-1), 6),
    ]))
    return t

def deliverables_table():
    hdr_s  = ps("dh",  fontName="Helvetica-Bold", fontSize=10, textColor=WHITE)
    file_s = ps("df",  fontName="Courier",         fontSize=9,  textColor=NAVY, leading=13)
    desc_s = ps("dd",  fontName="Helvetica",       fontSize=9.5,textColor=DARK, leading=13)
    data = [
        [Paragraph("File", hdr_s), Paragraph("Description", hdr_s)],
        [Paragraph("project_code.R", file_s),
         Paragraph("All 36 model blocks in a single R script (no loops over models)", desc_s)],
        [Paragraph("preprocessed_data.csv", file_s),
         Paragraph("Full cleaned dataset — 17.3 MB", desc_s)],
        [Paragraph("initial_train.csv", file_s),
         Paragraph("Training split — 12.1 MB", desc_s)],
        [Paragraph("initial_test.csv", file_s),
         Paragraph("Test split — 5.2 MB", desc_s)],
        [Paragraph("Cheng_HoMan_Peng_Weitao_Report.docx", file_s),
         Paragraph("45–50 page final report with all tables, charts, and analysis", desc_s)],
        [Paragraph("Cheng_HoMan_Peng_Weitao_Slides.pptx", file_s),
         Paragraph("12-slide, 10-minute presentation deck", desc_s)],
        [Paragraph("Presentation_Script.html", file_s),
         Paragraph("Word-for-word script for both presenters", desc_s)],
        [Paragraph("QA_Preparation.html", file_s),
         Paragraph("6 Q&amp;A questions with full answers and fallback one-liners", desc_s)],
        [Paragraph("Cheng_HoMan_Peng_Weitao.zip", file_s),
         Paragraph("Final submission archive containing all required files", desc_s)],
    ]
    t = Table(data, colWidths=[2.6*inch, W - 2.6*inch])
    t.setStyle(TableStyle([
        ("BACKGROUND",    (0,0), (-1,0), NAVY),
        ("ROWBACKGROUNDS",(0,1),(-1,-1),[WHITE, LIGHT]),
        ("GRID",          (0,0),(-1,-1), 0.4, colors.HexColor("#D0D8E8")),
        ("LEFTPADDING",   (0,0),(-1,-1), 7),
        ("RIGHTPADDING",  (0,0),(-1,-1), 7),
        ("TOPPADDING",    (0,0),(-1,-1), 5),
        ("BOTTOMPADDING", (0,0),(-1,-1), 5),
        ("VALIGN",        (0,0),(-1,-1), "TOP"),
    ]))
    return t

def key_box(num, heading, body):
    h = Paragraph(f"{num}.  {heading}",
                  ps("kh", fontName="Helvetica-Bold", fontSize=11,
                     textColor=NAVY, leading=15, spaceBefore=4))
    b = Paragraph(body, sBody)
    accent_bar = Table([[[h, b]]], colWidths=[W])
    # Use a table with left accent stripe
    inner = Table([[h], [b]], colWidths=[W - 20])
    inner.setStyle(TableStyle([
        ("LEFTPADDING",  (0,0),(-1,-1), 0),
        ("RIGHTPADDING", (0,0),(-1,-1), 0),
        ("TOPPADDING",   (0,0),(-1,-1), 2),
        ("BOTTOMPADDING",(0,0),(-1,-1), 2),
    ]))
    outer = Table([[inner]], colWidths=[W])
    outer.setStyle(TableStyle([
        ("BACKGROUND",   (0,0),(-1,-1), LIGHT),
        ("LEFTPADDING",  (0,0),(-1,-1), 14),
        ("RIGHTPADDING", (0,0),(-1,-1), 14),
        ("TOPPADDING",   (0,0),(-1,-1), 8),
        ("BOTTOMPADDING",(0,0),(-1,-1), 8),
        ("LINEBEFORE",   (0,0),(0,-1),  5, ACCENT),
    ]))
    return outer

# ── Page template with footer ─────────────────────────────────────────────────
def on_page(canvas, doc):
    canvas.saveState()
    canvas.setFillColor(MUTED)
    canvas.setFont("Helvetica", 8)
    canvas.drawCentredString(
        letter[0] / 2, 0.5*inch,
        f"CS699 Data Mining  ·  Ho Man Cheng & Weitao Peng  ·  Page {doc.page}"
    )
    # top rule
    canvas.setStrokeColor(NAVY)
    canvas.setLineWidth(0.5)
    canvas.line(0.9*inch, letter[1]-0.65*inch, letter[0]-0.9*inch, letter[1]-0.65*inch)
    canvas.restoreState()

# ── Build story ───────────────────────────────────────────────────────────────
story = []

# Cover
story.append(cover_banner())
story.append(Spacer(1, 0.3*inch))

# ─────────────────────────────────────────────────────────────────────────────
# SECTION 1
# ─────────────────────────────────────────────────────────────────────────────
story.append(section_header(1, "What Is This Project About?"))
story.append(Spacer(1, 8))
story.append(Paragraph(
    "The goal is to <b>predict whether a U.S. household contains at least one person "
    "with a disability</b> — a Yes or No answer. This is called a <b>binary "
    "classification problem</b>.", sBody))
story.append(Paragraph(
    "The data comes from the <b>2023 American Housing Survey (AHS)</b>, a large national "
    "survey conducted by the U.S. Census Bureau. The survey collects information about "
    "households — things like income, housing type, household size, age of members, and "
    "health-related questions.", sBody))
story.append(Paragraph("<b>Why does this matter?</b> Knowing which households are likely "
    "to have a disabled member helps government agencies and policymakers:", sBody))
for b in ["Allocate accessible housing and financial support",
          "Plan disability services and healthcare resources",
          "Identify underserved communities"]:
    story.append(bullet(b))
story.append(Spacer(1, 12))

# ─────────────────────────────────────────────────────────────────────────────
# SECTION 2
# ─────────────────────────────────────────────────────────────────────────────
story.append(section_header(2, "The Raw Dataset"))
story.append(Spacer(1, 8))
story.append(Paragraph("The original AHS file had:", sBody))
for b in ["~12,000+ rows (each row = one household)",
          "145 columns (each column = one survey question or feature)",
          "All values are integer codes (e.g., 1 = Yes, 2 = No, -6 = Not applicable)",
          "Missing values recorded as NA",
          "One target column called CLASS — value is Yes or No"]:
    story.append(bullet(b))
story.append(Spacer(1, 6))
story.append(Paragraph(
    "<b>The key problem from the start: the classes were imbalanced.</b>", sBody))
for b in ["~30.4% of households = Yes (have a disabled member)",
          "~69.6% of households = No"]:
    story.append(bullet(b))
story.append(Paragraph(
    "This is a problem because a model could score <b>70% accuracy by always predicting No</b> "
    "— and still be useless for actually finding disabled households. So we needed special "
    "strategies to handle this.", sBody))
story.append(Spacer(1, 12))

# ─────────────────────────────────────────────────────────────────────────────
# SECTION 3
# ─────────────────────────────────────────────────────────────────────────────
story.append(section_header(3, "Data Preprocessing — 7 Steps"))
story.append(Spacer(1, 8))
story.append(Paragraph(
    "Raw data is messy. Before training any model, we had to clean and prepare it. "
    "Here is what we did and why:", sBody))
story.append(Spacer(1, 6))

steps = [
    ("Step 3.1 — Remove rows with missing CLASS label",
     "Drop any household row where the disability label (CLASS) is NA.",
     "A model cannot learn from rows where the answer is unknown. These rows are useless for training or testing.",
     "Went from ~12,000+ rows to 12,045 usable rows.", None),
    ("Step 3.2 — Drop the CONTROL column",
     "Remove the CONTROL column entirely.",
     "CONTROL is a unique household ID number. It has zero relationship to disability status. If we kept it, the model might memorize IDs instead of learning real patterns.",
     None, None),
    ("Step 3.3 — Convert everything to numeric",
     "Convert all remaining columns from factor/character type to numbers.",
     "Most R machine learning algorithms require numeric inputs. The AHS already uses integer codes, so this ensured R treated them as numbers, not categories.",
     None, None),
    ("Step 3.4 — Median Imputation (fill in missing values)",
     "For every column that still has NA values, replace each NA with the median of that column.",
     "We cannot leave gaps in the data — most algorithms crash on NA values. We use the median (not the mean) because the median is more robust to extreme outliers.",
     None, None),
    ("Step 3.5 — Near-Zero Variance (NZV) Filter",
     "Remove columns that are nearly constant — columns where almost every row has the same value.",
     "A column that is the same for 99.9% of households teaches the model nothing.",
     "Went from 144 features down to 118 features.",
     "We used a lenient threshold (99:1 frequency ratio) instead of the default strict threshold (95:5). Why? Because disability-related features like HHSEE (vision difficulty), HHMEMRY (memory difficulty), and HHCARE (self-care difficulty) are rare, and the default threshold would have deleted the most important predictors."),
    ("Step 3.6 — Winsorization (clip extreme outliers)",
     "For continuous numerical features (columns with more than 10 unique values), cap values below the 1st percentile up to the 1st percentile, and cap values above the 99th percentile down to the 99th percentile.",
     "Extreme outliers can distort model training — especially for algorithms sensitive to scale (SVM, KNN, Neural Networks). We only winsorized continuous features (10+ unique values); binary features were deliberately skipped to avoid collapsing their values to zero.",
     None, None),
    ("Step 3.7 — Center and Scale (Standardize)",
     "Transform every feature to have mean = 0 and standard deviation = 1.",
     "Algorithms like SVM, KNN, and Neural Networks are extremely sensitive to the scale of input variables. A feature measured in thousands would otherwise dominate a feature measured in ones. Centering and scaling puts all features on the same playing field.",
     None, None),
]
for tag, what, why, result, note in steps:
    story.append(KeepTogether(step_box(tag, what, why, result, note)))
    story.append(Spacer(1, 6))

story.append(Paragraph("<b>After preprocessing:</b>", sBody))
for b in ["9,636 rows for training",
          "2,409 rows for testing (held out completely, never touched during training)",
          "118 features ready for model training"]:
    story.append(bullet(b))
story.append(Spacer(1, 12))

# ─────────────────────────────────────────────────────────────────────────────
# SECTION 4
# ─────────────────────────────────────────────────────────────────────────────
story.append(section_header(4, "Class Balancing — 4 Methods"))
story.append(Spacer(1, 8))
story.append(Paragraph(
    "Even after preprocessing, the training set was still ~30% Yes / ~70% No. We applied four "
    "different techniques to balance the classes before training and tested all four to see "
    "which produced the best models.", sBody))
story.append(Paragraph(
    "<b>Critical rule:</b> Balancing was applied <b>only to the training set</b>. The test set "
    "was kept in its original imbalanced state — because that reflects real-world conditions.",
    sBody))
story.append(Spacer(1, 8))

story.append(two_method_row(
    "Method 1 — Random Undersampling",
    "Randomly remove No-class rows until Yes and No are equal in count.",
    "Simple, fast, and forces the model to focus equally on both classes. The downside is we discard a lot of majority-class data (~5,800 rows kept instead of 9,636).",
    "Method 2 — Random Oversampling",
    "Randomly duplicate Yes-class rows until Yes and No are equal.",
    "Keeps all original data. The downside is the model sees the same minority examples many times, which can lead to overfitting."
))
story.append(Spacer(1, 6))
story.append(two_method_row(
    "Method 3 — SMOTE (K=5)",
    "Synthesize new minority rows by interpolating between a real Yes row and its 5 nearest Yes neighbors.",
    "Creates more diverse minority examples than simple oversampling. Avoids exact duplicates while expanding minority representation.",
    "Method 4 — ROSE",
    "Use a smoothed bootstrap approach to generate a completely synthetic balanced dataset from both classes.",
    "More aggressive synthetic generation than SMOTE. In practice on our dataset, ROSE underperformed — its samples blurred the decision boundary."
))
story.append(Spacer(1, 12))

# ─────────────────────────────────────────────────────────────────────────────
# SECTION 5
# ─────────────────────────────────────────────────────────────────────────────
story.append(section_header(5, "The 9 Classification Algorithms"))
story.append(Spacer(1, 8))
story.append(Paragraph(
    "We trained 9 different types of models on each balanced dataset. "
    "<b>4 balancing methods × 9 algorithms = 36 models total.</b> "
    "Each model has a number: Model 1 = Under + LR, Model 2 = Under + DT, …, Model 36 = ROSE + XGBoost.",
    sBody))
story.append(Spacer(1, 6))
story.append(algo_table([
    ("Logistic Regression",   "Linear",        "Simple baseline; interpretable; fast"),
    ("Decision Tree",         "Tree",           "Interpretable; handles binary features well"),
    ("Random Forest",         "Ensemble Tree",  "Strong with noisy data; robust to overfitting"),
    ("GBM",                   "Ensemble Tree",  "Sequential boosting; usually high AUC"),
    ("XGBoost",               "Ensemble Tree",  "State-of-the-art for tabular data"),
    ("SVM (Radial Kernel)",   "Kernel",         "Effective in high-dimensional spaces (118 features)"),
    ("KNN",                   "Distance",       "Non-parametric; captures local structure"),
    ("Naive Bayes",           "Probabilistic",  "Fast; works well with noisy features"),
    ("Neural Network",        "Neural",         "Captures nonlinear interactions; single hidden layer"),
]))
story.append(Spacer(1, 12))

# ─────────────────────────────────────────────────────────────────────────────
# SECTION 6
# ─────────────────────────────────────────────────────────────────────────────
story.append(section_header(6, "Model Training & Tuning"))
story.append(Spacer(1, 8))
story.append(Paragraph(
    "Each of the 36 models was trained using <b>5-fold cross-validation</b> — "
    "but only for <b>hyperparameter tuning</b>, not for final evaluation.", sBody))
story.append(Paragraph(
    "<b>What is 5-fold CV?</b> Split the training data into 5 equal chunks. Train on 4 chunks, "
    "validate on 1. Repeat 5 times rotating which chunk is the validation set. Average the results "
    "to pick the best hyperparameters (e.g., tree depth, number of trees, regularization strength).",
    sBody))
story.append(Paragraph(
    "<b>Why CV only for tuning, not for evaluation?</b> Because final scores must come from the "
    "held-out test set — data the model has never seen. Using CV for final scoring would "
    "artificially inflate the numbers.", sBody))
story.append(Paragraph(
    "<b>One special case — XGBoost:</b> The xgboost package in R 3.x is incompatible with the "
    "caret framework. So we wrote a <b>manual 5-fold CV loop from scratch</b> just for XGBoost, "
    "while all other 8 algorithms used caret's built-in tuning.", sBody))
story.append(Spacer(1, 12))

# ─────────────────────────────────────────────────────────────────────────────
# SECTION 7
# ─────────────────────────────────────────────────────────────────────────────
story.append(section_header(7, "Evaluation Protocol"))
story.append(Spacer(1, 8))
story.append(Paragraph(
    "After training, each model made predictions on the <b>2,409 unbalanced test rows</b> "
    "using a <b>fixed decision threshold of 0.5</b>.", sBody))
story.append(Paragraph(
    "<b>Why a fixed threshold?</b> So every model is compared at the same operating point — "
    "a fair, apples-to-apples comparison. Allowing per-model threshold tuning would be data "
    "leakage (fitting the threshold to test data).", sBody))
story.append(Spacer(1, 6))
story.append(Paragraph("<b>Metrics tracked for each model:</b>", sBody))
story.append(metrics_table())
story.append(Spacer(1, 8))

# Extra credit callout
ec = Table([[
    Paragraph(
        "<b>Extra-credit targets set by the professor:</b>  "
        "Yes TPR &gt;= 0.77  AND  No TPR &gt;= 0.73  (both simultaneously = +20% extra credit)",
        ps("ec", fontName="Helvetica-Bold", fontSize=11, textColor=WHITE, leading=16))
]], colWidths=[W])
ec.setStyle(TableStyle([
    ("BACKGROUND",   (0,0),(-1,-1), ACCENT),
    ("LEFTPADDING",  (0,0),(-1,-1), 14),
    ("RIGHTPADDING", (0,0),(-1,-1), 14),
    ("TOPPADDING",   (0,0),(-1,-1), 10),
    ("BOTTOMPADDING",(0,0),(-1,-1), 10),
]))
story.append(ec)
story.append(Spacer(1, 12))

# ─────────────────────────────────────────────────────────────────────────────
# SECTION 8
# ─────────────────────────────────────────────────────────────────────────────
story.append(section_header(8, "Results Across All 36 Models"))
story.append(Spacer(1, 8))
story.append(Paragraph("After running all 36 models, the key patterns were:", sBody))
for b in [
    "Undersampling consistently produced the <b>highest Yes TPR</b> — but sometimes at the cost of No TPR",
    "Oversampling and SMOTE generally favoured <b>No TPR</b> — the majority class",
    "ROSE performed <b>worst on Yes TPR</b> — its synthetic samples blurred binary disability features",
    "Tree ensembles (RF, GBM, XGBoost) led on <b>AUC</b> — strong overall discrimination",
    "Only a <b>handful of models</b> crossed both thresholds simultaneously",
]:
    story.append(bullet(b))
story.append(Spacer(1, 12))

# ─────────────────────────────────────────────────────────────────────────────
# SECTION 9
# ─────────────────────────────────────────────────────────────────────────────
story.append(section_header(9, "The Best Model"))
story.append(Spacer(1, 8))
story.append(Paragraph(
    "<b>Model 2: Random Undersampling + Decision Tree</b> — the <b>only model</b> out of 36 "
    "to meet both extra-credit thresholds simultaneously.", sBody))
story.append(Spacer(1, 6))
story.append(best_model_table())
story.append(Spacer(1, 10))
story.append(Paragraph(
    "<b>Why did a simple Decision Tree win over XGBoost and Random Forest?</b>", sBody))
for b in [
    "XGBoost had a higher AUC (0.86) — meaning it ranked Yes above No better across all thresholds",
    "But at the fixed threshold of 0.5, XGBoost's probability outputs were clustered near 0.5, so many true Yes cases fell just below the cutoff",
    "The Decision Tree, trained on the 50/50 undersampled data, produced <b>confident, polarized probabilities</b> — Yes cases got scores like 0.8–0.9, not borderline 0.48",
    "The Decision Tree's binary splitting rules matched perfectly with binary disability indicator features (HHSEE, HHMEMRY, HHCARE, HHERRND) — these became the top nodes of the tree and created clean, decisive splits",
]:
    story.append(bullet(b))
story.append(Spacer(1, 12))

# ─────────────────────────────────────────────────────────────────────────────
# SECTION 10
# ─────────────────────────────────────────────────────────────────────────────
story.append(section_header(10, "Deliverables Produced"))
story.append(Spacer(1, 8))
story.append(deliverables_table())
story.append(Spacer(1, 12))

# ─────────────────────────────────────────────────────────────────────────────
# SECTION 11
# ─────────────────────────────────────────────────────────────────────────────
story.append(section_header(11, "Key Takeaways"))
story.append(Spacer(1, 8))

takeaways = [
    ("Preprocessing quality matters more than algorithm choice",
     "The lenient NZV threshold that preserved disability indicator features had more impact "
     "than which algorithm we picked. Getting the data right first is the foundation of everything."),
    ("Accuracy is a misleading metric under class imbalance",
     "We never used accuracy as our primary metric — Yes TPR and No TPR told the real story. "
     "A 70% accurate model that always predicts No is worthless for this task."),
    ("Simple models can beat complex ones",
     "When the evaluation metric favours clean decisions over probabilistic ranking, a pruned "
     "Decision Tree can outperform XGBoost and Random Forest."),
    ("Balancing method choice is critical",
     "Undersampling doubled the Yes TPR compared to ROSE. The choice of balancing method had "
     "a bigger effect than the choice of algorithm in many cases."),
    ("AUC does not equal task performance",
     "The models with the highest AUC (XGBoost, Random Forest) did not win on the metric the "
     "professor actually graded — per-class TPR at a fixed threshold of 0.5."),
]
for i, (h, b) in enumerate(takeaways, 1):
    story.append(KeepTogether(key_box(i, h, b)))
    story.append(Spacer(1, 6))

story.append(Spacer(1, 0.3*inch))

# ── Build ─────────────────────────────────────────────────────────────────────
doc.build(story, onFirstPage=on_page, onLaterPages=on_page)
print(f"PDF saved to: {OUTPUT}")
