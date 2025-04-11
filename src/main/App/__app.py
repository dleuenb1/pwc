

from main.AI.large_language_model import GetTheBestModel
from main.AI.machine_learning_models import MLModel

from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
from typing import Dict, Any
import pandas as pd
from dotenv import load_dotenv
import json
import os

load_dotenv()
api_key = os.getenv("OPENAI_KEY")
mode_id = os.getenv("MODEL_ID")
print(mode_id)

app = FastAPI()

class InputData(BaseModel):
    column: str
    data: Dict[str, Dict[str, Any]]

@app.post("/analyze/")
async def analyze(request_: InputData):
    print(request_.column)
    try:
        best_model_dict = GetTheBestModel(api_key, mode_id, request_.data, request_.column)
    except Exception as e:
        raise HTTPException(status_code=404, detail=f"Error in GetTheBestModel: {str(e)}")
    print(best_model_dict)
    print(type(best_model_dict))
    print([i for i in best_model_dict.keys()])

    try:
        best_model = best_model_dict.get('BestModel')
        print(f"best_model= {best_model}")
        if not best_model:
            raise HTTPException(status_code=404, detail=f"Can't find the best model : 1")
        best_model = best_model.strip().lower()
    except:
        raise HTTPException(status_code=404, detail=f"Can't find the best model : 2")
    
    if not best_model:
        raise HTTPException(status_code=404, detail="Can't find the best model")
    
    try:
        dataframe = pd.DataFrame.from_dict(request_.data, orient="index")
        print("dataframe_columns")
        print(dataframe.columns)
        model__ = MLModel(dataframe, request_.column.replace("'",""), best_model)
        predicted_dataframe = model__.FillEmptyValues()
    except Exception as e:
        raise HTTPException(status_code=404, detail=str(e))
    
    return_dict = {
        "LLM_BestModel": best_model_dict,
        "Model_Metrics": model__.score_metrics,
        "Predicted_Data": predicted_dataframe.to_dict(orient="index")
        }
    return return_dict
if __name__ == "__main__":
    import uvicorn
    # Zmien "nazwa_pliku" na nazwę swojego pliku .py bez rozszerzenia
    print("Server is running")
    uvicorn.run("__app:app", host="0.0.0.0", port=8000, reload=True)
# Run the server with the following command: