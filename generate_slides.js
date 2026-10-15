const pptxgen = require("pptxgenjs");
const fs = require("fs");

const pres = new pptxgen();
pres.layout = "LAYOUT_16x9";
pres.author = "Ho Man Cheng, Weitao Peng";
pres.title = "CS699 Classification Project";

// ============================================================
// COLOR PALETTE — Midnight Executive
// ============================================================
const C = {
  navy: "1E2761",
  blue: "408EC6",
  accent: "E85D04",
  light: "F2F4F8",
  white: "FFFFFF",
  text: "333333",
  muted: "777777",
  darkText: "EEEEEE",
};

const chartDir = "D:\\VS Code\\VS Code Project\\BU\\699 HW\\Project_New\\charts";
function chartPath(name) { return chartDir + "\\" + name; }
const makeShadow = () => ({ type: "outer", blur: 6, offset: 2, color: "000000", opacity: 0.12, angle: 135 });

function addHeader(slide, title, subtitle) {
  slide.background = { color: C.light };
  slide.addText(title, { x: 0.6, y: 0.3, w: 8.8, h: 0.6, fontSize: 28, color: C.navy, fontFace: "Georgia", bold: true });
  slide.addShape(pres.shapes.RECTANGLE, { x: 0.6, y: 0.95, w: 1.3, h: 0.04, fill: { color: C.accent } });
  if (subtitle) slide.addText(subtitle, { x: 0.6, y: 1.0, w: 8.8, h: 0.35, fontSize: 13, color: C.muted, fontFace: "Calibri", italic: true });
}

function addFooter(slide, num, total, presenter) {
  slide.addText(`${presenter}  |  Slide ${num} / ${total}`, { x: 0.6, y: 5.25, w: 8.8, h: 0.3, fontSize: 9, color: C.muted, fontFace: "Calibri", align: "right" });
}

const TOTAL = 12;
const P1 = "Ho Man Cheng";
const P2 = "Weitao Peng";

// ============================================================
// SLIDE 1: TITLE
// ============================================================
let s1 = pres.addSlide();
s1.background = { color: C.navy };
s1.addShape(pres.shapes.RECTANGLE, { x: 0, y: 4.3, w: 10, h: 1.325, fill: { color: C.blue, transparency: 30 } });
s1.addText("CS699 Data Mining", { x: 0.8, y: 0.8, w: 8.4, h: 0.6, fontSize: 18, color: C.blue, fontFace: "Calibri", charSpacing: 4 });
s1.addText("Classification of Disability Status\nin U.S. Households", { x: 0.8, y: 1.6, w: 8.4, h: 2, fontSize: 36, color: C.white, fontFace: "Georgia", bold: true });
s1.addText("Using the 2023 American Housing Survey (AHS) Dataset", { x: 0.8, y: 3.4, w: 8.4, h: 0.5, fontSize: 16, color: C.muted, fontFace: "Calibri", italic: true });
s1.addText([
  { text: "Ho Man Cheng", options: { bold: true } },
  { text: "  &  ", options: {} },
  { text: "Weitao Peng", options: { bold: true } },
], { x: 0.8, y: 4.6, w: 5, h: 0.4, fontSize: 18, color: C.white, fontFace: "Calibri" });
s1.addText("Boston University  |  Metropolitan College", { x: 0.8, y: 5.05, w: 5, h: 0.3, fontSize: 12, color: C.muted, fontFace: "Calibri" });

// ============================================================
// SLIDE 2: AGENDA
// ============================================================
let s2 = pres.addSlide();
addHeader(s2, "Agenda", "10-minute presentation  |  Two presenters");

s2.addShape(pres.shapes.RECTANGLE, { x: 0.6, y: 1.5, w: 4.1, h: 3.6, fill: { color: C.white }, shadow: makeShadow() });
s2.addShape(pres.shapes.RECTANGLE, { x: 0.6, y: 1.5, w: 4.1, h: 0.5, fill: { color: C.navy } });
s2.addText("Presenter 1: Ho Man Cheng (~5 min)", { x: 0.8, y: 1.5, w: 3.9, h: 0.5, fontSize: 12, color: C.white, fontFace: "Calibri", bold: true });
s2.addText([
  { text: "1. Problem & Dataset", options: { bullet: true, breakLine: true } },
  { text: "2. Tools & Algorithms", options: { bullet: true, breakLine: true } },
  { text: "3. Preprocessing Pipeline", options: { bullet: true, breakLine: true } },
  { text: "4. Class Imbalance", options: { bullet: true, breakLine: true } },
  { text: "5. Balancing Methods", options: { bullet: true } },
], { x: 0.9, y: 2.2, w: 3.6, h: 2.7, fontSize: 14, color: C.text, fontFace: "Calibri", paraSpaceAfter: 8 });

