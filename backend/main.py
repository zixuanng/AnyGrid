from fastapi import FastAPI, WebSocket
from fastapi.middleware.cors import CORSMiddleware
from simulation import GridSimulator
from services.gemini_service import analyze_grid_anomaly, provide_simulation_recommendation
from services.external_data import get_eia_data, get_ev_chargers
import asyncio
import json
from pydantic import BaseModel

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

simulator = GridSimulator()

@app.get("/")
def read_root():
    return {"status": "Grid System Online"}

@app.get("/chargers")
def get_chargers(lat: float = 40.7128, lon: float = -74.0060):
    data = get_ev_chargers(lat=lat, lon=lon)
    simulator.inject_chargers(data)
    return data

@app.get("/metrics")
def get_metrics():
    return simulator.update()

@app.get("/eia-context")
def get_eia_context():
    return get_eia_data()

@app.get("/ai-insight")
def get_ai_insight():
    state = simulator.update()
    summary = f"Load: {state.total_load:.2f}kW, Gen: {state.total_generation:.2f}kW, Efficiency: {state.efficiency:.2f}, Leak: {state.leak_detected}"
    if state.leak_detected:
        summary += " WARNING: LEAK DETECTED."
    
    analysis = analyze_grid_anomaly(summary)
    return {"analysis": analysis}

@app.post("/control/toggle/{node_id}")
def toggle_node(node_id: str):
    success = simulator.toggle_node(node_id)
    return {"success": success, "node_id": node_id}

@app.websocket("/ws")
async def websocket_endpoint(websocket: WebSocket):
    await websocket.accept()
    try:
        while True:
            # Run simulation tick
            state = simulator.update()
            # Serialize
            data = state.model_dump()
            await websocket.send_json(data)
            await asyncio.sleep(2) # 2 second tick
    except Exception as e:
        print(f"WebSocket closed: {e}")

class SimulationMetrics(BaseModel):
    ev_adoption_percent: int
    solar_adoption_percent: int
    battery_capacity_percent: int
    climate_stress_enabled: bool

@app.post("/simulation/analyze")
def analyze_simulation(metrics: SimulationMetrics):
    # Convert pydantic model to dict/string for the prompt
    metrics_dict = metrics.model_dump()
    result = provide_simulation_recommendation(json.dumps(metrics_dict))
    return result

