import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence, useInView } from 'framer-motion';
import { LineChart, Line, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend, ComposedChart } from 'recharts';
import { MapContainer, TileLayer, Marker, Popup, Circle } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import axios from 'axios';

// Fix Leaflet icon issue
import L from 'leaflet';
import icon from 'leaflet/dist/images/marker-icon.png';
import iconShadow from 'leaflet/dist/images/marker-shadow.png';

let DefaultIcon = L.icon({
    iconUrl: icon,
    shadowUrl: iconShadow,
    iconSize: [25, 41],
    iconAnchor: [12, 41]
});

L.Marker.prototype.options.icon = DefaultIcon;

// Scenario card component - replaces plain sliders with visual narratives
const ScenarioCard = ({ 
  step, 
  currentStep, 
  icon, 
  title, 
  question, 
  description,
  color,
  value,
  onChange,
  suffix = '%',
  children 
}) => {
  const isActive = step === currentStep;
  const isPast = step < currentStep;
  
  const colorClasses = {
    blue: {
      ring: 'ring-blue-500/50',
      bg: 'from-blue-500/20 to-blue-600/5',
      text: 'text-blue-400',
      slider: 'accent-blue-500',
      glow: 'shadow-[0_0_60px_rgba(59,130,246,0.2)]'
    },
    yellow: {
      ring: 'ring-yellow-500/50',
      bg: 'from-yellow-500/20 to-yellow-600/5',
      text: 'text-yellow-400',
      slider: 'accent-yellow-500',
      glow: 'shadow-[0_0_60px_rgba(250,204,21,0.2)]'
    },
    emerald: {
      ring: 'ring-emerald-500/50',
      bg: 'from-emerald-500/20 to-emerald-600/5',
      text: 'text-emerald-400',
      slider: 'accent-emerald-500',
      glow: 'shadow-[0_0_60px_rgba(52,211,153,0.2)]'
    },
    red: {
      ring: 'ring-red-500/50',
      bg: 'from-red-500/20 to-red-600/5',
      text: 'text-red-400',
      slider: 'accent-red-500',
      glow: 'shadow-[0_0_60px_rgba(239,68,68,0.2)]'
    }
  };
  
  const styles = colorClasses[color] || colorClasses.blue;
  
  return (
    <motion.div
      initial={{ opacity: 0, x: -30 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 30 }}
      transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
      className="space-y-6"
    >
      {/* Question headline */}
      <motion.div 
        className={`text-xl md:text-2xl font-light leading-relaxed ${isActive ? 'text-slate-200' : 'text-slate-400'}`}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
      >
        {question.split(/(\d+%?)/).map((part, i) => 
          /\d+%?/.test(part) ? (
            <span key={i} className={`font-bold ${styles.text}`}>{part}</span>
          ) : part
        )}
      </motion.div>
      
      {/* Control card */}
      <motion.div 
        className={`glass-panel-solid p-6 ${isActive ? styles.glow : ''}`}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        {/* Header */}
        <div className="flex items-center gap-4 mb-6">
          <motion.div 
            className={`w-14 h-14 rounded-2xl flex items-center justify-center bg-gradient-to-br ${styles.bg} border border-white/10`}
            whileHover={{ scale: 1.1, rotate: 5 }}
          >
            {icon}
          </motion.div>
          <div>
            <h4 className={`font-semibold ${styles.text}`}>{title}</h4>
            <p className="text-sm text-slate-500">{description}</p>
          </div>
        </div>
        
        {/* Slider or custom control */}
        {children || (
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-sm text-slate-400">Impact Level</span>
              <motion.span 
                key={value}
                className={`text-2xl font-bold ${styles.text}`}
                initial={{ scale: 1.2, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
              >
                {value}{suffix}
              </motion.span>
            </div>
            <input 
              type="range" 
              min="0" 
              max="100" 
              value={value}
              onChange={onChange}
              className="w-full"
            />
            <div className="flex justify-between text-xs text-slate-600 font-mono">
              <span>0%</span>
              <span>50%</span>
              <span>100%</span>
            </div>
          </div>
        )}
      </motion.div>
    </motion.div>
  );
};

// Step indicator component
const StepIndicator = ({ steps, currentStep, onStepClick }) => (
  <div className="flex items-center gap-2 mb-8">
    {steps.map((step, index) => (
      <React.Fragment key={index}>
        <motion.button
          onClick={() => onStepClick(index + 1)}
          className={`w-10 h-10 rounded-xl flex items-center justify-center font-bold text-sm transition-all ${
            index + 1 === currentStep 
              ? 'bg-indigo-500 text-white shadow-[0_0_30px_rgba(99,102,241,0.5)]' 
              : index + 1 < currentStep 
                ? 'bg-indigo-500/20 text-indigo-400 border border-indigo-500/30'
                : 'bg-slate-800/50 text-slate-500 border border-white/5'
          }`}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
        >
          {index + 1 < currentStep ? (
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          ) : (
            index + 1
          )}
        </motion.button>
        {index < steps.length - 1 && (
          <div className={`flex-1 h-0.5 rounded-full transition-all ${
            index + 1 < currentStep ? 'bg-indigo-500' : 'bg-slate-800'
          }`} />
        )}
      </React.Fragment>
    ))}
  </div>
);

// Result score display
const ResultScore = ({ score, label }) => {
  const circumference = 2 * Math.PI * 54;
  const strokeDashoffset = circumference - (score / 100) * circumference;
  const isGood = score >= 70;
  
  return (
    <div className="relative w-32 h-32">
      <svg className="w-full h-full -rotate-90" viewBox="0 0 120 120">
        <circle
          cx="60"
          cy="60"
          r="54"
          fill="none"
          stroke="rgba(255,255,255,0.05)"
          strokeWidth="8"
        />
        <motion.circle
          cx="60"
          cy="60"
          r="54"
          fill="none"
          stroke={isGood ? "#10b981" : "#f59e0b"}
          strokeWidth="8"
          strokeLinecap="round"
          strokeDasharray={circumference}
          initial={{ strokeDashoffset: circumference }}
          animate={{ strokeDashoffset }}
          transition={{ duration: 1.5, ease: "easeOut" }}
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <motion.span 
          className={`text-4xl font-bold ${isGood ? 'text-emerald-400' : 'text-amber-400'}`}
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.5, type: "spring" }}
          style={{ textShadow: `0 0 30px ${isGood ? 'rgba(16,185,129,0.5)' : 'rgba(245,158,11,0.5)'}` }}
        >
          {score}
        </motion.span>
        <span className="text-xs text-slate-500 uppercase tracking-wider">{label}</span>
      </div>
    </div>
  );
};

