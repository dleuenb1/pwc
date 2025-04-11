import pandas as pd
import numpy as np
from sklearn.model_selection import train_test_split
from sklearn.preprocessing import StandardScaler, LabelEncoder
from sklearn.metrics import accuracy_score, precision_score, recall_score, f1_score
from sklearn.ensemble import RandomForestClassifier
from sklearn.linear_model import LogisticRegression
from xgboost import XGBClassifier




class MLModel:

    def __init__(self, data : pd.DataFrame, column_name : str, model_name : str):
        self.data = data
        self.column_name = column_name
        self.model_name = model_name
        self.training_data, self.scaler, self.label_encoder = self.PreProcessing()
        self.model, self.score_metrics = self.GetModel()
  
    def PreProcessing(self,) ->  dict:

        test_data = self.data.dropna()
        y = test_data[self.column_name]
        x = test_data.drop(self.column_name, axis=1)
        categorical_cols = x.select_dtypes(include=["object", "category"]).columns
        x = pd.get_dummies(x, columns=categorical_cols, drop_first=True)
        self.__columns = x.columns
        scaler = StandardScaler().fit(x)
        x = scaler.transform(x)

        if y.dtype == "object" or y.dtype == "category":
            label_encoder = LabelEncoder()
            label_encoder =  label_encoder.fit(y)
            print(label_encoder.classes_)
            y = label_encoder.transform(y)
        else:
            label_encoder = None

        x_train, x_test, y_train, y_test = train_test_split(x, y, test_size=0.2, random_state=42)
        dict_ = {"x_train" : x_train,
                "x_test" : x_test,
                "y_train" : y_train,
                "y_test" : y_test,
                }
        
        return dict_, scaler, label_encoder
    def GetModel(self,) -> object:
        if self.model_name == "randomforest":
            return self.__RandomForest()
        elif self.model_name == "logisticregression":
            return self.__LogisticRegression()
        elif self.model_name == "xgboost":
            return self.__XGBoost()
      
    def __RandomForest(self,) -> RandomForestClassifier:
        try:
            model = RandomForestClassifier(n_estimators=100, random_state=42)
            model.fit(self.training_data["x_train"], self.training_data["y_train"])
        except Exception as e:
            raise Exception(f"Error in RandomForest: {str(e)}")
        score_dict = self.__GetScoreDict(model)

        return model, score_dict 
    
    def __LogisticRegression(self) -> LogisticRegression:

        model = LogisticRegression()
        model.fit(self.training_data["x_train"], self.training_data["y_train"])
        score_dict = self.__GetScoreDict(model)
        return model, score_dict

    def __XGBoost(self) -> XGBClassifier:

        model = XGBClassifier()
        model.fit(self.training_data["x_train"], self.training_data["y_train"])
        score_dict = self.__GetScoreDict(model)
        return model, score_dict
    
    def __GetScoreDict(self, model : object) -> dict:
        try:
            y_pred = model.predict(self.training_data["x_test"])
        except Exception as e:
            raise Exception(f"Error in prediction: {str(e)}")
        try:
            y_pred_proba = model.predict_proba(self.training_data["x_test"])
        except Exception as e:
            raise Exception(f"Error in predict_proba: {str(e)}")
        try:
            accuracy = accuracy_score(self.training_data["y_test"], y_pred)
        except Exception as e:
            raise Exception(f"Error in accuracy_score: {str(e)}")
        try:
            f1_score_ = f1_score(self.training_data["y_test"], y_pred   )
        except Exception as e:
            f1_score_ = f1_score(self.training_data["y_test"], y_pred, average="macro")
        try:
            precision = precision_score(self.training_data["y_test"], y_pred)
        except Exception as e:
            precision = precision_score(self.training_data["y_test"], y_pred, average="macro")
        try:
            recall = recall_score(self.training_data["y_test"], y_pred)
        except Exception as e:
            recall = recall_score(self.training_data["y_test"], y_pred, average="macro")
        score_dict = {"Accuracy" : f"{accuracy:.2f}",
                    "Precision" : f"{precision:.2f}",
                    "Recall" : f"{recall:.2f}",
                    "F1-Score" : f"{f1_score_:.2f}"
                    }
        return score_dict
    
    def FillEmptyValues(self) -> pd.DataFrame:

        columns_order = self.data.columns
        filled_data = self.data.copy()
        print(filled_data.info())
        predict_data = filled_data.drop(self.column_name, axis=1)
        categorical_cols = predict_data.select_dtypes(include=["object", "category"]).columns
        predict_data = pd.get_dummies(predict_data, columns=categorical_cols, drop_first=True)
        predict_data = predict_data[self.__columns]
        filled_data[f"{self.column_name}_new"] = self.model.predict(self.scaler.transform(predict_data))
        print(filled_data[f"{self.column_name}_new"].unique())
        print(filled_data.info())
        if self.label_encoder:
            filled_data[f"{self.column_name}_new"] = self.label_encoder.inverse_transform(filled_data[f"{self.column_name}_new"])
            print(filled_data.info())
            print(filled_data[f"{self.column_name}_new"].unique())
        filled_data[self.column_name] = np.where((filled_data[self.column_name].isnull()) | (filled_data[self.column_name].isna()) , filled_data[f"{self.column_name}_new"], filled_data[self.column_name])

        return filled_data[columns_order]




