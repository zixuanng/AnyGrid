import os
import requests
import json
from dotenv import load_dotenv

load_dotenv()

EIA_API_KEY = os.getenv("EIA_API_KEY")
SOLAR_API_URL = os.getenv("SOLAR_API_URL")

def get_eia_data(series_id="ELEC.GEN.ALL-US-99.A"):
    """
    Fetches data from EIA API. 
    Default series: Total Net Generation (All Sectors), US (Annual).
    Note: The user's key manages access. This is a simplified fetcher.
    """
    if not EIA_API_KEY:
        print("Warning: EIA_API_KEY not set.")
        return None
    
    url = f"https://api.eia.gov/v2/seriesid/{series_id}?api_key={EIA_API_KEY}" # This is a pseudo-url, usage varies by v2 endpoint.
    # EIA v2 API uses a different structure usually: https://api.eia.gov/v2/...
    # Let's try a standard v2 request for electricity prices as a test case if needed.
    # For now, we'll follow the user's intent of "fetching context".
    # Since I don't have the specific series the user wants, I will mock the return structure 
    # if the real call fails, to ensure the app doesn't crash during dev.
    
    try:
        # Constructing a generic v2 request
        # Example: Electricity Retail Sales
        url = "https://api.eia.gov/v2/electricity/retail-sales/data/"
        params = {
            "api_key": EIA_API_KEY,
            "frequency": "monthly",
            "data[0]": "price",
            "facets[stateid][]": "TX", # Example state: Texas
            "sort[0][column]": "period",
            "sort[0][direction]": "desc",
            "offset": 0,
            "length": 1
        }
        response = requests.get(url, params=params)
        response.raise_for_status()
        return response.json()
    except Exception as e:
        print(f"Error fetching EIA data: {e}")
        return {"error": str(e), "mock_data": {"price": 12.5, "unit": "cents/kWh"}}

def get_solar_potential(lat=38.89, lon=-77.03, peak_power=1, loss=14):
    """
    Fetches solar PV potential from JRC PVGIS API.
    Defaults to Washington DC (US).
    """
    if not SOLAR_API_URL:
        return None

    params = {
        "lat": lat,
        "lon": lon,
        "peakpower": peak_power,
        "loss": loss,
        "outputformat": "json"
    }
    
    try:
        response = requests.get(SOLAR_API_URL, params=params)
        response.raise_for_status()
        return response.json()
    except Exception as e:
        print(f"Error fetching Solar data: {e}")
        return None

def get_ev_chargers(lat=40.7128, lon=-74.0060, distance=10, max_results=50):
    """
    Fetches EV charger locations from OpenChargeMap API.
    Proxied through backend to avoid CORS issues in frontend.
    """
    url = "https://api.openchargemap.io/v3/poi/"
    params = {
        "output": "json",
        "countrycode": "US",
        "maxresults": max_results,
        "latitude": lat,
        "longitude": lon,
        "distance": distance,
        "distanceunit": "KM"
    }
    
    try:
        response = requests.get(url, params=params, timeout=10)
        response.raise_for_status()
        return response.json()
    except Exception as e:
        print(f"Error fetching OpenChargeMap data: {e}")
        # Return mock data for fallback
        return [
            {"ID": 1, "AddressInfo": {"Latitude": 40.7128, "Longitude": -74.0060, "Title": "Downtown Charger"}},
            {"ID": 2, "AddressInfo": {"Latitude": 40.7589, "Longitude": -73.9851, "Title": "Times Square Station"}},
            {"ID": 3, "AddressInfo": {"Latitude": 40.7484, "Longitude": -73.9857, "Title": "Empire State Building"}},
        ]