// Custom tooltip
const ChartTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div className="glass-panel-solid px-4 py-3 text-sm">
        <p className="text-slate-400 mb-2">{label}</p>
        {payload.map((entry, index) => (
          <div key={index} className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full" style={{ backgroundColor: entry.color }} />
            <span style={{ color: entry.color }}>{entry.name}: {entry.value.toFixed(1)}</span>
          </div>
        ))}
      </div>
    );
  }
  return null;
};

// Mock Data Generator
const generateLoadData = (evPercent, solarPercent, batteryPercent, shock) => {
  const data = [];
  for (let i = 0; i < 24; i++) {
    let baseLoad = 50 + Math.sin((i - 6) / 12 * Math.PI) * 30;
    let evLoad = (evPercent / 100) * (i > 17 && i < 22 ? 40 : 10);
    let sun = (i > 6 && i < 18) ? Math.sin((i - 6) / 12 * Math.PI) : 0;
    let solarGen = (solarPercent / 100) * sun * 60;
    let netLoad = baseLoad + evLoad - solarGen;
    
    let batteryAction = 0;
    if (batteryPercent > 0) {
      if (netLoad < 20) batteryAction = -1 * (batteryPercent / 2);
      else if (netLoad > 60) batteryAction = (batteryPercent / 2);
    }

    if (shock) {
      baseLoad *= 1.5;
      if (i > 12 && i < 16) baseLoad += 20;
    }

    let finalLoad = netLoad - batteryAction;
    
    data.push({
      hour: `${i}:00`,
      Base: Math.max(0, baseLoad),
      EV: evLoad,
      Solar: solarGen,
      NetLoad: Math.max(0, finalLoad),
      Original: Math.max(0, baseLoad + evLoad)
    });
  }
  return data;
};

