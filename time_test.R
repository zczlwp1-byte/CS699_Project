# Quick timing test for all 36 models
# Loads preprocessing output, then times each model block

# Load required packages silently
suppressMessages({
  library(caret); library(e1071); library(randomForest); library(rpart)
  library(gbm); library(xgboost); library(nnet); library(kernlab)
  library(naivebayes); library(ROSE); library(smotefamily); library(pROC)
})

# Source the preprocessing and balancing (everything before models)
# We'll load the saved data and rebuild balanced sets

set.seed(699)
data <- read.csv("D:/VS Code/VS Code Project/BU/699 HW/Project_New/project_data.csv",
                 stringsAsFactors = FALSE)
data <- data[!is.na(data$Class) & data$Class != "", ]
data$CONTROL <- NULL
features <- data[, names(data) != "Class"]
for (col in names(features)) features[[col]] <- as.numeric(as.character(features[[col]]))
features <- features[, !sapply(features, function(x) all(is.na(x)))]
for (col in names(features)) {
  med <- median(features[[col]], na.rm = TRUE)
  features[[col]][is.na(features[[col]])] <- med
}
nzv <- nearZeroVar(features, freqCut = 99/1, saveMetrics = FALSE)
if (length(nzv) > 0) features <- features[, -nzv]
continuous_cols <- names(features)[sapply(features, function(x) length(unique(x)) > 10)]
for (col in continuous_cols) {
  x <- features[[col]]
  Q1 <- quantile(x, 0.25, na.rm=TRUE); Q3 <- quantile(x, 0.75, na.rm=TRUE)
  IQR_val <- Q3 - Q1; lo <- Q1 - 1.5*IQR_val; hi <- Q3 + 1.5*IQR_val
  features[[col]] <- pmin(pmax(x, lo), hi)
}
zero_var2 <- sapply(features, function(x) length(unique(x)) <= 1)
if (any(zero_var2)) features <- features[, !zero_var2]
pp <- preProcess(features, method = c("center","scale"))
features <- predict(pp, features)
zero_var3 <- sapply(features, function(x) var(x) == 0)
if (any(zero_var3)) features <- features[, !zero_var3]
full <- cbind(features, Class = factor(data$Class, levels = c("No","Yes")))

idx <- createDataPartition(full$Class, p=0.7, list=FALSE)
train_set <- full[idx,]; test_set <- full[-idx,]

# Balancing
train_under <- downSample(train_set[,-ncol(train_set)], train_set$Class, yname="Class")
train_over  <- upSample(train_set[,-ncol(train_set)], train_set$Class, yname="Class")
smote_out   <- SMOTE(train_set[,-ncol(train_set)], train_set$Class, K=5, dup_size=0)
train_smote <- smote_out$data; names(train_smote)[ncol(train_smote)] <- "Class"
train_smote$Class <- factor(train_smote$Class, levels=c("No","Yes"))
rose_out    <- ROSE(Class ~ ., data=train_set, seed=699)
train_rose  <- rose_out$data

# Feature selection
cor_remove <- function(d) {
  cor_mat <- cor(d[,-ncol(d)]); high <- findCorrelation(cor_mat, cutoff=0.85)
  if(length(high)>0) return(names(d[,-ncol(d)])[high]) else return(character(0))
}
rm_under <- cor_remove(train_under); rm_over <- cor_remove(train_over)
rm_smote <- cor_remove(train_smote); rm_rose <- cor_remove(train_rose)

make_fs <- function(train_d, test_d, rm_cols) {
  if(length(rm_cols)>0) {
    train_d <- train_d[, !(names(train_d) %in% rm_cols)]
    keep <- c(intersect(names(train_d), names(test_d)))
    test_d <- test_d[, keep]
  } else {
    keep <- intersect(names(train_d), names(test_d))
    train_d <- train_d[, keep]; test_d <- test_d[, keep]
  }
  list(train=train_d, test=test_d)
}

