from pydantic import BaseModel
from typing import List, Optional, Literal

class Node(BaseModel):
    id: str
    type: Literal["source", "consumer", "storage"]
    name: str
    voltage: float = 0.0 # kV
    load: float = 0.0 # kW (for consumers)
    generation: float = 0.0 # kW (for sources)
    status: Literal["active", "inactive", "fault"] = "active"
    lat: Optional[float] = None
    lon: Optional[float] = None

class Link(BaseModel):
    id: str
    source_id: str
    target_id: str
    capacity: float # kW limit
    current_load: float = 0.0
    status: Literal["active", "broken"] = "active"

class GridState(BaseModel):
    nodes: List[Node]
    links: List[Link]
    total_load: float
    total_generation: float
    efficiency: float
    leak_detected: bool
    timestamp: float
