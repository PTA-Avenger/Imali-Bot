import uvicorn
from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
import json
import torch
from transformers import AutoModelForCausalLM, AutoTokenizer, pipeline

# --- CONFIGURATION ---
MODEL_ID = "Qwen/Qwen2.5-1.5B-Instruct"
PLAYBOOK_PATH = "datasets/trm_playbook_evolved.json" # Point to your NEW evolved playbook

# --- INITIALIZATION ---
print("🚀 Loading TRM-Ace Model Server...")

# 1. Load the Playbook (The Brain)
try:
    with open(PLAYBOOK_PATH, 'r') as f:
        playbook = json.load(f)
    print(f"✅ Loaded Playbook with {len(playbook)} strategies.")
except FileNotFoundError:
    print(f"⚠️  Evolved playbook not found at {PLAYBOOK_PATH}. Loading seed...")
    with open("datasets/trm_playbook_seed.json", 'r') as f:
        playbook = json.load(f)

# 2. Load the Model (The Engine)
tokenizer = AutoTokenizer.from_pretrained(MODEL_ID)
model = AutoModelForCausalLM.from_pretrained(
    MODEL_ID, 
    torch_dtype=torch.float16, 
    device_map="auto" # Use GPU if available
)

pipe = pipeline(
    "text-generation",
    model=model,
    tokenizer=tokenizer,
    max_new_tokens=256,
    temperature=0.7,
    do_sample=True,
)

# --- APP LOGIC ---
app = FastAPI()

class QueryRequest(BaseModel):
    query: str
    history: list = []

def retrieve_context(user_query):
    """
    Retrieves the most relevant strategies from the Playbook.
    """
    context_entries = []
    query_lower = user_query.lower()
    
    # Basic keyword matching (Upgrade to Vector DB like FAISS for production)
    for entry in playbook:
        # Match topic or content keywords
        if entry['topic'].lower() in query_lower or \
           any(word in query_lower for word in entry['content'].split()[:5]):
            context_entries.append(f"- [{entry['topic']}]: {entry['heuristic']}")
            
    if not context_entries:
        return ["- [General Financial]: Ensure all transactions comply with local tax (SARS) and IFRS standards."]
        
    return context_entries[:3] # Limit context window usage

@app.post("/predict")
async def generate_response(request: QueryRequest):
    """
    Main endpoint for the Node.js backend to call.
    """
    try:
        # 1. RAG Step
        context = retrieve_context(request.query)
        
        # 2. Prompt Construction
        system_prompt = f"""You are Imali-Bot, an expert financial assistant.
        
        CURRENT PLAYBOOK STRATEGIES (Use these to answer):
        {chr(10).join(context)}
        
        INSTRUCTIONS:
        - Analyze the user query using the strategies above.
        - Be concise and professional.
        - If the query is about fraud or anomalies, explain WHY based on the heuristics.
        """
        
        messages = [
            {"role": "system", "content": system_prompt},
            {"role": "user", "content": request.query}
        ]
        
        # 3. Inference
        prompt = tokenizer.apply_chat_template(messages, tokenize=False, add_generation_prompt=True)
        outputs = pipe(prompt)
        
        # 4. Parsing
        full_text = outputs[0]['generated_text']
        response_text = full_text.split(prompt)[-1].strip()
        
        return {
            "response": response_text,
            "strategies_used": [c.split(':')[0] for c in context] # Return metadata for the UI
        }

    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/health")
def health_check():
    return {"status": "online", "model": MODEL_ID}

if __name__ == "__main__":
    # Run on port 8000
    uvicorn.run(app, host="0.0.0.0", port=8000)