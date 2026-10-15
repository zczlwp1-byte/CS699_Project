# Detailed results for all 36 models

These are the recorded results from `output_log4.txt`, cross-checked against the report and the data embedded in `generate_charts.py`. No models were retrained for this documentation update. Metrics are rounded as printed in the log.

The positive class is **Yes**. Confusion matrices below use actual classes as rows and predicted classes as columns. Each model is evaluated on 2,409 records: 1,845 No and 564 Yes.

[Back to project overview](../README.md) · [Download comparison CSV](../results/model_comparison.csv)

## Complete comparison

| Model | Balancing + algorithm | Yes recall | No recall | Yes precision | Yes F1 | No F1 | AUC | MCC | Kappa |
|---:|---|---:|---:|---:|---:|---:|---:|---:|---:|
| 1 | Undersampling + Logistic Regression | 0.6915 | 0.8472 | 0.5804 | 0.6311 | 0.8727 | 0.8528 | 0.5086 | 0.5051 |
| 2 | Undersampling + Decision Tree | 0.7730 | 0.7322 | 0.4688 | 0.5837 | 0.8129 | 0.7887 | 0.4395 | 0.4124 |
| 3 | Undersampling + Random Forest | 0.7021 | 0.8238 | 0.5492 | 0.6163 | 0.8605 | 0.8491 | 0.4864 | 0.4796 |
| 4 | Undersampling + Gradient Boosting | 0.7252 | 0.8304 | 0.5665 | 0.6361 | 0.8675 | 0.8567 | 0.5135 | 0.5063 |
| 5 | Undersampling + SVM (Radial) | 0.7163 | 0.8119 | 0.5379 | 0.6144 | 0.8553 | 0.8506 | 0.4829 | 0.4737 |
| 6 | Undersampling + K-Nearest Neighbors | 0.4592 | 0.9041 | 0.5940 | 0.5180 | 0.8738 | 0.7842 | 0.3996 | 0.3944 |
| 7 | Undersampling + Naive Bayes | 0.1348 | 0.9664 | 0.5507 | 0.2165 | 0.8664 | 0.7527 | 0.1843 | 0.1371 |
| 8 | Undersampling + Neural Network | 0.6791 | 0.7409 | 0.4448 | 0.5375 | 0.8058 | 0.7857 | 0.3711 | 0.3551 |
| 9 | Undersampling + XGBoost | 0.6986 | 0.8499 | 0.5872 | 0.6381 | 0.8752 | 0.8596 | 0.5181 | 0.5146 |
| 10 | Oversampling + Logistic Regression | 0.6826 | 0.8607 | 0.5997 | 0.6385 | 0.8793 | 0.8568 | 0.5204 | 0.5184 |
| 11 | Oversampling + Decision Tree | 0.6383 | 0.8228 | 0.5240 | 0.5755 | 0.8511 | 0.7505 | 0.4324 | 0.4286 |
| 12 | Oversampling + Random Forest | 0.4504 | 0.9767 | 0.8552 | 0.5900 | 0.9108 | 0.8537 | 0.55 | 0.511 |
| 13 | Oversampling + Gradient Boosting | 0.6489 | 0.8846 | 0.6321 | 0.6404 | 0.8882 | 0.8495 | 0.5287 | 0.5286 |
| 14 | Oversampling + SVM (Radial) | 0.5550 | 0.9176 | 0.6731 | 0.6084 | 0.8936 | 0.8272 | 0.507 | 0.5032 |
| 15 | Oversampling + K-Nearest Neighbors | 0.5638 | 0.7604 | 0.4184 | 0.4804 | 0.8031 | 0.6823 | 0.2955 | 0.2894 |
| 16 | Oversampling + Naive Bayes | 0.1365 | 0.9718 | 0.5969 | 0.2222 | 0.8693 | 0.7583 | 0.2038 | 0.148 |
| 17 | Oversampling + Neural Network | 0.5390 | 0.8585 | 0.5381 | 0.5385 | 0.8588 | 0.7673 | 0.3973 | 0.3973 |
| 18 | Oversampling + XGBoost | 0.4840 | 0.9604 | 0.7890 | 0.6000 | 0.9069 | 0.8425 | 0.5367 | 0.5134 |
| 19 | SMOTE + Logistic Regression | 0.6738 | 0.8743 | 0.6209 | 0.6463 | 0.8858 | 0.8539 | 0.5331 | 0.5323 |
| 20 | SMOTE + Decision Tree | 0.5071 | 0.9333 | 0.6993 | 0.5879 | 0.8957 | 0.8082 | 0.4967 | 0.4869 |
| 21 | SMOTE + Random Forest | 0.4167 | 0.9783 | 0.8545 | 0.5602 | 0.9073 | 0.8518 | 0.526 | 0.4805 |
| 22 | SMOTE + Gradient Boosting | 0.4894 | 0.9637 | 0.8047 | 0.6086 | 0.9092 | 0.8511 | 0.549 | 0.5244 |
| 23 | SMOTE + SVM (Radial) | 0.5142 | 0.9182 | 0.6576 | 0.5771 | 0.8885 | 0.8082 | 0.4734 | 0.4678 |
| 24 | SMOTE + K-Nearest Neighbors | 0.6596 | 0.6672 | 0.3773 | 0.4800 | 0.7534 | 0.7137 | 0.2814 | 0.2594 |
| 25 | SMOTE + Naive Bayes | 0.0089 | 0.9995 | 0.8333 | 0.0175 | 0.8682 | 0.7497 | 0.0707 | 0.0127 |
| 26 | SMOTE + Neural Network | 0.6028 | 0.8314 | 0.5223 | 0.5597 | 0.8515 | 0.7901 | 0.4141 | 0.4122 |
| 27 | SMOTE + XGBoost | 0.4450 | 0.9799 | 0.8715 | 0.5892 | 0.9117 | 0.857 | 0.5547 | 0.512 |
| 28 | ROSE + Logistic Regression | 0.7110 | 0.8255 | 0.5546 | 0.6232 | 0.8626 | 0.8494 | 0.4957 | 0.4886 |
| 29 | ROSE + Decision Tree | 0.2021 | 1.0000 | 1.0000 | 0.3363 | 0.8913 | 0.6011 | 0.4031 | 0.2796 |
| 30 | ROSE + Random Forest | 0.227 | 1.000 | 1.0000 | 0.3699 | 0.8943 | 0.7067 | 0.4285 | 0.3102 |
| 31 | ROSE + Gradient Boosting | 0.1383 | 1.0000 | 1.0000 | 0.2430 | 0.8836 | 0.6862 | 0.3309 | 0.1973 |
| 32 | ROSE + SVM (Radial) | 0.3103 | 0.9881 | 0.8883 | 0.4599 | 0.8987 | 0.8335 | 0.4611 | 0.3854 |
| 33 | ROSE + K-Nearest Neighbors | 0.1755 | 0.9843 | 0.7734 | 0.2861 | 0.8803 | 0.6454 | 0.3017 | 0.2184 |
| 34 | ROSE + Naive Bayes | 0.0833 | 0.9935 | 0.7966 | 0.1509 | 0.8739 | 0.7709 | 0.2105 | 0.1115 |
| 35 | ROSE + Neural Network | 0.3830 | 0.9924 | 0.9391 | 0.5441 | 0.9100 | 0.7354 | 0.5409 | 0.4725 |
| 36 | ROSE + XGBoost | 0.2199 | 1.0000 | 1.0000 | 0.3605 | 0.8935 | 0.6869 | 0.4213 | 0.3015 |

