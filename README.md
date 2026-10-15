# CS699 Data Mining Project

Classification of disability in households using the 2023 American Housing Survey (AHS).

The project includes data preprocessing, a stratified train/test split, four class-balancing methods, feature selection, and comparison of 36 classification models (four balancing methods and nine algorithms).

## Main files

- `project_code.R`: main analysis and model comparison pipeline.
- `project_data.csv`: input dataset.
- `preprocessed_data.csv`, `initial_train.csv`, `initial_test.csv`: prepared datasets.
- `time_test.R`: timing experiments.
- `charts/`: project figures.
- `Cheng_HoMan_Peng_Weitao_Report.pdf`: final report.
- `Cheng_HoMan_Peng_Weitao_Slides.pptx`: presentation.
- `generate_charts.py`, `generate_report.js`, `generate_slides.js`: artifact generation scripts.

## Run

Run `project_code.R` from the project root in R. The script installs missing R packages and loads `project_data.csv` from the current working directory.

Node dependencies for the document generation scripts are declared in `package.json` and `package-lock.json`; install them with `npm ci`. The scripts may require additional local tools or paths.

The original project documents, supporting materials, and experiment logs are preserved. Installed dependencies and local assistant settings are excluded.