s2.addShape(pres.shapes.RECTANGLE, { x: 5.3, y: 1.5, w: 4.1, h: 3.6, fill: { color: C.white }, shadow: makeShadow() });
s2.addShape(pres.shapes.RECTANGLE, { x: 5.3, y: 1.5, w: 4.1, h: 0.5, fill: { color: C.blue } });
s2.addText("Presenter 2: Weitao Peng (~5 min)", { x: 5.5, y: 1.5, w: 3.9, h: 0.5, fontSize: 12, color: C.white, fontFace: "Calibri", bold: true });
s2.addText([
  { text: "6. Evaluation Methodology", options: { bullet: true, breakLine: true } },
  { text: "7. Results Overview", options: { bullet: true, breakLine: true } },
  { text: "8. Best Model Identified", options: { bullet: true, breakLine: true } },
  { text: "9. Key Findings", options: { bullet: true, breakLine: true } },
  { text: "10. Conclusion & Q&A", options: { bullet: true } },
], { x: 5.6, y: 2.2, w: 3.6, h: 2.7, fontSize: 14, color: C.text, fontFace: "Calibri", paraSpaceAfter: 8 });
addFooter(s2, 2, TOTAL, "Both");

// ============================================================
// SLIDE 3: PROBLEM & DATASET
// ============================================================
let s3 = pres.addSlide();
addHeader(s3, "Problem Statement & Dataset", "Binary classification on the 2023 American Housing Survey");

s3.addShape(pres.shapes.RECTANGLE, { x: 0.6, y: 1.5, w: 4.3, h: 3.5, fill: { color: C.white }, shadow: makeShadow() });
s3.addText("Objective", { x: 0.8, y: 1.6, w: 4, h: 0.4, fontSize: 16, color: C.navy, fontFace: "Calibri", bold: true });
s3.addText([
  { text: "Predict whether a U.S. household contains a member with a disability (Class = Yes / No).", options: { bullet: true, breakLine: true } },
  { text: "Policy value: targeted resources, accessible housing planning, social services.", options: { bullet: true, breakLine: true } },
  { text: "Technical goal: compare 36 model configurations to find the strongest classifier.", options: { bullet: true } },
], { x: 0.8, y: 2.05, w: 4, h: 2.8, fontSize: 13, color: C.text, fontFace: "Calibri", paraSpaceAfter: 6 });

s3.addShape(pres.shapes.RECTANGLE, { x: 5.1, y: 1.5, w: 4.3, h: 3.5, fill: { color: C.navy }, shadow: makeShadow() });
s3.addText("Dataset Snapshot", { x: 5.3, y: 1.6, w: 4, h: 0.4, fontSize: 16, color: C.white, fontFace: "Calibri", bold: true });
s3.addText([
  { text: "Source: U.S. Census Bureau AHS 2023", options: { bullet: true, breakLine: true } },
  { text: "Rows: 12,045 households", options: { bullet: true, breakLine: true } },
  { text: "Features (after preprocessing): 118", options: { bullet: true, breakLine: true } },
  { text: "Class distribution: 30.4% Yes / 69.6% No", options: { bullet: true, breakLine: true } },
  { text: "Train / Test split: 80% / 20% stratified", options: { bullet: true } },
], { x: 5.3, y: 2.05, w: 4, h: 2.8, fontSize: 13, color: C.darkText, fontFace: "Calibri", paraSpaceAfter: 6 });
addFooter(s3, 3, TOTAL, P1);

// ============================================================
// SLIDE 4: TOOLS & ALGORITHMS
// ============================================================
let s4 = pres.addSlide();
addHeader(s4, "Tools & Classification Algorithms", "R 4.5.2  |  12 packages  |  9 algorithms × 4 balancing = 36 models");