## Confusion matrices

### Model 1: Undersampling + Logistic Regression

| Actual / Predicted | No | Yes |
|---|---:|---:|
| No | 1563 | 282 |
| Yes | 174 | 390 |

Yes recall: 0.6915; No recall: 0.8472; Yes precision: 0.5804; Yes F1: 0.6311; AUC: 0.8528; MCC: 0.5086; Kappa: 0.5051.

Original class-wise and weighted metrics:

```text
Class    TPR    FPR Precision Recall F_measure ROC_Area    MCC  Kappa
           No 0.8472 0.3085    0.8998 0.8472    0.8727   0.8528 0.5086 0.5051
          Yes 0.6915 0.1528    0.5804 0.6915    0.6311   0.8528 0.5086 0.5051
 Weighted Avg 0.8107 0.2721    0.8250 0.8107    0.8161   0.8528 0.5086 0.5051
```

### Model 2: Undersampling + Decision Tree

| Actual / Predicted | No | Yes |
|---|---:|---:|
| No | 1351 | 494 |
| Yes | 128 | 436 |

Yes recall: 0.7730; No recall: 0.7322; Yes precision: 0.4688; Yes F1: 0.5837; AUC: 0.7887; MCC: 0.4395; Kappa: 0.4124.

Original class-wise and weighted metrics:

```text
Class    TPR    FPR Precision Recall F_measure ROC_Area    MCC  Kappa
           No 0.7322 0.2270    0.9135 0.7322    0.8129   0.7887 0.4395 0.4124
          Yes 0.7730 0.2678    0.4688 0.7730    0.5837   0.7887 0.4395 0.4124
 Weighted Avg 0.7418 0.2365    0.8094 0.7418    0.7592   0.7887 0.4395 0.4124
```

### Model 3: Undersampling + Random Forest

| Actual / Predicted | No | Yes |
|---|---:|---:|
| No | 1520 | 325 |
| Yes | 168 | 396 |

Yes recall: 0.7021; No recall: 0.8238; Yes precision: 0.5492; Yes F1: 0.6163; AUC: 0.8491; MCC: 0.4864; Kappa: 0.4796.

