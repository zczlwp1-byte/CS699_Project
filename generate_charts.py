"""Generate charts for the CS699 classification project report."""
import matplotlib
matplotlib.use('Agg')
import matplotlib.pyplot as plt
import matplotlib.patches as mpatches
import numpy as np
import os

out_dir = r"D:\VS Code\VS Code Project\BU\699 HW\Project_New\charts"
os.makedirs(out_dir, exist_ok=True)

# All 36 model data
models = [
    (1,"Under","Logistic Reg",0.6915,0.8472,0.8528),
    (2,"Under","Decision Tree",0.7730,0.7322,0.7887),
    (3,"Under","Random Forest",0.7021,0.8238,0.8491),
    (4,"Under","GBM",0.7252,0.8304,0.8567),
    (5,"Under","SVM",0.7163,0.8119,0.8506),
    (6,"Under","KNN",0.4592,0.9041,0.7842),
    (7,"Under","Naive Bayes",0.1348,0.9664,0.7527),
    (8,"Under","Neural Net",0.6791,0.7409,0.7857),
    (9,"Under","XGBoost",0.6986,0.8499,0.8596),
    (10,"Over","Logistic Reg",0.6826,0.8607,0.8568),
    (11,"Over","Decision Tree",0.6383,0.8228,0.7505),
    (12,"Over","Random Forest",0.4504,0.9767,0.8537),
    (13,"Over","GBM",0.6489,0.8846,0.8495),
    (14,"Over","SVM",0.5550,0.9176,0.8272),
    (15,"Over","KNN",0.5638,0.7604,0.6823),
    (16,"Over","Naive Bayes",0.1365,0.9718,0.7583),
    (17,"Over","Neural Net",0.5390,0.8585,0.7673),
    (18,"Over","XGBoost",0.4840,0.9604,0.8425),
    (19,"SMOTE","Logistic Reg",0.6738,0.8743,0.8539),
    (20,"SMOTE","Decision Tree",0.5071,0.9333,0.8082),
    (21,"SMOTE","Random Forest",0.4167,0.9783,0.8518),
    (22,"SMOTE","GBM",0.4894,0.9637,0.8511),
    (23,"SMOTE","SVM",0.5142,0.9182,0.8082),
    (24,"SMOTE","KNN",0.6596,0.6672,0.7137),
    (25,"SMOTE","Naive Bayes",0.0089,0.9995,0.7497),
    (26,"SMOTE","Neural Net",0.6028,0.8314,0.7901),
    (27,"SMOTE","XGBoost",0.4450,0.9799,0.8570),
    (28,"ROSE","Logistic Reg",0.7110,0.8255,0.8494),
    (29,"ROSE","Decision Tree",0.2021,1.0000,0.6011),
    (30,"ROSE","Random Forest",0.2270,1.0000,0.7067),
    (31,"ROSE","GBM",0.1383,1.0000,0.6862),
    (32,"ROSE","SVM",0.3103,0.9881,0.8335),
    (33,"ROSE","KNN",0.1755,0.9843,0.6454),
    (34,"ROSE","Naive Bayes",0.0833,0.9935,0.7709),
    (35,"ROSE","Neural Net",0.3830,0.9924,0.7354),
    (36,"ROSE","XGBoost",0.2199,1.0000,0.6869),
]

colors = {"Under":"#2E75B6","Over":"#E36C09","SMOTE":"#70AD47","ROSE":"#7030A0"}
algo_names = ["Logistic Reg","Decision Tree","Random Forest","GBM","SVM","KNN","Naive Bayes","Neural Net","XGBoost"]

# ============================================================
# CHART 1: Class Distribution
# ============================================================
fig, ax = plt.subplots(figsize=(7, 4))
bars = ax.bar(["No (Non-Disability)", "Yes (Disability)"], [6153, 1882],
              color=["#2E75B6", "#E36C09"], edgecolor="white", width=0.5)
ax.bar_label(bars, fmt='%d', fontsize=12, fontweight='bold')
ax.set_ylabel("Number of Households", fontsize=12)
ax.set_title("Target Class Distribution (After Removing NAs)", fontsize=14, fontweight='bold')
ax.text(0.5, 0.92, "Imbalance Ratio: 3.27 : 1 (76.6% No / 23.4% Yes)",
        transform=ax.transAxes, ha='center', fontsize=10, color='gray')
ax.set_ylim(0, 7500)
ax.spines['top'].set_visible(False)
ax.spines['right'].set_visible(False)
plt.tight_layout()
plt.savefig(os.path.join(out_dir, "chart1_class_distribution.png"), dpi=200)
plt.close()
print("Chart 1: Class distribution - DONE")