s4.addShape(pres.shapes.RECTANGLE, { x: 0.6, y: 1.5, w: 4.3, h: 3.5, fill: { color: C.white }, shadow: makeShadow() });
s4.addText("Core R Packages", { x: 0.8, y: 1.6, w: 4, h: 0.4, fontSize: 15, color: C.navy, fontFace: "Calibri", bold: true });
s4.addText([
  { text: "caret — unified training / tuning", options: { bullet: true, breakLine: true } },
  { text: "randomForest, gbm, xgboost", options: { bullet: true, breakLine: true } },
  { text: "e1071, kernlab — SVM", options: { bullet: true, breakLine: true } },
  { text: "nnet, naivebayes, rpart", options: { bullet: true, breakLine: true } },
  { text: "ROSE, smotefamily — balancing", options: { bullet: true, breakLine: true } },
  { text: "pROC — ROC/AUC analysis", options: { bullet: true } },
], { x: 0.8, y: 2.05, w: 4, h: 2.9, fontSize: 12, color: C.text, fontFace: "Calibri", paraSpaceAfter: 4 });

s4.addShape(pres.shapes.RECTANGLE, { x: 5.1, y: 1.5, w: 4.3, h: 3.5, fill: { color: C.white }, shadow: makeShadow() });
s4.addText("9 Classification Algorithms", { x: 5.3, y: 1.6, w: 4, h: 0.4, fontSize: 15, color: C.navy, fontFace: "Calibri", bold: true });
s4.addText([
  { text: "Logistic Regression  ·  Decision Tree", options: { bullet: true, breakLine: true } },
  { text: "Random Forest  ·  GBM  ·  XGBoost", options: { bullet: true, breakLine: true } },
  { text: "SVM (Radial)  ·  KNN", options: { bullet: true, breakLine: true } },
  { text: "Naive Bayes  ·  Neural Network", options: { bullet: true, breakLine: true } },
  { text: "Linear, tree-based, kernel, and neural families — full comparison across paradigms.", options: { italic: true } },
], { x: 5.3, y: 2.05, w: 4, h: 2.9, fontSize: 12, color: C.text, fontFace: "Calibri", paraSpaceAfter: 6 });
addFooter(s4, 4, TOTAL, P1);

// ============================================================
// SLIDE 5: PREPROCESSING PIPELINE
// ============================================================
let s5 = pres.addSlide();
addHeader(s5, "Preprocessing Pipeline", "From raw AHS CSV → 118 clean, scaled features");

const steps = [
  { n: "1", t: "Remove Class NAs", d: "Drop rows missing the target label" },
  { n: "2", t: "Drop CONTROL", d: "Identifier with zero predictive value" },
  { n: "3", t: "Numeric Conversion", d: "Factor codes → numeric for models" },
  { n: "4", t: "Median Imputation", d: "Replace NAs with column median" },
  { n: "5", t: "Near-Zero Variance", d: "Lenient filter (freqCut=99/1)" },
  { n: "6", t: "Winsorization", d: "Clip continuous outliers (1%/99%)" },
  { n: "7", t: "Center & Scale", d: "Zero mean, unit variance" },
];

const startX = 0.4; const boxW = 1.32; const gap = 0.05;
steps.forEach((step, i) => {
  const x = startX + i * (boxW + gap);
  s5.addShape(pres.shapes.RECTANGLE, { x: x, y: 1.6, w: boxW, h: 0.5, fill: { color: C.navy } });
  s5.addText(step.n, { x: x, y: 1.6, w: boxW, h: 0.5, fontSize: 18, color: C.accent, fontFace: "Georgia", bold: true, align: "center" });
  s5.addShape(pres.shapes.RECTANGLE, { x: x, y: 2.1, w: boxW, h: 1.8, fill: { color: C.white }, shadow: makeShadow() });
  s5.addText(step.t, { x: x + 0.05, y: 2.2, w: boxW - 0.1, h: 0.7, fontSize: 10, color: C.navy, fontFace: "Calibri", bold: true, align: "center" });
  s5.addText(step.d, { x: x + 0.05, y: 2.9, w: boxW - 0.1, h: 0.9, fontSize: 9, color: C.text, fontFace: "Calibri", align: "center" });
});

s5.addShape(pres.shapes.RECTANGLE, { x: 0.6, y: 4.2, w: 8.8, h: 0.85, fill: { color: C.light } });
s5.addText([
  { text: "Result: ", options: { bold: true, color: C.navy } },
  { text: "9,636 training rows × 118 features  →  Saved as ", options: {} },
  { text: "preprocessed_data.csv, initial_train.csv, initial_test.csv", options: { italic: true, color: C.accent } },
], { x: 0.8, y: 4.3, w: 8.4, h: 0.7, fontSize: 12, color: C.text, fontFace: "Calibri" });
addFooter(s5, 5, TOTAL, P1);