Original class-wise and weighted metrics:

```text
Class    TPR    FPR Precision Recall F_measure ROC_Area    MCC  Kappa
           No 0.8238 0.2979    0.9005 0.8238    0.8605   0.8491 0.4864 0.4796
          Yes 0.7021 0.1762    0.5492 0.7021    0.6163   0.8491 0.4864 0.4796
 Weighted Avg 0.7954 0.2694    0.8182 0.7954    0.8033   0.8491 0.4864 0.4796
```

### Model 4: Undersampling + Gradient Boosting

| Actual / Predicted | No | Yes |
|---|---:|---:|
| No | 1532 | 313 |
| Yes | 155 | 409 |

Yes recall: 0.7252; No recall: 0.8304; Yes precision: 0.5665; Yes F1: 0.6361; AUC: 0.8567; MCC: 0.5135; Kappa: 0.5063.

Original class-wise and weighted metrics:

```text
Class    TPR    FPR Precision Recall F_measure ROC_Area    MCC  Kappa
           No 0.8304 0.2748    0.9081 0.8304    0.8675   0.8567 0.5135 0.5063
          Yes 0.7252 0.1696    0.5665 0.7252    0.6361   0.8567 0.5135 0.5063
 Weighted Avg 0.8057 0.2502    0.8281 0.8057    0.8133   0.8567 0.5135 0.5063
```

### Model 5: Undersampling + SVM (Radial)

| Actual / Predicted | No | Yes |
|---|---:|---:|
| No | 1498 | 347 |
| Yes | 160 | 404 |

Yes recall: 0.7163; No recall: 0.8119; Yes precision: 0.5379; Yes F1: 0.6144; AUC: 0.8506; MCC: 0.4829; Kappa: 0.4737.

Original class-wise and weighted metrics:

```text
Class    TPR    FPR Precision Recall F_measure ROC_Area    MCC  Kappa
           No 0.8119 0.2837    0.9035 0.8119    0.8553   0.8506 0.4829 0.4737
          Yes 0.7163 0.1881    0.5379 0.7163    0.6144   0.8506 0.4829 0.4737
 Weighted Avg 0.7895 0.2613    0.8179 0.7895    0.7989   0.8506 0.4829 0.4737
```

### Model 6: Undersampling + K-Nearest Neighbors

| Actual / Predicted | No | Yes |
|---|---:|---:|
| No | 1668 | 177 |
| Yes | 305 | 259 |

Yes recall: 0.4592; No recall: 0.9041; Yes precision: 0.5940; Yes F1: 0.5180; AUC: 0.7842; MCC: 0.3996; Kappa: 0.3944.

Original class-wise and weighted metrics:

```text
Class    TPR    FPR Precision Recall F_measure ROC_Area    MCC  Kappa
           No 0.9041 0.5408    0.8454 0.9041    0.8738   0.7842 0.3996 0.3944
          Yes 0.4592 0.0959    0.5940 0.4592    0.5180   0.7842 0.3996 0.3944
 Weighted Avg 0.7999 0.4366    0.7866 0.7999    0.7905   0.7842 0.3996 0.3944
```

### Model 7: Undersampling + Naive Bayes

| Actual / Predicted | No | Yes |
|---|---:|---:|
| No | 1783 | 62 |
| Yes | 488 | 76 |

Yes recall: 0.1348; No recall: 0.9664; Yes precision: 0.5507; Yes F1: 0.2165; AUC: 0.7527; MCC: 0.1843; Kappa: 0.1371.

Original class-wise and weighted metrics:

```text
Class    TPR    FPR Precision Recall F_measure ROC_Area    MCC  Kappa
           No 0.9664 0.8652    0.7851 0.9664    0.8664   0.7527 0.1843 0.1371
          Yes 0.1348 0.0336    0.5507 0.1348    0.2165   0.7527 0.1843 0.1371
 Weighted Avg 0.7717 0.6705    0.7302 0.7717    0.7142   0.7527 0.1843 0.1371
```

### Model 8: Undersampling + Neural Network

| Actual / Predicted | No | Yes |
|---|---:|---:|
| No | 1367 | 478 |
| Yes | 181 | 383 |

Yes recall: 0.6791; No recall: 0.7409; Yes precision: 0.4448; Yes F1: 0.5375; AUC: 0.7857; MCC: 0.3711; Kappa: 0.3551.

Original class-wise and weighted metrics:

```text
Class    TPR    FPR Precision Recall F_measure ROC_Area    MCC  Kappa
           No 0.7409 0.3209    0.8831 0.7409    0.8058   0.7857 0.3711 0.3551
          Yes 0.6791 0.2591    0.4448 0.6791    0.5375   0.7857 0.3711 0.3551
 Weighted Avg 0.7264 0.3064    0.7805 0.7264    0.7430   0.7857 0.3711 0.3551
```

