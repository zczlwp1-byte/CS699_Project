# Q&A Preparation — CS699 Classification Project
**Team:** Ho Man Cheng & Weitao Peng
**Format:** 6 anticipated questions with rehearsed answers (~30–45 seconds each)

---

## Question 1 — Why did a simple Decision Tree beat ensembles like XGBoost and Random Forest?

**Anticipated phrasing from audience:**
> "XGBoost and Random Forest had the highest AUC, but they didn't win. Why did a single Decision Tree outperform them on your target metrics?"

**Answer (~40 seconds):**

Great question. The key is that **AUC and per-class TPR measure different things**. AUC measures how well a model *ranks* Yes examples above No examples across all possible thresholds, while Yes TPR at a fixed threshold of 0.5 measures how many Yes cases we actually classify correctly *right now*.

Random Forest and XGBoost produced strong probability rankings — that's why their AUCs were high — but their probability distributions were compressed around 0.5, so at our fixed cutoff many true Yes cases fell just below the threshold. The Decision Tree, trained on the undersampled 50/50 data, produced more confident, polarized probabilities that pushed Yes cases clearly across the 0.5 line. In other words, **the ensembles ranked better, but the tree made cleaner decisions at our chosen threshold** — which is exactly what the grading rubric rewards.

**Fallback one-liner if time is short:**
> "High AUC means good ranking; the rubric rewards good *decisions* at threshold 0.5, and the Decision Tree made cleaner decisions on the undersampled data."

---

## Question 2 — Why did you choose Random Undersampling when it throws away ~70% of the majority class data?

**Anticipated phrasing from audience:**
> "Undersampling discards most of your No-class examples. Wasn't that wasteful? Why not use SMOTE or oversampling, which keep all the data?"

**Answer (~40 seconds):**

That's a fair concern, and we asked the same thing early on. Three reasons justified the choice empirically.

**First**, the minority class is the **signal-limited** class here — there are only about 2,900 Yes rows. Our bottleneck was minority-class recall, not majority-class coverage, so losing some No rows wasn't the limiting factor.

**Second**, we tested all four balancing methods head-to-head. Undersampling produced a **mean Yes-TPR roughly double that of ROSE**, and it consistently beat SMOTE and oversampling on the dual-threshold target. The empirical result spoke for itself.

**Third**, the Decision Tree's top splits latched onto **binary disability indicator features** — variables like HHSEE, HHMEMRY, and HHCARE. Once the training data was 50/50 balanced, those binary splits aligned almost perfectly with the class boundary. Synthesized samples from SMOTE and ROSE actually *blurred* those clean binary splits by creating non-binary interpolated values.

So yes, undersampling discards data — but it discards *redundant* data and preserves the exact signal the model needs.

**Fallback one-liner if time is short:**
> "Empirically it beat every other balancer on Yes-TPR, and it preserved the clean binary splits the Decision Tree relies on."

---

## Question 3 — How would your model generalize to other Census years or different states, and could it be deployed in practice?

**Anticipated phrasing from audience:**
> "You evaluated on a holdout from 2023 data. Would this model work on the 2021 AHS or on data from a single state? And what would it take to deploy it?"

**Answer (~45 seconds):**

Honest answer: **we don't know for certain**, and that's an important caveat we'd flag in any real deployment. Here's what we can say.

**On temporal generalization:** the AHS schema is relatively stable across years, and our top predictors — HHSEE, HHMEMRY, HHCARE, HHERRND — are questionnaire items that exist in multiple survey years. So the model architecture should transfer, but we'd want to **retrain** rather than reuse the fitted weights, because base rates shift slightly year over year.

**On geographic generalization:** the 2023 AHS samples nationally, so our model reflects a nationally-weighted distribution. A single state with very different demographics — say, a state with a much older population — would likely see **different calibration**, and we'd recommend refitting on state-level data if such data were available.

**On deployment:** honestly, a Yes-class precision of **0.47** is too low for any high-stakes decision like benefit allocation. Our model is more useful as a **screening tool** — flagging households for a human follow-up — than as an automated classifier. With a higher-precision stage after it, it could add real value.

**Fallback one-liner if time is short:**
> "The features are stable across AHS years, so the architecture generalizes — but we'd retrain on new data, and the ~47% precision means it's a screening tool, not a deployment-ready classifier."

---

## Question 4 — Why did you fix the classification threshold at 0.5 instead of tuning it per model?

**Anticipated phrasing from audience:**
> "You could have boosted Yes TPR for XGBoost and Random Forest just by lowering the threshold below 0.5. Why didn't you tune the threshold per model?"

**Answer (~40 seconds):**

You're right that threshold tuning would change the ranking — and that was actually a deliberate methodological choice, not an oversight.

