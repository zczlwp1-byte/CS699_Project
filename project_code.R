# ================================================================
# CS699 Data Mining Project
# Classification of Disability in Households
# Dataset: 2023 American Housing Survey (AHS)
# ================================================================
# This script performs:
#   1. Data loading and preprocessing (imputation, outlier handling, scaling)
#   2. Train/test split (70/30 stratified)
#   3. Data balancing (4 methods: Undersampling, Oversampling, SMOTE, ROSE)
#   4. Feature selection (correlation-based removal)
#   5. 36 classification models (4 balancing x 9 algorithms), each tuned separately
#   6. Model comparison and best model selection
# ================================================================

# ================================================================
# SECTION 0: INSTALL AND LOAD REQUIRED PACKAGES
# ================================================================
# Install packages if not already installed (assumes fresh R 4.5.2)
if (!require("caret"))         install.packages("caret", dependencies = TRUE)
if (!require("e1071"))         install.packages("e1071")
if (!require("randomForest"))  install.packages("randomForest")
if (!require("rpart"))         install.packages("rpart")
if (!require("gbm"))           install.packages("gbm")
if (!require("xgboost"))       install.packages("xgboost")
if (!require("nnet"))          install.packages("nnet")
if (!require("kernlab"))       install.packages("kernlab")
if (!require("naivebayes"))    install.packages("naivebayes")
if (!require("ROSE"))          install.packages("ROSE")
if (!require("smotefamily"))   install.packages("smotefamily")
if (!require("pROC"))          install.packages("pROC")

# Load all required packages
library(caret)          # Model training, tuning, and evaluation
library(e1071)          # SVM support functions
library(randomForest)   # Random Forest classifier
library(rpart)          # Decision Tree (CART)
library(gbm)            # Gradient Boosting Machine
library(xgboost)        # Extreme Gradient Boosting
library(nnet)           # Neural Network (single hidden layer)
library(kernlab)        # SVM with radial kernel
library(naivebayes)     # Naive Bayes classifier
library(ROSE)           # ROSE balancing method
library(smotefamily)    # SMOTE balancing method
library(pROC)           # ROC curve and AUC computation

# ================================================================
# SECTION 1: DATA LOADING & PREPROCESSING
# ================================================================

# --- 1.1 Load the dataset ---
cat("=== STAGE 1: DATA LOADING & PREPROCESSING ===\n\n")
data <- read.csv("project_data.csv", stringsAsFactors = FALSE)
cat(sprintf("Original dataset: %d rows, %d columns\n", nrow(data), ncol(data)))

# --- 1.2 Remove rows where Class is NA or empty ---
# These rows cannot be used for classification
data <- data[!is.na(data$Class) & data$Class != "", ]
cat(sprintf("After removing Class NAs: %d rows\n", nrow(data)))

# --- 1.3 Drop CONTROL column (record identifier, not predictive) ---
data$CONTROL <- NULL
cat(sprintf("After dropping CONTROL: %d columns remaining\n", ncol(data)))

# --- 1.4 Exploratory Data Analysis (EDA) summary ---
cat("\n--- EDA Summary ---\n")

# Class distribution
class_table <- table(data$Class)
cat("Target variable (Class) distribution:\n")
print(class_table)
cat(sprintf("Class proportions: No = %.2f%%, Yes = %.2f%%\n\n",
            100 * class_table["No"] / sum(class_table),
            100 * class_table["Yes"] / sum(class_table)))

# Separate Class from features before numeric conversion
class_col <- factor(data$Class, levels = c("No", "Yes"))
features <- data[, -which(names(data) == "Class")]

# --- 1.5 Convert all features to numeric ---
# All features in this dataset are integer-coded; NAs represent missing values
cat("Converting all features to numeric...\n")
features <- as.data.frame(lapply(features, function(x) {
  suppressWarnings(as.numeric(as.character(x)))
}))

# Remove any columns that became entirely NA after conversion
all_na_cols <- sapply(features, function(x) all(is.na(x)))
if (sum(all_na_cols) > 0) {
  cat(sprintf("Removing %d columns that are entirely NA\n", sum(all_na_cols)))
  features <- features[, !all_na_cols]
}

# Missing data summary
missing_pct <- colMeans(is.na(features)) * 100
cat(sprintf("Columns with missing values: %d out of %d\n",
            sum(missing_pct > 0), ncol(features)))
cat(sprintf("Max missing rate: %.2f%% (%s)\n",
            max(missing_pct), names(which.max(missing_pct))))

# --- 1.6 Impute missing values with column medians ---
cat("Imputing missing values with column medians...\n")
for (col in names(features)) {
  if (any(is.na(features[[col]]))) {
    med_val <- median(features[[col]], na.rm = TRUE)
    features[[col]][is.na(features[[col]])] <- med_val
  }
}
cat(sprintf("Remaining NAs after imputation: %d\n", sum(is.na(features))))

# --- 1.7 Remove zero-variance and near-constant features ---
# Use lenient threshold (freqCut=99/1) to keep rare-but-predictive features
# like disability indicators (HHSEE, HHMEMRY, HHCARE, HHERRND) that have
# low variance but are strong predictors of the target class.
# Also remove truly zero-variance features (all identical values).
zero_var_cols <- sapply(features, function(x) length(unique(x)) <= 1)
if (sum(zero_var_cols) > 0) {
  cat(sprintf("Removing %d zero-variance features: %s\n",
              sum(zero_var_cols), paste(names(features)[zero_var_cols], collapse = ", ")))
  features <- features[, !zero_var_cols]
}
# Lenient NZV: only remove if 99%+ are the same value
nzv_indices <- nearZeroVar(features, saveMetrics = FALSE, freqCut = 99/1)
if (length(nzv_indices) > 0) {
  nzv_names <- names(features)[nzv_indices]
  cat(sprintf("Removing %d near-constant features (>99%% same value): %s\n",
              length(nzv_indices), paste(nzv_names, collapse = ", ")))
  features <- features[, -nzv_indices]
}
cat(sprintf("Features remaining after variance filtering: %d\n", ncol(features)))

# --- 1.8 Outlier handling: Winsorization (IQR-based capping) ---
# Only apply to continuous features (>10 unique values) to avoid
# collapsing binary/low-cardinality categorical features to zero variance
cat("Winsorizing outliers (IQR method, continuous features only)...\n")
continuous_cols <- names(features)[sapply(features, function(x) length(unique(x)) > 10)]
cat(sprintf("  Continuous features to winsorize: %d out of %d\n",
            length(continuous_cols), ncol(features)))
for (col in continuous_cols) {
  q1 <- quantile(features[[col]], 0.25, na.rm = TRUE)
  q3 <- quantile(features[[col]], 0.75, na.rm = TRUE)
  iqr_val <- q3 - q1
  lower_bound <- q1 - 1.5 * iqr_val
  upper_bound <- q3 + 1.5 * iqr_val
  features[[col]] <- pmin(pmax(features[[col]], lower_bound), upper_bound)
}

# --- 1.8b Remove any features that became zero-variance after winsorization ---
zero_var2 <- sapply(features, function(x) length(unique(x)) <= 1)
if (sum(zero_var2) > 0) {
  cat(sprintf("Removing %d features that became constant after winsorization\n",
              sum(zero_var2)))
  features <- features[, !zero_var2]
}
cat(sprintf("Features remaining: %d\n", ncol(features)))

# --- 1.9 Center and scale all numeric features ---
# Standardize to mean=0, sd=1 (required for KNN, SVM, Neural Network)
cat("Centering and scaling features...\n")
preproc_params <- preProcess(features, method = c("center", "scale"))
features <- predict(preproc_params, features)

# Verify no zero-variance columns remain after scaling
zero_var <- sapply(features, function(x) var(x) == 0 | is.na(var(x)))
if (any(zero_var)) {
  cat(sprintf("Removing %d zero-variance columns after scaling\n", sum(zero_var)))
  features <- features[, !zero_var]
}
cat(sprintf("Final feature count: %d\n", ncol(features)))

# --- 1.10 Reassemble and save preprocessed dataset ---
preprocessed_data <- cbind(features, Class = class_col)
write.csv(preprocessed_data, "preprocessed_data.csv", row.names = FALSE)
cat(sprintf("\nSaved: preprocessed_data.csv (%d rows, %d columns)\n",
            nrow(preprocessed_data), ncol(preprocessed_data)))

# ================================================================
# SECTION 2: TRAIN/TEST SPLIT (70/30 Stratified)
# ================================================================
cat("\n=== STAGE 2: TRAIN/TEST SPLIT ===\n\n")

# Stratified split preserving class proportions
set.seed(699)
train_index <- createDataPartition(preprocessed_data$Class, p = 0.7, list = FALSE)
train_data <- preprocessed_data[train_index, ]
test_data  <- preprocessed_data[-train_index, ]

cat(sprintf("Training set: %d rows (No=%d, Yes=%d)\n",
            nrow(train_data),
            sum(train_data$Class == "No"),
            sum(train_data$Class == "Yes")))
cat(sprintf("Test set:     %d rows (No=%d, Yes=%d)\n",
            nrow(test_data),
            sum(test_data$Class == "No"),
            sum(test_data$Class == "Yes")))

# Save train and test datasets
write.csv(train_data, "initial_train.csv", row.names = FALSE)
write.csv(test_data, "initial_test.csv", row.names = FALSE)
cat("Saved: initial_train.csv, initial_test.csv\n")

# ================================================================
# SECTION 3: HELPER FUNCTION — Model Evaluation
# ================================================================
# This function computes and prints confusion matrix + all performance
# metrics for each model. Returns a list for the summary table.

evaluate_model <- function(predictions, actual, prob_yes, model_name) {
  # Compute confusion matrix with positive class = "Yes"
  cm <- confusionMatrix(predictions, actual, positive = "Yes")

  # Extract confusion matrix values
  # Layout: rows = Prediction, columns = Reference
  TN <- cm$table["No", "No"]     # Predicted No, Actual No
  FN <- cm$table["No", "Yes"]    # Predicted No, Actual Yes (missed)
  FP <- cm$table["Yes", "No"]    # Predicted Yes, Actual No (false alarm)
  TP <- cm$table["Yes", "Yes"]   # Predicted Yes, Actual Yes (correct)

  # --- Class "Yes" metrics ---
  yes_tpr   <- ifelse((TP + FN) > 0, TP / (TP + FN), 0)       # Sensitivity / Recall
  yes_fpr   <- ifelse((FP + TN) > 0, FP / (FP + TN), 0)       # False Positive Rate
  yes_prec  <- ifelse((TP + FP) > 0, TP / (TP + FP), 0)       # Precision (PPV)
  yes_recall <- yes_tpr
  yes_f1    <- ifelse((yes_prec + yes_recall) > 0,
                       2 * yes_prec * yes_recall / (yes_prec + yes_recall), 0)

  # --- Class "No" metrics ---
  no_tpr    <- ifelse((TN + FP) > 0, TN / (TN + FP), 0)       # Specificity
  no_fpr    <- ifelse((FN + TP) > 0, FN / (FN + TP), 0)       # FPR for No class
  no_prec   <- ifelse((TN + FN) > 0, TN / (TN + FN), 0)       # NPV
  no_recall <- no_tpr
  no_f1     <- ifelse((no_prec + no_recall) > 0,
                       2 * no_prec * no_recall / (no_prec + no_recall), 0)

  # --- Weighted Average (weighted by class support) ---
  n_yes <- TP + FN   # Actual Yes count in test set
  n_no  <- TN + FP   # Actual No count in test set
  total <- n_yes + n_no
  w_yes <- n_yes / total
  w_no  <- n_no / total

  w_tpr   <- w_yes * yes_tpr   + w_no * no_tpr
  w_fpr   <- w_yes * yes_fpr   + w_no * no_fpr
  w_prec  <- w_yes * yes_prec  + w_no * no_prec
  w_recall <- w_yes * yes_recall + w_no * no_recall
  w_f1    <- w_yes * yes_f1    + w_no * no_f1

  # --- ROC Area (AUC) ---
  auc_val <- tryCatch({
    roc_obj <- roc(actual, prob_yes, levels = c("No", "Yes"),
                   direction = "<", quiet = TRUE)
    as.numeric(auc(roc_obj))
  }, error = function(e) NA)

  # --- Matthews Correlation Coefficient (MCC) ---
  denom_mcc <- sqrt(as.numeric(TP + FP) * as.numeric(TP + FN) *
                    as.numeric(TN + FP) * as.numeric(TN + FN))
  mcc <- ifelse(denom_mcc > 0, (TP * TN - FP * FN) / denom_mcc, 0)

  # --- Kappa ---
  kappa_val <- as.numeric(cm$overall["Kappa"])

  # Print model header
  cat(sprintf("\n%s\n%s\n", model_name,
              paste(rep("=", nchar(model_name)), collapse = "")))

  # Print confusion matrix
  cat("\nConfusion Matrix:\n")
  print(cm$table)

  # Build and print performance metrics table
  metrics_df <- data.frame(
    Class     = c("No", "Yes", "Weighted Avg"),
    TPR       = round(c(no_tpr, yes_tpr, w_tpr), 4),
    FPR       = round(c(no_fpr, yes_fpr, w_fpr), 4),
    Precision = round(c(no_prec, yes_prec, w_prec), 4),
    Recall    = round(c(no_recall, yes_recall, w_recall), 4),
    F_measure = round(c(no_f1, yes_f1, w_f1), 4),
    ROC_Area  = round(c(auc_val, auc_val, auc_val), 4),
    MCC       = round(c(mcc, mcc, mcc), 4),
    Kappa     = round(c(kappa_val, kappa_val, kappa_val), 4)
  )
  cat("\nPerformance Metrics:\n")
  print(metrics_df, row.names = FALSE)
  cat(sprintf("\n=> Yes TPR: %.4f | No TPR: %.4f | AUC: %.4f\n",
              yes_tpr, no_tpr, auc_val))

  # Open results in separate RStudio viewer windows (only in interactive mode)
  if (interactive()) {
    # Build a combined results table for the viewer window
    cm_df <- as.data.frame.matrix(cm$table)
    View(cm_df, title = paste0(model_name, " - Confusion Matrix"))
    View(metrics_df, title = paste0(model_name, " - Performance Metrics"))
  }

  # Return metrics for summary table
  return(list(
    model = model_name,
    yes_tpr = yes_tpr, no_tpr = no_tpr,
    yes_fpr = yes_fpr, no_fpr = no_fpr,
    yes_prec = yes_prec, no_prec = no_prec,
    yes_f1 = yes_f1, no_f1 = no_f1,
    w_tpr = w_tpr, w_f1 = w_f1,
    auc = auc_val, mcc = mcc, kappa = kappa_val
  ))
}

# --- XGBoost Helper Function (manual CV, bypasses caret incompatibility) ---
# xgboost 3.x is incompatible with caret's xgbTree method, so we implement
# manual 5-fold cross-validation with parameter tuning for XGBoost.
train_xgboost_cv <- function(train_data, test_data, seed = 699) {
  set.seed(seed)

  # Prepare numeric matrices (xgboost requires matrix input)
  feat_cols <- names(train_data)[names(train_data) != "Class"]
  train_mat    <- as.matrix(train_data[, feat_cols])
  train_labels <- ifelse(train_data$Class == "Yes", 1, 0)
  test_mat     <- as.matrix(test_data[, feat_cols])

  # Define expanded parameter search grid for better tuning
  param_grid <- expand.grid(
    max_depth = c(3, 4, 6, 8),
    eta       = c(0.01, 0.05, 0.1, 0.3),
    nrounds   = c(100, 200, 300),
    stringsAsFactors = FALSE
  )

  # 5-fold CV to select best parameters
  folds <- createFolds(train_data$Class, k = 5, returnTrain = FALSE)
  best_auc <- 0
  best_row <- 1

  for (i in 1:nrow(param_grid)) {
    fold_aucs <- sapply(folds, function(val_idx) {
      dtrain <- xgb.DMatrix(train_mat[-val_idx, ], label = train_labels[-val_idx])
      dval   <- xgb.DMatrix(train_mat[val_idx, ],  label = train_labels[val_idx])
      params <- list(objective = "binary:logistic",
                     max_depth = param_grid$max_depth[i],
                     eta = param_grid$eta[i],
                     colsample_bytree = 0.8, subsample = 0.8, min_child_weight = 1)
      mdl <- xgb.train(params, dtrain, nrounds = param_grid$nrounds[i], verbose = 0)
      preds <- predict(mdl, dval)
      as.numeric(auc(roc(train_labels[val_idx], preds, quiet = TRUE)))
    })
    if (mean(fold_aucs) > best_auc) {
      best_auc <- mean(fold_aucs)
      best_row <- i
    }
  }

  # Train final model on full training data with best parameters
  best <- param_grid[best_row, ]
  dtrain_final <- xgb.DMatrix(train_mat, label = train_labels)
  params_final <- list(objective = "binary:logistic",
                       max_depth = best$max_depth, eta = best$eta,
                       colsample_bytree = 0.8, subsample = 0.8, min_child_weight = 1)
  final_model <- xgb.train(params_final, dtrain_final,
                            nrounds = best$nrounds, verbose = 0)

  # Predict on test set (threshold = 0.5)
  prob_yes   <- predict(final_model, test_mat)
  pred_class <- factor(ifelse(prob_yes > 0.5, "Yes", "No"), levels = c("No", "Yes"))

  cat(sprintf("  Best params: max_depth=%d, eta=%.1f, nrounds=%d (CV AUC=%.4f)\n",
              best$max_depth, best$eta, best$nrounds, best_auc))

  return(list(predictions = pred_class, prob_yes = prob_yes))
}

# Initialize list to store results from all 36 models
results_list <- list()

# ================================================================
# SECTION 4: DATA BALANCING (4 methods applied to training set)
# ================================================================
cat("\n=== STAGE 3: DATA BALANCING ===\n\n")

# Separate features and target from training data
train_features <- train_data[, -which(names(train_data) == "Class")]
train_class    <- train_data$Class

# --- 4.1 Method 1: Random Undersampling ---
# Randomly removes majority (No) samples to match minority (Yes) count
set.seed(699)
train_under <- downSample(x = train_features, y = train_class, yname = "Class")
cat(sprintf("1. Undersampled: %d rows (No=%d, Yes=%d)\n",
            nrow(train_under), sum(train_under$Class == "No"),
            sum(train_under$Class == "Yes")))

# --- 4.2 Method 2: Random Oversampling ---
# Randomly duplicates minority (Yes) samples to match majority (No) count
set.seed(699)
train_over <- upSample(x = train_features, y = train_class, yname = "Class")
cat(sprintf("2. Oversampled:  %d rows (No=%d, Yes=%d)\n",
            nrow(train_over), sum(train_over$Class == "No"),
            sum(train_over$Class == "Yes")))