### Model 9: Undersampling + XGBoost

| Actual / Predicted | No | Yes |
|---|---:|---:|
| No | 1568 | 277 |
| Yes | 170 | 394 |

Yes recall: 0.6986; No recall: 0.8499; Yes precision: 0.5872; Yes F1: 0.6381; AUC: 0.8596; MCC: 0.5181; Kappa: 0.5146.

Original class-wise and weighted metrics:

```text
Class    TPR    FPR Precision Recall F_measure ROC_Area    MCC  Kappa
           No 0.8499 0.3014    0.9022 0.8499    0.8752   0.8596 0.5181 0.5146
          Yes 0.6986 0.1501    0.5872 0.6986    0.6381   0.8596 0.5181 0.5146
 Weighted Avg 0.8144 0.2660    0.8284 0.8144    0.8197   0.8596 0.5181 0.5146
```

### Model 10: Oversampling + Logistic Regression

| Actual / Predicted | No | Yes |
|---|---:|---:|
| No | 1588 | 257 |
| Yes | 179 | 385 |

Yes recall: 0.6826; No recall: 0.8607; Yes precision: 0.5997; Yes F1: 0.6385; AUC: 0.8568; MCC: 0.5204; Kappa: 0.5184.

Original class-wise and weighted metrics:

```text
Class    TPR    FPR Precision Recall F_measure ROC_Area    MCC  Kappa
           No 0.8607 0.3174    0.8987 0.8607    0.8793   0.8568 0.5204 0.5184
          Yes 0.6826 0.1393    0.5997 0.6826    0.6385   0.8568 0.5204 0.5184
 Weighted Avg 0.8190 0.2757    0.8287 0.8190    0.8229   0.8568 0.5204 0.5184
```

### Model 11: Oversampling + Decision Tree

| Actual / Predicted | No | Yes |
|---|---:|---:|
| No | 1518 | 327 |
| Yes | 204 | 360 |

Yes recall: 0.6383; No recall: 0.8228; Yes precision: 0.5240; Yes F1: 0.5755; AUC: 0.7505; MCC: 0.4324; Kappa: 0.4286.

Original class-wise and weighted metrics:

```text
Class    TPR    FPR Precision Recall F_measure ROC_Area    MCC  Kappa
           No 0.8228 0.3617    0.8815 0.8228    0.8511   0.7505 0.4324 0.4286
          Yes 0.6383 0.1772    0.5240 0.6383    0.5755   0.7505 0.4324 0.4286
 Weighted Avg 0.7796 0.3185    0.7978 0.7796    0.7866   0.7505 0.4324 0.4286
```

### Model 12: Oversampling + Random Forest

| Actual / Predicted | No | Yes |
|---|---:|---:|
| No | 1802 | 43 |
| Yes | 310 | 254 |

Yes recall: 0.4504; No recall: 0.9767; Yes precision: 0.8552; Yes F1: 0.5900; AUC: 0.8537; MCC: 0.55; Kappa: 0.511.

Original class-wise and weighted metrics:

```text
Class    TPR    FPR Precision Recall F_measure ROC_Area  MCC Kappa
           No 0.9767 0.5496    0.8532 0.9767    0.9108   0.8537 0.55 0.511
          Yes 0.4504 0.0233    0.8552 0.4504    0.5900   0.8537 0.55 0.511
 Weighted Avg 0.8535 0.4264    0.8537 0.8535    0.8357   0.8537 0.55 0.511
```

### Model 13: Oversampling + Gradient Boosting

| Actual / Predicted | No | Yes |
|---|---:|---:|
| No | 1632 | 213 |
| Yes | 198 | 366 |

Yes recall: 0.6489; No recall: 0.8846; Yes precision: 0.6321; Yes F1: 0.6404; AUC: 0.8495; MCC: 0.5287; Kappa: 0.5286.

Original class-wise and weighted metrics:

```text
Class    TPR    FPR Precision Recall F_measure ROC_Area    MCC  Kappa
           No 0.8846 0.3511    0.8918 0.8846    0.8882   0.8495 0.5287 0.5286
          Yes 0.6489 0.1154    0.6321 0.6489    0.6404   0.8495 0.5287 0.5286
 Weighted Avg 0.8294 0.2959    0.8310 0.8294    0.8302   0.8495 0.5287 0.5286
```

### Model 14: Oversampling + SVM (Radial)

| Actual / Predicted | No | Yes |
|---|---:|---:|
| No | 1693 | 152 |
| Yes | 251 | 313 |

Yes recall: 0.5550; No recall: 0.9176; Yes precision: 0.6731; Yes F1: 0.6084; AUC: 0.8272; MCC: 0.507; Kappa: 0.5032.

Original class-wise and weighted metrics:

```text
Class    TPR    FPR Precision Recall F_measure ROC_Area   MCC  Kappa
           No 0.9176 0.4450    0.8709 0.9176    0.8936   0.8272 0.507 0.5032
          Yes 0.5550 0.0824    0.6731 0.5550    0.6084   0.8272 0.507 0.5032
 Weighted Avg 0.8327 0.3601    0.8246 0.8327    0.8268   0.8272 0.507 0.5032
```

### Model 15: Oversampling + K-Nearest Neighbors

| Actual / Predicted | No | Yes |
|---|---:|---:|
| No | 1403 | 442 |
| Yes | 246 | 318 |

Yes recall: 0.5638; No recall: 0.7604; Yes precision: 0.4184; Yes F1: 0.4804; AUC: 0.6823; MCC: 0.2955; Kappa: 0.2894.

Original class-wise and weighted metrics:

```text
Class    TPR    FPR Precision Recall F_measure ROC_Area    MCC  Kappa
           No 0.7604 0.4362    0.8508 0.7604    0.8031   0.6823 0.2955 0.2894
          Yes 0.5638 0.2396    0.4184 0.5638    0.4804   0.6823 0.2955 0.2894
 Weighted Avg 0.7144 0.3901    0.7496 0.7144    0.7275   0.6823 0.2955 0.2894
```

### Model 16: Oversampling + Naive Bayes

| Actual / Predicted | No | Yes |
|---|---:|---:|
| No | 1793 | 52 |
| Yes | 487 | 77 |

Yes recall: 0.1365; No recall: 0.9718; Yes precision: 0.5969; Yes F1: 0.2222; AUC: 0.7583; MCC: 0.2038; Kappa: 0.148.

Original class-wise and weighted metrics:

```text
Class    TPR    FPR Precision Recall F_measure ROC_Area    MCC Kappa
           No 0.9718 0.8635    0.7864 0.9718    0.8693   0.7583 0.2038 0.148
          Yes 0.1365 0.0282    0.5969 0.1365    0.2222   0.7583 0.2038 0.148
 Weighted Avg 0.7763 0.6679    0.7420 0.7763    0.7178   0.7583 0.2038 0.148
```

### Model 17: Oversampling + Neural Network

| Actual / Predicted | No | Yes |
|---|---:|---:|
| No | 1584 | 261 |
| Yes | 260 | 304 |

Yes recall: 0.5390; No recall: 0.8585; Yes precision: 0.5381; Yes F1: 0.5385; AUC: 0.7673; MCC: 0.3973; Kappa: 0.3973.

Original class-wise and weighted metrics:

```text
Class    TPR    FPR Precision Recall F_measure ROC_Area    MCC  Kappa
           No 0.8585 0.4610    0.8590 0.8585    0.8588   0.7673 0.3973 0.3973
          Yes 0.5390 0.1415    0.5381 0.5390    0.5385   0.7673 0.3973 0.3973
 Weighted Avg 0.7837 0.3862    0.7839 0.7837    0.7838   0.7673 0.3973 0.3973
```

### Model 18: Oversampling + XGBoost

| Actual / Predicted | No | Yes |
|---|---:|---:|
| No | 1772 | 73 |
| Yes | 291 | 273 |

Yes recall: 0.4840; No recall: 0.9604; Yes precision: 0.7890; Yes F1: 0.6000; AUC: 0.8425; MCC: 0.5367; Kappa: 0.5134.

Original class-wise and weighted metrics:

```text
Class    TPR    FPR Precision Recall F_measure ROC_Area    MCC  Kappa
           No 0.9604 0.5160    0.8589 0.9604    0.9069   0.8425 0.5367 0.5134
          Yes 0.4840 0.0396    0.7890 0.4840    0.6000   0.8425 0.5367 0.5134
 Weighted Avg 0.8489 0.4044    0.8426 0.8489    0.8350   0.8425 0.5367 0.5134
```

### Model 19: SMOTE + Logistic Regression

| Actual / Predicted | No | Yes |
|---|---:|---:|
| No | 1613 | 232 |
| Yes | 184 | 380 |

Yes recall: 0.6738; No recall: 0.8743; Yes precision: 0.6209; Yes F1: 0.6463; AUC: 0.8539; MCC: 0.5331; Kappa: 0.5323.

Original class-wise and weighted metrics:

```text
Class    TPR    FPR Precision Recall F_measure ROC_Area    MCC  Kappa
           No 0.8743 0.3262    0.8976 0.8743    0.8858   0.8539 0.5331 0.5323
          Yes 0.6738 0.1257    0.6209 0.6738    0.6463   0.8539 0.5331 0.5323
 Weighted Avg 0.8273 0.2793    0.8328 0.8273    0.8297   0.8539 0.5331 0.5323
```

### Model 20: SMOTE + Decision Tree

| Actual / Predicted | No | Yes |
|---|---:|---:|
| No | 1722 | 123 |
| Yes | 278 | 286 |