**First**, a fixed threshold of 0.5 gives us a **fair, apples-to-apples comparison** across all 36 models. If we tuned per model, we'd be comparing 36 different operating points, and the winner would partly reflect who got the luckiest threshold on the test set — not who had the strongest underlying classifier.

**Second**, threshold tuning on the test set is a form of **data leakage**. Doing it properly would require a separate validation split or nested cross-validation, which would shrink our training data further.

**Third**, the assignment's grading rubric specifies evaluation at the default threshold, so we followed the stated protocol.

That said, if this were a real deployment, threshold tuning via precision-recall curves would be the next step — and I'd expect XGBoost to become competitive once we pick a threshold around 0.3 to 0.35.

**Fallback one-liner if time is short:**
> "Fixed threshold = fair comparison across 36 models with no test-set leakage; threshold tuning would be the next step in a real deployment."

---

## Question 5 — What are the ethical and privacy implications of predicting disability status?

**Anticipated phrasing from audience:**
> "Predicting disability status is sensitive. What are the ethical risks of this kind of model, and how should stakeholders think about deploying it?"

**Answer (~45 seconds):**

This is a question we take seriously, and it's one of the reasons we were cautious about the deployment claim.

**The first risk is misuse.** A model that flags households as likely containing a disabled person could be used for *discrimination* as easily as for support — for example by insurers adjusting premiums, landlords screening tenants, or employers targeting job ads. So any deployment would need strict access controls and a defined legitimate purpose, like allocating accessibility resources.

**The second risk is false positives.** Our Yes-class precision is only **0.47**, meaning over half of flagged households don't actually have a disabled member. Labeling a household incorrectly based on a model could cause real harm if the label is treated as authoritative.

**The third risk is privacy.** The AHS is a public survey with informed consent, but deploying a predictor on non-survey data — say, administrative records — crosses a consent boundary the original respondents didn't agree to.

Our view: this model belongs in **aggregate policy research**, not individual-level decisioning.

**Fallback one-liner if time is short:**
> "Three concerns — discrimination risk, 47% false-positive rate, and consent boundaries. This model belongs in aggregate research, not individual decisions."

---

## Question 6 — What would you do differently if you had more time or compute resources?

**Anticipated phrasing from audience:**
> "If you had another semester and unlimited compute, what's the next thing you'd try to push performance higher?"

**Answer (~45 seconds):**

Great closing question. Four things, roughly in order of expected impact.

**First, cost-sensitive learning.** Instead of physically resampling the training data, we'd encode the class imbalance into the loss function directly — for example, class-weighted XGBoost. This often matches undersampling's recall while keeping all the training data.

**Second, proper threshold tuning** with a three-way split — train, validation, test — to pick a per-model threshold that maximizes the dual-TPR objective without leaking.

**Third, model stacking.** Our results suggest Decision Trees handle Yes-TPR well while XGBoost handles No-TPR and AUC well. A meta-learner that blends them could potentially cross both thresholds with higher margin.

**Fourth, feature engineering from the AHS codebook** — building composite features from related survey items rather than using raw codes. The raw AHS features are noisy; domain-informed aggregations would likely help every algorithm.

If I had to pick just one, I'd start with **cost-sensitive XGBoost** — it's the highest expected return for the lowest implementation cost.

**Fallback one-liner if time is short:**
> "Cost-sensitive XGBoost first, then proper threshold tuning with a three-way split, then stacking Decision Tree + XGBoost into a meta-learner."

---

## Delivery Tips

1. **Acknowledge the question first** — a brief "Great question" or "That's a fair concern" buys you two seconds to organize your thought.
2. **Number your points out loud** ("Three reasons...", "First... Second... Third...") — the audience remembers structured answers better.
3. **Admit uncertainty when appropriate** — saying "honestly, we don't know" about generalization is more credible than overclaiming.
4. **Cap each answer at ~45 seconds** — if you're running long, stop and offer to discuss offline.
5. **Split Q&A handling** — Ho Man fields Preprocessing/Data questions; Weitao fields Results/Evaluation questions. If one of you is stuck, the other steps in.

## Quick-Reference Cheat Sheet (keep on lectern)

| Stat | Value |
|---|---|
| Training rows | 9,636 |
| Test rows | 2,409 |
| Features after preprocessing | 118 |
| Class distribution | 30.4% Yes / 69.6% No |
| Best model Yes TPR | 0.7730 |
| Best model No TPR | 0.7322 |
| Best model AUC | 0.7990 |
| Best model F1 (Yes) | 0.6140 |
| Best model Kappa | 0.4582 |
| Extra-credit thresholds | Yes ≥ 0.77, No ≥ 0.73 |