fs_under <- make_fs(train_under, test_set, rm_under)
fs_over  <- make_fs(train_over, test_set, rm_over)
fs_smote <- make_fs(train_smote, test_set, rm_smote)
fs_rose  <- make_fs(train_rose, test_set, rm_rose)

train_under_fs <- fs_under$train; test_under_fs <- fs_under$test
train_over_fs  <- fs_over$train;  test_over_fs  <- fs_over$test
train_smote_fs <- fs_smote$train; test_smote_fs <- fs_smote$test
train_rose_fs  <- fs_rose$train;  test_rose_fs  <- fs_rose$test

ctrl <- trainControl(method="cv", number=5, classProbs=TRUE, verboseIter=FALSE)
rpart_grid <- expand.grid(cp = c(0.001, 0.005, 0.01, 0.02, 0.05))
gbm_grid <- expand.grid(n.trees=c(100,200,300), interaction.depth=c(3,5),
                         shrinkage=c(0.01,0.1), n.minobsinnode=10)
knn_grid <- expand.grid(k = c(3,5,7,9,11,15))
nb_grid <- expand.grid(laplace=c(0,1), usekernel=c(TRUE,FALSE), adjust=1)
nnet_grid <- expand.grid(size=c(5,10,15), decay=c(0.001,0.01,0.1))

# XGBoost helper
train_xgboost_cv <- function(train_data, test_data, seed=699) {
  set.seed(seed)
  feat_cols <- names(train_data)[names(train_data)!="Class"]
  train_mat <- as.matrix(train_data[,feat_cols])
  train_labels <- ifelse(train_data$Class=="Yes",1,0)
  test_mat <- as.matrix(test_data[,feat_cols])
  param_grid <- expand.grid(max_depth=c(3,4,6,8),eta=c(0.01,0.05,0.1,0.3),nrounds=c(100,200,300),stringsAsFactors=FALSE)
  folds <- createFolds(train_data$Class,k=5,returnTrain=FALSE)
  best_auc<-0; best_row<-1
  for(i in 1:nrow(param_grid)){
    fold_aucs<-sapply(folds,function(val_idx){
      dtrain<-xgb.DMatrix(train_mat[-val_idx,],label=train_labels[-val_idx])
      dval<-xgb.DMatrix(train_mat[val_idx,],label=train_labels[val_idx])
      params<-list(objective="binary:logistic",max_depth=param_grid$max_depth[i],eta=param_grid$eta[i],colsample_bytree=0.8,subsample=0.8,min_child_weight=1)
      mdl<-xgb.train(params,dtrain,nrounds=param_grid$nrounds[i],verbose=0)
      preds<-predict(mdl,dval)
      as.numeric(auc(roc(train_labels[val_idx],preds,quiet=TRUE)))
    })
    if(mean(fold_aucs)>best_auc){best_auc<-mean(fold_aucs);best_row<-i}
  }
  best<-param_grid[best_row,]
  dtrain_final<-xgb.DMatrix(train_mat,label=train_labels)
  params_final<-list(objective="binary:logistic",max_depth=best$max_depth,eta=best$eta,colsample_bytree=0.8,subsample=0.8,min_child_weight=1)
  final_model<-xgb.train(params_final,dtrain_final,nrounds=best$nrounds,verbose=0)
  cat(sprintf("  Best params: max_depth=%d, eta=%.1f, nrounds=%d (CV AUC=%.4f)\n",best$max_depth,best$eta,best$nrounds,best_auc))
  probs<-predict(final_model,xgb.DMatrix(test_mat))
  preds<-factor(ifelse(probs>=0.5,"Yes","No"),levels=c("No","Yes"))
  list(predictions=preds, probabilities=probs)
}

# ============================================================
# TIME EACH MODEL
# ============================================================
cat("================================================================\n")
cat("TIMING TEST: All 36 Models\n")
cat("================================================================\n\n")

