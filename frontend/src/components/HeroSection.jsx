import React, { useEffect, useState, useRef } from 'react';
import { motion, useScroll, useTransform, useSpring, AnimatePresence } from 'framer-motion';

// Animated energy particle component
const EnergyParticle = ({ delay, duration, startX }) => (
  <motion.div
    className="absolute w-1 h-1 rounded-full bg-cyan-400"
    style={{ left: `${startX}%` }}
    initial={{ y: '100vh', opacity: 0, scale: 0 }}
    animate={{ 
      y: '-10vh', 
      opacity: [0, 1, 1, 0], 
      scale: [0, 1.5, 1, 0] 
    }}
    transition={{ 
      duration: duration, 
      delay: delay, 
      repeat: Infinity,
      ease: "linear"
    }}
  />
);

// Floating stat orb component
const FloatingStat = ({ value, label, color, delay }) => (
  <motion.div
    className="glass-card p-4 md:p-6"
    initial={{ opacity: 0, y: 30, scale: 0.9 }}
    animate={{ opacity: 1, y: 0, scale: 1 }}
    transition={{ 
      duration: 0.8, 
      delay: delay,
      ease: [0.16, 1, 0.3, 1]
    }}
    whileHover={{ scale: 1.05, y: -5 }}
  >
    <motion.div 
      className={`text-3xl md:text-4xl font-bold tracking-tight ${color}`}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5, delay: delay + 0.3 }}
    >
      {value}
    </motion.div>
    <div className="text-xs md:text-sm text-slate-400 mt-1 uppercase tracking-wider">{label}</div>
  </motion.div>
);

// Generate particles with random properties
const generateParticles = (count) => {
  return Array.from({ length: count }, (_, i) => ({
    id: i,
    delay: Math.random() * 5,
    duration: 8 + Math.random() * 7,
    startX: Math.random() * 100
  }));
};

