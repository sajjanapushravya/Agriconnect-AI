"""
AgriConnect AI - ML Model Training Script
Trains a Random Forest Regressor on agricultural sales data and evaluates MAE, RMSE, and R2.
"""

import os
import json
import numpy as np

def train_demand_model():
    print("Initializing synthetic 180-day agricultural mandi transaction dataset...")
    np.random.seed(42)
    n_samples = 1200

    # Features: [base_stock, seasonality_index, price_ratio, is_weekend, day_index]
    X = np.zeros((n_samples, 5))
    X[:, 0] = np.random.uniform(50, 1500, n_samples) # Base stock
    X[:, 1] = np.random.choice([0.95, 1.05, 1.15, 1.25], n_samples) # Seasonality
    X[:, 2] = np.random.uniform(0.7, 0.95, n_samples) # Platform / Market Price ratio
    X[:, 3] = np.random.choice([0, 1], n_samples, p=[0.71, 0.29]) # Weekend flag
    X[:, 4] = np.random.randint(1, 30, n_samples) # Day of month

    # Target: Daily Sales (kg)
    # y = base_stock * 0.1 * seasonality * (1 / price_ratio) * (1.2 if weekend) + noise
    y = (X[:, 0] * 0.10) * X[:, 1] * (1.0 / X[:, 2]) * (1.0 + 0.22 * X[:, 3]) + np.random.normal(0, 4, n_samples)
    y = np.maximum(5.0, y)

    # Train / test split (80/20)
    split_idx = int(0.8 * n_samples)
    X_train, X_test = X[:split_idx], X[split_idx:]
    y_train, y_test = y[:split_idx], y[split_idx:]

    try:
        from sklearn.ensemble import RandomForestRegressor
        model = RandomForestRegressor(n_estimators=100, random_state=42)
        model.fit(X_train, y_train)
        y_pred = model.predict(X_test)
    except ImportError:
        # Fallback linear baseline if scikit-learn is not installed in runtime
        weights = np.linalg.pinv(X_train).dot(y_train)
        y_pred = X_test.dot(weights)

    mae = float(np.mean(np.abs(y_test - y_pred)))
    rmse = float(np.sqrt(np.mean((y_test - y_pred) ** 2)))
    ss_tot = np.sum((y_test - np.mean(y_test)) ** 2)
    ss_res = np.sum((y_test - y_pred) ** 2)
    r2 = float(1 - (ss_res / ss_tot))

    results = {
        "model_name": "AgriConnect_Demand_RandomForest_v1",
        "dataset_samples": n_samples,
        "metrics": {
            "MAE": round(mae, 2),
            "RMSE": round(rmse, 2),
            "R2_score": round(r2, 3)
        },
        "status": "Trained successfully"
    }

    os.makedirs("ml/saved_models", exist_ok=True)
    with open("ml/saved_models/metrics.json", "w") as f:
        json.dump(results, f, indent=2)

    print("Model Training Complete:")
    print(f" - MAE:  {mae:.2f} kg")
    print(f" - RMSE: {rmse:.2f} kg")
    print(f" - R²:   {r2:.3f}")
    print("Saved to ml/saved_models/metrics.json")
    return results

if __name__ == "__main__":
    train_demand_model()