// ============================================================
// SLIDE 6: CLASS IMBALANCE
// ============================================================
let s6 = pres.addSlide();
addHeader(s6, "Class Imbalance Problem", "Majority class dominates — models bias toward predicting 'No'");

s6.addImage({ path: chartPath("chart1_class_distribution.png"), x: 0.6, y: 1.4, w: 5.2, h: 3.5 });
s6.addText("Figure 1. Class distribution in the training set", { x: 0.6, y: 4.9, w: 5.2, h: 0.3, fontSize: 10, color: C.muted, fontFace: "Calibri", italic: true, align: "center" });

s6.addShape(pres.shapes.RECTANGLE, { x: 6.1, y: 1.4, w: 3.3, h: 3.5, fill: { color: C.navy }, shadow: makeShadow() });
s6.addText("Why it matters", { x: 6.3, y: 1.5, w: 3, h: 0.4, fontSize: 15, color: C.white, fontFace: "Calibri", bold: true });
s6.addText([
  { text: "~70% No vs ~30% Yes", options: { bullet: true, breakLine: true } },
  { text: "Accuracy is misleading under imbalance", options: { bullet: true, breakLine: true } },
  { text: "Minority class (Yes) = the class we most want to detect", options: { bullet: true, breakLine: true } },
  { text: "Solution: apply balancing before training", options: { bullet: true, bold: true } },
], { x: 6.3, y: 1.95, w: 3, h: 2.9, fontSize: 12, color: C.darkText, fontFace: "Calibri", paraSpaceAfter: 6 });
addFooter(s6, 6, TOTAL, P1);

// ============================================================
// SLIDE 7: BALANCING METHODS
// ============================================================
let s7 = pres.addSlide();
addHeader(s7, "Four Balancing Methods", "Applied to training set only — test set stays untouched");

const methods = [
  { t: "Random Undersampling", d: "Remove majority-class samples to match minority count", c: C.navy },
  { t: "Random Oversampling", d: "Duplicate minority-class samples to match majority count", c: C.blue },
  { t: "SMOTE  (K=5)", d: "Synthesize new minority samples via nearest neighbors", c: C.navy },
  { t: "ROSE", d: "Generate a balanced synthetic sample via smoothed bootstrap", c: C.blue },
];
methods.forEach((m, i) => {
  const row = Math.floor(i / 2); const col = i % 2;
  const x = 0.6 + col * 4.5; const y = 1.5 + row * 1.75;
  s7.addShape(pres.shapes.RECTANGLE, { x: x, y: y, w: 4.3, h: 1.55, fill: { color: C.white }, shadow: makeShadow() });
  s7.addShape(pres.shapes.RECTANGLE, { x: x, y: y, w: 0.15, h: 1.55, fill: { color: m.c } });
  s7.addText(m.t, { x: x + 0.3, y: y + 0.1, w: 4, h: 0.4, fontSize: 15, color: C.navy, fontFace: "Calibri", bold: true });
  s7.addText(m.d, { x: x + 0.3, y: y + 0.55, w: 4, h: 0.9, fontSize: 12, color: C.text, fontFace: "Calibri" });
});
addFooter(s7, 7, TOTAL, P1);

// ============================================================
// SLIDE 8: EVALUATION METHODOLOGY
// ============================================================
let s8 = pres.addSlide();
addHeader(s8, "Evaluation Methodology", "Holdout test set  |  Fixed threshold 0.5  |  5-fold CV for tuning only");

s8.addShape(pres.shapes.RECTANGLE, { x: 0.6, y: 1.5, w: 4.3, h: 3.5, fill: { color: C.white }, shadow: makeShadow() });
s8.addText("How we evaluated 36 models", { x: 0.8, y: 1.6, w: 4, h: 0.4, fontSize: 15, color: C.navy, fontFace: "Calibri", bold: true });
s8.addText([
  { text: "Hold-out 2,409 rows as unbalanced test set", options: { bullet: true, breakLine: true } },
  { text: "5-fold cross-validation used only for hyperparameter tuning (never for final scoring)", options: { bullet: true, breakLine: true } },
  { text: "Predict with fixed decision threshold = 0.5", options: { bullet: true, breakLine: true } },
  { text: "Report on original imbalanced test → real-world fidelity", options: { bullet: true } },
], { x: 0.8, y: 2.05, w: 4, h: 2.9, fontSize: 12, color: C.text, fontFace: "Calibri", paraSpaceAfter: 6 });

