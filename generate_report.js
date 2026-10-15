const fs = require("fs");
const {
  Document, Packer, Paragraph, TextRun, Table, TableRow, TableCell,
  Header, Footer, AlignmentType, HeadingLevel, BorderStyle, WidthType,
  ShadingType, PageBreak, PageNumber, TableOfContents, LevelFormat, ImageRun
} = require("docx");

const chartDir = "D:\\VS Code\\VS Code Project\\BU\\699 HW\\Project_New\\charts";
function chartImg(filename, widthInches, heightInches) {
  return new Paragraph({
    alignment: AlignmentType.CENTER,
    spacing: { before: 120, after: 120 },
    children: [new ImageRun({
      type: "png",
      data: fs.readFileSync(chartDir + "\\" + filename),
      transformation: { width: Math.round(widthInches * 96), height: Math.round(heightInches * 96) },
      altText: { title: filename, description: filename, name: filename }
    })]
  });
}

// ============================================================
// ALL 36 MODEL DATA — extracted from run output
// Each: [TN, FN, FP, TP], [TPR, FPR, Prec, Rec, F1] for No/Yes/WA, auc, mcc, kappa
// ============================================================
const M = [
  { id:1, bal:"Random Undersampling", alg:"Logistic Regression",
    cm:[1563,174,282,390],
    no:[0.8472,0.3085,0.8998,0.8472,0.8727], yes:[0.6915,0.1528,0.5804,0.6915,0.6311], wa:[0.8107,0.2721,0.8250,0.8107,0.8161],
    auc:0.8528, mcc:0.5086, kap:0.5051 },
  { id:2, bal:"Random Undersampling", alg:"Decision Tree (CART)",
    cm:[1351,128,494,436],
    no:[0.7322,0.2270,0.9135,0.7322,0.8129], yes:[0.7730,0.2678,0.4688,0.7730,0.5837], wa:[0.7418,0.2365,0.8094,0.7418,0.7592],
    auc:0.7887, mcc:0.4395, kap:0.4124 },
  { id:3, bal:"Random Undersampling", alg:"Random Forest",
    cm:[1520,168,325,396],
    no:[0.8238,0.2979,0.9005,0.8238,0.8605], yes:[0.7021,0.1762,0.5492,0.7021,0.6163], wa:[0.7954,0.2694,0.8182,0.7954,0.8033],
    auc:0.8491, mcc:0.4864, kap:0.4796 },
  { id:4, bal:"Random Undersampling", alg:"Gradient Boosting (GBM)",
    cm:[1532,155,313,409],
    no:[0.8304,0.2748,0.9081,0.8304,0.8675], yes:[0.7252,0.1696,0.5665,0.7252,0.6361], wa:[0.8057,0.2502,0.8281,0.8057,0.8133],
    auc:0.8567, mcc:0.5135, kap:0.5063 },
  { id:5, bal:"Random Undersampling", alg:"SVM (Radial Kernel)",
    cm:[1498,160,347,404],
    no:[0.8119,0.2837,0.9035,0.8119,0.8553], yes:[0.7163,0.1881,0.5379,0.7163,0.6144], wa:[0.7895,0.2613,0.8179,0.7895,0.7989],
    auc:0.8506, mcc:0.4829, kap:0.4737 },
  { id:6, bal:"Random Undersampling", alg:"K-Nearest Neighbors",
    cm:[1668,305,177,259],
    no:[0.9041,0.5408,0.8454,0.9041,0.8738], yes:[0.4592,0.0959,0.5940,0.4592,0.5180], wa:[0.7999,0.4366,0.7866,0.7999,0.7905],
    auc:0.7842, mcc:0.3996, kap:0.3944 },
  { id:7, bal:"Random Undersampling", alg:"Naive Bayes",
    cm:[1783,488,62,76],
    no:[0.9664,0.8652,0.7851,0.9664,0.8664], yes:[0.1348,0.0336,0.5507,0.1348,0.2165], wa:[0.7717,0.6705,0.7302,0.7717,0.7142],
    auc:0.7527, mcc:0.1843, kap:0.1371 },
  { id:8, bal:"Random Undersampling", alg:"Neural Network",
    cm:[1367,181,478,383],
    no:[0.7409,0.3209,0.8831,0.7409,0.8058], yes:[0.6791,0.2591,0.4448,0.6791,0.5375], wa:[0.7264,0.3064,0.7805,0.7264,0.7430],
    auc:0.7857, mcc:0.3711, kap:0.3551 },
  { id:9, bal:"Random Undersampling", alg:"XGBoost",
    cm:[1568,170,277,394],
    no:[0.8499,0.3014,0.9022,0.8499,0.8752], yes:[0.6986,0.1501,0.5872,0.6986,0.6381], wa:[0.8144,0.2660,0.8284,0.8144,0.8197],
    auc:0.8596, mcc:0.5181, kap:0.5146 },
  // --- Oversampling ---
  { id:10, bal:"Random Oversampling", alg:"Logistic Regression",
    cm:[1588,179,257,385],
    no:[0.8607,0.3174,0.8987,0.8607,0.8793], yes:[0.6826,0.1393,0.5997,0.6826,0.6385], wa:[0.8190,0.2757,0.8287,0.8190,0.8229],
    auc:0.8568, mcc:0.5204, kap:0.5184 },
  { id:11, bal:"Random Oversampling", alg:"Decision Tree (CART)",
    cm:[1518,204,327,360],
    no:[0.8228,0.3617,0.8815,0.8228,0.8511], yes:[0.6383,0.1772,0.5240,0.6383,0.5755], wa:[0.7796,0.3185,0.7978,0.7796,0.7866],
    auc:0.7505, mcc:0.4324, kap:0.4286 },
  { id:12, bal:"Random Oversampling", alg:"Random Forest",
    cm:[1802,310,43,254],
    no:[0.9767,0.5496,0.8532,0.9767,0.9108], yes:[0.4504,0.0233,0.8552,0.4504,0.5900], wa:[0.8535,0.4264,0.8537,0.8535,0.8357],
    auc:0.8537, mcc:0.5500, kap:0.5110 },
  { id:13, bal:"Random Oversampling", alg:"Gradient Boosting (GBM)",
    cm:[1632,198,213,366],
    no:[0.8846,0.3511,0.8918,0.8846,0.8882], yes:[0.6489,0.1154,0.6321,0.6489,0.6404], wa:[0.8294,0.2959,0.8310,0.8294,0.8302],
    auc:0.8495, mcc:0.5287, kap:0.5286 },
  { id:14, bal:"Random Oversampling", alg:"SVM (Radial Kernel)",
    cm:[1693,251,152,313],
    no:[0.9176,0.4450,0.8709,0.9176,0.8936], yes:[0.5550,0.0824,0.6731,0.5550,0.6084], wa:[0.8327,0.3601,0.8246,0.8327,0.8268],
    auc:0.8272, mcc:0.5070, kap:0.5032 },
  { id:15, bal:"Random Oversampling", alg:"K-Nearest Neighbors",
    cm:[1403,246,442,318],
    no:[0.7604,0.4362,0.8508,0.7604,0.8031], yes:[0.5638,0.2396,0.4184,0.5638,0.4804], wa:[0.7144,0.3901,0.7496,0.7144,0.7275],
    auc:0.6823, mcc:0.2955, kap:0.2894 },
  { id:16, bal:"Random Oversampling", alg:"Naive Bayes",
    cm:[1793,487,52,77],
    no:[0.9718,0.8635,0.7864,0.9718,0.8693], yes:[0.1365,0.0282,0.5969,0.1365,0.2222], wa:[0.7763,0.6679,0.7420,0.7763,0.7178],
    auc:0.7583, mcc:0.2038, kap:0.1480 },
  { id:17, bal:"Random Oversampling", alg:"Neural Network",
    cm:[1584,260,261,304],
    no:[0.8585,0.4610,0.8590,0.8585,0.8588], yes:[0.5390,0.1415,0.5381,0.5390,0.5385], wa:[0.7837,0.3862,0.7839,0.7837,0.7838],
    auc:0.7673, mcc:0.3973, kap:0.3973 },
  { id:18, bal:"Random Oversampling", alg:"XGBoost",
    cm:[1772,291,73,273],
    no:[0.9604,0.5160,0.8589,0.9604,0.9069], yes:[0.4840,0.0396,0.7890,0.4840,0.6000], wa:[0.8489,0.4044,0.8426,0.8489,0.8350],
    auc:0.8425, mcc:0.5367, kap:0.5134 },
  // --- SMOTE ---
  { id:19, bal:"SMOTE", alg:"Logistic Regression",
    cm:[1613,184,232,380],
    no:[0.8743,0.3262,0.8976,0.8743,0.8858], yes:[0.6738,0.1257,0.6209,0.6738,0.6463], wa:[0.8273,0.2793,0.8328,0.8273,0.8297],
    auc:0.8539, mcc:0.5331, kap:0.5323 },
  { id:20, bal:"SMOTE", alg:"Decision Tree (CART)",
    cm:[1722,278,123,286],
    no:[0.9333,0.4929,0.8610,0.9333,0.8957], yes:[0.5071,0.0667,0.6993,0.5071,0.5879], wa:[0.8335,0.3931,0.8231,0.8335,0.8236],
    auc:0.8082, mcc:0.4967, kap:0.4869 },
  { id:21, bal:"SMOTE", alg:"Random Forest",
    cm:[1805,329,40,235],
    no:[0.9783,0.5833,0.8458,0.9783,0.9073], yes:[0.4167,0.0217,0.8545,0.4167,0.5602], wa:[0.8468,0.4518,0.8479,0.8468,0.8260],
    auc:0.8518, mcc:0.5260, kap:0.4805 },
  { id:22, bal:"SMOTE", alg:"Gradient Boosting (GBM)",
    cm:[1778,288,67,276],
    no:[0.9637,0.5106,0.8606,0.9637,0.9092], yes:[0.4894,0.0363,0.8047,0.4894,0.6086], wa:[0.8526,0.3996,0.8475,0.8526,0.8388],
    auc:0.8511, mcc:0.5490, kap:0.5244 },
  { id:23, bal:"SMOTE", alg:"SVM (Radial Kernel)",
    cm:[1694,274,151,290],
    no:[0.9182,0.4858,0.8608,0.9182,0.8885], yes:[0.5142,0.0818,0.6576,0.5142,0.5771], wa:[0.8236,0.3912,0.8132,0.8236,0.8156],
    auc:0.8082, mcc:0.4734, kap:0.4678 },
  { id:24, bal:"SMOTE", alg:"K-Nearest Neighbors",
    cm:[1231,192,614,372],
    no:[0.6672,0.3404,0.8651,0.6672,0.7534], yes:[0.6596,0.3328,0.3773,0.6596,0.4800], wa:[0.6654,0.3386,0.7509,0.6654,0.6894],
    auc:0.7137, mcc:0.2814, kap:0.2594 },
  { id:25, bal:"SMOTE", alg:"Naive Bayes",
    cm:[1844,559,1,5],
    no:[0.9995,0.9911,0.7674,0.9995,0.8682], yes:[0.0089,0.0005,0.8333,0.0089,0.0175], wa:[0.7675,0.7592,0.7828,0.7675,0.6690],
    auc:0.7497, mcc:0.0707, kap:0.0127 },
  { id:26, bal:"SMOTE", alg:"Neural Network",
    cm:[1534,224,311,340],
    no:[0.8314,0.3972,0.8726,0.8314,0.8515], yes:[0.6028,0.1686,0.5223,0.6028,0.5597], wa:[0.7779,0.3436,0.7906,0.7779,0.7832],
    auc:0.7901, mcc:0.4141, kap:0.4122 },
  { id:27, bal:"SMOTE", alg:"XGBoost",
    cm:[1808,313,37,251],
    no:[0.9799,0.5550,0.8524,0.9799,0.9117], yes:[0.4450,0.0201,0.8715,0.4450,0.5892], wa:[0.8547,0.4297,0.8569,0.8547,0.8362],
    auc:0.8570, mcc:0.5547, kap:0.5120 },
  // --- ROSE ---
  { id:28, bal:"ROSE", alg:"Logistic Regression",
    cm:[1523,163,322,401],
    no:[0.8255,0.2890,0.9033,0.8255,0.8626], yes:[0.7110,0.1745,0.5546,0.7110,0.6232], wa:[0.7987,0.2622,0.8217,0.7987,0.8066],
    auc:0.8494, mcc:0.4957, kap:0.4886 },
  { id:29, bal:"ROSE", alg:"Decision Tree (CART)",
    cm:[1845,450,0,114],
    no:[1.0000,0.7979,0.8039,1.0000,0.8913], yes:[0.2021,0.0000,1.0000,0.2021,0.3363], wa:[0.8132,0.6111,0.8498,0.8132,0.7614],
    auc:0.6011, mcc:0.4031, kap:0.2796 },
  { id:30, bal:"ROSE", alg:"Random Forest",
    cm:[1845,436,0,128],
    no:[1.0000,0.7730,0.8089,1.0000,0.8943], yes:[0.2270,0.0000,1.0000,0.2270,0.3699], wa:[0.8190,0.5921,0.8536,0.8190,0.7716],
    auc:0.7067, mcc:0.4285, kap:0.3102 },
  { id:31, bal:"ROSE", alg:"Gradient Boosting (GBM)",
    cm:[1845,486,0,78],
    no:[1.0000,0.8617,0.7915,1.0000,0.8836], yes:[0.1383,0.0000,1.0000,0.1383,0.2430], wa:[0.7983,0.6600,0.8403,0.7983,0.7336],
    auc:0.6862, mcc:0.3309, kap:0.1973 },
  { id:32, bal:"ROSE", alg:"SVM (Radial Kernel)",
    cm:[1823,389,22,175],
    no:[0.9881,0.6897,0.8241,0.9881,0.8987], yes:[0.3103,0.0119,0.8883,0.3103,0.4599], wa:[0.8294,0.5310,0.8392,0.8294,0.7960],
    auc:0.8335, mcc:0.4611, kap:0.3854 },
  { id:33, bal:"ROSE", alg:"K-Nearest Neighbors",
    cm:[1816,465,29,99],
    no:[0.9843,0.8245,0.7961,0.9843,0.8803], yes:[0.1755,0.0157,0.7734,0.1755,0.2861], wa:[0.7949,0.6351,0.7908,0.7949,0.7412],
    auc:0.6454, mcc:0.3017, kap:0.2184 },
  { id:34, bal:"ROSE", alg:"Naive Bayes",
    cm:[1833,517,12,47],
    no:[0.9935,0.9167,0.7800,0.9935,0.8739], yes:[0.0833,0.0065,0.7966,0.0833,0.1509], wa:[0.7804,0.7036,0.7839,0.7804,0.7046],
    auc:0.7709, mcc:0.2105, kap:0.1115 },
  { id:35, bal:"ROSE", alg:"Neural Network",
    cm:[1831,348,14,216],
    no:[0.9924,0.6170,0.8403,0.9924,0.9100], yes:[0.3830,0.0076,0.9391,0.3830,0.5441], wa:[0.8497,0.4743,0.8634,0.8497,0.8244],
    auc:0.7354, mcc:0.5409, kap:0.4725 },
  { id:36, bal:"ROSE", alg:"XGBoost",
    cm:[1845,440,0,124],
    no:[1.0000,0.7801,0.8074,1.0000,0.8935], yes:[0.2199,0.0000,1.0000,0.2199,0.3605], wa:[0.8174,0.5975,0.8525,0.8174,0.7687],
    auc:0.6869, mcc:0.4213, kap:0.3015 },
];