Yes recall: 0.5071; No recall: 0.9333; Yes precision: 0.6993; Yes F1: 0.5879; AUC: 0.8082; MCC: 0.4967; Kappa: 0.4869.

Original class-wise and weighted metrics:

```text
Class    TPR    FPR Precision Recall F_measure ROC_Area    MCC  Kappa
           No 0.9333 0.4929    0.8610 0.9333    0.8957   0.8082 0.4967 0.4869
          Yes 0.5071 0.0667    0.6993 0.5071    0.5879   0.8082 0.4967 0.4869
 Weighted Avg 0.8335 0.3931    0.8231 0.8335    0.8236   0.8082 0.4967 0.4869
```

### Model 21: SMOTE + Random Forest

| Actual / Predicted | No | Yes |
|---|---:|---:|
| No | 1805 | 40 |
| Yes | 329 | 235 |

Yes recall: 0.4167; No recall: 0.9783; Yes precision: 0.8545; Yes F1: 0.5602; AUC: 0.8518; MCC: 0.526; Kappa: 0.4805.

Original class-wise and weighted metrics:

```text
Class    TPR    FPR Precision Recall F_measure ROC_Area   MCC  Kappa
           No 0.9783 0.5833    0.8458 0.9783    0.9073   0.8518 0.526 0.4805
          Yes 0.4167 0.0217    0.8545 0.4167    0.5602   0.8518 0.526 0.4805
 Weighted Avg 0.8468 0.4518    0.8479 0.8468    0.8260   0.8518 0.526 0.4805
```

### Model 22: SMOTE + Gradient Boosting

| Actual / Predicted | No | Yes |
|---|---:|---:|
| No | 1778 | 67 |
| Yes | 288 | 276 |

Yes recall: 0.4894; No recall: 0.9637; Yes precision: 0.8047; Yes F1: 0.6086; AUC: 0.8511; MCC: 0.549; Kappa: 0.5244.

Original class-wise and weighted metrics:

```text
Class    TPR    FPR Precision Recall F_measure ROC_Area   MCC  Kappa
           No 0.9637 0.5106    0.8606 0.9637    0.9092   0.8511 0.549 0.5244
          Yes 0.4894 0.0363    0.8047 0.4894    0.6086   0.8511 0.549 0.5244
 Weighted Avg 0.8526 0.3996    0.8475 0.8526    0.8388   0.8511 0.549 0.5244
```

### Model 23: SMOTE + SVM (Radial)

| Actual / Predicted | No | Yes |
|---|---:|---:|
| No | 1694 | 151 |
| Yes | 274 | 290 |

Yes recall: 0.5142; No recall: 0.9182; Yes precision: 0.6576; Yes F1: 0.5771; AUC: 0.8082; MCC: 0.4734; Kappa: 0.4678.

Original class-wise and weighted metrics:

```text
Class    TPR    FPR Precision Recall F_measure ROC_Area    MCC  Kappa
           No 0.9182 0.4858    0.8608 0.9182    0.8885   0.8082 0.4734 0.4678
          Yes 0.5142 0.0818    0.6576 0.5142    0.5771   0.8082 0.4734 0.4678
 Weighted Avg 0.8236 0.3912    0.8132 0.8236    0.8156   0.8082 0.4734 0.4678
```

### Model 24: SMOTE + K-Nearest Neighbors

| Actual / Predicted | No | Yes |
|---|---:|---:|
| No | 1231 | 614 |
| Yes | 192 | 372 |

Yes recall: 0.6596; No recall: 0.6672; Yes precision: 0.3773; Yes F1: 0.4800; AUC: 0.7137; MCC: 0.2814; Kappa: 0.2594.

Original class-wise and weighted metrics:

```text
Class    TPR    FPR Precision Recall F_measure ROC_Area    MCC  Kappa
           No 0.6672 0.3404    0.8651 0.6672    0.7534   0.7137 0.2814 0.2594
          Yes 0.6596 0.3328    0.3773 0.6596    0.4800   0.7137 0.2814 0.2594
 Weighted Avg 0.6654 0.3386    0.7509 0.6654    0.6894   0.7137 0.2814 0.2594
```

### Model 25: SMOTE + Naive Bayes

| Actual / Predicted | No | Yes |
|---|---:|---:|
| No | 1844 | 1 |
| Yes | 559 | 5 |

Yes recall: 0.0089; No recall: 0.9995; Yes precision: 0.8333; Yes F1: 0.0175; AUC: 0.7497; MCC: 0.0707; Kappa: 0.0127.

Original class-wise and weighted metrics:

```text
Class    TPR    FPR Precision Recall F_measure ROC_Area    MCC  Kappa
           No 0.9995 0.9911    0.7674 0.9995    0.8682   0.7497 0.0707 0.0127
          Yes 0.0089 0.0005    0.8333 0.0089    0.0175   0.7497 0.0707 0.0127
 Weighted Avg 0.7675 0.7592    0.7828 0.7675    0.6690   0.7497 0.0707 0.0127
```

