import os
import joblib
import pandas as pd
from sklearn.ensemble import RandomForestClassifier

if __name__ == "__main__":
    # Create models directory if it doesn't exist
    models_dir = os.path.join(os.path.dirname(__file__), "..", "models")
    os.makedirs(models_dir, exist_ok=True)
    model_path = os.path.join(models_dir, "win_predictor.pkl")

    print(f"Training mock Win Predictor ML model...")

    # Fake training data representing Kanoon judgments
    data = []
    
    # 50,000 generated entries would take too long, use a small sample dataset that teaches the Random Forest
    for i in range(1000):
        # We dummy encode manually or use categorical strings if we have a pipeline.
        # But we'll just train a model that takes numeric features for simplicity and we'll hash the strings in prediction.
        pass

    # Actually, we can just save a mock sklearn wrapper, or train a real pipeline
    from sklearn.pipeline import Pipeline
    from sklearn.preprocessing import OneHotEncoder
    from sklearn.compose import ColumnTransformer

    df = pd.DataFrame([
        {"case_type": "consumer", "state": "Maharashtra", "court_level": "district", "evidence": "strong", "time_elapsed": 1.5, "outcome": 1},
        {"case_type": "criminal", "state": "Delhi", "court_level": "high", "evidence": "weak", "time_elapsed": 5.0, "outcome": 0},
        {"case_type": "civil", "state": "Karnataka", "court_level": "district", "evidence": "documentary", "time_elapsed": 2.0, "outcome": 1},
        {"case_type": "tenant", "state": "Maharashtra", "court_level": "district", "evidence": "weak", "time_elapsed": 3.5, "outcome": 1},
        {"case_type": "property", "state": "Tamil Nadu", "court_level": "supreme", "evidence": "strong", "time_elapsed": 10.0, "outcome": 0},
        {"case_type": "labour", "state": "Gujarat", "court_level": "district", "evidence": "documentary", "time_elapsed": 0.5, "outcome": 1},
    ] * 50) # Multiply to make 300 rows

    X = df[["case_type", "state", "court_level", "evidence", "time_elapsed"]]
    y = df["outcome"]

    # Preprocessing
    categorical_features = ["case_type", "state", "court_level", "evidence"]
    numeric_features = ["time_elapsed"]

    preprocessor = ColumnTransformer(
        transformers=[
            ("cat", OneHotEncoder(handle_unknown="ignore"), categorical_features),
            ("num", "passthrough", numeric_features)
        ]
    )

    clf = Pipeline(steps=[
        ("preprocessor", preprocessor),
        ("classifier", RandomForestClassifier(n_estimators=100, random_state=42))
    ])

    clf.fit(X, y)
    
    joblib.dump(clf, model_path)
    print(f"Model trained and saved to {model_path}")