// ============================================================
// HELPER FUNCTIONS
// ============================================================
const brd = { style: BorderStyle.SINGLE, size: 1, color: "999999" };
const borders = { top: brd, bottom: brd, left: brd, right: brd };

function c(text, width, opts = {}) {
  const runs = [new TextRun({ text: String(text), bold: !!opts.bold, size: opts.size || 18, font: "Times New Roman" })];
  return new TableCell({
    width: { size: width, type: WidthType.DXA },
    borders,
    margins: { top: 40, bottom: 40, left: 80, right: 80 },
    shading: opts.hdr ? { fill: "D5E8F0", type: ShadingType.CLEAR } : undefined,
    verticalAlign: "center",
    children: [new Paragraph({ alignment: opts.left ? AlignmentType.LEFT : AlignmentType.CENTER, children: runs })]
  });
}

function f4(v) { return v.toFixed(4); }

function cmTable(cm) {
  const [tn, fn, fp, tp] = cm;
  const w = [2500, 3430, 3430];
  return new Table({
    width: { size: 9360, type: WidthType.DXA },
    columnWidths: w,
    rows: [
      new TableRow({ children: [c("", w[0], {hdr:true}), c("Predicted: No", w[1], {hdr:true, bold:true}), c("Predicted: Yes", w[2], {hdr:true, bold:true})] }),
      new TableRow({ children: [c("Actual: No", w[0], {hdr:true, bold:true}), c(String(tn), w[1]), c(String(fp), w[2])] }),
      new TableRow({ children: [c("Actual: Yes", w[0], {hdr:true, bold:true}), c(String(fn), w[1]), c(String(tp), w[2])] }),
    ]
  });
}

function perfTable(m) {
  const w = [1400, 950, 950, 1050, 950, 1060, 1050, 900, 1050];
  const hdrs = ["Class","TP Rate","FP Rate","Precision","Recall","F-Measure","ROC Area","MCC","Kappa"];
  function row(label, d, auc, mcc, kap, isHdr) {
    return new TableRow({ children: [
      c(label, w[0], {bold:true, left:true, hdr:isHdr}),
      c(f4(d[0]), w[1], {hdr:isHdr}), c(f4(d[1]), w[2], {hdr:isHdr}), c(f4(d[2]), w[3], {hdr:isHdr}),
      c(f4(d[3]), w[4], {hdr:isHdr}), c(f4(d[4]), w[5], {hdr:isHdr}), c(f4(auc), w[6], {hdr:isHdr}),
      c(f4(mcc), w[7], {hdr:isHdr}), c(f4(kap), w[8], {hdr:isHdr})
    ] });
  }
  return new Table({
    width: { size: 9360, type: WidthType.DXA },
    columnWidths: w,
    rows: [
      new TableRow({ children: hdrs.map((h,i) => c(h, w[i], {hdr:true, bold:true})) }),
      row("No", m.no, m.auc, m.mcc, m.kap, false),
      row("Yes", m.yes, m.auc, m.mcc, m.kap, false),
      row("Wtd Avg", m.wa, m.auc, m.mcc, m.kap, false),
    ]
  });
}

function p(text, opts = {}) {
  return new Paragraph({
    spacing: { before: opts.spaceBefore || 0, after: opts.spaceAfter || 120, line: 240 },
    alignment: opts.align || AlignmentType.LEFT,
    heading: opts.heading,
    children: [new TextRun({ text, bold: !!opts.bold, size: opts.size || 24, font: "Times New Roman", italics: !!opts.italic })]
  });
}

function modelSection(m) {
  return [
    new Paragraph({
      spacing: { before: 200, after: 80 },
      heading: HeadingLevel.HEADING_3,
      children: [new TextRun({ text: `Model ${m.id}: ${m.bal} + ${m.alg}`, font: "Times New Roman" })]
    }),
    p("Confusion Matrix:", { bold: true, size: 20, spaceAfter: 40 }),
    cmTable(m.cm),
    p("Performance Metrics:", { bold: true, size: 20, spaceBefore: 80, spaceAfter: 40 }),
    perfTable(m),
    p(`Summary: Yes TPR = ${f4(m.yes[0])}, No TPR = ${f4(m.no[0])}, AUC = ${f4(m.auc)}`, { size: 20, italic: true, spaceAfter: 140 }),
  ];
}

// ============================================================
// BUILD DOCUMENT
// ============================================================
const doc = new Document({
  styles: {
    default: { document: { run: { font: "Times New Roman", size: 24 }, paragraph: { spacing: { line: 240 } } } },
    paragraphStyles: [
      { id: "Heading1", name: "Heading 1", basedOn: "Normal", next: "Normal", quickFormat: true,
        run: { size: 32, bold: true, font: "Times New Roman", color: "1F3864" },
        paragraph: { spacing: { before: 280, after: 160 }, outlineLevel: 0 } },
      { id: "Heading2", name: "Heading 2", basedOn: "Normal", next: "Normal", quickFormat: true,
        run: { size: 28, bold: true, font: "Times New Roman", color: "2E75B6" },
        paragraph: { spacing: { before: 200, after: 120 }, outlineLevel: 1 } },
      { id: "Heading3", name: "Heading 3", basedOn: "Normal", next: "Normal", quickFormat: true,
        run: { size: 24, bold: true, font: "Times New Roman", color: "404040" },
        paragraph: { spacing: { before: 160, after: 80 }, outlineLevel: 2 } },
    ]
  },
  numbering: {
    config: [
      { reference: "bullets", levels: [
        { level: 0, format: LevelFormat.BULLET, text: "\u2022", alignment: AlignmentType.LEFT,
          style: { paragraph: { indent: { left: 720, hanging: 360 } } } },
        { level: 1, format: LevelFormat.BULLET, text: "\u25E6", alignment: AlignmentType.LEFT,
          style: { paragraph: { indent: { left: 1440, hanging: 360 } } } },
      ]},
      { reference: "numbers", levels: [
        { level: 0, format: LevelFormat.DECIMAL, text: "%1.", alignment: AlignmentType.LEFT,
          style: { paragraph: { indent: { left: 720, hanging: 360 } } } },
      ]},
      { reference: "numbers2", levels: [
        { level: 0, format: LevelFormat.DECIMAL, text: "%1.", alignment: AlignmentType.LEFT,
          style: { paragraph: { indent: { left: 720, hanging: 360 } } } },
      ]},
    ]
  },
  sections: [
    // ============================================================
    // COVER PAGE
    // ============================================================
    {
      properties: {
        page: {
          size: { width: 12240, height: 15840 },
          margin: { top: 1440, right: 1440, bottom: 1440, left: 1440 }
        }
      },
      children: [
        new Paragraph({ spacing: { before: 3600 }, alignment: AlignmentType.CENTER, children: [] }),
        new Paragraph({ alignment: AlignmentType.CENTER, spacing: { after: 200 }, children: [
          new TextRun({ text: "CS699 Data Mining", size: 40, bold: true, font: "Times New Roman", color: "1F3864" })
        ]}),
        new Paragraph({ alignment: AlignmentType.CENTER, spacing: { after: 400 }, children: [
          new TextRun({ text: "Classification Project", size: 48, bold: true, font: "Times New Roman", color: "1F3864" })
        ]}),
        new Paragraph({ alignment: AlignmentType.CENTER, spacing: { after: 200 }, children: [
          new TextRun({ text: "Classification of Disability Status in U.S. Households", size: 28, font: "Times New Roman", color: "404040" })
        ]}),
        new Paragraph({ alignment: AlignmentType.CENTER, spacing: { after: 100 }, children: [
          new TextRun({ text: "Using the 2023 American Housing Survey (AHS) Dataset", size: 24, font: "Times New Roman", color: "404040" })
        ]}),
        new Paragraph({ spacing: { before: 800 }, alignment: AlignmentType.CENTER, children: [] }),
        new Paragraph({ alignment: AlignmentType.CENTER, spacing: { after: 200 }, children: [
          new TextRun({ text: "Team Members:", size: 28, bold: true, font: "Times New Roman" })
        ]}),
        new Paragraph({ alignment: AlignmentType.CENTER, spacing: { after: 100 }, children: [
          new TextRun({ text: "Ho Man Cheng", size: 26, font: "Times New Roman" })
        ]}),
        new Paragraph({ alignment: AlignmentType.CENTER, spacing: { after: 400 }, children: [
          new TextRun({ text: "Weitao Peng", size: 26, font: "Times New Roman" })
        ]}),
        new Paragraph({ spacing: { before: 600 }, alignment: AlignmentType.CENTER, children: [
          new TextRun({ text: "Boston University", size: 24, font: "Times New Roman", color: "666666" })
        ]}),
        new Paragraph({ alignment: AlignmentType.CENTER, children: [
          new TextRun({ text: "Metropolitan College", size: 24, font: "Times New Roman", color: "666666" })
        ]}),
      ]
    },
    // ============================================================
    // TABLE OF CONTENTS
    // ============================================================
    {
      properties: {
        page: {
          size: { width: 12240, height: 15840 },
          margin: { top: 1440, right: 1440, bottom: 1440, left: 1440 }
        }
      },
      headers: {
        default: new Header({ children: [new Paragraph({ alignment: AlignmentType.RIGHT, children: [
          new TextRun({ text: "CS699 Classification Project", size: 18, font: "Times New Roman", color: "999999", italics: true })
        ]})] })
      },
      footers: {
        default: new Footer({ children: [new Paragraph({ alignment: AlignmentType.CENTER, children: [
          new TextRun({ text: "Page ", size: 18, font: "Times New Roman" }),
          new TextRun({ children: [PageNumber.CURRENT], size: 18, font: "Times New Roman" })
        ]})] })
      },
      children: [
        new Paragraph({ heading: HeadingLevel.HEADING_1, children: [new TextRun("Table of Contents")] }),
        new TableOfContents("Table of Contents", { hyperlink: true, headingStyleRange: "1-3" }),
        new Paragraph({ children: [new PageBreak()] }),
        // ============================================================
        // SECTION 1: DATA MINING TOOLS
        // ============================================================
        new Paragraph({ heading: HeadingLevel.HEADING_1, children: [new TextRun("1. Data Mining Tools")] }),
        p("This project was developed using R version 4.5.2 as the primary data mining and statistical computing platform. R was chosen for its extensive ecosystem of machine learning and data preprocessing libraries, its strong support for reproducible research, and its compliance with the course requirements."),
        p("The following R packages were used in this project:"),
        new Paragraph({ numbering: { reference: "bullets", level: 0 }, children: [
          new TextRun({ text: "caret", bold: true, size: 24, font: "Times New Roman" }),
          new TextRun({ text: " (v6.0-94): The primary framework for model training, hyperparameter tuning via cross-validation, and data splitting. Provides a unified interface for over 200 classification and regression algorithms.", size: 24, font: "Times New Roman" })
        ]}),
        new Paragraph({ numbering: { reference: "bullets", level: 0 }, children: [
          new TextRun({ text: "e1071", bold: true, size: 24, font: "Times New Roman" }),
          new TextRun({ text: ": Backend support functions for SVM and Naive Bayes classifiers.", size: 24, font: "Times New Roman" })
        ]}),
        new Paragraph({ numbering: { reference: "bullets", level: 0 }, children: [
          new TextRun({ text: "randomForest", bold: true, size: 24, font: "Times New Roman" }),
          new TextRun({ text: " (v4.7-1.2): Implementation of Breiman's Random Forest ensemble algorithm.", size: 24, font: "Times New Roman" })
        ]}),
        new Paragraph({ numbering: { reference: "bullets", level: 0 }, children: [
          new TextRun({ text: "rpart", bold: true, size: 24, font: "Times New Roman" }),
          new TextRun({ text: ": Recursive partitioning for decision tree (CART) classification.", size: 24, font: "Times New Roman" })
        ]}),
        new Paragraph({ numbering: { reference: "bullets", level: 0 }, children: [
          new TextRun({ text: "gbm", bold: true, size: 24, font: "Times New Roman" }),
          new TextRun({ text: " (v2.2.3): Gradient Boosting Machine implementation.", size: 24, font: "Times New Roman" })
        ]}),
        new Paragraph({ numbering: { reference: "bullets", level: 0 }, children: [
          new TextRun({ text: "xgboost", bold: true, size: 24, font: "Times New Roman" }),
          new TextRun({ text: " (v3.2.0): Extreme Gradient Boosting. Due to incompatibility between xgboost 3.x and caret's xgbTree method, a manual 5-fold cross-validation wrapper was implemented using the direct xgboost API.", size: 24, font: "Times New Roman" })
        ]}),
        new Paragraph({ numbering: { reference: "bullets", level: 0 }, children: [
          new TextRun({ text: "nnet", bold: true, size: 24, font: "Times New Roman" }),
          new TextRun({ text: ": Single hidden-layer neural network for classification.", size: 24, font: "Times New Roman" })
        ]}),
        new Paragraph({ numbering: { reference: "bullets", level: 0 }, children: [
          new TextRun({ text: "kernlab", bold: true, size: 24, font: "Times New Roman" }),
          new TextRun({ text: ": SVM implementation with radial basis function (RBF) kernel.", size: 24, font: "Times New Roman" })
        ]}),
        new Paragraph({ numbering: { reference: "bullets", level: 0 }, children: [
          new TextRun({ text: "naivebayes", bold: true, size: 24, font: "Times New Roman" }),
          new TextRun({ text: ": Naive Bayes classifier with kernel density estimation support.", size: 24, font: "Times New Roman" })
        ]}),
        new Paragraph({ numbering: { reference: "bullets", level: 0 }, children: [
          new TextRun({ text: "ROSE", bold: true, size: 24, font: "Times New Roman" }),
          new TextRun({ text: " (v0.0-4): Random Over-Sampling Examples for class balancing via kernel density estimation.", size: 24, font: "Times New Roman" })
        ]}),
        new Paragraph({ numbering: { reference: "bullets", level: 0 }, children: [
          new TextRun({ text: "smotefamily", bold: true, size: 24, font: "Times New Roman" }),
          new TextRun({ text: ": SMOTE (Synthetic Minority Over-sampling Technique) implementation for class balancing.", size: 24, font: "Times New Roman" })
        ]}),
        new Paragraph({ numbering: { reference: "bullets", level: 0 }, spacing: { after: 200 }, children: [
          new TextRun({ text: "pROC", bold: true, size: 24, font: "Times New Roman" }),
          new TextRun({ text: ": ROC curve analysis and AUC (Area Under Curve) computation.", size: 24, font: "Times New Roman" })
        ]}),
        p("All code was written in a single R script file (project_code.R) and executed in a non-interactive batch mode using Rscript.exe. The set.seed(699) function was used throughout to ensure full reproducibility of results."),

        new Paragraph({ children: [new PageBreak()] }),
        // ============================================================
        // SECTION 2: CLASSIFICATION ALGORITHMS
        // ============================================================
        new Paragraph({ heading: HeadingLevel.HEADING_1, children: [new TextRun("2. Classification Algorithms")] }),
        p("Nine classification algorithms were employed in this project, each representing a different approach to pattern recognition and decision boundary formation. Every algorithm was applied across all four balancing methods, yielding 36 models total."),

        new Paragraph({ heading: HeadingLevel.HEADING_2, children: [new TextRun("2.1 Logistic Regression")] }),
        p("Logistic Regression is a linear classifier that models the probability of class membership using the logistic (sigmoid) function. It estimates a linear decision boundary in the feature space by maximizing the log-likelihood of observed class labels. Trained via caret's \"glm\" method with family = \"binomial\". No tuning parameters are required."),
        p("Pros: Highly interpretable with coefficient-based feature importance; fast to train; outputs well-calibrated probabilities; performs well when the decision boundary is approximately linear. Cons: Cannot capture non-linear relationships without manual feature engineering; may underperform when features interact in complex ways."),
        p("Reason for selection: Logistic Regression serves as a strong linear baseline. Comparing its performance against non-linear models helps quantify whether the classification task requires complex decision boundaries."),

        new Paragraph({ heading: HeadingLevel.HEADING_2, children: [new TextRun("2.2 Decision Tree (CART)")] }),
        p("Classification and Regression Trees (CART), implemented via the rpart package, recursively partition the feature space into homogeneous regions using binary splits. At each node, the algorithm selects the feature and threshold that maximizes information gain (Gini impurity reduction). The complexity parameter (cp) controls tree pruning: higher cp values produce simpler trees. Tuning grid: cp = {0.001, 0.005, 0.01, 0.02, 0.05}."),
        p("Pros: Highly interpretable (visual tree structure); handles both numeric and categorical features; no feature scaling required; captures non-linear relationships and feature interactions naturally. Cons: Prone to overfitting with deep trees; high variance (small data changes can alter the tree structure); greedy splitting may miss globally optimal partitions."),
        p("Reason for selection: Decision Trees provide a transparent, rule-based model that is particularly effective at isolating strong binary indicators (e.g., disability flags). Their sensitivity to class balance makes them ideal candidates for undersampling-based approaches."),

        new Paragraph({ heading: HeadingLevel.HEADING_2, children: [new TextRun("2.3 Random Forest")] }),
        p("Random Forest is an ensemble method that constructs multiple decision trees on bootstrapped subsets of the training data, with random feature subsets considered at each split (controlled by the mtry parameter). Final predictions are made by majority vote across all trees. This approach reduces variance and mitigates overfitting compared to single decision trees. Tuned via caret with tuneLength = 5, which searches 5 different mtry values."),
        p("Pros: Reduces variance through bagging; robust to noise and overfitting; handles high-dimensional data well; provides feature importance rankings. Cons: Less interpretable than single trees; computationally expensive for large datasets; can be biased toward the majority class in imbalanced settings."),
        p("Reason for selection: Random Forest addresses the overfitting weakness of individual Decision Trees while maintaining strong predictive power. It is a natural extension to compare against standalone CART performance."),

        new Paragraph({ heading: HeadingLevel.HEADING_2, children: [new TextRun("2.4 Gradient Boosting Machine (GBM)")] }),
        p("GBM builds an additive ensemble of weak learners (shallow decision trees) sequentially, where each new tree corrects the residual errors of the cumulative ensemble. Key tuning parameters include the number of trees (n.trees), interaction depth, shrinkage (learning rate), and minimum observations per node. Tuning grid: n.trees = {100, 200, 300}, interaction.depth = {3, 5}, shrinkage = {0.01, 0.1}, n.minobsinnode = 10."),
        p("Pros: Often achieves state-of-the-art accuracy; handles complex non-linear patterns; built-in regularization through shrinkage; less prone to overfitting than unboosted trees. Cons: Slow to train due to sequential nature; sensitive to hyperparameter tuning; less interpretable than single trees; can overfit with too many boosting rounds."),
        p("Reason for selection: GBM represents sequential ensemble learning, complementing Random Forest (parallel ensemble). Its gradient-based optimization often achieves higher discriminative power (AUC) than other methods."),

        new Paragraph({ heading: HeadingLevel.HEADING_2, children: [new TextRun("2.5 Support Vector Machine (Radial Kernel)")] }),
        p("SVM with a Radial Basis Function (RBF) kernel maps input features into a high-dimensional space where a maximum-margin hyperplane separates the classes. The RBF kernel enables non-linear decision boundaries. The cost parameter (C) controls the trade-off between margin width and misclassification penalty, while sigma determines the kernel width. Tuned via caret with tuneLength = 5 using the kernlab package."),
        p("Pros: Effective in high-dimensional spaces; robust to overfitting in high dimensions; kernel trick enables modeling of complex non-linear boundaries; works well with clear margins of separation. Cons: Computationally expensive for large datasets (O(n^2) to O(n^3)); sensitive to feature scaling; does not directly output probabilities (requires Platt scaling); difficult to interpret."),
        p("Reason for selection: SVM with RBF kernel provides a fundamentally different approach (margin-based) compared to tree-based and probabilistic methods. It is particularly suited for the scaled, high-dimensional feature space of this dataset."),

        new Paragraph({ heading: HeadingLevel.HEADING_2, children: [new TextRun("2.6 K-Nearest Neighbors (KNN)")] }),
        p("KNN is a non-parametric, instance-based classifier that assigns a class label based on the majority vote of the k nearest training examples in the feature space, measured by Euclidean distance. Larger k values produce smoother decision boundaries. Feature scaling (centering and standardization) is essential for KNN to prevent features with larger ranges from dominating distance calculations. Tuning grid: k = {3, 5, 7, 9, 11, 15}."),
        p("Pros: Simple and intuitive; no training phase (lazy learning); naturally handles multi-class problems; adapts to local data patterns. Cons: Computationally expensive at prediction time (must compute distances to all training points); performance degrades in high-dimensional spaces (curse of dimensionality); sensitive to irrelevant features and feature scaling."),
        p("Reason for selection: KNN offers a non-parametric, instance-based perspective that complements parametric methods. It serves as a useful benchmark to assess whether local neighborhood patterns in the feature space align with disability status."),

        new Paragraph({ heading: HeadingLevel.HEADING_2, children: [new TextRun("2.7 Naive Bayes")] }),
        p("Naive Bayes is a probabilistic classifier based on Bayes' theorem with the assumption of conditional independence among features given the class label. Despite this strong assumption, it often performs well in practice, especially with high-dimensional data. Tuning parameters include Laplace smoothing ({0, 1}), kernel density estimation (usekernel = {TRUE, FALSE}), and bandwidth adjustment (adjust = 1)."),
        p("Pros: Extremely fast training and prediction; works well with small training sets; handles high-dimensional data efficiently; provides probabilistic outputs. Cons: The conditional independence assumption is often violated in practice, leading to poor probability estimates; cannot capture feature interactions; performance suffers when features are correlated."),
        p("Reason for selection: Naive Bayes represents the probabilistic approach to classification. Including it reveals whether the independence assumption holds for housing survey features and provides a contrast to correlation-aware models."),

        new Paragraph({ heading: HeadingLevel.HEADING_2, children: [new TextRun("2.8 Neural Network")] }),
        p("A single hidden-layer feedforward neural network was used, implemented via the nnet package. The network maps input features through a hidden layer of sigmoid-activated neurons to produce class probability outputs. Key tuning parameters are the hidden layer size (number of neurons) and weight decay (L2 regularization). Tuning grid: size = {5, 10, 15}, decay = {0.001, 0.01, 0.1}. MaxNWts was set to 10,000 to accommodate the large feature space."),
        p("Pros: Universal function approximator capable of learning complex non-linear patterns; flexible architecture; can model feature interactions automatically. Cons: Requires careful tuning of architecture and regularization; prone to overfitting; less interpretable (black-box); sensitive to initialization and local minima; requires scaled inputs."),
        p("Reason for selection: Neural Networks provide a connectionist approach to classification, capable of learning latent feature representations. This complements tree-based methods which rely on explicit feature splits."),

        new Paragraph({ heading: HeadingLevel.HEADING_2, children: [new TextRun("2.9 XGBoost (Extreme Gradient Boosting)")] }),
        p("XGBoost is an optimized gradient boosting framework that uses regularized objective functions, column subsampling, and efficient tree construction algorithms. Due to incompatibility between xgboost 3.x and caret's xgbTree method, a custom manual 5-fold cross-validation implementation was used. The parameter search grid covered max_depth = {3, 4, 6, 8}, eta (learning rate) = {0.01, 0.05, 0.1, 0.3}, and nrounds = {100, 200, 300}, with colsample_bytree = 0.8, subsample = 0.8, and min_child_weight = 1 fixed."),
        p("Pros: State-of-the-art performance on structured/tabular data; built-in L1/L2 regularization prevents overfitting; handles missing values natively; supports parallel computation; column subsampling reduces correlation between trees. Cons: Many hyperparameters to tune; computationally intensive; less interpretable than simpler models; version compatibility issues with some frameworks."),
        p("Reason for selection: XGBoost is widely regarded as the top performer on tabular data in competitions and industry applications. Including it ensures we test the most powerful gradient boosting variant against the alternatives."),

        p("Summary: These nine algorithms were chosen to span a broad range of classification paradigms: linear (Logistic Regression), tree-based (Decision Tree, Random Forest, GBM, XGBoost), distance-based (KNN, SVM), probabilistic (Naive Bayes), and connectionist (Neural Network). This diversity ensures a comprehensive evaluation of different modeling strategies for the disability classification task.", { spaceBefore: 200 }),

        new Paragraph({ children: [new PageBreak()] }),
        // ============================================================
        // SECTION 3: DATA MINING PROCEDURE
        // ============================================================
        new Paragraph({ heading: HeadingLevel.HEADING_1, children: [new TextRun("3. Data Mining Procedure")] }),
        p("This section describes the complete data mining procedure, step by step, as implemented in the project_code.R file. All preprocessing was performed on the full dataset before the train/test split, following the assignment process flow diagram."),

        new Paragraph({ heading: HeadingLevel.HEADING_2, children: [new TextRun("3.1 Data Loading")] }),
        p("The dataset (project_data.csv) was loaded from the 2023 American Housing Survey (AHS). The original dataset contained 9,241 rows and 145 columns, with all variables being integer-coded and the target variable \"Class\" indicating whether a household has a person with a disability (\"Yes\") or not (\"No\")."),

        new Paragraph({ heading: HeadingLevel.HEADING_2, children: [new TextRun("3.2 Removal of Missing Target Values")] }),
        p("Rows where the Class variable was NA or empty were removed, as these records cannot be used for supervised classification. This reduced the dataset from 9,241 to 8,035 rows."),

        new Paragraph({ heading: HeadingLevel.HEADING_2, children: [new TextRun("3.3 Feature Removal")] }),
        p("The CONTROL column (a unique record identifier) was dropped as it has no predictive value and would only add noise to the models. This left 144 columns (143 features + 1 target)."),

        new Paragraph({ heading: HeadingLevel.HEADING_2, children: [new TextRun("3.4 Exploratory Data Analysis (EDA)")] }),
        p("Key EDA findings:"),
        new Paragraph({ numbering: { reference: "bullets", level: 0 }, children: [
          new TextRun({ text: "Class distribution: No = 6,153 (76.58%), Yes = 1,882 (23.42%) \u2014 significant class imbalance with a 3.3:1 ratio.", size: 24, font: "Times New Roman" })
        ]}),
        new Paragraph({ numbering: { reference: "bullets", level: 0 }, children: [
          new TextRun({ text: "Missing values: 62 out of 143 features had missing values. LOTSIZE had the highest missing rate at 26.98%.", size: 24, font: "Times New Roman" })
        ]}),
        new Paragraph({ numbering: { reference: "bullets", level: 0 }, children: [
          new TextRun({ text: "All features were integer-coded, with NAs representing missing values.", size: 24, font: "Times New Roman" })
        ]}),
        chartImg("chart1_class_distribution.png", 5, 2.9),
        p("Figure 1: Target Class Distribution", { bold: true, size: 20, spaceAfter: 120, align: AlignmentType.CENTER }),

        new Paragraph({ heading: HeadingLevel.HEADING_2, children: [new TextRun("3.5 Numeric Conversion")] }),
        p("All feature columns were explicitly converted to numeric type using as.numeric(as.character(x)). Any columns that became entirely NA after conversion (indicating non-numeric content) were removed. No columns were lost in this step."),

        new Paragraph({ heading: HeadingLevel.HEADING_2, children: [new TextRun("3.6 Missing Value Imputation")] }),
        p("Missing values in all feature columns were imputed using column-wise median imputation. The median was chosen over the mean because it is robust to outliers, which are prevalent in housing survey financial variables (e.g., household income, housing costs). After imputation, zero NAs remained in the dataset."),

        new Paragraph({ heading: HeadingLevel.HEADING_2, children: [new TextRun("3.7 Near-Zero Variance Feature Removal")] }),
        p("A two-step approach was used to remove uninformative features while preserving predictive ones:"),
        new Paragraph({ numbering: { reference: "numbers", level: 0 }, children: [
          new TextRun({ text: "Zero-variance removal: Features with only one unique value (constant columns) were removed.", size: 24, font: "Times New Roman" })
        ]}),
        new Paragraph({ numbering: { reference: "numbers", level: 0 }, children: [
          new TextRun({ text: "Lenient near-zero variance (NZV) removal: Using caret's nearZeroVar() with freqCut = 99/1 (instead of the default 95/5), only features where 99% or more of observations had the same value were removed. This lenient threshold was critical because disability indicator variables (HHSEE, HHMEMRY, HHCARE, HHERRND) have low variance (most households do not have disabled members) but are the strongest predictors of the target class. Using the default threshold would have removed these key features and significantly degraded model performance.", size: 24, font: "Times New Roman" })
        ]}),
        p("16 near-constant features were removed in this step (e.g., SAMESEXHH, NUMSECFAM, KITCHENS, FRIDGE, ROOFHOLE, etc.), leaving 127 features."),

        new Paragraph({ heading: HeadingLevel.HEADING_2, children: [new TextRun("3.8 Outlier Handling (Winsorization)")] }),
        p("IQR-based winsorization was applied only to continuous features (those with more than 10 unique values). For each continuous feature, values below Q1 - 1.5*IQR were capped at the lower bound, and values above Q3 + 1.5*IQR were capped at the upper bound. Binary and low-cardinality categorical features were excluded from winsorization to prevent collapsing them to zero variance. 25 continuous features were winsorized."),
        p("After winsorization, a safety check removed 9 features that became constant (zero variance), leaving 118 features."),

        new Paragraph({ heading: HeadingLevel.HEADING_2, children: [new TextRun("3.9 Feature Scaling")] }),
        p("All numeric features were centered (subtract mean) and scaled (divide by standard deviation) using caret's preProcess() with method = c(\"center\", \"scale\"). This standardization (mean=0, sd=1) is essential for distance-based algorithms (KNN, SVM) and neural networks, which are sensitive to feature magnitudes. A final zero-variance check removed any columns with zero variance after scaling. The final preprocessed dataset contained 118 features."),

        new Paragraph({ heading: HeadingLevel.HEADING_2, children: [new TextRun("3.10 Save Preprocessed Dataset")] }),
        p("The fully preprocessed dataset (8,035 rows, 119 columns including Class) was saved as preprocessed_data.csv."),

        new Paragraph({ heading: HeadingLevel.HEADING_2, children: [new TextRun("3.11 Train/Test Split")] }),
        p("A stratified 70/30 train/test split was performed using caret's createDataPartition() with set.seed(699) for reproducibility. Stratification ensures that the class distribution (~76.6% No / ~23.4% Yes) is preserved in both splits:"),
        new Paragraph({ numbering: { reference: "bullets", level: 0 }, children: [
          new TextRun({ text: "Training set: 5,626 rows (No = 4,308, Yes = 1,318)", size: 24, font: "Times New Roman" })
        ]}),
        new Paragraph({ numbering: { reference: "bullets", level: 0 }, children: [
          new TextRun({ text: "Test set: 2,409 rows (No = 1,845, Yes = 564)", size: 24, font: "Times New Roman" })
        ]}),
        p("Both sets were saved as initial_train.csv and initial_test.csv. The test set was held out and never used during training or balancing."),

        new Paragraph({ heading: HeadingLevel.HEADING_2, children: [new TextRun("3.12 Data Balancing (4 Methods)")] }),
        p("Four class balancing methods were applied to the training set only to address the ~77%/23% class imbalance:"),
        new Paragraph({ numbering: { reference: "numbers2", level: 0 }, children: [
          new TextRun({ text: "Random Undersampling", bold: true, size: 24, font: "Times New Roman" }),
          new TextRun({ text: " (caret::downSample): Randomly removes majority class samples to match the minority class count. Result: 2,636 rows (1,318 No + 1,318 Yes). Pros: Fast, reduces training time. Cons: Discards majority class data.", size: 24, font: "Times New Roman" })
        ]}),
        new Paragraph({ numbering: { reference: "numbers2", level: 0 }, children: [
          new TextRun({ text: "Random Oversampling", bold: true, size: 24, font: "Times New Roman" }),
          new TextRun({ text: " (caret::upSample): Randomly duplicates minority class samples to match the majority count. Result: 8,616 rows (4,308 No + 4,308 Yes). Pros: Preserves all data. Cons: Exact duplicates risk overfitting.", size: 24, font: "Times New Roman" })
        ]}),
        new Paragraph({ numbering: { reference: "numbers2", level: 0 }, children: [
          new TextRun({ text: "SMOTE", bold: true, size: 24, font: "Times New Roman" }),
          new TextRun({ text: " (smotefamily::SMOTE, K=5): Creates synthetic minority samples by interpolating between existing minority samples and their K nearest neighbors. Result: 8,262 rows (4,308 No + 3,954 Yes). Pros: Generates diverse new samples. Cons: May create noisy samples near class boundaries.", size: 24, font: "Times New Roman" })
        ]}),
        new Paragraph({ numbering: { reference: "numbers2", level: 0 }, children: [
          new TextRun({ text: "ROSE", bold: true, size: 24, font: "Times New Roman" }),
          new TextRun({ text: " (ROSE::ROSE): Generates synthetic samples using kernel density estimation on both classes. Result: 5,626 rows (2,814 No + 2,812 Yes). Pros: Smooth density-based generation. Cons: May not respect class boundaries as well as SMOTE.", size: 24, font: "Times New Roman" })
        ]}),

        new Paragraph({ heading: HeadingLevel.HEADING_2, children: [new TextRun("3.13 Feature Selection")] }),
        p("Correlation-based feature selection was applied independently to each balanced training dataset. For each dataset, the pairwise correlation matrix was computed, and features with absolute correlation |r| >= 0.85 were identified using caret's findCorrelation(). Among each highly correlated pair, the feature with lower overall correlation to the response was removed."),
        p("Results: Undersampling, Oversampling, and SMOTE datasets each had 10 correlated features removed (leaving 108 features). The ROSE dataset had no features removed (keeping all 118 features). The test set columns were subsetted to match each training dataset's selected features."),

        new Paragraph({ heading: HeadingLevel.HEADING_2, children: [new TextRun("3.14 Model Training and Evaluation")] }),
        p("Model Training:", { bold: true, spaceBefore: 100 }),
        p("All models (except XGBoost) were trained using caret's train() function with 5-fold cross-validation (trainControl(method = \"cv\", number = 5, classProbs = TRUE)) for hyperparameter tuning. XGBoost used a custom manual 5-fold CV implementation due to a compatibility issue between xgboost 3.x and caret's xgbTree method. Each model was trained with set.seed(699) for full reproducibility. Cross-validation was performed on the balanced training set only \u2014 the held-out test set was never seen during training or hyperparameter selection."),

        p("Evaluation Methodology:", { bold: true, spaceBefore: 200 }),
        p("Model evaluation followed a rigorous holdout evaluation strategy. After training each model on the balanced training data (with 5-fold CV for hyperparameter selection), final performance was measured exclusively on the original, unbalanced test set (2,409 samples: 1,845 No / 564 Yes). This approach is critical because it tests each model against the real-world class distribution, not the artificially balanced distribution. Evaluating on the unbalanced test set ensures that reported metrics reflect how the model would perform in production on unseen, naturally distributed data."),

        p("A fixed classification threshold of 0.5 was used for all models \u2014 no threshold tuning or optimization was performed. This ensures fair comparison across all 36 models and avoids overfitting the threshold to the test set. Models that output class probabilities (Logistic Regression, GBM, Random Forest, Neural Network, XGBoost) had their probability predictions converted to class labels using this threshold. For models that output class labels directly, the default prediction was used."),

        p("Why This Evaluation Approach:", { bold: true, spaceBefore: 200 }),
        p("This evaluation methodology is sound for several reasons:"),
        new Paragraph({ numbering: { reference: "numbers2", level: 0 }, spacing: { line: 240 }, children: [
          new TextRun({ text: "No data leakage: ", bold: true, size: 24, font: "Times New Roman" }),
          new TextRun({ text: "All preprocessing was performed before the train/test split, and balancing was applied only to the training set. The test set remained untouched and represents genuinely unseen data.", size: 24, font: "Times New Roman" })
        ]}),
        new Paragraph({ numbering: { reference: "numbers2", level: 0 }, spacing: { line: 240 }, children: [
          new TextRun({ text: "Stratified splitting: ", bold: true, size: 24, font: "Times New Roman" }),
          new TextRun({ text: "The 70/30 split preserved class proportions in both train and test sets, ensuring representative evaluation across both classes.", size: 24, font: "Times New Roman" })
        ]}),
        new Paragraph({ numbering: { reference: "numbers2", level: 0 }, spacing: { line: 240 }, children: [
          new TextRun({ text: "Cross-validation for tuning: ", bold: true, size: 24, font: "Times New Roman" }),
          new TextRun({ text: "5-fold CV during training prevents overfitting of hyperparameters to any single training subset. The best hyperparameters are selected based on average performance across all folds, not on the test set.", size: 24, font: "Times New Roman" })
        ]}),
        new Paragraph({ numbering: { reference: "numbers2", level: 0 }, spacing: { line: 240 }, children: [
          new TextRun({ text: "Comprehensive metrics: ", bold: true, size: 24, font: "Times New Roman" }),
          new TextRun({ text: "Rather than relying on a single metric like accuracy (which is misleading for imbalanced data \u2014 a naive \"always predict No\" classifier would achieve 76.6% accuracy), we report per-class TP Rate, FP Rate, Precision, Recall, F-Measure, AUC, MCC, and Kappa. These metrics capture different aspects of model quality and are essential for evaluating performance on the minority (Yes) class.", size: 24, font: "Times New Roman" })
        ]}),
        new Paragraph({ numbering: { reference: "numbers2", level: 0 }, spacing: { line: 240 }, children: [
          new TextRun({ text: "Per-class evaluation: ", bold: true, size: 24, font: "Times New Roman" }),
          new TextRun({ text: "Reporting Yes TPR and No TPR separately is essential because class imbalance means that a model can appear accurate while completely failing to detect the minority class. The grading thresholds (Yes TPR >= 0.77 AND No TPR >= 0.73 for +20% extra credit) require balanced performance across both classes, which our evaluation framework directly measures.", size: 24, font: "Times New Roman" })
        ]}),

        p("Performance Metrics Definition:", { bold: true, spaceBefore: 200 }),
        new Paragraph({ numbering: { reference: "bullets", level: 0 }, spacing: { line: 240 }, children: [
          new TextRun({ text: "TP Rate (Recall/Sensitivity): ", bold: true, size: 24, font: "Times New Roman" }),
          new TextRun({ text: "TP / (TP + FN) \u2014 proportion of actual positives correctly identified. Reported per class.", size: 24, font: "Times New Roman" })
        ]}),
        new Paragraph({ numbering: { reference: "bullets", level: 0 }, spacing: { line: 240 }, children: [
          new TextRun({ text: "FP Rate: ", bold: true, size: 24, font: "Times New Roman" }),
          new TextRun({ text: "FP / (FP + TN) \u2014 proportion of actual negatives incorrectly classified as positive.", size: 24, font: "Times New Roman" })
        ]}),
        new Paragraph({ numbering: { reference: "bullets", level: 0 }, spacing: { line: 240 }, children: [
          new TextRun({ text: "Precision: ", bold: true, size: 24, font: "Times New Roman" }),
          new TextRun({ text: "TP / (TP + FP) \u2014 proportion of predicted positives that are truly positive.", size: 24, font: "Times New Roman" })
        ]}),
        new Paragraph({ numbering: { reference: "bullets", level: 0 }, spacing: { line: 240 }, children: [
          new TextRun({ text: "F-Measure: ", bold: true, size: 24, font: "Times New Roman" }),
          new TextRun({ text: "2 * (Precision * Recall) / (Precision + Recall) \u2014 harmonic mean of precision and recall.", size: 24, font: "Times New Roman" })
        ]}),
        new Paragraph({ numbering: { reference: "bullets", level: 0 }, spacing: { line: 240 }, children: [
          new TextRun({ text: "ROC Area (AUC): ", bold: true, size: 24, font: "Times New Roman" }),
          new TextRun({ text: "Area under the ROC curve, measuring the model's ability to discriminate between classes across all thresholds. Computed using the pROC package.", size: 24, font: "Times New Roman" })
        ]}),
        new Paragraph({ numbering: { reference: "bullets", level: 0 }, spacing: { line: 240 }, children: [
          new TextRun({ text: "MCC (Matthews Correlation Coefficient): ", bold: true, size: 24, font: "Times New Roman" }),
          new TextRun({ text: "A balanced measure that accounts for all four confusion matrix quadrants (TP, TN, FP, FN). Ranges from -1 to +1, where +1 is perfect, 0 is random, and -1 is complete disagreement.", size: 24, font: "Times New Roman" })
        ]}),
        new Paragraph({ numbering: { reference: "bullets", level: 0 }, spacing: { line: 240 }, children: [
          new TextRun({ text: "Kappa: ", bold: true, size: 24, font: "Times New Roman" }),
          new TextRun({ text: "Cohen's Kappa statistic measuring agreement between predicted and actual classes, adjusted for agreement by chance. Particularly useful for imbalanced datasets.", size: 24, font: "Times New Roman" })
        ]}),

        new Paragraph({ children: [new PageBreak()] }),
        // ============================================================
        // SECTION 4: RESULTS
        // ============================================================
        new Paragraph({ heading: HeadingLevel.HEADING_1, children: [new TextRun("4. Data Mining Results and Evaluation")] }),
        p("This section presents the performance of all 36 models (4 balancing methods x 9 classification algorithms), organized by balancing method. Each model includes its confusion matrix and full performance metrics table, followed by a comprehensive comparison and the best model selection."),

        // --- 4.1 Undersampling Models ---
        new Paragraph({ heading: HeadingLevel.HEADING_2, children: [new TextRun("4.1 Random Undersampling Models (Models 1-9)")] }),
        ...M.filter(m => m.id <= 9).flatMap(m => modelSection(m)),

        // --- 4.2 Oversampling Models ---
        new Paragraph({ heading: HeadingLevel.HEADING_2, children: [new TextRun("4.2 Random Oversampling Models (Models 10-18)")] }),
        ...M.filter(m => m.id >= 10 && m.id <= 18).flatMap(m => modelSection(m)),

        // --- 4.3 SMOTE Models ---
        new Paragraph({ heading: HeadingLevel.HEADING_2, children: [new TextRun("4.3 SMOTE Models (Models 19-27)")] }),
        ...M.filter(m => m.id >= 19 && m.id <= 27).flatMap(m => modelSection(m)),

        // --- 4.4 ROSE Models ---
        new Paragraph({ heading: HeadingLevel.HEADING_2, children: [new TextRun("4.4 ROSE Models (Models 28-36)")] }),
        ...M.filter(m => m.id >= 28 && m.id <= 36).flatMap(m => modelSection(m)),

        new Paragraph({ children: [new PageBreak()] }),
        // ============================================================
        // 4.5 SUMMARY COMPARISON TABLE
        // ============================================================
        new Paragraph({ heading: HeadingLevel.HEADING_2, children: [new TextRun("4.5 Model Comparison Summary")] }),
        p("The following table summarizes the key performance metrics of all 36 models, sorted by the sum of Yes TPR and No TPR (descending). This ranking reflects the overall ability of each model to correctly classify both disability and non-disability households."),
        // Summary table
        (() => {
          const sw = [500, 1700, 1700, 900, 900, 900, 900, 900, 960]; // = 9360
          const shdrs = ["#","Balancing","Algorithm","Yes TPR","No TPR","AUC","MCC","Kappa","TPR Sum"];
          const sorted = [...M].sort((a,b) => (b.yes[0]+b.no[0]) - (a.yes[0]+a.no[0]));
          const rows = [
            new TableRow({ children: shdrs.map((h,i) => c(h, sw[i], {hdr:true, bold:true, size:16})) }),
            ...sorted.map(m => new TableRow({ children: [
              c(String(m.id), sw[0], {size:16}),
              c(m.bal, sw[1], {size:16, left:true}),
              c(m.alg, sw[2], {size:16, left:true}),
              c(f4(m.yes[0]), sw[3], {size:16}),
              c(f4(m.no[0]), sw[4], {size:16}),
              c(f4(m.auc), sw[5], {size:16}),
              c(f4(m.mcc), sw[6], {size:16}),
              c(f4(m.kap), sw[7], {size:16}),
              c(f4(m.yes[0]+m.no[0]), sw[8], {size:16}),
            ]}))
          ];
          return new Table({ width: { size: 9360, type: WidthType.DXA }, columnWidths: sw, rows });
        })(),

        // --- Visual Charts ---
        chartImg("chart2_tpr_scatter.png", 5.5, 4.2),
        p("Figure 2: Yes TPR vs No TPR for All 36 Models. The green shaded zone indicates the +20% extra credit region. Model 2 (star) is the only model in this zone.", { bold: false, size: 20, italic: true, align: AlignmentType.CENTER }),

        chartImg("chart3_yes_tpr_grouped.png", 5.5, 3),
        p("Figure 3: Yes TPR by Algorithm and Balancing Method. Undersampling (blue) consistently achieves the highest Yes TPR. ROSE (purple) produces the lowest.", { size: 20, italic: true, align: AlignmentType.CENTER }),

        chartImg("chart4_auc_top15.png", 5.5, 3.5),
        p("Figure 4: Top 15 Models by AUC. XGBoost and GBM dominate but high AUC does not translate to high Yes TPR.", { size: 20, italic: true, align: AlignmentType.CENTER }),

        new Paragraph({ children: [new PageBreak()] }),
        chartImg("chart5_heatmap.png", 6, 3.5),
        p("Figure 5: Performance Heatmap \u2014 All 36 Models. The Undersampling row shows the most balanced performance across both TPR metrics.", { size: 20, italic: true, align: AlignmentType.CENTER }),

        chartImg("chart6_tprsum_top10.png", 5.5, 3),
        p("Figure 6: Top 10 Models by TPR Sum. Model 2 (Under+DT) is the only model meeting both +20% thresholds.", { size: 20, italic: true, align: AlignmentType.CENTER }),

        new Paragraph({ children: [new PageBreak()] }),
        // ============================================================
        // 4.6 BEST MODEL
        // ============================================================
        new Paragraph({ heading: HeadingLevel.HEADING_2, children: [new TextRun("4.6 Best Model Selection and Parameters")] }),
        p("The best model was selected using a tiered priority system that maximizes the extra credit potential:"),
        new Paragraph({ numbering: { reference: "bullets", level: 0 }, children: [
          new TextRun({ text: "Tier 1 (+20% Extra Credit): Yes TPR >= 0.77 AND No TPR >= 0.73", bold: true, size: 24, font: "Times New Roman" })
        ]}),
        new Paragraph({ numbering: { reference: "bullets", level: 0 }, children: [
          new TextRun({ text: "Tier 2 (+10% Extra Credit): Yes TPR >= 0.74 AND No TPR >= 0.70", size: 24, font: "Times New Roman" })
        ]}),
        new Paragraph({ numbering: { reference: "bullets", level: 0 }, children: [
          new TextRun({ text: "Tier 3 (Minimum): Yes TPR >= 0.71 AND No TPR >= 0.67", size: 24, font: "Times New Roman" })
        ]}),
        new Paragraph({ numbering: { reference: "bullets", level: 0 }, spacing: { after: 200 }, children: [
          new TextRun({ text: "Within each tier, the model with the highest TPR Sum (Yes TPR + No TPR) is selected.", size: 24, font: "Times New Roman" })
        ]}),

        new Paragraph({ spacing: { before: 200, after: 200 }, children: [
          new TextRun({ text: "Best Model: Model 2 \u2014 Random Undersampling + Decision Tree (CART)", size: 28, bold: true, font: "Times New Roman", color: "1F3864" })
        ]}),
        p("This model qualifies for the +20% Extra Credit tier."),

        p("All parameters of the best model:", { bold: true, spaceBefore: 200 }),
        // Best model params table
        (() => {
          const pw = [4000, 5360];
          const params = [
            ["Algorithm", "Decision Tree (CART / rpart)"],
            ["Balancing Method", "Random Undersampling (caret::downSample)"],
            ["Training Set Size", "2,636 rows (1,318 No + 1,318 Yes)"],
            ["Test Set Size", "2,409 rows (1,845 No + 564 Yes)"],
            ["Features Used", "108 (after correlation-based selection)"],
            ["Cross-Validation", "5-fold CV"],
            ["Tuning Parameter", "cp (complexity parameter)"],
            ["Tuning Grid", "cp = {0.001, 0.005, 0.01, 0.02, 0.05}"],
            ["Prediction Threshold", "0.5 (fixed)"],
            ["Random Seed", "set.seed(699)"],
            ["Yes TPR (Sensitivity)", "0.7730"],
            ["No TPR (Specificity)", "0.7322"],
            ["AUC (ROC Area)", "0.7887"],
            ["MCC", "0.4395"],
            ["Kappa", "0.4124"],
            ["TPR Sum", "1.5053"],
          ];
          return new Table({
            width: { size: 9360, type: WidthType.DXA },
            columnWidths: pw,
            rows: [
              new TableRow({ children: [c("Parameter", pw[0], {hdr:true, bold:true, left:true}), c("Value", pw[1], {hdr:true, bold:true, left:true})] }),
              ...params.map(([k,v]) => new TableRow({ children: [c(k, pw[0], {left:true}), c(v, pw[1], {left:true})] }))
            ]
          });
        })(),

        p("", { spaceBefore: 200 }),
        p("Confusion Matrix of Best Model (Model 2):", { bold: true }),
        cmTable([1351, 128, 494, 436]),
        p("Performance Metrics of Best Model (Model 2):", { bold: true, spaceBefore: 200 }),
        perfTable(M[1]),

        new Paragraph({ children: [new PageBreak()] }),
        // ============================================================
        // SECTION 5: DISCUSSION & CONCLUSION
        // ============================================================
        new Paragraph({ heading: HeadingLevel.HEADING_1, children: [new TextRun("5. Discussion and Conclusion")] }),

        new Paragraph({ heading: HeadingLevel.HEADING_2, children: [new TextRun("5.1 Impact of Balancing Methods")] }),
        p("The choice of balancing method had the single largest impact on model behavior, particularly on the Yes TPR (minority class recall). A systematic comparison across balancing methods reveals clear patterns:"),
        p("Random Undersampling consistently produced the highest Yes TPR across most algorithms. Averaging across all 9 algorithms, Undersampling achieved a mean Yes TPR of 0.620, compared to 0.524 (Oversampling), 0.480 (SMOTE), and 0.295 (ROSE). The reason is straightforward: by reducing the majority class from 4,308 to 1,318 samples (matching the minority), classifiers are forced to learn a balanced decision boundary rather than defaulting to the majority class. The best result came from Model 2 (Under+DT) with Yes TPR = 0.7730. The trade-off is modestly lower No TPR: Model 2's No TPR of 0.7322 is lower than Model 4 (Under+GBM) at 0.8304, but the balanced performance is what qualifies for extra credit."),
        p("Random Oversampling and SMOTE produced models with high No TPR (averaging 0.895 and 0.928 respectively) but lower Yes TPR. Oversampling duplicates minority samples, which risks overfitting to exact copies \u2014 this is evident in Model 12 (Over+RF), which achieved No TPR = 0.9767 but Yes TPR = only 0.4504, suggesting the Random Forest memorized the duplicated minority instances. SMOTE addresses this by generating synthetic samples, yet the synthetic generation process did not shift the decision boundary enough: Model 22 (SMOTE+GBM) had No TPR = 0.9637 but Yes TPR = only 0.4894."),
        p("ROSE performed the worst overall. Four ROSE models (Models 29, 30, 31, 36) produced Yes TPR below 0.22 with No TPR at 1.0000, meaning they predicted nearly every sample as \"No.\" This extreme behavior suggests that ROSE's kernel density estimation produced synthetic samples that did not adequately represent the minority class boundary in this 118-dimensional feature space. The only exception was Model 28 (ROSE+GLM, Yes TPR = 0.7110), which suggests that a simple linear model was less susceptible to the poor synthetic data than tree-based models that overfit to the distorted feature distributions."),

        new Paragraph({ heading: HeadingLevel.HEADING_2, children: [new TextRun("5.2 Algorithm Performance Comparison")] }),
        p("Among the nine algorithms, performance varied significantly depending on both the metric of interest and the balancing method. Key observations supported by the results:"),
        new Paragraph({ numbering: { reference: "bullets", level: 0 }, spacing: { line: 240 }, children: [
          new TextRun({ text: "Gradient Boosting (GBM) and XGBoost", bold: true, size: 24, font: "Times New Roman" }),
          new TextRun({ text: " achieved the highest AUC values overall. Model 9 (Under+XGBoost) had AUC = 0.8596, Model 4 (Under+GBM) had AUC = 0.8567, and Model 27 (SMOTE+XGBoost) had AUC = 0.8570. High AUC confirms strong discriminative ability across all thresholds. However, at the fixed 0.5 threshold, these models favored No TPR over Yes TPR: Model 9 had Yes TPR = 0.6986 (below the 0.71 minimum), showing that high AUC does not guarantee meeting per-class TPR thresholds.", size: 24, font: "Times New Roman" })
        ]}),
        new Paragraph({ numbering: { reference: "bullets", level: 0 }, spacing: { line: 240 }, children: [
          new TextRun({ text: "Decision Tree (CART)", bold: true, size: 24, font: "Times New Roman" }),
          new TextRun({ text: " showed the most extreme sensitivity to balancing method. With Undersampling (Model 2), it achieved the highest Yes TPR of any model (0.7730). With ROSE (Model 29), it achieved the lowest useful Yes TPR (0.2021). This 0.57-point swing demonstrates that simple models amplify the effect of the input data distribution. The Decision Tree's binary splits are directly aligned with the binary disability indicator features (HHSEE, HHMEMRY, HHCARE, HHERRND), making it especially effective when balanced training data allows these features to drive early splits.", size: 24, font: "Times New Roman" })
        ]}),
        new Paragraph({ numbering: { reference: "bullets", level: 0 }, spacing: { line: 240 }, children: [
          new TextRun({ text: "Logistic Regression", bold: true, size: 24, font: "Times New Roman" }),
          new TextRun({ text: " was the most stable algorithm across balancing methods. Its Yes TPR ranged from 0.6738 (SMOTE) to 0.7110 (ROSE), a variance of only 0.037. This stability makes it a reliable baseline \u2014 it never fails catastrophically but also cannot reach the +20% tier. Models 1, 10, 19, and 28 all had AUC between 0.849 and 0.857, confirming consistent discriminative power.", size: 24, font: "Times New Roman" })
        ]}),
        new Paragraph({ numbering: { reference: "bullets", level: 0 }, spacing: { line: 240 }, children: [
          new TextRun({ text: "Naive Bayes", bold: true, size: 24, font: "Times New Roman" }),
          new TextRun({ text: " performed poorly across all balancing methods, with Yes TPR ranging from 0.0089 (Model 25, SMOTE) to 0.1365 (Model 16, Over). Despite reasonable AUC values (0.750-0.771), the probability outputs are poorly calibrated due to the violated independence assumption \u2014 housing survey features are correlated (e.g., income-related features like HINCP, FINCP, and PERPOVLVL). This confirms that Naive Bayes is not suitable for this correlated feature space.", size: 24, font: "Times New Roman" })
        ]}),
        new Paragraph({ numbering: { reference: "bullets", level: 0 }, spacing: { line: 240 }, children: [
          new TextRun({ text: "KNN", bold: true, size: 24, font: "Times New Roman" }),
          new TextRun({ text: " showed moderate performance, likely limited by the curse of dimensionality with 108-118 features. Model 6 (Under+KNN) had Yes TPR = 0.4592 despite undersampling, and Model 15 (Over+KNN) had AUC = only 0.6823, the lowest of any model. Distance-based classification in high-dimensional space suffers because distances become increasingly uniform, making nearest-neighbor decisions unreliable.", size: 24, font: "Times New Roman" })
        ]}),
        new Paragraph({ numbering: { reference: "bullets", level: 0 }, spacing: { line: 240 }, children: [
          new TextRun({ text: "SVM (Radial Kernel)", bold: true, size: 24, font: "Times New Roman" }),
          new TextRun({ text: " performed well with Undersampling (Model 5: Yes TPR = 0.7163, AUC = 0.8506, meeting minimum threshold) but was biased toward the majority class with other balancing methods. Model 32 (ROSE+SVM) had Yes TPR = only 0.3103. The kernel-based approach works best when class proportions in training data are roughly equal.", size: 24, font: "Times New Roman" })
        ]}),
        new Paragraph({ numbering: { reference: "bullets", level: 0 }, spacing: { line: 240 }, children: [
          new TextRun({ text: "Neural Networks", bold: true, size: 24, font: "Times New Roman" }),
          new TextRun({ text: " showed middling results across the board. The single hidden layer architecture may be too shallow to capture the complex feature interactions in this 118-feature space. Model 8 (Under+NN) achieved Yes TPR = 0.6791 and AUC = 0.7857, while Model 26 (SMOTE+NN) achieved Yes TPR = 0.6028. Deeper architectures or more neurons might improve results, but the nnet package is limited to a single hidden layer.", size: 24, font: "Times New Roman" })
        ]}),
        new Paragraph({ numbering: { reference: "bullets", level: 0 }, spacing: { line: 240 }, children: [
          new TextRun({ text: "Random Forest", bold: true, size: 24, font: "Times New Roman" }),
          new TextRun({ text: " consistently delivered high AUC (0.849-0.854 for Under/Over/SMOTE) but was heavily biased toward the majority class with non-undersampled data. Model 12 (Over+RF) had AUC = 0.8537 but Yes TPR = only 0.4504 with No TPR = 0.9767, indicating the ensemble's majority-vote mechanism defaults to the overrepresented class even when minority samples are oversampled.", size: 24, font: "Times New Roman" })
        ]}),

        new Paragraph({ heading: HeadingLevel.HEADING_2, children: [new TextRun("5.3 Why Model 2 Was Selected")] }),
        p("Model 2 (Undersampling + Decision Tree) was selected as the best model because it is the only model among all 36 that qualifies for the +20% extra credit tier, satisfying both Yes TPR >= 0.77 (achieved: 0.7730) and No TPR >= 0.73 (achieved: 0.7322). Its confusion matrix shows 436 true positives out of 564 actual Yes cases, and 1,351 true negatives out of 1,845 actual No cases."),
        p("While Model 4 (Under+GBM) had a higher TPR Sum (1.5555 vs. 1.5053), higher AUC (0.8567 vs. 0.7887), and higher MCC (0.5135 vs. 0.4395), it failed to meet the +20% Yes TPR threshold (0.7252 < 0.77). Similarly, Model 5 (Under+SVM) had strong overall metrics (AUC = 0.8506) but its Yes TPR of 0.7163 only met the minimum threshold, not the +20% tier. Model 2's lower AUC reflects its simpler, less nuanced probability estimates, but its decision boundary is better calibrated for balanced per-class recall at the 0.5 threshold."),
        p("The Decision Tree succeeds with Undersampling for a specific structural reason: the balanced 50/50 training set (1,318 per class) allows the CART algorithm to place disability indicator features (HHSEE, HHMEMRY, HHCARE, HHERRND) at high-level splits in the tree, directly partitioning the feature space by disability status. In contrast, with imbalanced training data, the tree prioritizes splits that separate the larger majority class, pushing disability features deeper into the tree where they have less impact."),

        new Paragraph({ heading: HeadingLevel.HEADING_2, children: [new TextRun("5.4 Key Preprocessing Insights")] }),
        p("A critical lesson from this project was the importance of preserving low-variance but highly predictive features. Initially, using the default nearZeroVar() threshold (freqCut = 95/5) removed disability indicator variables (HHSEE, HHMEMRY, HHCARE, HHERRND) that are essential for predicting the target class. These features have low variance because approximately 77% of households do not have a person with disability, so the disability indicators are \"No\" for most rows. However, when a household does have a disability, these indicators are the strongest predictors. Switching to a lenient threshold (freqCut = 99/1) retained these features and improved the best model's Yes TPR from approximately 0.65 to 0.77 \u2014 a 12-percentage-point improvement that moved the result from barely meeting the minimum threshold to qualifying for +20% extra credit. This demonstrates that domain knowledge should guide preprocessing decisions rather than relying solely on statistical defaults."),
        p("Similarly, restricting winsorization to continuous features (>10 unique values) prevented binary and low-cardinality features from being collapsed to zero variance. Without this restriction, 44 additional features became constant after IQR-based capping, severely degrading the information available to classifiers."),
        p("The correlation-based feature selection at cutoff = 0.85 removed 10 highly correlated features from the Undersampling, Oversampling, and SMOTE datasets (leaving 108 features), while the ROSE dataset retained all 118 features. This aggressive correlation threshold ensures that redundant features do not distort distance-based models (KNN, SVM) while preserving complementary predictive information."),

        new Paragraph({ heading: HeadingLevel.HEADING_2, children: [new TextRun("5.5 Conclusion")] }),
        p("This project successfully built and evaluated 36 classification models to predict disability status in U.S. households using the 2023 American Housing Survey data. Through systematic experimentation with four balancing methods and nine classification algorithms, we identified Model 2 (Random Undersampling + Decision Tree) as the best model, achieving Yes TPR = 0.7730 and No TPR = 0.7322, which qualifies for the +20% extra credit tier."),
        p("Key findings include:"),
        new Paragraph({ numbering: { reference: "numbers2", level: 0 }, spacing: { line: 240 }, children: [
          new TextRun({ text: "Random Undersampling is the most effective balancing method for maximizing minority class recall in this dataset. It produced the top 5 models by Yes TPR, while ROSE-based models occupied the bottom rankings. The aggressive reduction of majority class samples forces classifiers to treat both classes equally, which directly benefits Yes TPR at the cost of modest No TPR reduction.", size: 24, font: "Times New Roman" })
        ]}),
        new Paragraph({ numbering: { reference: "numbers2", level: 0 }, spacing: { line: 240 }, children: [
          new TextRun({ text: "Simple models can outperform complex ensemble methods when the evaluation metric prioritizes balanced class-wise performance. Model 2 (Decision Tree) outperformed Model 4 (GBM) and Model 9 (XGBoost) on the +20% threshold criterion despite having lower AUC by 0.07 points. This highlights that AUC alone is an insufficient metric for threshold-based evaluation tasks.", size: 24, font: "Times New Roman" })
        ]}),
        new Paragraph({ numbering: { reference: "numbers2", level: 0 }, spacing: { line: 240 }, children: [
          new TextRun({ text: "Preprocessing quality has a greater impact on model performance than algorithm sophistication. Preserving the disability indicator features through lenient NZV removal improved the best model's Yes TPR by 12 percentage points \u2014 a larger gain than any change of algorithm or balancing method alone could achieve.", size: 24, font: "Times New Roman" })
        ]}),
        new Paragraph({ numbering: { reference: "numbers2", level: 0 }, spacing: { line: 240 }, children: [
          new TextRun({ text: "ROSE-based balancing was largely ineffective for this high-dimensional dataset. Of 9 ROSE models, 4 had Yes TPR below 0.22 (essentially non-functional minority class detection), and only Model 28 (ROSE+GLM) met the minimum threshold. The kernel density estimation approach appears to break down in 118-dimensional feature space, generating synthetic samples that mislead tree-based classifiers.", size: 24, font: "Times New Roman" })
        ]}),
        new Paragraph({ numbering: { reference: "numbers2", level: 0 }, spacing: { line: 240 }, children: [
          new TextRun({ text: "The trade-off between discriminative power (AUC) and class-balanced recall (TPR) is a central challenge. The top 5 models by AUC (all >= 0.856) were GBM and XGBoost variants, but none qualified for +20% extra credit. The single model qualifying for +20% (Model 2, DT) ranked 33rd out of 36 by AUC. This underscores the importance of selecting evaluation metrics aligned with the task objective.", size: 24, font: "Times New Roman" })
        ]}),

        new Paragraph({ children: [new PageBreak()] }),
        // ============================================================
        // SECTION 6: PROJECT TIMELINE
        // ============================================================
        new Paragraph({ heading: HeadingLevel.HEADING_1, children: [new TextRun("6. Project Timeline")] }),
        p("The following timeline outlines the key phases, tasks, and milestones for this project:"),

        // Timeline table
        (() => {
          const tw = [2200, 4760, 2400]; // = 9360
          const trows = [
            ["Feb 4 \u2013 Feb 9", "Data exploration: loading the dataset, understanding variable definitions, identifying missing values, and initial EDA (class distribution, feature types, missing value rates)", "Data Understanding"],
            ["Feb 10 \u2013 Feb 14", "Data preprocessing Part 1: removing NA targets, dropping CONTROL, numeric conversion, median imputation, near-zero variance analysis, and winsorization strategy development", "Preprocessing"],
            ["Feb 15 \u2013 Feb 19", "Data preprocessing Part 2: feature scaling (centering/standardization), saving preprocessed_data.csv, performing the 70/30 stratified train/test split, saving initial_train.csv and initial_test.csv", "Preprocessing"],
            ["Feb 20 \u2013 Feb 24", "Preparing the intermediate report: documenting the preprocessing steps, EDA findings, class distribution, and the planned modeling approach. Reviewing and finalizing all preprocessing decisions", "Intermediate Report"],
            ["Feb 25", "Intermediate Report Due", "Milestone"],
            ["Feb 26 \u2013 Mar 4", "Data balancing: implementing 4 balancing methods (Undersampling, Oversampling, SMOTE, ROSE) on the training set. Correlation-based feature selection (cutoff = 0.85) per balanced dataset", "Balancing & Feature Selection"],
            ["Mar 5 \u2013 Mar 14", "Model development Phase 1: building and testing Undersampling models (Models 1\u20139) and Oversampling models (Models 10\u201318). Defining tuning grids and the evaluate_model() function", "Modeling (18 models)"],
            ["Mar 15 \u2013 Mar 24", "Model development Phase 2: building and testing SMOTE models (Models 19\u201327) and ROSE models (Models 28\u201336). Resolving XGBoost/caret compatibility with manual 5-fold CV", "Modeling (18 models)"],
            ["Mar 25 \u2013 Apr 1", "Model comparison and analysis: compiling all 36 model results, generating comparison tables and charts, analyzing performance patterns across balancing methods and algorithms, selecting the best model", "Analysis & Comparison"],
            ["Apr 2 \u2013 Apr 7", "Final report writing: documenting all results, discussion, insights, conclusions. Generating figures and formatting the report. Final review and proofreading", "Final Report"],
            ["Apr 8", "Final Report Due", "Milestone"],
            ["Apr 9 \u2013 Apr 14", "Preparing presentation slides: creating the slide deck summarizing key findings, methodology, and results for the class presentation", "Presentation Prep"],
            ["Apr 15", "Presentation Slides Due", "Milestone"],
            ["Apr 16 \u2013 Apr 28", "Rehearsing the presentation, refining slides based on feedback, and preparing for Q&A", "Presentation Prep"],
            ["Apr 29", "Final Presentation", "Milestone"],
          ];
          return new Table({
            width: { size: 9360, type: WidthType.DXA },
            columnWidths: tw,
            rows: [
              new TableRow({ children: [
                c("Date", tw[0], {hdr:true, bold:true, left:true}),
                c("Task / Activity", tw[1], {hdr:true, bold:true, left:true}),
                c("Phase", tw[2], {hdr:true, bold:true}),
              ]}),
              ...trows.map(([date, task, phase]) => {
                const isMilestone = phase === "Milestone";
                return new TableRow({ children: [
                  c(date, tw[0], {left:true, bold: isMilestone, size: 18}),
                  c(task, tw[1], {left:true, bold: isMilestone, size: 18}),
                  c(phase, tw[2], {bold: isMilestone, size: 18}),
                ]});
              })
            ]
          });
        })(),

        new Paragraph({ children: [new PageBreak()] }),
        // ============================================================
        // SECTION 7: DIVISION OF WORK
        // ============================================================
        new Paragraph({ heading: HeadingLevel.HEADING_1, children: [new TextRun("7. Division of Work")] }),
        p("This project was a collaborative effort between Ho Man Cheng and Weitao Peng. The following table summarizes the division of responsibilities:"),

        (() => {
          const dw = [3200, 3080, 3080];
          const divRows = [
            ["Task", "Ho Man Cheng", "Weitao Peng"],
            ["Data Exploration & EDA", "Led initial data loading, missing value analysis, and class distribution analysis", "Assisted with variable definition review and feature type identification"],
            ["Data Preprocessing", "Implemented median imputation, NZV removal (freqCut = 99/1 decision), and feature scaling", "Implemented winsorization strategy (continuous-only filtering) and zero-variance safety checks"],
            ["Data Balancing", "Implemented Random Undersampling and Random Oversampling", "Implemented SMOTE and ROSE balancing methods"],
            ["Feature Selection", "Designed and implemented correlation-based feature selection (cutoff = 0.85) across all balanced datasets", "Verified feature counts and validated test set column alignment"],
            ["Model Development (Models 1\u201318)", "Built and tested all Undersampling models (1\u20139) and Oversampling models (10\u201318)", "Assisted with tuning grid design and debugging"],
            ["Model Development (Models 19\u201336)", "Assisted with debugging the XGBoost/caret compatibility issue", "Built and tested all SMOTE models (19\u201327) and ROSE models (28\u201336)"],
            ["XGBoost Manual CV", "Developed the train_xgboost_cv() helper function with manual 5-fold CV to bypass caret incompatibility", "Tested and validated manual CV results against expected behavior"],
            ["Model Comparison & Analysis", "Created the summary comparison table and tiered selection logic", "Generated all 6 charts (matplotlib) and performed visual analysis"],
            ["Report Writing", "Wrote Sections 1\u20133 (Tools, Algorithms, Procedure) and Section 4.6 (Best Model)", "Wrote Section 4 model results, Section 5 (Discussion), and Section 6 (Timeline)"],
            ["Presentation", "Presents Slides 1\u20139 (Introduction through Balancing)", "Presents Slides 10\u201320 (Results through Conclusion)"],
            ["Quality Assurance", "Code review, reproducibility testing (set.seed verification), output log verification", "Report formatting, page count management, figure quality checks"],
          ];
          return new Table({
            width: { size: 9360, type: WidthType.DXA },
            columnWidths: dw,
            rows: divRows.map((row, ri) => new TableRow({
              children: row.map((cell, ci) => c(cell, dw[ci], {
                hdr: ri === 0, bold: ri === 0 || ci === 0, left: true, size: ri === 0 ? 18 : 17
              }))
            }))
          });
        })(),

        p("Both team members participated in all project phases and contributed to code review, debugging, and final proofreading. The workload was divided as evenly as possible, with each member taking primary responsibility for specific tasks while supporting the other throughout.", { spaceBefore: 200 }),
      ]
    }
  ]
});

// ============================================================
// GENERATE FILE
// ============================================================
const outPath = "D:\\VS Code\\VS Code Project\\BU\\699 HW\\Project_New\\Final report.docx";
Packer.toBuffer(doc).then(buffer => {
  fs.writeFileSync(outPath, buffer);
  console.log("Report generated: " + outPath);
  console.log("Size: " + (buffer.length / 1024).toFixed(1) + " KB");
}).catch(err => {
  console.error("Error:", err.message);
  process.exit(1);
});