export default function HeroSection({ onExplore }) {
  const containerRef = useRef(null);
  const [particles] = useState(() => generateParticles(30));
  
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end start"]
  });
  
  const smoothProgress = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001
  });
  
  // Parallax transforms
  const titleY = useTransform(smoothProgress, [0, 1], [0, -100]);
  const subtitleY = useTransform(smoothProgress, [0, 1], [0, -60]);
  const statsY = useTransform(smoothProgress, [0, 1], [0, -40]);
  const bgY = useTransform(smoothProgress, [0, 1], [0, 150]);
  const cityScale = useTransform(smoothProgress, [0, 0.5], [1, 1.15]);
  const cityOpacity = useTransform(smoothProgress, [0, 0.5], [1, 0.3]);
  const overlayOpacity = useTransform(smoothProgress, [0.2, 0.6], [0, 0.8]);
  
  const textVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: (i) => ({
      opacity: 1,
      y: 0,
      transition: {
        delay: i * 0.15,
        duration: 0.8,
        ease: [0.16, 1, 0.3, 1]
      }
    })
  };

  return (
    <section 
      ref={containerRef}
      className="relative min-h-screen flex items-center justify-center overflow-hidden"
    >
      {/* Animated background layers */}
      <motion.div 
        className="absolute inset-0 z-0"
        style={{ y: bgY }}
      >
        {/* Main gradient mesh background */}
        <div className="absolute inset-0 bg-gradient-to-b from-[#030712] via-[#0A1628] to-[#030712]" />
        
        {/* City silhouette layer */}
        <motion.div 
          className="absolute bottom-0 left-0 right-0 h-[60vh]"
          style={{ 
            scale: cityScale,
            opacity: cityOpacity,
            transformOrigin: 'bottom center'
          }}
        >
          {/* Stylized cityscape SVG */}
          <svg 
            viewBox="0 0 1440 400" 
            className="absolute bottom-0 w-full h-full"
            preserveAspectRatio="xMidYMax slice"
          >
            <defs>
              <linearGradient id="cityGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor="rgba(99, 102, 241, 0.3)" />
                <stop offset="100%" stopColor="rgba(15, 23, 42, 0.9)" />
              </linearGradient>
              <linearGradient id="windowGlow" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor="rgba(34, 211, 238, 0.8)" />
                <stop offset="100%" stopColor="rgba(99, 102, 241, 0.4)" />
              </linearGradient>
              <filter id="glow">
                <feGaussianBlur stdDeviation="2" result="coloredBlur"/>
                <feMerge>
                  <feMergeNode in="coloredBlur"/>
                  <feMergeNode in="SourceGraphic"/>
                </feMerge>
              </filter>
            </defs>
            
            {/* City buildings */}
            <g fill="url(#cityGradient)">
              {/* Left section */}
              <rect x="20" y="280" width="60" height="120" rx="2" />
              <rect x="90" y="220" width="80" height="180" rx="2" />
              <rect x="180" y="180" width="50" height="220" rx="2" />
              <rect x="240" y="250" width="70" height="150" rx="2" />
              
              {/* Center (taller buildings) */}
              <rect x="340" y="100" width="100" height="300" rx="3" />
              <rect x="460" y="60" width="80" height="340" rx="3" />
              <rect x="560" y="120" width="120" height="280" rx="3" />
              <rect x="700" y="80" width="90" height="320" rx="3" />
              <rect x="810" y="140" width="110" height="260" rx="3" />
              
              {/* Right section */}
              <rect x="950" y="200" width="70" height="200" rx="2" />
              <rect x="1040" y="160" width="90" height="240" rx="2" />
              <rect x="1150" y="240" width="60" height="160" rx="2" />
              <rect x="1230" y="190" width="80" height="210" rx="2" />
              <rect x="1330" y="260" width="90" height="140" rx="2" />
            </g>
            
            {/* Glowing windows */}
            <g fill="url(#windowGlow)" filter="url(#glow)" className="animate-pulse">
              <rect x="360" y="130" width="8" height="6" rx="1" opacity="0.8" />
              <rect x="380" y="150" width="8" height="6" rx="1" opacity="0.6" />
              <rect x="400" y="170" width="8" height="6" rx="1" opacity="0.9" />
              <rect x="480" y="90" width="8" height="6" rx="1" opacity="0.7" />
              <rect x="500" y="120" width="8" height="6" rx="1" opacity="0.85" />
              <rect x="520" y="150" width="8" height="6" rx="1" opacity="0.65" />
              <rect x="590" y="150" width="8" height="6" rx="1" opacity="0.9" />
              <rect x="620" y="180" width="8" height="6" rx="1" opacity="0.7" />
              <rect x="650" y="200" width="8" height="6" rx="1" opacity="0.8" />
              <rect x="720" y="110" width="8" height="6" rx="1" opacity="0.75" />
              <rect x="750" y="140" width="8" height="6" rx="1" opacity="0.6" />
              <rect x="780" y="170" width="8" height="6" rx="1" opacity="0.85" />
              <rect x="840" y="170" width="8" height="6" rx="1" opacity="0.7" />
              <rect x="870" y="200" width="8" height="6" rx="1" opacity="0.8" />
            </g>
            
            {/* Energy flow lines */}
            <g stroke="rgba(34, 211, 238, 0.4)" strokeWidth="1" fill="none" className="animate-pulse">
              <path d="M 0 350 Q 200 320 400 350 T 800 330 T 1200 350 T 1440 340" />
              <path d="M 0 370 Q 300 340 600 370 T 1000 350 T 1440 360" opacity="0.6" />
            </g>
          </svg>
        </motion.div>
        
        {/* Data overlay grid */}
        <motion.div 
          className="absolute inset-0 grid-pattern"
          style={{ opacity: overlayOpacity }}
        />
        
        {/* Floating glow orbs */}
        <motion.div 
          className="glow-orb glow-orb-cyan w-96 h-96 -top-48 -right-48"
          animate={{ 
            scale: [1, 1.2, 1],
            opacity: [0.3, 0.5, 0.3]
          }}
          transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
        />
        <motion.div 
          className="glow-orb glow-orb-indigo w-80 h-80 top-1/4 -left-40"
          animate={{ 
            scale: [1, 1.3, 1],
            opacity: [0.2, 0.4, 0.2]
          }}
          transition={{ duration: 10, repeat: Infinity, ease: "easeInOut", delay: 2 }}
        />
        <motion.div 
          className="glow-orb glow-orb-emerald w-72 h-72 bottom-1/4 right-1/4"
          animate={{ 
            scale: [1, 1.15, 1],
            opacity: [0.25, 0.45, 0.25]
          }}
          transition={{ duration: 7, repeat: Infinity, ease: "easeInOut", delay: 4 }}
        />
      </motion.div>
      
      {/* Energy particles */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none z-10">
        {particles.map(particle => (
          <EnergyParticle key={particle.id} {...particle} />
        ))}
      </div>
      
      {/* Main content */}
      <div className="relative z-20 max-w-7xl mx-auto px-6 py-20 text-center">
        {/* Badge */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="inline-flex items-center gap-2 px-4 py-2 mb-8 rounded-full glass-card"
        >
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
          </span>
          <span className="text-sm text-slate-300 font-medium">Real-Time Energy Intelligence</span>
        </motion.div>
        
        {/* Title */}
        <motion.div style={{ y: titleY }}>
          <motion.h1 
            className="heading-hero mb-4"
            custom={0}
            initial="hidden"
            animate="visible"
            variants={textVariants}
          >
            <span className="block text-white/90">ANYGRID</span>
          </motion.h1>
          
          <motion.div 
            className="text-2xl md:text-4xl font-light text-gradient-primary mb-6"
            custom={1}
            initial="hidden"
            animate="visible"
            variants={textVariants}
          >
            Powering Tomorrow's Cities
          </motion.div>
        </motion.div>
        
        {/* Subtitle */}
        <motion.div style={{ y: subtitleY }}>
          <motion.p 
            className="text-lg md:text-xl text-slate-400 max-w-2xl mx-auto mb-12 leading-relaxed"
            custom={2}
            initial="hidden"
            animate="visible"
            variants={textVariants}
          >
            Experience the future of energy management through stunning visualizations, 
            AI-powered insights, and interactive scenario exploration.
          </motion.p>
          
          {/* CTA Button */}
          <motion.button
            onClick={onExplore}
            className="btn-primary group"
            custom={3}
            initial="hidden"
            animate="visible"
            variants={textVariants}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.98 }}
          >
            <span className="flex items-center gap-3">
              Explore the Grid
              <motion.svg 
                className="w-5 h-5"
                fill="none" 
                viewBox="0 0 24 24" 
                stroke="currentColor"
                animate={{ y: [0, 5, 0] }}
                transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
              </motion.svg>
            </span>
          </motion.button>
        </motion.div>
        
        {/* Floating stats */}
        <motion.div 
          style={{ y: statsY }}
          className="mt-20 grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6 max-w-4xl mx-auto"
        >
          <FloatingStat 
            value="99.9%" 
            label="Uptime" 
            color="text-emerald-400" 
            delay={0.8}
          />
          <FloatingStat 
            value="42MW" 
            label="Managed" 
            color="text-cyan-400" 
            delay={1.0}
          />
          <FloatingStat 
            value="15K+" 
            label="Nodes" 
            color="text-indigo-400" 
            delay={1.2}
          />
          <FloatingStat 
            value="24/7" 
            label="AI Analysis" 
            color="text-amber-400" 
            delay={1.4}
          />
        </motion.div>
      </div>
      
      {/* Scroll indicator */}
      <motion.div 
        className="absolute bottom-8 left-1/2 -translate-x-1/2 z-20"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 2 }}
      >
        <motion.div
          className="w-6 h-10 rounded-full border-2 border-slate-600 flex justify-center pt-2"
          animate={{ opacity: [0.5, 1, 0.5] }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          <motion.div
            className="w-1.5 h-1.5 rounded-full bg-slate-400"
            animate={{ y: [0, 12, 0] }}
            transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
          />
        </motion.div>
      </motion.div>
    </section>
  );
}