timings <- list()
time_model <- function(name, expr) {
  t0 <- proc.time()
  eval(expr, envir=parent.frame())
  elapsed <- (proc.time() - t0)[["elapsed"]]
  timings[[name]] <<- elapsed
  cat(sprintf("%-50s %6.1f sec\n", name, elapsed))
}

# Models 1-9: Undersampling
time_model("M01 Under+GLM", quote({set.seed(699); train(Class~.,data=train_under_fs,method="glm",family="binomial",trControl=ctrl)}))
time_model("M02 Under+DT",  quote({set.seed(699); train(Class~.,data=train_under_fs,method="rpart",trControl=ctrl,tuneGrid=rpart_grid)}))
time_model("M03 Under+RF",  quote({set.seed(699); train(Class~.,data=train_under_fs,method="rf",trControl=ctrl,tuneLength=5,importance=FALSE)}))
time_model("M04 Under+GBM", quote({set.seed(699); train(Class~.,data=train_under_fs,method="gbm",trControl=ctrl,tuneGrid=gbm_grid,verbose=FALSE)}))
time_model("M05 Under+SVM", quote({set.seed(699); train(Class~.,data=train_under_fs,method="svmRadial",trControl=ctrl,tuneLength=5)}))
time_model("M06 Under+KNN", quote({set.seed(699); train(Class~.,data=train_under_fs,method="knn",trControl=ctrl,tuneGrid=knn_grid)}))
time_model("M07 Under+NB",  quote({set.seed(699); train(Class~.,data=train_under_fs,method="naive_bayes",trControl=ctrl,tuneGrid=nb_grid)}))
time_model("M08 Under+NN",  quote({set.seed(699); train(Class~.,data=train_under_fs,method="nnet",trControl=ctrl,tuneGrid=nnet_grid,trace=FALSE,MaxNWts=10000)}))
time_model("M09 Under+XGB", quote({set.seed(699); train_xgboost_cv(train_under_fs,test_under_fs)}))

# Models 10-18: Oversampling
time_model("M10 Over+GLM",  quote({set.seed(699); train(Class~.,data=train_over_fs,method="glm",family="binomial",trControl=ctrl)}))
time_model("M11 Over+DT",   quote({set.seed(699); train(Class~.,data=train_over_fs,method="rpart",trControl=ctrl,tuneGrid=rpart_grid)}))
time_model("M12 Over+RF",   quote({set.seed(699); train(Class~.,data=train_over_fs,method="rf",trControl=ctrl,tuneLength=5,importance=FALSE)}))
time_model("M13 Over+GBM",  quote({set.seed(699); train(Class~.,data=train_over_fs,method="gbm",trControl=ctrl,tuneGrid=gbm_grid,verbose=FALSE)}))
time_model("M14 Over+SVM",  quote({set.seed(699); train(Class~.,data=train_over_fs,method="svmRadial",trControl=ctrl,tuneLength=5)}))
time_model("M15 Over+KNN",  quote({set.seed(699); train(Class~.,data=train_over_fs,method="knn",trControl=ctrl,tuneGrid=knn_grid)}))
time_model("M16 Over+NB",   quote({set.seed(699); train(Class~.,data=train_over_fs,method="naive_bayes",trControl=ctrl,tuneGrid=nb_grid)}))
time_model("M17 Over+NN",   quote({set.seed(699); train(Class~.,data=train_over_fs,method="nnet",trControl=ctrl,tuneGrid=nnet_grid,trace=FALSE,MaxNWts=10000)}))
time_model("M18 Over+XGB",  quote({set.seed(699); train_xgboost_cv(train_over_fs,test_over_fs)}))