# --- 4.3 Method 3: SMOTE (Synthetic Minority Over-sampling Technique) ---
# Creates synthetic minority samples via K-nearest neighbor interpolation
set.seed(699)
smote_result <- SMOTE(X = train_features, target = as.character(train_class),
                      K = 5, dup_size = 0)
train_smote <- smote_result$data
names(train_smote)[names(train_smote) == "class"] <- "Class"  # Rename output column
train_smote$Class <- factor(train_smote$Class, levels = c("No", "Yes"))
cat(sprintf("3. SMOTE:        %d rows (No=%d, Yes=%d)\n",
            nrow(train_smote), sum(train_smote$Class == "No"),
            sum(train_smote$Class == "Yes")))

# --- 4.4 Method 4: ROSE (Random Over-Sampling Examples) ---
# Generates synthetic samples using kernel density estimation
set.seed(699)
rose_result <- ROSE(Class ~ ., data = train_data, seed = 699)
train_rose <- rose_result$data
train_rose$Class <- factor(train_rose$Class, levels = c("No", "Yes"))
cat(sprintf("4. ROSE:         %d rows (No=%d, Yes=%d)\n",
            nrow(train_rose), sum(train_rose$Class == "No"),
            sum(train_rose$Class == "Yes")))

# ================================================================
# SECTION 5: FEATURE SELECTION (Correlation-based removal)
# ================================================================
# Remove highly correlated features (|r| > 0.85) from each balanced dataset
# This reduces multicollinearity and can improve model performance
cat("\n=== STAGE 4: FEATURE SELECTION ===\n\n")

remove_correlated <- function(train_bal, test_set, cutoff = 0.85, name = "") {
  # Compute correlation matrix on feature columns only
  feat_cols <- names(train_bal)[names(train_bal) != "Class"]
  cor_matrix <- cor(train_bal[, feat_cols], use = "complete.obs")
  high_cor <- findCorrelation(cor_matrix, cutoff = cutoff)

  if (length(high_cor) > 0) {
    cols_remove <- feat_cols[high_cor]
    cat(sprintf("  %s: Removing %d correlated features\n", name, length(cols_remove)))
    train_bal <- train_bal[, !(names(train_bal) %in% cols_remove)]
    # Subset test set to match training columns
    test_set <- test_set[, names(train_bal)]
  } else {
    cat(sprintf("  %s: No features removed\n", name))
  }
  return(list(train = train_bal, test = test_set))
}

# Apply feature selection to each balanced dataset
fs_under <- remove_correlated(train_under, test_data, 0.85, "Undersampling")
train_under_fs <- fs_under$train;  test_under_fs <- fs_under$test

fs_over <- remove_correlated(train_over, test_data, 0.85, "Oversampling")
train_over_fs <- fs_over$train;  test_over_fs <- fs_over$test

fs_smote <- remove_correlated(train_smote, test_data, 0.85, "SMOTE")
train_smote_fs <- fs_smote$train;  test_smote_fs <- fs_smote$test

fs_rose <- remove_correlated(train_rose, test_data, 0.85, "ROSE")
train_rose_fs <- fs_rose$train;  test_rose_fs <- fs_rose$test

cat(sprintf("\nFeatures after selection: Under=%d, Over=%d, SMOTE=%d, ROSE=%d\n",
            ncol(train_under_fs) - 1, ncol(train_over_fs) - 1,
            ncol(train_smote_fs) - 1, ncol(train_rose_fs) - 1))

# ================================================================
# SECTION 6: COMMON TRAINING CONFIGURATION
# ================================================================
# 5-fold cross-validation with class probability estimation
ctrl <- trainControl(method = "cv", number = 5, classProbs = TRUE)

# --- Tuning Grids for each algorithm ---
# Decision Tree: complexity parameter
rpart_grid <- expand.grid(cp = c(0.001, 0.005, 0.01, 0.02, 0.05))

# GBM: number of trees, depth, learning rate
gbm_grid <- expand.grid(
  n.trees = c(100, 200, 300),
  interaction.depth = c(3, 5),
  shrinkage = c(0.01, 0.1),
  n.minobsinnode = 10
)

# KNN: number of neighbors
knn_grid <- expand.grid(k = c(3, 5, 7, 9, 11, 15))

# Naive Bayes: Laplace smoothing and kernel estimation
nb_grid <- expand.grid(laplace = c(0, 1), usekernel = c(TRUE, FALSE), adjust = 1)

# Neural Network: hidden layer size and weight decay
nnet_grid <- expand.grid(size = c(5, 10, 15), decay = c(0.001, 0.01, 0.1))

# XGBoost: tuning handled by train_xgboost_cv() helper function
# (caret's xgbTree method is incompatible with xgboost 3.x)

# ================================================================
# SECTION 7: BUILD AND TEST 36 MODELS (one at a time)
# ================================================================
# 4 balancing methods x 9 classification algorithms = 36 models
# Each model is a separate code block (no nested loops)
cat("\n=== STAGE 5: BUILD AND TEST 36 MODELS ===\n")

# ============================================================
# Model 1: Undersampling + Logistic Regression
# ============================================================
set.seed(699)
model_1 <- train(Class ~ ., data = train_under_fs, method = "glm",
                 family = "binomial", trControl = ctrl)
pred_1  <- predict(model_1, newdata = test_under_fs)
prob_1  <- predict(model_1, newdata = test_under_fs, type = "prob")
results_list[["M01_Under_GLM"]] <- evaluate_model(
  pred_1, test_under_fs$Class, prob_1[, "Yes"],
  "Model 1: Undersampling + Logistic Regression")

# ============================================================
# Model 2: Undersampling + Decision Tree
# ============================================================
set.seed(699)
model_2 <- train(Class ~ ., data = train_under_fs, method = "rpart",
                 trControl = ctrl, tuneGrid = rpart_grid)
pred_2  <- predict(model_2, newdata = test_under_fs)
prob_2  <- predict(model_2, newdata = test_under_fs, type = "prob")
results_list[["M02_Under_DT"]] <- evaluate_model(
  pred_2, test_under_fs$Class, prob_2[, "Yes"],
  "Model 2: Undersampling + Decision Tree")

# ============================================================
# Model 3: Undersampling + Random Forest
# ============================================================
set.seed(699)
model_3 <- train(Class ~ ., data = train_under_fs, method = "rf",
                 trControl = ctrl, tuneLength = 5, importance = FALSE)
