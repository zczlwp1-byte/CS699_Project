# Presentation Script — CS699 Classification Project
**Total length:** ~10 minutes  |  **Presenters:** Ho Man Cheng (Slides 1–7, ~5:00) · Weitao Peng (Slides 8–12, ~5:00)
**Pace target:** ~130 words/min delivery.

---

## PRESENTER 1 — Ho Man Cheng  (Slides 1–7, ~5:00)

### Slide 1 — Title (0:20)
Good afternoon, Professor and classmates. I'm **Ho Man Cheng**, and together with my teammate **Weitao Peng**, we're presenting our CS699 Data Mining final project: the **Classification of Disability Status in U.S. Households** using the 2023 American Housing Survey. Over the next ten minutes we'll walk you through our data, our pipeline, the thirty-six models we built, and the single configuration that came out on top.

### Slide 2 — Agenda (0:20)
Here's how we've split the talk. I'll cover the problem, the dataset, our tools, the preprocessing pipeline, and the four balancing methods — that's roughly the first five minutes. Weitao will then take over with the evaluation methodology, the results across all thirty-six models, the best model we identified, the key findings, and our conclusion.

### Slide 3 — Problem Statement & Dataset (0:50)
Our objective is a **binary classification** problem: predict whether a U.S. household contains a member with a disability — a Yes/No label. The motivation is practical: these predictions support targeted resource allocation, accessible housing planning, and social-service delivery.

Our dataset comes from the **U.S. Census Bureau's 2023 American Housing Survey**. After cleaning we had **12,045 households and 118 features**. Importantly, the class distribution is imbalanced — only about **30.4%** of households have a disabled member, while **69.6%** do not. We used a stratified 80/20 split for training and testing.

### Slide 4 — Tools & Classification Algorithms (0:50)
We built everything in **R 4.5.2** using twelve packages. `caret` gave us a unified training and tuning interface; `randomForest`, `gbm`, and `xgboost` handled the ensembles; `e1071` and `kernlab` provided SVMs; `nnet` gave us neural networks; `ROSE` and `smotefamily` handled resampling; and `pROC` handled ROC analysis.

We selected **nine classification algorithms** that span four families — linear, tree-based, kernel, and neural — so the comparison is fair across paradigms. Combined with four balancing methods, that gives us exactly **thirty-six model configurations**.

### Slide 5 — Preprocessing Pipeline (0:55)
Our pipeline has seven stages. First we drop rows missing the class label. Second we drop the `CONTROL` identifier column, which has no predictive value. Third, we convert factor codes to numeric. Fourth, we impute missing values using the column median. Fifth, a **lenient near-zero-variance filter** with a 99-to-1 frequency cutoff removes constants while keeping rare binary signals. Sixth, we winsorize continuous features to the 1st and 99th percentiles to tame outliers. Seventh, we center and scale.

The result: **9,636 training rows across 118 features**, saved to the three CSVs required by the assignment.

### Slide 6 — Class Imbalance Problem (0:45)
This chart shows why balancing matters. The majority class — households without a disabled member — makes up roughly seventy percent of the training set. If we naively optimize accuracy, a model can hit **70%** just by always predicting No, and still completely miss the minority class we actually care about. In this problem, the **Yes** class is the policy-relevant one, so recall on that class is what we want to maximize.

### Slide 7 — Four Balancing Methods (1:00)
We applied four balancing strategies — and only to the training set; the test set stays untouched so our evaluation reflects reality.

**Random Undersampling** removes majority-class rows until both classes match. **Random Oversampling** duplicates minority rows. **SMOTE**, with K equal to five, synthesizes new minority samples by interpolating between nearest neighbors. Finally **ROSE** uses a smoothed bootstrap to generate a fully synthetic balanced sample. Each method rebalances the training data differently — and, as you'll see, they give very different downstream results. I'll now hand it over to Weitao to walk through the evaluation.

---

## PRESENTER 2 — Weitao Peng  (Slides 8–12, ~5:00)

