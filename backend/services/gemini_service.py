import os
import google.generativeai as genai
from dotenv import load_dotenv

from pathlib import Path

# Explicitly load .env from the backend directory
current_dir = Path(__file__).resolve().parent
env_path = current_dir.parent / '.env'
load_dotenv(dotenv_path=env_path)

GEMINI_API_KEY = os.getenv("GEMINI_API_KEY")

if GEMINI_API_KEY:
    genai.configure(api_key=GEMINI_API_KEY)

def analyze_grid_anomaly(grid_state_summary):
    """
    Sends grid state summary to Gemini to explain anomalies.
    """
    if not GEMINI_API_KEY:
        return "Gemini API Key not configured."

    model = genai.GenerativeModel('gemini-2.5-flash') # Using a capable flash model as implied by user's key comment "gemini-2.5 flash" (mapped to available 2.0 or 1.5 flash)

    prompt = f"""
    You are an expert energy grid analyst.
    Analyze the following grid state summary where an anomaly might be present (e.g., leak, theft, outage).
    
    Grid State:
    {grid_state_summary}
    
    Provide a concise explanation of what might be happening and 1 recommendation.
    """
    
    try:
        response = model.generate_content(prompt)
        return response.text
    except Exception as e:
        return f"AI Analysis failed: {e}"

def suggest_optimization(grid_metrics):
    """
    Suggests optimizations based on grid metrics.
    """
    if not GEMINI_API_KEY:
        return "Gemini API Key not configured."
        
    model = genai.GenerativeModel('gemini-2.5-flash')

    prompt = f"""
    Based on these grid metrics, suggest one optimization to improve efficiency or reduce loss.
    
    Metrics:
    {grid_metrics}
    """
    
    try:
        response = model.generate_content(prompt)
        return response.text
    except Exception as e:
        return f"AI Suggestion failed: {e}"

def provide_simulation_recommendation(simulation_metrics):
    """
    Analyzes simulation results and provides strategic recommendations.
    """
    if not GEMINI_API_KEY:
        return {"recommendation": "Gemini API Key not configured.", "resilience_score": 0}

    model = genai.GenerativeModel('gemini-2.5-flash')

    prompt = f"""
    You are an urban energy planner.
    Analyze the following simulation results for a city grid transition:
    
    Simulation Metrics:
    {simulation_metrics}
    
    Provide:
    1. A Resilience Score (0-100) based on the balance of supply, demand, and storage.
    2. A strategic recommendation to improve the system's robustness against climate shocks.
    
    Format the output as JSON:
    {{
        "resilience_score": 85,
        "recommendation": "..."
    }}
    """
    
    try:
        response = model.generate_content(prompt)
        # Attempt to parse JSON from the response text
        import json
        text = response.text.replace("```json", "").replace("```", "").strip()
        return json.loads(text)
    except Exception as e:
        print(f"Error in Gemini simulation analysis: {e}")
        return {"resilience_score": 50, "recommendation": "Could not generate recommendation at this time."}