pred_3  <- predict(model_3, newdata = test_under_fs)
prob_3  <- predict(model_3, newdata = test_under_fs, type = "prob")
results_list[["M03_Under_RF"]] <- evaluate_model(
  pred_3, test_under_fs$Class, prob_3[, "Yes"],
  "Model 3: Undersampling + Random Forest")

# ============================================================
# Model 4: Undersampling + Gradient Boosting (GBM)
# ============================================================
set.seed(699)
model_4 <- train(Class ~ ., data = train_under_fs, method = "gbm",
                 trControl = ctrl, tuneGrid = gbm_grid, verbose = FALSE)
pred_4  <- predict(model_4, newdata = test_under_fs)
prob_4  <- predict(model_4, newdata = test_under_fs, type = "prob")
results_list[["M04_Under_GBM"]] <- evaluate_model(
  pred_4, test_under_fs$Class, prob_4[, "Yes"],
  "Model 4: Undersampling + Gradient Boosting")

# ============================================================
# Model 5: Undersampling + SVM (Radial Kernel)
# ============================================================
set.seed(699)
model_5 <- train(Class ~ ., data = train_under_fs, method = "svmRadial",
                 trControl = ctrl, tuneLength = 5)
pred_5  <- predict(model_5, newdata = test_under_fs)
prob_5  <- predict(model_5, newdata = test_under_fs, type = "prob")
results_list[["M05_Under_SVM"]] <- evaluate_model(
  pred_5, test_under_fs$Class, prob_5[, "Yes"],
  "Model 5: Undersampling + SVM (Radial)")

# ============================================================
# Model 6: Undersampling + K-Nearest Neighbors
# ============================================================
set.seed(699)
model_6 <- train(Class ~ ., data = train_under_fs, method = "knn",
                 trControl = ctrl, tuneGrid = knn_grid)
pred_6  <- predict(model_6, newdata = test_under_fs)
prob_6  <- predict(model_6, newdata = test_under_fs, type = "prob")
results_list[["M06_Under_KNN"]] <- evaluate_model(
  pred_6, test_under_fs$Class, prob_6[, "Yes"],
  "Model 6: Undersampling + K-Nearest Neighbors")

# ============================================================
# Model 7: Undersampling + Naive Bayes
# ============================================================
set.seed(699)
model_7 <- train(Class ~ ., data = train_under_fs, method = "naive_bayes",
                 trControl = ctrl, tuneGrid = nb_grid)
pred_7  <- predict(model_7, newdata = test_under_fs)
prob_7  <- predict(model_7, newdata = test_under_fs, type = "prob")
results_list[["M07_Under_NB"]] <- evaluate_model(
  pred_7, test_under_fs$Class, prob_7[, "Yes"],
  "Model 7: Undersampling + Naive Bayes")

# ============================================================
# Model 8: Undersampling + Neural Network
# ============================================================
set.seed(699)
model_8 <- train(Class ~ ., data = train_under_fs, method = "nnet",
                 trControl = ctrl, tuneGrid = nnet_grid,
                 MaxNWts = 10000, trace = FALSE)
pred_8  <- predict(model_8, newdata = test_under_fs)
prob_8  <- predict(model_8, newdata = test_under_fs, type = "prob")
results_list[["M08_Under_NN"]] <- evaluate_model(
  pred_8, test_under_fs$Class, prob_8[, "Yes"],
  "Model 8: Undersampling + Neural Network")

# ============================================================
# Model 9: Undersampling + XGBoost
# ============================================================
# Using direct xgboost with manual CV (caret xgbTree incompatible with xgboost 3.x)
set.seed(699)
xgb_9 <- train_xgboost_cv(train_under_fs, test_under_fs, seed = 699)
results_list[["M09_Under_XGB"]] <- evaluate_model(
  xgb_9$predictions, test_under_fs$Class, xgb_9$prob_yes,
  "Model 9: Undersampling + XGBoost")

# ============================================================
# Model 10: Oversampling + Logistic Regression
# ============================================================
set.seed(699)
model_10 <- train(Class ~ ., data = train_over_fs, method = "glm",
                  family = "binomial", trControl = ctrl)
pred_10  <- predict(model_10, newdata = test_over_fs)
prob_10  <- predict(model_10, newdata = test_over_fs, type = "prob")
results_list[["M10_Over_GLM"]] <- evaluate_model(
  pred_10, test_over_fs$Class, prob_10[, "Yes"],
  "Model 10: Oversampling + Logistic Regression")

# ============================================================
# Model 11: Oversampling + Decision Tree
# ============================================================
set.seed(699)
model_11 <- train(Class ~ ., data = train_over_fs, method = "rpart",
                  trControl = ctrl, tuneGrid = rpart_grid)
pred_11  <- predict(model_11, newdata = test_over_fs)
prob_11  <- predict(model_11, newdata = test_over_fs, type = "prob")
results_list[["M11_Over_DT"]] <- evaluate_model(
  pred_11, test_over_fs$Class, prob_11[, "Yes"],
  "Model 11: Oversampling + Decision Tree")

# ============================================================
# Model 12: Oversampling + Random Forest
# ============================================================
set.seed(699)
model_12 <- train(Class ~ ., data = train_over_fs, method = "rf",
                  trControl = ctrl, tuneLength = 5, importance = FALSE)
pred_12  <- predict(model_12, newdata = test_over_fs)
prob_12  <- predict(model_12, newdata = test_over_fs, type = "prob")
results_list[["M12_Over_RF"]] <- evaluate_model(
  pred_12, test_over_fs$Class, prob_12[, "Yes"],
  "Model 12: Oversampling + Random Forest")

# ============================================================
# Model 13: Oversampling + Gradient Boosting (GBM)
# ============================================================
set.seed(699)
model_13 <- train(Class ~ ., data = train_over_fs, method = "gbm",
                  trControl = ctrl, tuneGrid = gbm_grid, verbose = FALSE)
pred_13  <- predict(model_13, newdata = test_over_fs)
prob_13  <- predict(model_13, newdata = test_over_fs, type = "prob")
results_list[["M13_Over_GBM"]] <- evaluate_model(
  pred_13, test_over_fs$Class, prob_13[, "Yes"],
  "Model 13: Oversampling + Gradient Boosting")