# ============================================================
# CHART 2: Yes TPR vs No TPR Scatter (all 36 models)
# ============================================================
fig, ax = plt.subplots(figsize=(8, 6))
for mid, bal, alg, yes_tpr, no_tpr, auc in models:
    ax.scatter(no_tpr, yes_tpr, c=colors[bal], s=60, zorder=5, edgecolors='white', linewidth=0.5)
# Highlight best model (Model 2)
ax.scatter(0.7322, 0.7730, c='red', s=200, marker='*', zorder=10, edgecolors='black', linewidth=1)
ax.annotate("Model 2\n(Best)", (0.7322, 0.7730), textcoords="offset points",
            xytext=(-50, 10), fontsize=9, fontweight='bold', color='red',
            arrowprops=dict(arrowstyle='->', color='red'))
# Threshold lines
ax.axhline(y=0.77, color='green', linestyle='--', alpha=0.5, label='Yes TPR = 0.77 (+20% EC)')
ax.axvline(x=0.73, color='green', linestyle='--', alpha=0.5, label='No TPR = 0.73 (+20% EC)')
ax.axhline(y=0.71, color='orange', linestyle=':', alpha=0.5, label='Yes TPR = 0.71 (minimum)')
ax.axvline(x=0.67, color='orange', linestyle=':', alpha=0.5, label='No TPR = 0.67 (minimum)')
# Shade the +20% zone
ax.fill_between([0.73, 1.05], 0.77, 1.05, alpha=0.08, color='green')
ax.text(0.88, 0.80, "+20% EC Zone", fontsize=9, color='green', fontstyle='italic')
patches = [mpatches.Patch(color=v, label=k) for k,v in
           {"Undersampling":"#2E75B6","Oversampling":"#E36C09","SMOTE":"#70AD47","ROSE":"#7030A0"}.items()]
ax.legend(handles=patches + ax.get_legend_handles_labels()[0], loc='lower left', fontsize=8)
ax.set_xlabel("No TPR (Specificity)", fontsize=12)
ax.set_ylabel("Yes TPR (Sensitivity)", fontsize=12)
ax.set_title("Yes TPR vs No TPR for All 36 Models", fontsize=14, fontweight='bold')
ax.set_xlim(0.6, 1.05)
ax.set_ylim(-0.02, 0.85)
ax.spines['top'].set_visible(False)
ax.spines['right'].set_visible(False)
ax.grid(True, alpha=0.2)
plt.tight_layout()
plt.savefig(os.path.join(out_dir, "chart2_tpr_scatter.png"), dpi=200)
plt.close()
print("Chart 2: Yes TPR vs No TPR scatter - DONE")

# ============================================================
# CHART 3: Grouped bar chart - Yes TPR by Algorithm (grouped by balancing)
# ============================================================
fig, ax = plt.subplots(figsize=(12, 5.5))
x = np.arange(len(algo_names))
width = 0.2
bal_labels = ["Under", "Over", "SMOTE", "ROSE"]
for i, bal in enumerate(bal_labels):
    vals = [m[3] for m in models if m[1] == bal]  # yes_tpr
    bars = ax.bar(x + i*width - 1.5*width, vals, width, label=bal,
                  color=colors[bal], edgecolor='white')
ax.set_xticks(x)
ax.set_xticklabels(algo_names, rotation=30, ha='right', fontsize=10)
ax.set_ylabel("Yes TPR (Sensitivity)", fontsize=12)
ax.set_title("Yes TPR (Minority Class Recall) by Algorithm and Balancing Method", fontsize=13, fontweight='bold')
ax.axhline(y=0.77, color='green', linestyle='--', alpha=0.6, linewidth=1)
ax.text(8.6, 0.775, "+20% EC", fontsize=8, color='green')
ax.axhline(y=0.71, color='orange', linestyle=':', alpha=0.6, linewidth=1)
ax.text(8.6, 0.715, "Minimum", fontsize=8, color='orange')
ax.legend(title="Balancing", fontsize=9, title_fontsize=10)
ax.set_ylim(0, 0.95)
ax.spines['top'].set_visible(False)
ax.spines['right'].set_visible(False)
ax.grid(axis='y', alpha=0.2)
plt.tight_layout()
plt.savefig(os.path.join(out_dir, "chart3_yes_tpr_grouped.png"), dpi=200)
plt.close()
print("Chart 3: Yes TPR grouped bar chart - DONE")

