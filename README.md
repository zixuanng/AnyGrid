# AnyGrid ⚡

**AnyGrid** is a cinematic, state-of-the-art smart grid simulation and monitoring platform. It bridges the gap between real-world infrastructure data and dynamic energy modeling, providing a premium interface for visualizing the future of decentralized power.

## 🌟 Vision
AnyGrid aims to empower grid operators and city planners with AI-driven insights. By simulating real-time fluctuations and integrating live data from EV charging networks and solar potential APIs, it provides a holistic view of energy efficiency and security.

## 🚀 Features

### 📺 Cinematic Dashboard
- **Magazine-Style UI**: A bespoke, high-end design system built for visual impact.
- **Interactive Map**: Real-world geographical visualization of grid nodes using Leaflet.
- **Topological View**: Dynamic node-link diagrams powered by ReactFlow to visualize power distribution.
- **Live Analytics**: Real-time telemetry charts for Load vs. Generation using Recharts.

### 🧠 Intelligent Simulation
- **Dynamic Load Balancing**: Real-time simulation of residential, industrial, and commercial power consumption.
- **Renewable Integration**: Live solar potential data mapping from NREL/PVGIS.
- **EV Network Injection**: Real-time integration of EV charging stations via Open Charge Map API.
- **Anomaly Detection**: AI-powered leak and theft detection using **Google Gemini**.

### 🛠️ Technical Prowess
- **WebSockets**: Low-latency, real-time data streaming from the Python backend to the React frontend.
- **FastAPI Core**: A high-performance, asynchronous backend architecture.
- **Responsive Design**: Fully optimized for diverse screen sizes with Tailwind CSS and Framer Motion.

## 🏗️ Tech Stack

### Frontend
- **Framework**: React 19 (Vite)
- **Styling**: Tailwind CSS, Vanilla CSS
- **Animations**: Framer Motion
- **Visualization**: ReactFlow, Recharts, React-Leaflet
- **Networking**: Axios

### Backend
- **Core**: Python 3.10+
- **API**: FastAPI
- **Real-time**: WebSockets
- **AI**: Google Gemini API
- **Simulation**: Custom event-driven logic

## 🚦 Getting Started

### Prerequisites
- Python 3.10+
- Node.js 18+
- [Gemini API Key](https://aistudio.google.com/)

### Backend Setup
1. Navigate to the `backend` directory:
   ```bash
   cd backend
   ```
2. Create and activate a virtual environment:
   ```bash
   python -m venv .venv
   source .venv/bin/activate  # Windows: .venv\Scripts\activate
   ```
3. Install dependencies:
   ```bash
   pip install -r requirements.txt
   ```
4. Configure environment variables in a `.env` file:
   ```env
   GEMINI_API_KEY=your_api_key_here
   ```
5. Run the server:
   ```bash
   python main.py
   ```

### Frontend Setup
1. Navigate to the `frontend` directory:
   ```bash
   cd frontend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start the development server:
   ```bash
   npm run dev
   ```

## 📈 Roadmap
- [ ] **Climate Stress Modeling**: Simulating extreme weather impact on grid stability.
- [ ] **Predictive Maintenance**: Using ML to forecast equipment failure.
- [ ] **V2G Integration**: Vehicle-to-Grid simulation for EV battery buffering.
- [ ] **Distributed Ledger**: Blockchain-based peer-to-peer energy trading simulation.

---

Built with ❤️ by BrokadoX for HackUnited v6.