# ============================================================
# Model 14: Oversampling + SVM (Radial Kernel)
# ============================================================
set.seed(699)
model_14 <- train(Class ~ ., data = train_over_fs, method = "svmRadial",
                  trControl = ctrl, tuneLength = 5)
pred_14  <- predict(model_14, newdata = test_over_fs)
prob_14  <- predict(model_14, newdata = test_over_fs, type = "prob")
results_list[["M14_Over_SVM"]] <- evaluate_model(
  pred_14, test_over_fs$Class, prob_14[, "Yes"],
  "Model 14: Oversampling + SVM (Radial)")

# ============================================================
# Model 15: Oversampling + K-Nearest Neighbors
# ============================================================
set.seed(699)
model_15 <- train(Class ~ ., data = train_over_fs, method = "knn",
                  trControl = ctrl, tuneGrid = knn_grid)
pred_15  <- predict(model_15, newdata = test_over_fs)
prob_15  <- predict(model_15, newdata = test_over_fs, type = "prob")
results_list[["M15_Over_KNN"]] <- evaluate_model(
  pred_15, test_over_fs$Class, prob_15[, "Yes"],
  "Model 15: Oversampling + K-Nearest Neighbors")

# ============================================================
# Model 16: Oversampling + Naive Bayes
# ============================================================
set.seed(699)
model_16 <- train(Class ~ ., data = train_over_fs, method = "naive_bayes",
                  trControl = ctrl, tuneGrid = nb_grid)
pred_16  <- predict(model_16, newdata = test_over_fs)
prob_16  <- predict(model_16, newdata = test_over_fs, type = "prob")
results_list[["M16_Over_NB"]] <- evaluate_model(
  pred_16, test_over_fs$Class, prob_16[, "Yes"],
  "Model 16: Oversampling + Naive Bayes")

# ============================================================
# Model 17: Oversampling + Neural Network
# ============================================================
set.seed(699)
model_17 <- train(Class ~ ., data = train_over_fs, method = "nnet",
                  trControl = ctrl, tuneGrid = nnet_grid,
                  MaxNWts = 10000, trace = FALSE)
pred_17  <- predict(model_17, newdata = test_over_fs)
prob_17  <- predict(model_17, newdata = test_over_fs, type = "prob")
results_list[["M17_Over_NN"]] <- evaluate_model(
  pred_17, test_over_fs$Class, prob_17[, "Yes"],
  "Model 17: Oversampling + Neural Network")

# ============================================================
# Model 18: Oversampling + XGBoost
# ============================================================
# Using direct xgboost with manual CV (caret xgbTree incompatible with xgboost 3.x)
set.seed(699)
xgb_18 <- train_xgboost_cv(train_over_fs, test_over_fs, seed = 699)
results_list[["M18_Over_XGB"]] <- evaluate_model(
  xgb_18$predictions, test_over_fs$Class, xgb_18$prob_yes,
  "Model 18: Oversampling + XGBoost")

# ============================================================
# Model 19: SMOTE + Logistic Regression
# ============================================================
set.seed(699)
model_19 <- train(Class ~ ., data = train_smote_fs, method = "glm",
                  family = "binomial", trControl = ctrl)
pred_19  <- predict(model_19, newdata = test_smote_fs)
prob_19  <- predict(model_19, newdata = test_smote_fs, type = "prob")
results_list[["M19_SMOTE_GLM"]] <- evaluate_model(
  pred_19, test_smote_fs$Class, prob_19[, "Yes"],
  "Model 19: SMOTE + Logistic Regression")

# ============================================================
# Model 20: SMOTE + Decision Tree
# ============================================================
set.seed(699)
model_20 <- train(Class ~ ., data = train_smote_fs, method = "rpart",
                  trControl = ctrl, tuneGrid = rpart_grid)
pred_20  <- predict(model_20, newdata = test_smote_fs)
prob_20  <- predict(model_20, newdata = test_smote_fs, type = "prob")
results_list[["M20_SMOTE_DT"]] <- evaluate_model(
  pred_20, test_smote_fs$Class, prob_20[, "Yes"],
  "Model 20: SMOTE + Decision Tree")

# ============================================================
# Model 21: SMOTE + Random Forest
# ============================================================
set.seed(699)
model_21 <- train(Class ~ ., data = train_smote_fs, method = "rf",
                  trControl = ctrl, tuneLength = 5, importance = FALSE)
pred_21  <- predict(model_21, newdata = test_smote_fs)
prob_21  <- predict(model_21, newdata = test_smote_fs, type = "prob")
results_list[["M21_SMOTE_RF"]] <- evaluate_model(
  pred_21, test_smote_fs$Class, prob_21[, "Yes"],
  "Model 21: SMOTE + Random Forest")

# ============================================================
# Model 22: SMOTE + Gradient Boosting (GBM)
# ============================================================
set.seed(699)
model_22 <- train(Class ~ ., data = train_smote_fs, method = "gbm",
                  trControl = ctrl, tuneGrid = gbm_grid, verbose = FALSE)
pred_22  <- predict(model_22, newdata = test_smote_fs)
prob_22  <- predict(model_22, newdata = test_smote_fs, type = "prob")
results_list[["M22_SMOTE_GBM"]] <- evaluate_model(
  pred_22, test_smote_fs$Class, prob_22[, "Yes"],
  "Model 22: SMOTE + Gradient Boosting")

# ============================================================
# Model 23: SMOTE + SVM (Radial Kernel)
# ============================================================
set.seed(699)
model_23 <- train(Class ~ ., data = train_smote_fs, method = "svmRadial",
                  trControl = ctrl, tuneLength = 5)
pred_23  <- predict(model_23, newdata = test_smote_fs)
prob_23  <- predict(model_23, newdata = test_smote_fs, type = "prob")
results_list[["M23_SMOTE_SVM"]] <- evaluate_model(
  pred_23, test_smote_fs$Class, prob_23[, "Yes"],
  "Model 23: SMOTE + SVM (Radial)")

# ============================================================
# Model 24: SMOTE + K-Nearest Neighbors
# ============================================================
set.seed(699)
model_24 <- train(Class ~ ., data = train_smote_fs, method = "knn",
                  trControl = ctrl, tuneGrid = knn_grid)
pred_24  <- predict(model_24, newdata = test_smote_fs)
prob_24  <- predict(model_24, newdata = test_smote_fs, type = "prob")
results_list[["M24_SMOTE_KNN"]] <- evaluate_model(
  pred_24, test_smote_fs$Class, prob_24[, "Yes"],
  "Model 24: SMOTE + K-Nearest Neighbors")