s8.addShape(pres.shapes.RECTANGLE, { x: 5.1, y: 1.5, w: 4.3, h: 3.5, fill: { color: C.navy }, shadow: makeShadow() });
s8.addText("Metrics Tracked", { x: 5.3, y: 1.6, w: 4, h: 0.4, fontSize: 15, color: C.white, fontFace: "Calibri", bold: true });
s8.addText([
  { text: "TPR (Yes) — recall for the minority class", options: { bullet: true, breakLine: true } },
  { text: "TPR (No) — recall for the majority class", options: { bullet: true, breakLine: true } },
  { text: "Precision, F1, AUC, MCC, Kappa", options: { bullet: true, breakLine: true } },
  { text: "Weighted averages for overall comparison", options: { bullet: true, breakLine: true } },
  { text: "Extra-credit bar: Yes TPR ≥ 0.77 AND No TPR ≥ 0.73", options: { bullet: true, bold: true, color: C.accent } },
], { x: 5.3, y: 2.05, w: 4, h: 2.9, fontSize: 12, color: C.darkText, fontFace: "Calibri", paraSpaceAfter: 6 });
addFooter(s8, 8, TOTAL, P2);

// ============================================================
// SLIDE 9: RESULTS OVERVIEW
// ============================================================
let s9 = pres.addSlide();
addHeader(s9, "Results Overview — All 36 Models", "Yes TPR vs No TPR  |  upper-right quadrant = strong on both classes");

s9.addImage({ path: chartPath("chart2_tpr_scatter.png"), x: 0.6, y: 1.4, w: 5.6, h: 3.6 });
s9.addText("Figure 2. Per-class recall across 36 configurations", { x: 0.6, y: 5.0, w: 5.6, h: 0.25, fontSize: 10, color: C.muted, fontFace: "Calibri", italic: true, align: "center" });

s9.addShape(pres.shapes.RECTANGLE, { x: 6.4, y: 1.4, w: 3.0, h: 3.6, fill: { color: C.white }, shadow: makeShadow() });
s9.addText("Key Observations", { x: 6.6, y: 1.5, w: 2.6, h: 0.4, fontSize: 14, color: C.navy, fontFace: "Calibri", bold: true });
s9.addText([
  { text: "Undersampling pushes Yes-TPR highest", options: { bullet: true, breakLine: true } },
  { text: "Oversampling / SMOTE favor No-TPR", options: { bullet: true, breakLine: true } },
  { text: "Tree ensembles cluster in the upper band", options: { bullet: true, breakLine: true } },
  { text: "ROSE under-performs other balancers", options: { bullet: true, breakLine: true } },
  { text: "Only a handful cross both thresholds", options: { bullet: true, bold: true } },
], { x: 6.6, y: 1.95, w: 2.6, h: 3, fontSize: 11, color: C.text, fontFace: "Calibri", paraSpaceAfter: 6 });
addFooter(s9, 9, TOTAL, P2);

// ============================================================
// SLIDE 10: BEST MODEL
// ============================================================
let s10 = pres.addSlide();
addHeader(s10, "Best Model — Undersampling + Decision Tree", "Only configuration that crosses both extra-credit thresholds");

s10.addShape(pres.shapes.RECTANGLE, { x: 0.6, y: 1.4, w: 4.2, h: 3.6, fill: { color: C.navy }, shadow: makeShadow() });
s10.addText("Model 2", { x: 0.8, y: 1.5, w: 4, h: 0.4, fontSize: 16, color: C.accent, fontFace: "Calibri", bold: true });
s10.addText("Under-sampling + Decision Tree", { x: 0.8, y: 1.9, w: 4, h: 0.4, fontSize: 13, color: C.white, fontFace: "Calibri", italic: true });