### Model 26: SMOTE + Neural Network

| Actual / Predicted | No | Yes |
|---|---:|---:|
| No | 1534 | 311 |
| Yes | 224 | 340 |

Yes recall: 0.6028; No recall: 0.8314; Yes precision: 0.5223; Yes F1: 0.5597; AUC: 0.7901; MCC: 0.4141; Kappa: 0.4122.

Original class-wise and weighted metrics:

```text
Class    TPR    FPR Precision Recall F_measure ROC_Area    MCC  Kappa
           No 0.8314 0.3972    0.8726 0.8314    0.8515   0.7901 0.4141 0.4122
          Yes 0.6028 0.1686    0.5223 0.6028    0.5597   0.7901 0.4141 0.4122
 Weighted Avg 0.7779 0.3436    0.7906 0.7779    0.7832   0.7901 0.4141 0.4122
```

### Model 27: SMOTE + XGBoost

| Actual / Predicted | No | Yes |
|---|---:|---:|
| No | 1808 | 37 |
| Yes | 313 | 251 |

Yes recall: 0.4450; No recall: 0.9799; Yes precision: 0.8715; Yes F1: 0.5892; AUC: 0.857; MCC: 0.5547; Kappa: 0.512.

Original class-wise and weighted metrics:

```text
Class    TPR    FPR Precision Recall F_measure ROC_Area    MCC Kappa
           No 0.9799 0.5550    0.8524 0.9799    0.9117    0.857 0.5547 0.512
          Yes 0.4450 0.0201    0.8715 0.4450    0.5892    0.857 0.5547 0.512
 Weighted Avg 0.8547 0.4297    0.8569 0.8547    0.8362    0.857 0.5547 0.512
```

### Model 28: ROSE + Logistic Regression

| Actual / Predicted | No | Yes |
|---|---:|---:|
| No | 1523 | 322 |
| Yes | 163 | 401 |

Yes recall: 0.7110; No recall: 0.8255; Yes precision: 0.5546; Yes F1: 0.6232; AUC: 0.8494; MCC: 0.4957; Kappa: 0.4886.

Original class-wise and weighted metrics:

```text
Class    TPR    FPR Precision Recall F_measure ROC_Area    MCC  Kappa
           No 0.8255 0.2890    0.9033 0.8255    0.8626   0.8494 0.4957 0.4886
          Yes 0.7110 0.1745    0.5546 0.7110    0.6232   0.8494 0.4957 0.4886
 Weighted Avg 0.7987 0.2622    0.8217 0.7987    0.8066   0.8494 0.4957 0.4886
```

### Model 29: ROSE + Decision Tree

| Actual / Predicted | No | Yes |
|---|---:|---:|
| No | 1845 | 0 |
| Yes | 450 | 114 |

Yes recall: 0.2021; No recall: 1.0000; Yes precision: 1.0000; Yes F1: 0.3363; AUC: 0.6011; MCC: 0.4031; Kappa: 0.2796.

Original class-wise and weighted metrics:

```text
Class    TPR    FPR Precision Recall F_measure ROC_Area    MCC  Kappa
           No 1.0000 0.7979    0.8039 1.0000    0.8913   0.6011 0.4031 0.2796
          Yes 0.2021 0.0000    1.0000 0.2021    0.3363   0.6011 0.4031 0.2796
 Weighted Avg 0.8132 0.6111    0.8498 0.8132    0.7614   0.6011 0.4031 0.2796
```

### Model 30: ROSE + Random Forest

| Actual / Predicted | No | Yes |
|---|---:|---:|
| No | 1845 | 0 |
| Yes | 436 | 128 |

Yes recall: 0.227; No recall: 1.000; Yes precision: 1.0000; Yes F1: 0.3699; AUC: 0.7067; MCC: 0.4285; Kappa: 0.3102.

Original class-wise and weighted metrics:

```text
Class   TPR    FPR Precision Recall F_measure ROC_Area    MCC  Kappa
           No 1.000 0.7730    0.8089  1.000    0.8943   0.7067 0.4285 0.3102
          Yes 0.227 0.0000    1.0000  0.227    0.3699   0.7067 0.4285 0.3102
 Weighted Avg 0.819 0.5921    0.8536  0.819    0.7716   0.7067 0.4285 0.3102
```

### Model 31: ROSE + Gradient Boosting

| Actual / Predicted | No | Yes |
|---|---:|---:|
| No | 1845 | 0 |
| Yes | 486 | 78 |

Yes recall: 0.1383; No recall: 1.0000; Yes precision: 1.0000; Yes F1: 0.2430; AUC: 0.6862; MCC: 0.3309; Kappa: 0.1973.