# ============================================================
# Model 25: SMOTE + Naive Bayes
# ============================================================
set.seed(699)
model_25 <- train(Class ~ ., data = train_smote_fs, method = "naive_bayes",
                  trControl = ctrl, tuneGrid = nb_grid)
pred_25  <- predict(model_25, newdata = test_smote_fs)
prob_25  <- predict(model_25, newdata = test_smote_fs, type = "prob")
results_list[["M25_SMOTE_NB"]] <- evaluate_model(
  pred_25, test_smote_fs$Class, prob_25[, "Yes"],
  "Model 25: SMOTE + Naive Bayes")

# ============================================================
# Model 26: SMOTE + Neural Network
# ============================================================
set.seed(699)
model_26 <- train(Class ~ ., data = train_smote_fs, method = "nnet",
                  trControl = ctrl, tuneGrid = nnet_grid,
                  MaxNWts = 10000, trace = FALSE)
pred_26  <- predict(model_26, newdata = test_smote_fs)
prob_26  <- predict(model_26, newdata = test_smote_fs, type = "prob")
results_list[["M26_SMOTE_NN"]] <- evaluate_model(
  pred_26, test_smote_fs$Class, prob_26[, "Yes"],
  "Model 26: SMOTE + Neural Network")

# ============================================================
# Model 27: SMOTE + XGBoost
# ============================================================
# Using direct xgboost with manual CV (caret xgbTree incompatible with xgboost 3.x)
set.seed(699)
xgb_27 <- train_xgboost_cv(train_smote_fs, test_smote_fs, seed = 699)
results_list[["M27_SMOTE_XGB"]] <- evaluate_model(
  xgb_27$predictions, test_smote_fs$Class, xgb_27$prob_yes,
  "Model 27: SMOTE + XGBoost")

# ============================================================
# Model 28: ROSE + Logistic Regression
# ============================================================
set.seed(699)
model_28 <- train(Class ~ ., data = train_rose_fs, method = "glm",
                  family = "binomial", trControl = ctrl)
pred_28  <- predict(model_28, newdata = test_rose_fs)
prob_28  <- predict(model_28, newdata = test_rose_fs, type = "prob")
results_list[["M28_ROSE_GLM"]] <- evaluate_model(
  pred_28, test_rose_fs$Class, prob_28[, "Yes"],
  "Model 28: ROSE + Logistic Regression")

# ============================================================
# Model 29: ROSE + Decision Tree
# ============================================================
set.seed(699)
model_29 <- train(Class ~ ., data = train_rose_fs, method = "rpart",
                  trControl = ctrl, tuneGrid = rpart_grid)
pred_29  <- predict(model_29, newdata = test_rose_fs)
prob_29  <- predict(model_29, newdata = test_rose_fs, type = "prob")
results_list[["M29_ROSE_DT"]] <- evaluate_model(
  pred_29, test_rose_fs$Class, prob_29[, "Yes"],
  "Model 29: ROSE + Decision Tree")

# ============================================================
# Model 30: ROSE + Random Forest
# ============================================================
set.seed(699)
model_30 <- train(Class ~ ., data = train_rose_fs, method = "rf",
                  trControl = ctrl, tuneLength = 5, importance = FALSE)
pred_30  <- predict(model_30, newdata = test_rose_fs)
prob_30  <- predict(model_30, newdata = test_rose_fs, type = "prob")
results_list[["M30_ROSE_RF"]] <- evaluate_model(
  pred_30, test_rose_fs$Class, prob_30[, "Yes"],
  "Model 30: ROSE + Random Forest")

# ============================================================
# Model 31: ROSE + Gradient Boosting (GBM)
# ============================================================
set.seed(699)
model_31 <- train(Class ~ ., data = train_rose_fs, method = "gbm",
                  trControl = ctrl, tuneGrid = gbm_grid, verbose = FALSE)
pred_31  <- predict(model_31, newdata = test_rose_fs)
prob_31  <- predict(model_31, newdata = test_rose_fs, type = "prob")
results_list[["M31_ROSE_GBM"]] <- evaluate_model(
  pred_31, test_rose_fs$Class, prob_31[, "Yes"],
  "Model 31: ROSE + Gradient Boosting")

# ============================================================
# Model 32: ROSE + SVM (Radial Kernel)
# ============================================================
set.seed(699)
model_32 <- train(Class ~ ., data = train_rose_fs, method = "svmRadial",
                  trControl = ctrl, tuneLength = 5)
pred_32  <- predict(model_32, newdata = test_rose_fs)
prob_32  <- predict(model_32, newdata = test_rose_fs, type = "prob")
results_list[["M32_ROSE_SVM"]] <- evaluate_model(
  pred_32, test_rose_fs$Class, prob_32[, "Yes"],
  "Model 32: ROSE + SVM (Radial)")

# ============================================================
# Model 33: ROSE + K-Nearest Neighbors
# ============================================================
set.seed(699)
model_33 <- train(Class ~ ., data = train_rose_fs, method = "knn",
                  trControl = ctrl, tuneGrid = knn_grid)
pred_33  <- predict(model_33, newdata = test_rose_fs)
prob_33  <- predict(model_33, newdata = test_rose_fs, type = "prob")
results_list[["M33_ROSE_KNN"]] <- evaluate_model(
  pred_33, test_rose_fs$Class, prob_33[, "Yes"],
  "Model 33: ROSE + K-Nearest Neighbors")

# ============================================================
# Model 34: ROSE + Naive Bayes
# ============================================================
set.seed(699)
model_34 <- train(Class ~ ., data = train_rose_fs, method = "naive_bayes",
                  trControl = ctrl, tuneGrid = nb_grid)
pred_34  <- predict(model_34, newdata = test_rose_fs)
prob_34  <- predict(model_34, newdata = test_rose_fs, type = "prob")
results_list[["M34_ROSE_NB"]] <- evaluate_model(
  pred_34, test_rose_fs$Class, prob_34[, "Yes"],
  "Model 34: ROSE + Naive Bayes")

# ============================================================
# Model 35: ROSE + Neural Network
# ============================================================
set.seed(699)
model_35 <- train(Class ~ ., data = train_rose_fs, method = "nnet",
                  trControl = ctrl, tuneGrid = nnet_grid,
                  MaxNWts = 10000, trace = FALSE)