const metrics = [
  ["Yes TPR", "0.7730", "≥ 0.77 required"],
  ["No TPR",  "0.7322", "≥ 0.73 required"],
  ["AUC",     "0.7990", ""],
  ["F1 (Yes)","0.6140", ""],
  ["Kappa",   "0.4582", ""],
];
let my = 2.45;
metrics.forEach(([k, v, note]) => {
  s10.addText(k, { x: 0.8, y: my, w: 1.5, h: 0.35, fontSize: 12, color: C.darkText, fontFace: "Calibri" });
  s10.addText(v, { x: 2.3, y: my, w: 1, h: 0.35, fontSize: 14, color: C.white, fontFace: "Calibri", bold: true });
  if (note) s10.addText(note, { x: 3.3, y: my, w: 1.5, h: 0.35, fontSize: 9, color: C.accent, fontFace: "Calibri", italic: true });
  my += 0.4;
});

s10.addImage({ path: chartPath("chart6_tprsum_top10.png"), x: 5.0, y: 1.4, w: 4.4, h: 3.6 });
s10.addText("Figure 3. Top 10 models ranked by combined TPR (Yes + No)", { x: 5.0, y: 5.0, w: 4.4, h: 0.25, fontSize: 10, color: C.muted, fontFace: "Calibri", italic: true, align: "center" });
addFooter(s10, 10, TOTAL, P2);

// ============================================================
// SLIDE 11: KEY FINDINGS
// ============================================================
let s11 = pres.addSlide();
addHeader(s11, "Key Findings", "Lessons from 36 model configurations");

const findings = [
  { h: "Balancing beats accuracy chasing", d: "Undersampling unlocked the highest Yes-TPR despite shrinking the training set to ~5.8K rows." },
  { h: "Simple models can win", d: "A pruned Decision Tree beat ensembles on the minority-class recall target." },
  { h: "Ensembles dominate overall AUC", d: "Random Forest and XGBoost top the AUC ranking but underperform Yes-TPR." },
  { h: "ROSE offered little lift here", d: "Its smoothed-bootstrap samples introduce noise without stabilizing the decision boundary." },
];
findings.forEach((f, i) => {
  const row = Math.floor(i / 2); const col = i % 2;
  const x = 0.6 + col * 4.5; const y = 1.5 + row * 1.75;
  s11.addShape(pres.shapes.RECTANGLE, { x: x, y: y, w: 4.3, h: 1.55, fill: { color: C.white }, shadow: makeShadow() });
  s11.addShape(pres.shapes.RECTANGLE, { x: x, y: y, w: 0.15, h: 1.55, fill: { color: C.accent } });
  s11.addText(f.h, { x: x + 0.3, y: y + 0.1, w: 4, h: 0.45, fontSize: 14, color: C.navy, fontFace: "Calibri", bold: true });
  s11.addText(f.d, { x: x + 0.3, y: y + 0.6, w: 4, h: 0.9, fontSize: 11, color: C.text, fontFace: "Calibri" });
});
addFooter(s11, 11, TOTAL, P2);

// ============================================================
// SLIDE 12: CONCLUSION & Q&A
// ============================================================
let s12 = pres.addSlide();
s12.background = { color: C.navy };
s12.addShape(pres.shapes.RECTANGLE, { x: 0, y: 2.3, w: 10, h: 1.0, fill: { color: C.blue, transparency: 30 } });
s12.addText("Thank You", { x: 0.8, y: 0.9, w: 8.4, h: 0.8, fontSize: 40, color: C.white, fontFace: "Georgia", bold: true });
s12.addText("Questions?", { x: 0.8, y: 2.45, w: 8.4, h: 0.7, fontSize: 28, color: C.accent, fontFace: "Georgia", italic: true });

s12.addText([
  { text: "Takeaway: ", options: { bold: true, color: C.accent } },
  { text: "Model 2 (Under + Decision Tree) meets both extra-credit thresholds — Yes TPR 0.7730, No TPR 0.7322.", options: { color: C.white } },
], { x: 0.8, y: 3.9, w: 8.4, h: 0.6, fontSize: 14, fontFace: "Calibri" });

s12.addText("Ho Man Cheng  |  Weitao Peng   ·   CS699 Data Mining   ·   Spring 2026", { x: 0.8, y: 5.1, w: 8.4, h: 0.3, fontSize: 11, color: C.muted, fontFace: "Calibri", align: "center" });

// ============================================================
// SAVE
// ============================================================
pres.writeFile({ fileName: "D:\\VS Code\\VS Code Project\\BU\\699 HW\\Project_New\\Cheng_HoMan_Peng_Weitao_Slides.pptx" })
  .then(fileName => { console.log(`Created: ${fileName}`); });
