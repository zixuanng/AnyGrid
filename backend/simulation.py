import random
import time
from models import GridState, Node, Link
from services.external_data import get_solar_potential

class GridSimulator:
    def __init__(self):
        self.nodes = [
            Node(id="gen1", type="source", name="Main Power Plant", generation=1000.0, lat=38.9, lon=-77.0),
            Node(id="sol1", type="source", name="Solar Farm A", generation=0.0, lat=38.95, lon=-77.05),
            Node(id="cons1", type="consumer", name="Residential District", load=200.0),
            Node(id="cons2", type="consumer", name="Industrial Zone", load=500.0),
            Node(id="cons3", type="consumer", name="Commercial Hub", load=150.0),
        ]
        self.links = [
            Link(id="l1", source_id="gen1", target_id="cons1", capacity=1000),
            Link(id="l2", source_id="gen1", target_id="cons2", capacity=1000),
            Link(id="l3", source_id="gen1", target_id="cons3", capacity=1000),
            Link(id="l4", source_id="sol1", target_id="cons1", capacity=500),
        ]
        # Fetch solar potential once for base calculation (in a real app, this might be dynamic)
        self.solar_potential = 0.0
        self._init_solar()

    def _init_solar(self):
        try:
            # Using sol1 coordinates
            data = get_solar_potential(lat=38.95, lon=-77.05)
            if data and 'outputs' in data:
                 # Simplified: take monthly average or similar. 
                 # PVGIS returns 'outputs.monthly' usually.
                 # Let's just mock a 'potential' factor if structure is complex
                 self.solar_potential = 500.0 # Base potential kW
        except:
            self.solar_potential = 300.0

    def update(self):
        """
        Advances simulation by one tick.
        """
        # 1. Update Loads (random fluctuation)
        total_load = 0.0
        for node in self.nodes:
            if node.type == "consumer" and node.status == "active":
                variation = random.uniform(0.9, 1.1)
                node.load = node.load * variation
                # Clamp load
                node.load = max(50, min(800, node.load)) 
                total_load += node.load
        
        # 2. Update Solar Generation (simulating day/night cycle purely by time is hard without loop, 
        # so we just fluctuate it)
        solar_node = next((n for n in self.nodes if n.id == "sol1"), None)
        if solar_node and solar_node.status == "active":
            solar_node.generation = self.solar_potential * random.uniform(0.0, 1.0) # Day/cloud variance

        # 3. Supply matching
        main_gen = next(n for n in self.nodes if n.id == "gen1")
        # Main gen picks up the slack
        needed_from_main = total_load - (solar_node.generation if solar_node else 0)
        main_gen.generation = max(0, needed_from_main)

        # 4. Leak Detection
        # Simulate technical loss (resistance)
        expected_loss = total_load * 0.05 # 5% technical loss
        total_generation = main_gen.generation + (solar_node.generation if solar_node else 0)
        
        # If generation is significantly higher than load + expected loss, we have a leak/theft
        # Let's introduce a random "theft" event occasionally
        if random.random() > 0.95:
             # Discrepancy!
             leak_amount = 50.0 # 50kW stolen
             # In a real physical sim, generation would spike to cover it, but measured load wouldn't matching
             # Here we just flag it
             total_generation += leak_amount 

        actual_loss = total_generation - total_load
        leak_detected = actual_loss > (expected_loss * 1.5) # Threshold

        return GridState(
            nodes=self.nodes,
            links=self.links,
            total_load=total_load,
            total_generation=total_generation,
            efficiency=(total_load / total_generation) if total_generation > 0 else 0,
            leak_detected=leak_detected,
            timestamp=time.time()
        )

    def toggle_node(self, node_id: str):
        for node in self.nodes:
            if node.id == node_id:
                node.status = "inactive" if node.status == "active" else "active"
                return True
        return False

    def inject_chargers(self, chargers_data: list):
        """
        Injects real-world charger data as nodes into the simulation.
        """
        count = 0
        for charger in chargers_data:
            c_id = f"ev_{charger.get('ID')}"
            
            # Check if exists
            if any(n.id == c_id for n in self.nodes):
                continue
                
            info = charger.get('AddressInfo', {})
            lat = info.get('Latitude', 0.0)
            lon = info.get('Longitude', 0.0)
            title = info.get('Title', 'Unknown Charger')
            
            # Create Node
            new_node = Node(
                id=c_id,
                type="consumer",
                name=f"EV: {title}",
                load=random.uniform(20.0, 80.0), # Random load for simulation
                lat=lat,
                lon=lon
            )
            self.nodes.append(new_node)
            
            # Link to Main Gen (simplified topology)
            new_link = Link(
                id=f"link_{c_id}",
                source_id="gen1",
                target_id=c_id,
                capacity=200
            )
            self.links.append(new_link)
            count += 1
            
        return count