# ============================================================
# CHART 4: AUC Comparison - Top 15 models
# ============================================================
sorted_by_auc = sorted(models, key=lambda m: m[5], reverse=True)[:15]
fig, ax = plt.subplots(figsize=(10, 5.5))
labels = [f"M{m[0]}: {m[1]}+{m[2]}" for m in sorted_by_auc]
aucs = [m[5] for m in sorted_by_auc]
bar_colors = [colors[m[1]] for m in sorted_by_auc]
bars = ax.barh(range(len(labels)), aucs, color=bar_colors, edgecolor='white', height=0.7)
ax.set_yticks(range(len(labels)))
ax.set_yticklabels(labels, fontsize=9)
ax.set_xlabel("AUC (ROC Area)", fontsize=12)
ax.set_title("Top 15 Models by AUC", fontsize=14, fontweight='bold')
ax.set_xlim(0.65, 0.88)
ax.invert_yaxis()
for bar, val in zip(bars, aucs):
    ax.text(val + 0.003, bar.get_y() + bar.get_height()/2, f"{val:.4f}",
            va='center', fontsize=8)
ax.spines['top'].set_visible(False)
ax.spines['right'].set_visible(False)
ax.grid(axis='x', alpha=0.2)
plt.tight_layout()
plt.savefig(os.path.join(out_dir, "chart4_auc_top15.png"), dpi=200)
plt.close()
print("Chart 4: AUC top 15 - DONE")

# ============================================================
# CHART 5: Heatmap - Key metrics by model (Yes TPR, No TPR, AUC)
# ============================================================
fig, axes = plt.subplots(1, 3, figsize=(14, 8))
metrics_data = {
    "Yes TPR": np.array([m[3] for m in models]).reshape(4, 9),
    "No TPR": np.array([m[4] for m in models]).reshape(4, 9),
    "AUC": np.array([m[5] for m in models]).reshape(4, 9),
}
bal_labels_full = ["Undersampling", "Oversampling", "SMOTE", "ROSE"]
for ax, (title, data) in zip(axes, metrics_data.items()):
    im = ax.imshow(data, cmap='RdYlGn', aspect='auto', vmin=0, vmax=1)
    ax.set_xticks(range(9))
    ax.set_xticklabels(algo_names, rotation=45, ha='right', fontsize=7)
    ax.set_yticks(range(4))
    ax.set_yticklabels(bal_labels_full, fontsize=9)
    ax.set_title(title, fontsize=12, fontweight='bold')
    for i in range(4):
        for j in range(9):
            val = data[i, j]
            color = 'white' if val < 0.4 or val > 0.85 else 'black'
            ax.text(j, i, f"{val:.2f}", ha='center', va='center', fontsize=7, color=color)
fig.colorbar(im, ax=axes, shrink=0.6, label="Metric Value")
fig.suptitle("Performance Heatmap: All 36 Models", fontsize=14, fontweight='bold', y=1.01)
plt.tight_layout()
plt.savefig(os.path.join(out_dir, "chart5_heatmap.png"), dpi=200, bbox_inches='tight')
plt.close()
print("Chart 5: Heatmap - DONE")

# ============================================================
# CHART 6: TPR Sum - Top 10 models with threshold check
# ============================================================
sorted_by_tprsum = sorted(models, key=lambda m: m[3]+m[4], reverse=True)[:10]
fig, ax = plt.subplots(figsize=(10, 5))
labels = [f"M{m[0]}: {m[1]}+{m[2]}" for m in sorted_by_tprsum]
yes_vals = [m[3] for m in sorted_by_tprsum]
no_vals = [m[4] for m in sorted_by_tprsum]
y_pos = range(len(labels))
ax.barh(y_pos, yes_vals, color='#E36C09', height=0.4, label='Yes TPR', align='edge')
ax.barh([y + 0.4 for y in y_pos], no_vals, color='#2E75B6', height=0.4, label='No TPR', align='edge')
ax.set_yticks([y + 0.4 for y in y_pos])
ax.set_yticklabels(labels, fontsize=9)
ax.invert_yaxis()
ax.set_xlabel("TPR Value", fontsize=12)
ax.set_title("Top 10 Models by TPR Sum (Yes TPR + No TPR)", fontsize=13, fontweight='bold')
ax.legend(fontsize=10)
ax.axvline(x=0.77, color='green', linestyle='--', alpha=0.4)
ax.axvline(x=0.73, color='green', linestyle='--', alpha=0.4)
ax.axvline(x=0.71, color='orange', linestyle=':', alpha=0.4)
ax.axvline(x=0.67, color='orange', linestyle=':', alpha=0.4)
ax.set_xlim(0, 1.0)
ax.spines['top'].set_visible(False)
ax.spines['right'].set_visible(False)
ax.grid(axis='x', alpha=0.2)
plt.tight_layout()
plt.savefig(os.path.join(out_dir, "chart6_tprsum_top10.png"), dpi=200)
plt.close()
print("Chart 6: TPR Sum top 10 - DONE")

print("\nAll 6 charts generated in:", out_dir)