pred_35  <- predict(model_35, newdata = test_rose_fs)
prob_35  <- predict(model_35, newdata = test_rose_fs, type = "prob")
results_list[["M35_ROSE_NN"]] <- evaluate_model(
  pred_35, test_rose_fs$Class, prob_35[, "Yes"],
  "Model 35: ROSE + Neural Network")

# ============================================================
# Model 36: ROSE + XGBoost
# ============================================================
# Using direct xgboost with manual CV (caret xgbTree incompatible with xgboost 3.x)
set.seed(699)
xgb_36 <- train_xgboost_cv(train_rose_fs, test_rose_fs, seed = 699)
results_list[["M36_ROSE_XGB"]] <- evaluate_model(
  xgb_36$predictions, test_rose_fs$Class, xgb_36$prob_yes,
  "Model 36: ROSE + XGBoost")

# ================================================================
# SECTION 8: MODEL COMPARISON & BEST MODEL SELECTION
# ================================================================
cat("\n\n=== STAGE 6: MODEL COMPARISON & BEST MODEL SELECTION ===\n\n")

# Compile all 36 results into a summary data frame
summary_df <- do.call(rbind, lapply(names(results_list), function(key) {
  r <- results_list[[key]]
  data.frame(
    ID          = key,
    Model       = r$model,
    Yes_TPR     = round(r$yes_tpr, 4),
    No_TPR      = round(r$no_tpr, 4),
    Yes_F1      = round(r$yes_f1, 4),
    No_F1       = round(r$no_f1, 4),
    AUC         = round(r$auc, 4),
    MCC         = round(r$mcc, 4),
    Kappa       = round(r$kappa, 4),
    TPR_Sum     = round(r$yes_tpr + r$no_tpr, 4),
    stringsAsFactors = FALSE
  )
}))

# Sort by sum of TPRs (primary criterion: maximize both class TPRs)
summary_df <- summary_df[order(-summary_df$TPR_Sum), ]

# Print full summary table
cat("================================================================\n")
cat("FULL MODEL COMPARISON (sorted by Yes TPR + No TPR)\n")
cat("================================================================\n\n")
print(summary_df, row.names = FALSE)

# --- Best model selection ---
# Priority: select highest extra credit tier first, then highest TPR Sum within tier.
#   Tier 1 (+20% EC): Yes TPR >= 0.77 AND No TPR >= 0.73
#   Tier 2 (+10% EC): Yes TPR >= 0.74 AND No TPR >= 0.70
#   Tier 3 (minimum):  Yes TPR >= 0.71 AND No TPR >= 0.67
#   Tier 4 (fallback): highest TPR Sum overall
tier1 <- summary_df[summary_df$Yes_TPR >= 0.77 & summary_df$No_TPR >= 0.73, ]
tier2 <- summary_df[summary_df$Yes_TPR >= 0.74 & summary_df$No_TPR >= 0.70, ]
tier3 <- summary_df[summary_df$Yes_TPR >= 0.71 & summary_df$No_TPR >= 0.67, ]

if (nrow(tier1) > 0) {
  best <- tier1[1, ]  # Already sorted by TPR_Sum descending
  cat(sprintf("\n%d model(s) qualify for +20%% EXTRA CREDIT (Yes>=0.77, No>=0.73)\n", nrow(tier1)))
  cat("Selecting highest TPR Sum among +20%% tier models.\n")
} else if (nrow(tier2) > 0) {
  best <- tier2[1, ]
  cat(sprintf("\n%d model(s) qualify for +10%% EXTRA CREDIT (Yes>=0.74, No>=0.70)\n", nrow(tier2)))
  cat("Selecting highest TPR Sum among +10%% tier models.\n")
} else if (nrow(tier3) > 0) {
  best <- tier3[1, ]
  cat(sprintf("\n%d model(s) meet minimum threshold (Yes>=0.71, No>=0.67)\n", nrow(tier3)))
  cat("Selecting highest TPR Sum among minimum-threshold models.\n")
} else {
  best <- summary_df[1, ]
  cat("\nNo model meets minimum threshold; selecting highest TPR Sum overall.\n")
}
cat(sprintf("\n\n================================================================\n"))
cat(sprintf("BEST MODEL: %s\n", best$Model))
cat(sprintf("================================================================\n"))
cat(sprintf("  Yes TPR:     %.4f\n", best$Yes_TPR))
cat(sprintf("  No TPR:      %.4f\n", best$No_TPR))
cat(sprintf("  Yes F1:      %.4f\n", best$Yes_F1))
cat(sprintf("  No F1:       %.4f\n", best$No_F1))
cat(sprintf("  AUC:         %.4f\n", best$AUC))
cat(sprintf("  MCC:         %.4f\n", best$MCC))
cat(sprintf("  Kappa:       %.4f\n", best$Kappa))
cat(sprintf("  TPR Sum:     %.4f\n", best$TPR_Sum))

# Check performance thresholds for grading
cat("\n--- Threshold Check ---\n")
if (best$Yes_TPR >= 0.77 && best$No_TPR >= 0.73) {
  cat("RESULT: Qualifies for +20% EXTRA CREDIT\n")
  cat(sprintf("  (Yes TPR >= 0.77: %.4f >= 0.77 YES | No TPR >= 0.73: %.4f >= 0.73 YES)\n",
              best$Yes_TPR, best$No_TPR))
} else if (best$Yes_TPR >= 0.74 && best$No_TPR >= 0.70) {
  cat("RESULT: Qualifies for +10% EXTRA CREDIT\n")
  cat(sprintf("  (Yes TPR >= 0.74: %.4f | No TPR >= 0.70: %.4f)\n",
              best$Yes_TPR, best$No_TPR))
} else if (best$Yes_TPR >= 0.71 && best$No_TPR >= 0.67) {
  cat("RESULT: Meets MINIMUM threshold (no penalty)\n")
  cat(sprintf("  (Yes TPR >= 0.71: %.4f | No TPR >= 0.67: %.4f)\n",
              best$Yes_TPR, best$No_TPR))
} else {
  cat("WARNING: Below minimum threshold (-10% penalty)\n")
  cat(sprintf("  (Yes TPR: %.4f [need >= 0.71] | No TPR: %.4f [need >= 0.67])\n",
              best$Yes_TPR, best$No_TPR))
}

cat("\n=== PROJECT CODE COMPLETE ===\n")
