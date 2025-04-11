import openai
import os
from dotenv import load_dotenv
import json
import pandas as pd


load_dotenv()
api_key = os.getenv("OPENAI_KEY")
mode_id = os.getenv("MODEL_ID")
print(mode_id)
def GetTheBestModel(key, model_id, json_data : dict, column :str):
    
    prompt = f"Analyze the file and find the best classification model with the highest score to fill empty values in the column {column}."
    
    temp_df = pd.DataFrame.from_dict(json_data, orient="index")[:1000]
    print(temp_df.head())
    temp_path = os.path.join(os.getcwd(), "temp", "temp.csv")
    temp_df.to_csv(temp_path , index=False)
    with open(temp_path , "r") as file:
        file_content = file.read()

    system_prompt = """You are a system that analyzes data calculate metrics for  classification model from the XGBoost, RandomForest, LogisticRegression.
    Return only json format with best classification model, Accuracy, Precision,Recall,F1-Score without ```json The structure of the json should be {"BestModel" :,Accuracy: , Precision: ,Recall: ,F1-Score: }"""
    user_prompt = f"{prompt}\nHere is the data:\n{file_content}"

    client = openai.Client(api_key=key)
    response = client.chat.completions.create(
        model = model_id,
        messages = [
            {"role": "system", "content": system_prompt},
            {"role": "user", "content": user_prompt}
        ]
    )
    return_value = response.choices[0].message.content
    return json.loads(return_value)




if __name__ == "__main__":


    with open("heart.json", "r") as file:
        data = json.load(file)

    test = GetTheBestModel(api_key, mode_id, data, "HeartDisease")

    print(test)
