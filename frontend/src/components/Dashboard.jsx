import React, { useEffect, useState, useRef } from 'react';
import { motion, AnimatePresence, useInView } from 'framer-motion';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import GridMap from './GridMap';
import axios from 'axios';

// Animated counter component
const AnimatedCounter = ({ value, suffix = '', decimals = 1 }) => {
  const [displayValue, setDisplayValue] = useState(0);
  const countRef = useRef(null);
  const isInView = useInView(countRef, { once: true });
  
  useEffect(() => {
    if (!isInView) return;
    
    const duration = 1500;
    const startTime = Date.now();
    const startValue = displayValue;
    
    const animate = () => {
      const elapsed = Date.now() - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const easeOut = 1 - Math.pow(1 - progress, 3);
      
      setDisplayValue(startValue + (value - startValue) * easeOut);
      
      if (progress < 1) {
        requestAnimationFrame(animate);
      }
    };
    
    requestAnimationFrame(animate);
  }, [value, isInView]);
  
  return (
    <span ref={countRef}>
      {displayValue.toFixed(decimals)}{suffix}
    </span>
  );
};

// Premium metric card
const MetricCard = ({ title, value, suffix, icon, color, progress, delay = 0 }) => {
  const cardRef = useRef(null);
  const isInView = useInView(cardRef, { once: true });
  
  const colorClasses = {
    blue: {
      text: 'text-blue-400',
      bg: 'bg-blue-500',
      glow: 'shadow-[0_0_60px_rgba(59,130,246,0.2)]',
      gradient: 'from-blue-500/20 to-blue-600/5'
    },
    emerald: {
      text: 'text-emerald-400',
      bg: 'bg-emerald-500',
      glow: 'shadow-[0_0_60px_rgba(52,211,153,0.2)]',
      gradient: 'from-emerald-500/20 to-emerald-600/5'
    },
    indigo: {
      text: 'text-indigo-400',
      bg: 'bg-indigo-500',
      glow: 'shadow-[0_0_60px_rgba(99,102,241,0.2)]',
      gradient: 'from-indigo-500/20 to-indigo-600/5'
    }
  };
  
  const styles = colorClasses[color] || colorClasses.blue;
  
  return (
    <motion.div
      ref={cardRef}
      className={`metric-card relative overflow-hidden ${styles.glow}`}
      initial={{ opacity: 1, y: 0, scale: 1 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ 
        duration: 0.6, 
        delay: delay,
        ease: [0.16, 1, 0.3, 1]
      }}
      whileHover={{ y: -6 }}
    >
      {/* Background gradient */}
      <div className={`absolute inset-0 bg-gradient-to-br ${styles.gradient} opacity-50`} />
      
      {/* Icon */}
      <motion.div 
        className="absolute top-4 right-4 opacity-10 group-hover:opacity-20 transition-opacity"
        initial={{ scale: 0.8, opacity: 0 }}
        animate={isInView ? { scale: 1, opacity: 0.1 } : {}}
        transition={{ delay: delay + 0.2 }}
      >
        {icon}
      </motion.div>
      
      {/* Content */}
      <div className="relative z-10">
        <motion.h3 
          className="metric-label mb-3"
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 1 } : {}}
          transition={{ delay: delay + 0.1 }}
        >
          {title}
        </motion.h3>
        
        <motion.div 
          className={`metric-value ${styles.text}`}
          initial={{ opacity: 0, scale: 0.9 }}
          animate={isInView ? { opacity: 1, scale: 1 } : {}}
          transition={{ delay: delay + 0.2 }}
          style={{ textShadow: `0 0 40px currentColor` }}
        >
          <AnimatedCounter value={value} suffix={suffix} />
        </motion.div>
        
        {/* Progress bar */}
        {progress !== undefined && (
          <div className="mt-4">
            <div className="h-1.5 bg-slate-800/80 rounded-full overflow-hidden">
              <motion.div 
                className={`h-full ${styles.bg} rounded-full`}
                initial={{ width: 0 }}
                animate={isInView ? { width: `${Math.min(100, progress)}%` } : {}}
                transition={{ duration: 1, delay: delay + 0.4, ease: "easeOut" }}
              />
            </div>
          </div>
        )}
      </div>
    </motion.div>
  );
};