Original class-wise and weighted metrics:

```text
Class    TPR    FPR Precision Recall F_measure ROC_Area    MCC  Kappa
           No 1.0000 0.8617    0.7915 1.0000    0.8836   0.6862 0.3309 0.1973
          Yes 0.1383 0.0000    1.0000 0.1383    0.2430   0.6862 0.3309 0.1973
 Weighted Avg 0.7983 0.6600    0.8403 0.7983    0.7336   0.6862 0.3309 0.1973
```

### Model 32: ROSE + SVM (Radial)

| Actual / Predicted | No | Yes |
|---|---:|---:|
| No | 1823 | 22 |
| Yes | 389 | 175 |

Yes recall: 0.3103; No recall: 0.9881; Yes precision: 0.8883; Yes F1: 0.4599; AUC: 0.8335; MCC: 0.4611; Kappa: 0.3854.

Original class-wise and weighted metrics:

```text
Class    TPR    FPR Precision Recall F_measure ROC_Area    MCC  Kappa
           No 0.9881 0.6897    0.8241 0.9881    0.8987   0.8335 0.4611 0.3854
          Yes 0.3103 0.0119    0.8883 0.3103    0.4599   0.8335 0.4611 0.3854
 Weighted Avg 0.8294 0.5310    0.8392 0.8294    0.7960   0.8335 0.4611 0.3854
```

### Model 33: ROSE + K-Nearest Neighbors

| Actual / Predicted | No | Yes |
|---|---:|---:|
| No | 1816 | 29 |
| Yes | 465 | 99 |

Yes recall: 0.1755; No recall: 0.9843; Yes precision: 0.7734; Yes F1: 0.2861; AUC: 0.6454; MCC: 0.3017; Kappa: 0.2184.

Original class-wise and weighted metrics:

```text
Class    TPR    FPR Precision Recall F_measure ROC_Area    MCC  Kappa
           No 0.9843 0.8245    0.7961 0.9843    0.8803   0.6454 0.3017 0.2184
          Yes 0.1755 0.0157    0.7734 0.1755    0.2861   0.6454 0.3017 0.2184
 Weighted Avg 0.7949 0.6351    0.7908 0.7949    0.7412   0.6454 0.3017 0.2184
```

### Model 34: ROSE + Naive Bayes

| Actual / Predicted | No | Yes |
|---|---:|---:|
| No | 1833 | 12 |
| Yes | 517 | 47 |

Yes recall: 0.0833; No recall: 0.9935; Yes precision: 0.7966; Yes F1: 0.1509; AUC: 0.7709; MCC: 0.2105; Kappa: 0.1115.

Original class-wise and weighted metrics:

```text
Class    TPR    FPR Precision Recall F_measure ROC_Area    MCC  Kappa
           No 0.9935 0.9167    0.7800 0.9935    0.8739   0.7709 0.2105 0.1115
          Yes 0.0833 0.0065    0.7966 0.0833    0.1509   0.7709 0.2105 0.1115
 Weighted Avg 0.7804 0.7036    0.7839 0.7804    0.7046   0.7709 0.2105 0.1115
```

### Model 35: ROSE + Neural Network

| Actual / Predicted | No | Yes |
|---|---:|---:|
| No | 1831 | 14 |
| Yes | 348 | 216 |

Yes recall: 0.3830; No recall: 0.9924; Yes precision: 0.9391; Yes F1: 0.5441; AUC: 0.7354; MCC: 0.5409; Kappa: 0.4725.

Original class-wise and weighted metrics:

```text
Class    TPR    FPR Precision Recall F_measure ROC_Area    MCC  Kappa
           No 0.9924 0.6170    0.8403 0.9924    0.9100   0.7354 0.5409 0.4725
          Yes 0.3830 0.0076    0.9391 0.3830    0.5441   0.7354 0.5409 0.4725
 Weighted Avg 0.8497 0.4743    0.8634 0.8497    0.8244   0.7354 0.5409 0.4725
```

### Model 36: ROSE + XGBoost

| Actual / Predicted | No | Yes |
|---|---:|---:|
| No | 1845 | 0 |
| Yes | 440 | 124 |

Yes recall: 0.2199; No recall: 1.0000; Yes precision: 1.0000; Yes F1: 0.3605; AUC: 0.6869; MCC: 0.4213; Kappa: 0.3015.

Original class-wise and weighted metrics:

```text
Class    TPR    FPR Precision Recall F_measure ROC_Area    MCC  Kappa
           No 1.0000 0.7801    0.8074 1.0000    0.8935   0.6869 0.4213 0.3015
          Yes 0.2199 0.0000    1.0000 0.2199    0.3605   0.6869 0.4213 0.3015
 Weighted Avg 0.8174 0.5975    0.8525 0.8174    0.7687   0.6869 0.4213 0.3015
```