### Slide 8 — Evaluation Methodology (1:00)
Thank you, Ho Man. Our evaluation protocol is deliberately strict. We held out **2,409 rows** as an untouched, unbalanced test set. We used **5-fold cross-validation** only for hyperparameter tuning — never for final scoring — and we locked the decision threshold at **0.5** to keep the comparison fair across all thirty-six models.

We report recall on each class separately — **Yes TPR** and **No TPR** — along with Precision, F1, AUC, MCC, and Kappa. The extra-credit bar set by the assignment is demanding: **Yes TPR must reach 0.77** and **No TPR must reach 0.73** simultaneously.

### Slide 9 — Results Overview (1:10)
This scatter plots Yes TPR on the x-axis against No TPR on the y-axis for every one of the thirty-six models. A few patterns stand out.

**Undersampling** — the red cluster — pushes Yes-TPR the highest, but at the cost of No-TPR. **Oversampling and SMOTE** do the opposite: they favor the majority class. **Tree ensembles** — Random Forest, GBM, XGBoost — cluster in the upper band with strong overall AUC. **ROSE** consistently underperformed the other three balancers on our data. And critically, only a small handful of points cross *both* dashed thresholds into the upper-right quadrant that the extra-credit target defines.

### Slide 10 — Best Model (1:10)
Our winner is **Model 2**: Random Undersampling paired with a Decision Tree. It scored **Yes TPR of 0.7730**, which clears the 0.77 bar, and **No TPR of 0.7322**, which clears the 0.73 bar — the only configuration to meet both simultaneously. AUC was **0.7990**, F1 on the Yes class was **0.6140**, and Cohen's Kappa was **0.4582**.

The chart on the right ranks the top ten models by combined TPR. Model 2 sits at the top. This is a reminder that a pruned Decision Tree, given a balanced training distribution, can outperform much heavier ensembles on the metrics that actually matter for this problem.

### Slide 11 — Key Findings (1:15)
Four takeaways. **First**, balancing beats accuracy chasing — undersampling unlocked the highest minority-class recall even though it shrank the training set to roughly 5,800 rows. **Second**, simple models can win — our pruned Decision Tree beat every ensemble on the dual-recall target. **Third**, ensembles still dominate overall AUC — Random Forest and XGBoost lead the AUC ranking, but their Yes-TPR lags because the decision threshold of 0.5 is not optimal for their probability distributions. **Fourth**, ROSE offered little lift on this dataset — its smoothed-bootstrap samples added noise without stabilizing the decision boundary.

### Slide 12 — Conclusion & Q&A (0:25)
To summarize: thirty-six models, nine algorithms, four balancing methods, one strict evaluation protocol — and **Model 2, Undersampling plus Decision Tree, is the only one that meets both extra-credit thresholds**. Thank you for your time — we're happy to take any questions.

---

## Timing Summary

| Segment | Presenter | Slides | Time |
|---|---|---|---|
| Title + Agenda | Ho Man | 1–2 | 0:40 |
| Problem & Dataset | Ho Man | 3 | 0:50 |
| Tools & Algorithms | Ho Man | 4 | 0:50 |
| Preprocessing | Ho Man | 5 | 0:55 |
| Class Imbalance | Ho Man | 6 | 0:45 |
| Balancing Methods | Ho Man | 7 | 1:00 |
| **Presenter 1 Total** |  |  | **~5:00** |
| Evaluation | Weitao | 8 | 1:00 |
| Results Overview | Weitao | 9 | 1:10 |
| Best Model | Weitao | 10 | 1:10 |
| Key Findings | Weitao | 11 | 1:15 |
| Conclusion | Weitao | 12 | 0:25 |
| **Presenter 2 Total** |  |  | **~5:00** |
| **Grand Total** |  | **12** | **~10:00** |

## Delivery Notes
- Practice the handoff at the end of Slide 7 so the transition is clean.
- If short on time, trim Slide 11 to two findings instead of four.
- If ahead of schedule, linger on Slide 9 to point out specific models.
- Speak at roughly **130 words/min**; any faster and the audience can't follow the numbers.