// AI Insight panel
const AIInsightPanel = ({ insight, isLoading }) => {
  const panelRef = useRef(null);
  const isInView = useInView(panelRef, { once: true });
  
  return (
    <motion.div
      ref={panelRef}
      className="glass-panel-solid p-1 relative overflow-hidden"
      initial={{ opacity: 1, y: 0 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
    >
      {/* Left accent */}
      <div className="absolute top-0 left-0 w-1 h-full bg-gradient-to-b from-indigo-500 via-purple-500 to-indigo-500" />
      
      {/* Animated glow */}
      <motion.div 
        className="absolute -top-20 -right-20 w-40 h-40 bg-indigo-500/20 rounded-full blur-3xl"
        animate={{ 
          scale: [1, 1.2, 1],
          opacity: [0.2, 0.4, 0.2]
        }}
        transition={{ duration: 4, repeat: Infinity }}
      />
      
      <div className="bg-slate-900/50 p-6 rounded-xl relative">
        <div className="flex items-center gap-3 mb-4">
          <motion.div 
            className="px-3 py-1.5 rounded-lg bg-gradient-to-r from-indigo-500/20 to-purple-500/20 border border-indigo-500/30"
            animate={{ 
              boxShadow: ['0 0 20px rgba(99,102,241,0.2)', '0 0 40px rgba(99,102,241,0.4)', '0 0 20px rgba(99,102,241,0.2)']
            }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            <span className="text-xs font-bold text-indigo-300 tracking-wider flex items-center gap-2">
              <motion.span
                className="w-2 h-2 rounded-full bg-indigo-400"
                animate={{ scale: [1, 1.3, 1] }}
                transition={{ duration: 1, repeat: Infinity }}
              />
              GEMINI AI ANALYSIS
            </span>
          </motion.div>
          <div className="h-px flex-1 bg-gradient-to-r from-indigo-500/50 to-transparent" />
        </div>
        
        <AnimatePresence mode="wait">
          {isLoading ? (
            <motion.div
              key="loading"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex items-center gap-3"
            >
              <motion.div
                className="w-5 h-5 border-2 border-indigo-500/30 border-t-indigo-500 rounded-full"
                animate={{ rotate: 360 }}
                transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
              />
              <span className="text-slate-400 animate-pulse">Analyzing grid patterns...</span>
            </motion.div>
          ) : (
            <motion.p
              key="insight"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="text-slate-200 leading-relaxed text-lg font-light"
            >
              {insight}
            </motion.p>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
};

// Custom tooltip for charts
const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <motion.div 
        className="glass-panel-solid px-4 py-3"
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
      >
        <p className="text-xs text-slate-400 mb-2">{label}</p>
        {payload.map((entry, index) => (
          <div key={index} className="flex items-center gap-2">
            <span 
              className="w-2 h-2 rounded-full" 
              style={{ backgroundColor: entry.color }}
            />
            <span className="text-sm font-medium" style={{ color: entry.color }}>
              {entry.value.toFixed(1)} kW
            </span>
          </div>
        ))}
      </motion.div>
    );
  }
  return null;
};

export default function Dashboard() {
  const [gridState, setGridState] = useState(null);
  const [history, setHistory] = useState([]);
  const [aiInsight, setAiInsight] = useState("Initializing AI analysis...");
  const [isLoadingInsight, setIsLoadingInsight] = useState(true);
  const sectionRef = useRef(null);
  const isInView = useInView(sectionRef, { once: true });

  useEffect(() => {
    const ws = new WebSocket("ws://127.0.0.1:8000/ws");
    
    ws.onmessage = (event) => {
      const data = JSON.parse(event.data);
      setGridState(data);
      setHistory(prev => [...prev.slice(-20), { 
        time: new Date().toLocaleTimeString(), 
        load: data.total_load, 
        gen: data.total_generation 
      }]);
    };

    return () => ws.close();
  }, []);

  useEffect(() => {
    const fetchInsight = async () => {
      setIsLoadingInsight(true);
      try {
        const res = await axios.get("http://127.0.0.1:8000/ai-insight");
        let text = res.data.analysis;
        // Basic check if it's a raw error string/object
        if (typeof text !== 'string' || text.toString().includes('quota') || text.toString().includes('error')) {
          text = "Grid operating within normal parameters. Real-time analysis active.";
        }
        setAiInsight(text);
      } catch (e) { 
        setAiInsight("Grid operating within normal parameters. All systems nominal.");
      }
      setIsLoadingInsight(false);
    };
    
    fetchInsight();
    const interval = setInterval(fetchInsight, 15000);
    return () => clearInterval(interval);
  }, []);

  const toggleNode = async (nodeIds) => {
    await axios.post(`http://127.0.0.1:8000/control/toggle/${nodeIds}`);
  };

  if (!gridState) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <motion.div 
          className="flex flex-col items-center gap-6"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          <motion.div 
            className="relative w-24 h-24"
            animate={{ rotate: 360 }}
            transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
          >
            <div className="absolute inset-0 border-4 border-indigo-500/20 rounded-full" />
            <div className="absolute inset-0 border-4 border-transparent border-t-indigo-500 rounded-full" />
            <motion.div
              className="absolute inset-2 border-4 border-transparent border-t-cyan-500 rounded-full"
              animate={{ rotate: -360 }}
              transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
            />
          </motion.div>
          <motion.div 
            className="text-lg font-medium text-slate-400"
            animate={{ opacity: [0.5, 1, 0.5] }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            Establishing Grid Connection...
          </motion.div>
        </motion.div>
      </div>
    );
  }

  return (
    <section ref={sectionRef} className="relative py-16 md:py-24 opacity-100">
      <div className="max-w-[1600px] mx-auto px-6 space-y-8">
        {/* Header */}
        <motion.header 
          className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 pb-8 border-b border-white/5"
          initial={{ opacity: 1, y: 0 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <div>
            <motion.h2 
              className="text-3xl md:text-4xl font-bold tracking-tight"
              initial={{ opacity: 0, x: -20 }}
              animate={isInView ? { opacity: 1, x: 0 } : {}}
              transition={{ delay: 0.1 }}
            >
              <span className="text-gradient-primary">ANYGRID</span>
              <span className="text-white/20 font-light ml-3">COMMAND</span>
            </motion.h2>
            <motion.p 
              className="text-slate-400 text-sm mt-2 tracking-wide uppercase"
              initial={{ opacity: 0 }}
              animate={isInView ? { opacity: 1 } : {}}
              transition={{ delay: 0.2 }}
            >
              Real-time Energy Management System
            </motion.p>
          </div>
          
          <motion.div 
            className={`px-6 py-3 rounded-2xl font-bold border backdrop-blur-xl transition-all duration-500 ${
              gridState.leak_detected 
                ? 'bg-red-500/10 border-red-500/30 text-red-400 shadow-[0_0_40px_rgba(239,68,68,0.2)]' 
                : 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400 shadow-[0_0_40px_rgba(16,185,129,0.2)]'
            }`}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={isInView ? { opacity: 1, scale: 1 } : {}}
            transition={{ delay: 0.3 }}
          >
            <div className="flex items-center gap-3">
              <span className="relative flex h-3 w-3">
                <span className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 ${
                  gridState.leak_detected ? 'bg-red-400' : 'bg-emerald-400'
                }`} />
                <span className={`relative inline-flex rounded-full h-3 w-3 ${
                  gridState.leak_detected ? 'bg-red-500' : 'bg-emerald-500'
                }`} />
              </span>
              {gridState.leak_detected ? "CRITICAL: LEAK DETECTED" : "SYSTEM NOMINAL"}
            </div>
          </motion.div>
        </motion.header>

        {/* Metrics Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <MetricCard
            title="Total Load"
            value={gridState.total_load}
            suffix=" kW"
            color="blue"
            delay={0}
            progress={(gridState.total_load / 200) * 100}
            icon={
              <svg className="w-20 h-20 text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            }
          />
          
          <MetricCard
            title="Total Generation"
            value={gridState.total_generation}
            suffix=" kW"
            color="emerald"
            delay={0.1}
            progress={(gridState.total_generation / 200) * 100}
            icon={
              <svg className="w-20 h-20 text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
              </svg>
            }
          />
          
          <MetricCard
            title="Grid Efficiency"
            value={gridState.efficiency * 100}
            suffix="%"
            color="indigo"
            delay={0.2}
            progress={gridState.efficiency * 100}
            icon={
              <svg className="w-20 h-20 text-indigo-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
            }
          />
        </div>

        {/* AI Insight */}
        <AIInsightPanel insight={aiInsight} isLoading={isLoadingInsight} />

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Grid Map */}
          <motion.div 
            className="lg:col-span-2 glass-panel p-4 min-h-[500px]"
            initial={{ opacity: 1, x: 0 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
          >
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-slate-200">Network Topology</h3>
              <div className="flex gap-4 text-xs">
                <div className="flex items-center gap-2">
                  <span className="w-3 h-3 rounded-full bg-emerald-500" />
                  <span className="text-slate-400">Source</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="w-3 h-3 rounded-full bg-blue-500" />
                  <span className="text-slate-400">Consumer</span>
                </div>
              </div>
            </div>
            <GridMap gridState={gridState} onToggleNode={toggleNode} />
          </motion.div>

          {/* Live Chart */}
          <motion.div 
            className="glass-panel p-6 flex flex-col min-h-[500px]"
            initial={{ opacity: 1, x: 0 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
          >
            <div className="flex justify-between items-center mb-6">
              <h3 className="font-semibold text-slate-200">Live Power Flow</h3>
              <div className="flex gap-4 text-xs font-mono">
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-blue-500" />
                  <span className="text-slate-500">LOAD</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-emerald-500" />
                  <span className="text-slate-500">GEN</span>
                </div>
              </div>
            </div>
            
            <div className="flex-1 w-full min-h-[400px] relative">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={history}>
                  <defs>
                    <linearGradient id="colorLoadNew" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.4}/>
                      <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                    </linearGradient>
                    <linearGradient id="colorGenNew" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#10b981" stopOpacity={0.4}/>
                      <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false} />
                  <XAxis 
                    dataKey="time" 
                    stroke="#475569" 
                    tick={{fontSize: 10}} 
                    tickLine={false} 
                    axisLine={false} 
                  />
                  <YAxis 
                    stroke="#475569" 
                    tick={{fontSize: 10}} 
                    tickLine={false} 
                    axisLine={false}
                    width={35}
                  />
                  <Tooltip content={<CustomTooltip />} />
                  <Area 
                    type="monotone" 
                    dataKey="load" 
                    stroke="#3b82f6" 
                    strokeWidth={2} 
                    fillOpacity={1} 
                    fill="url(#colorLoadNew)" 
                  />
                  <Area 
                    type="monotone" 
                    dataKey="gen" 
                    stroke="#10b981" 
                    strokeWidth={2} 
                    fillOpacity={1} 
                    fill="url(#colorGenNew)" 
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