# Models 19-27: SMOTE
time_model("M19 SMOTE+GLM", quote({set.seed(699); train(Class~.,data=train_smote_fs,method="glm",family="binomial",trControl=ctrl)}))
time_model("M20 SMOTE+DT",  quote({set.seed(699); train(Class~.,data=train_smote_fs,method="rpart",trControl=ctrl,tuneGrid=rpart_grid)}))
time_model("M21 SMOTE+RF",  quote({set.seed(699); train(Class~.,data=train_smote_fs,method="rf",trControl=ctrl,tuneLength=5,importance=FALSE)}))
time_model("M22 SMOTE+GBM", quote({set.seed(699); train(Class~.,data=train_smote_fs,method="gbm",trControl=ctrl,tuneGrid=gbm_grid,verbose=FALSE)}))
time_model("M23 SMOTE+SVM", quote({set.seed(699); train(Class~.,data=train_smote_fs,method="svmRadial",trControl=ctrl,tuneLength=5)}))
time_model("M24 SMOTE+KNN", quote({set.seed(699); train(Class~.,data=train_smote_fs,method="knn",trControl=ctrl,tuneGrid=knn_grid)}))
time_model("M25 SMOTE+NB",  quote({set.seed(699); train(Class~.,data=train_smote_fs,method="naive_bayes",trControl=ctrl,tuneGrid=nb_grid)}))
time_model("M26 SMOTE+NN",  quote({set.seed(699); train(Class~.,data=train_smote_fs,method="nnet",trControl=ctrl,tuneGrid=nnet_grid,trace=FALSE,MaxNWts=10000)}))
time_model("M27 SMOTE+XGB", quote({set.seed(699); train_xgboost_cv(train_smote_fs,test_smote_fs)}))

# Models 28-36: ROSE
time_model("M28 ROSE+GLM",  quote({set.seed(699); train(Class~.,data=train_rose_fs,method="glm",family="binomial",trControl=ctrl)}))
time_model("M29 ROSE+DT",   quote({set.seed(699); train(Class~.,data=train_rose_fs,method="rpart",trControl=ctrl,tuneGrid=rpart_grid)}))
time_model("M30 ROSE+RF",   quote({set.seed(699); train(Class~.,data=train_rose_fs,method="rf",trControl=ctrl,tuneLength=5,importance=FALSE)}))
time_model("M31 ROSE+GBM",  quote({set.seed(699); train(Class~.,data=train_rose_fs,method="gbm",trControl=ctrl,tuneGrid=gbm_grid,verbose=FALSE)}))
time_model("M32 ROSE+SVM",  quote({set.seed(699); train(Class~.,data=train_rose_fs,method="svmRadial",trControl=ctrl,tuneLength=5)}))
time_model("M33 ROSE+KNN",  quote({set.seed(699); train(Class~.,data=train_rose_fs,method="knn",trControl=ctrl,tuneGrid=knn_grid)}))
time_model("M34 ROSE+NB",   quote({set.seed(699); train(Class~.,data=train_rose_fs,method="naive_bayes",trControl=ctrl,tuneGrid=nb_grid)}))
time_model("M35 ROSE+NN",   quote({set.seed(699); train(Class~.,data=train_rose_fs,method="nnet",trControl=ctrl,tuneGrid=nnet_grid,trace=FALSE,MaxNWts=10000)}))
time_model("M36 ROSE+XGB",  quote({set.seed(699); train_xgboost_cv(train_rose_fs,test_rose_fs)}))

cat("\n================================================================\n")
cat("TIMING SUMMARY (sorted by time, descending)\n")
cat("================================================================\n")
t_df <- data.frame(Model=names(timings), Seconds=unlist(timings), stringsAsFactors=FALSE)
t_df <- t_df[order(-t_df$Seconds),]
for(i in 1:nrow(t_df)) cat(sprintf("%-50s %6.1f sec\n", t_df$Model[i], t_df$Seconds[i]))
cat(sprintf("\nTotal: %.1f sec (%.1f min)\n", sum(t_df$Seconds), sum(t_df$Seconds)/60))