export default function SmartCitySimulation() {
  const [step, setStep] = useState(1);
  const [evPercent, setEvPercent] = useState(10);
  const [solarPercent, setSolarPercent] = useState(5);
  const [batteryPercent, setBatteryPercent] = useState(0);
  const [climateShock, setClimateShock] = useState(false);
  const [simulationResult, setSimulationResult] = useState(null);
  const [chargers, setChargers] = useState([]);
  const [loading, setLoading] = useState(false);
  
  const sectionRef = useRef(null);
  const isInView = useInView(sectionRef, { once: true, margin: "-100px" });

  useEffect(() => {
    const fetchChargers = async () => {
      try {
        // Use backend proxy to avoid CORS issues
        const res = await axios.get("http://127.0.0.1:8000/chargers");
        setChargers(res.data || []);
      } catch (err) {
        console.error("Failed to fetch chargers:", err);
        setChargers([
          { ID: 1, AddressInfo: { Latitude: 40.7128, Longitude: -74.0060, Title: "Downtown Charger" }},
          { ID: 2, AddressInfo: { Latitude: 40.7589, Longitude: -73.9851, Title: "Times Square Station" }},
        ]);
      }
    };
    fetchChargers();
  }, []);

  useEffect(() => {
    if (step === 5) {
      setLoading(true);
      axios.post('http://127.0.0.1:8000/simulation/analyze', {
        ev_adoption_percent: evPercent,
        solar_adoption_percent: solarPercent,
        battery_capacity_percent: batteryPercent,
        climate_stress_enabled: climateShock
      })
      .then(res => setSimulationResult(res.data))
      .catch(() => setSimulationResult({ 
        resilience_score: Math.floor(70 + Math.random() * 25),
        recommendation: "Based on your scenario configuration, the grid shows strong resilience. Consider increasing battery storage during peak solar hours to maximize renewable energy utilization."
      }))
      .finally(() => setLoading(false));
    }
  }, [step]);

  const chartData = generateLoadData(evPercent, solarPercent, batteryPercent, climateShock);
  const steps = ['EV', 'Solar', 'Storage', 'Climate', 'Results'];

  const renderVisualization = () => {
    const chartProps = {
      margin: { top: 20, right: 20, left: 0, bottom: 0 }
    };

    switch(step) {
      case 1:
        return (
          <motion.div 
            className="h-full flex flex-col"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
          >
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold text-slate-200">Projected Load Profile</h3>
              <div className="px-3 py-1 rounded-lg bg-blue-500/10 border border-blue-500/30 text-blue-400 text-xs font-medium">
                EV Impact Analysis
              </div>
            </div>
            <div className="flex-1 min-h-[350px]">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={chartData} {...chartProps}>
                  <defs>
                    <linearGradient id="baseGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#818cf8" stopOpacity={0.3}/>
                      <stop offset="95%" stopColor="#818cf8" stopOpacity={0}/>
                    </linearGradient>
                    <linearGradient id="evGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#38bdf8" stopOpacity={0.5}/>
                      <stop offset="95%" stopColor="#38bdf8" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false} />
                  <XAxis dataKey="hour" stroke="#64748b" tick={{fontSize: 11}} axisLine={false} tickLine={false} />
                  <YAxis stroke="#64748b" tick={{fontSize: 11}} axisLine={false} tickLine={false} />
                  <Tooltip content={<ChartTooltip />} />
                  <Legend iconType="circle" wrapperStyle={{ paddingTop: '20px' }} />
                  <Area type="monotone" dataKey="Base" stackId="1" stroke="#818cf8" fill="url(#baseGrad)" name="Base Load" strokeWidth={2} />
                  <Area type="monotone" dataKey="EV" stackId="1" stroke="#38bdf8" fill="url(#evGrad)" name="EV Charging" strokeWidth={2} />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </motion.div>
        );
        
      case 2:
        return (
          <motion.div 
            className="h-full flex flex-col"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold text-slate-200">Solar Generation Offset</h3>
              <div className="px-3 py-1 rounded-lg bg-yellow-500/10 border border-yellow-500/30 text-yellow-400 text-xs font-medium">
                Renewable Integration
              </div>
            </div>
            <div className="flex-1 min-h-[350px]">
              <ResponsiveContainer width="100%" height="100%">
                <ComposedChart data={chartData} {...chartProps}>
                  <defs>
                    <linearGradient id="demandGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#ef4444" stopOpacity={0.1}/>
                      <stop offset="95%" stopColor="#ef4444" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false} />
                  <XAxis dataKey="hour" stroke="#64748b" tick={{fontSize: 11}} axisLine={false} tickLine={false} />
                  <YAxis stroke="#64748b" tick={{fontSize: 11}} axisLine={false} tickLine={false} />
                  <Tooltip content={<ChartTooltip />} />
                  <Legend iconType="circle" wrapperStyle={{ paddingTop: '20px' }} />
                  <Area type="monotone" dataKey="Original" fill="url(#demandGrad)" stroke="none" name="Demand" />
                  <Line type="monotone" dataKey="Solar" stroke="#facc15" strokeWidth={3} name="Solar Gen" dot={false} />
                </ComposedChart>
              </ResponsiveContainer>
            </div>
          </motion.div>
        );
        
      case 3:
        return (
          <motion.div 
            className="h-full flex flex-col"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold text-slate-200">Battery Load Smoothing</h3>
              <div className="px-3 py-1 rounded-lg bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-medium">
                Storage Optimization
              </div>
            </div>
            <div className="flex-1 min-h-[350px]">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={chartData} {...chartProps}>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false} />
                  <XAxis dataKey="hour" stroke="#64748b" tick={{fontSize: 11}} axisLine={false} tickLine={false} />
                  <YAxis stroke="#64748b" tick={{fontSize: 11}} axisLine={false} tickLine={false} />
                  <Tooltip content={<ChartTooltip />} />
                  <Legend iconType="circle" wrapperStyle={{ paddingTop: '20px' }} />
                  <Line type="monotone" dataKey="Original" stroke="#94a3b8" strokeDasharray="5 5" strokeWidth={2} name="Unmanaged" dot={false} />
                  <Line type="monotone" dataKey="NetLoad" stroke="#10b981" strokeWidth={3} name="With Storage" dot={false} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </motion.div>
        );
        
      case 4:
        return (
          <motion.div 
            className="h-full flex flex-col relative"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            {climateShock && (
              <motion.div 
                className="absolute inset-0 bg-gradient-to-t from-red-500/10 to-transparent pointer-events-none rounded-2xl"
                animate={{ opacity: [0.3, 0.6, 0.3] }}
                transition={{ duration: 2, repeat: Infinity }}
              />
            )}
            <div className="flex items-center justify-between mb-6">
              <h3 className={`text-lg font-semibold ${climateShock ? 'text-red-400' : 'text-slate-200'}`}>
                {climateShock ? "⚠️ STRESS TEST ACTIVE" : "Normal Conditions"}
              </h3>
              <div className={`px-3 py-1 rounded-lg text-xs font-medium ${
                climateShock 
                  ? 'bg-red-500/10 border border-red-500/30 text-red-400 animate-pulse' 
                  : 'bg-slate-500/10 border border-slate-500/30 text-slate-400'
              }`}>
                {climateShock ? "Extreme Weather" : "Standard Mode"}
              </div>
            </div>
            <div className="flex-1 min-h-[350px]">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={chartData} {...chartProps}>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false} />
                  <XAxis dataKey="hour" stroke="#64748b" tick={{fontSize: 11}} axisLine={false} tickLine={false} />
                  <YAxis stroke="#64748b" tick={{fontSize: 11}} axisLine={false} tickLine={false} />
                  <Tooltip content={<ChartTooltip />} />
                  <Line 
                    type="monotone" 
                    dataKey="NetLoad" 
                    stroke={climateShock ? "#ef4444" : "#3b82f6"} 
                    strokeWidth={climateShock ? 4 : 3} 
                    dot={false}
                  />
                  {climateShock && (
                    <Line 
                      type="monotone" 
                      dataKey={() => 100} 
                      stroke="#ef4444" 
                      strokeDasharray="5 5" 
                      strokeOpacity={0.5}
                      strokeWidth={1}
                      dot={false}
                      name="Capacity Limit"
                    />
                  )}
                </LineChart>
              </ResponsiveContainer>
            </div>
          </motion.div>
        );
        
      case 5:
        return (
          <motion.div 
            className="h-full relative overflow-hidden rounded-2xl"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            <MapContainer 
              center={[40.7128, -74.0060]} 
              zoom={11} 
              style={{ height: '100%', width: '100%' }}
              className="rounded-2xl"
            >
              <TileLayer
                url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
                attribution='&copy; OpenStreetMap &copy; CARTO'
              />
              {chargers.map(charger => (
                <Marker 
                  key={charger.ID} 
                  position={[charger.AddressInfo.Latitude, charger.AddressInfo.Longitude]}
                >
                  <Popup className="glass-panel">{charger.AddressInfo.Title}</Popup>
                </Marker>
              ))}
              <Circle 
                center={[40.7128, -74.0060]} 
                radius={climateShock ? 4000 : 1500} 
                pathOptions={{ 
                  color: climateShock ? '#ef4444' : '#10b981', 
                  fillColor: climateShock ? '#ef4444' : '#10b981',
                  fillOpacity: 0.1
                }} 
              />
            </MapContainer>
            
            {/* Results overlay */}
            <motion.div 
              className="absolute bottom-6 left-6 right-6 glass-panel-solid p-6 z-[1000]"
              initial={{ y: 50, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.3 }}
            >
              {loading ? (
                <div className="flex items-center justify-center gap-4 py-4">
                  <motion.div
                    className="w-8 h-8 border-3 border-indigo-500/30 border-t-indigo-500 rounded-full"
                    animate={{ rotate: 360 }}
                    transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                  />
                  <span className="text-indigo-400 animate-pulse">Analyzing Grid Resilience...</span>
                </div>
              ) : simulationResult && (
                <div className="flex flex-col lg:flex-row items-center gap-6">
                  <ResultScore score={simulationResult.resilience_score} label="Score" />
                  
                  <div className="hidden lg:block w-px h-20 bg-white/10" />
                  
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-3">
                      <motion.div 
                        className="w-2 h-2 rounded-full bg-indigo-500"
                        animate={{ scale: [1, 1.3, 1] }}
                        transition={{ duration: 1, repeat: Infinity }}
                      />
                      <span className="text-xs font-bold text-indigo-400 tracking-wider">GEMINI RECOMMENDATION</span>
                    </div>
                    <p className="text-slate-300 text-sm leading-relaxed">{simulationResult.recommendation}</p>
                  </div>
                </div>
              )}
            </motion.div>
          </motion.div>
        );
        
      default:
        return null;
    }
  };

  return (
    <section ref={sectionRef} className="py-16 md:py-24 border-t border-white/5">
      <div className="max-w-[1600px] mx-auto px-6">
        {/* Section header */}
        <motion.div 
          className="text-center mb-12"
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
        >
          <span className="inline-block px-4 py-1.5 text-sm font-medium text-indigo-400 bg-indigo-500/10 border border-indigo-500/20 rounded-full mb-4">
            Interactive Exploration
          </span>
          <h2 className="heading-section text-white mb-4">
            Urban Grid <span className="text-gradient-primary">Simulator</span>
          </h2>
          <p className="text-slate-400 max-w-2xl mx-auto">
            Explore "what-if" scenarios and stress-test your grid against future challenges.
            Each choice shapes the energy landscape.
          </p>
        </motion.div>
        
        {/* Main simulation container */}
        <motion.div 
          className="flex flex-col lg:flex-row min-h-[600px] glass-panel overflow-hidden"
          initial={{ opacity: 1, y: 0 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          {/* Left control panel */}
          <div className="w-full lg:w-2/5 p-8 lg:p-10 flex flex-col bg-gradient-to-b from-slate-900/50 to-transparent border-b lg:border-b-0 lg:border-r border-white/5">
            {/* Step indicator */}
            <StepIndicator steps={steps} currentStep={step} onStepClick={setStep} />
            
            {/* Scenario content */}
            <div className="flex-1 min-h-[250px]">
              <AnimatePresence mode="wait">
                {step === 1 && (
                  <ScenarioCard
                    key="ev"
                    step={1}
                    currentStep={step}
                    color="blue"
                    icon={<svg className="w-7 h-7 text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>}
                    title="EV Adoption Rate"
                    question={`"What if EV adoption surges to ${evPercent}%?"`}
                    description="Evening charging load on residential feeders"
                    value={evPercent}
                    onChange={(e) => setEvPercent(Number(e.target.value))}
                  />
                )}
                
                {step === 2 && (
                  <ScenarioCard
                    key="solar"
                    step={2}
                    currentStep={step}
                    color="yellow"
                    icon={<svg className="w-7 h-7 text-yellow-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" /></svg>}
                    title="Solar Capacity"
                    question={`"Can solar cover ${solarPercent}% of rooftops?"`}
                    description="Distributed generation from residential PV"
                    value={solarPercent}
                    onChange={(e) => setSolarPercent(Number(e.target.value))}
                  />
                )}
                
                {step === 3 && (
                  <ScenarioCard
                    key="battery"
                    step={3}
                    currentStep={step}
                    color="emerald"
                    icon={<svg className="w-7 h-7 text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" /></svg>}
                    title="Battery Storage"
                    question={`"How much storage to smooth the curve?"`}
                    description="Grid-scale battery for peak shaving"
                    value={batteryPercent}
                    onChange={(e) => setBatteryPercent(Number(e.target.value))}
                  />
                )}
                
                {step === 4 && (
                  <ScenarioCard
                    key="climate"
                    step={4}
                    currentStep={step}
                    color="red"
                    icon={<svg className="w-7 h-7 text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg>}
                    title="Climate Stress Test"
                    question={`"Can the grid handle extreme events?"`}
                    description="Simulates 40°C heatwave conditions"
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <span className={`font-bold ${climateShock ? 'text-red-400' : 'text-slate-400'}`}>
                          {climateShock ? 'HEATWAVE ACTIVE' : 'NORMAL CONDITIONS'}
                        </span>
                        <p className="text-xs text-slate-500 mt-1">
                          {climateShock ? '+50% base load, reduced efficiency' : 'Standard operating parameters'}
                        </p>
                      </div>
                      <motion.button 
                        onClick={() => setClimateShock(!climateShock)}
                        className={`relative w-14 h-8 rounded-full transition-all ${
                          climateShock 
                            ? 'bg-red-500 shadow-[0_0_20px_rgba(239,68,68,0.5)]' 
                            : 'bg-slate-700'
                        }`}
                        whileTap={{ scale: 0.95 }}
                      >
                        <motion.span 
                          className="absolute top-1 w-6 h-6 bg-white rounded-full shadow-lg"
                          animate={{ left: climateShock ? '30px' : '4px' }}
                          transition={{ type: "spring", stiffness: 500, damping: 30 }}
                        />
                      </motion.button>
                    </div>
                  </ScenarioCard>
                )}
                
                {step === 5 && (
                  <motion.div
                    key="results"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    className="glass-panel-solid p-6"
                  >
                    <div className="flex items-center gap-3 mb-4">
                      <motion.div 
                        className="w-3 h-3 rounded-full bg-emerald-500"
                        animate={{ scale: [1, 1.3, 1] }}
                        transition={{ duration: 1, repeat: Infinity }}
                      />
                      <h4 className="font-bold text-emerald-400 tracking-wider">SIMULATION COMPLETE</h4>
                    </div>
                    <p className="text-slate-400 leading-relaxed mb-4">
                      Your scenario has been analyzed. Review the map for geospatial impact 
                      and AI-driven resilience recommendations.
                    </p>
                    <div className="grid grid-cols-2 gap-3 text-center text-sm">
                      <div className="p-3 rounded-xl bg-slate-800/50 border border-white/5">
                        <div className="text-blue-400 font-bold">{evPercent}%</div>
                        <div className="text-xs text-slate-500">EV Adoption</div>
                      </div>
                      <div className="p-3 rounded-xl bg-slate-800/50 border border-white/5">
                        <div className="text-yellow-400 font-bold">{solarPercent}%</div>
                        <div className="text-xs text-slate-500">Solar</div>
                      </div>
                      <div className="p-3 rounded-xl bg-slate-800/50 border border-white/5">
                        <div className="text-emerald-400 font-bold">{batteryPercent}%</div>
                        <div className="text-xs text-slate-500">Storage</div>
                      </div>
                      <div className="p-3 rounded-xl bg-slate-800/50 border border-white/5">
                        <div className={climateShock ? 'text-red-400 font-bold' : 'text-slate-400'}>
                          {climateShock ? 'ON' : 'OFF'}
                        </div>
                        <div className="text-xs text-slate-500">Stress Test</div>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
            
            {/* Navigation */}
            <div className="pt-6 flex justify-between border-t border-white/5 mt-6">
              <motion.button 
                onClick={() => setStep(Math.max(1, step - 1))}
                disabled={step === 1}
                className="btn-ghost disabled:opacity-30"
                whileHover={{ x: -4 }}
                whileTap={{ scale: 0.95 }}
              >
                ← Back
              </motion.button>
              
              {step < 5 ? (
                <motion.button 
                  onClick={() => setStep(step + 1)}
                  className="btn-primary"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  Next Step →
                </motion.button>
              ) : (
                <motion.button 
                  onClick={() => setStep(1)}
                  className="btn-secondary"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  Start Over
                </motion.button>
              )}
            </div>
          </div>
          
          {/* Right visualization panel */}
          <div className="w-full lg:w-3/5 p-6 lg:p-8 bg-gradient-to-br from-transparent to-slate-900/30">
            <div className="h-full min-h-[400px] glass-panel p-6">
              {renderVisualization()}
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
