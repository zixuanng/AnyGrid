import React, { useRef } from 'react';
import { motion, useScroll, useTransform, useInView } from 'framer-motion';

// Individual story card component
const StoryCard = ({ icon, title, description, stats, color, index, children }) => {
  const cardRef = useRef(null);
  const isInView = useInView(cardRef, { once: true, margin: "-100px" });
  
  const colorClasses = {
    cyan: {
      icon: 'from-cyan-500/20 to-cyan-600/10 border-cyan-500/30',
      glow: 'shadow-[0_0_60px_rgba(34,211,238,0.15)]',
      text: 'text-cyan-400',
      accent: 'bg-cyan-500'
    },
    indigo: {
      icon: 'from-indigo-500/20 to-indigo-600/10 border-indigo-500/30',
      glow: 'shadow-[0_0_60px_rgba(99,102,241,0.15)]',
      text: 'text-indigo-400',
      accent: 'bg-indigo-500'
    },
    emerald: {
      icon: 'from-emerald-500/20 to-emerald-600/10 border-emerald-500/30',
      glow: 'shadow-[0_0_60px_rgba(52,211,153,0.15)]',
      text: 'text-emerald-400',
      accent: 'bg-emerald-500'
    },
    amber: {
      icon: 'from-amber-500/20 to-amber-600/10 border-amber-500/30',
      glow: 'shadow-[0_0_60px_rgba(251,191,36,0.15)]',
      text: 'text-amber-400',
      accent: 'bg-amber-500'
    },
    rose: {
      icon: 'from-rose-500/20 to-rose-600/10 border-rose-500/30',
      glow: 'shadow-[0_0_60px_rgba(251,113,133,0.15)]',
      text: 'text-rose-400',
      accent: 'bg-rose-500'
    }
  };
  
  const styles = colorClasses[color] || colorClasses.indigo;
  
  return (
    <motion.div
      ref={cardRef}
      className={`story-card p-8 md:p-10 ${styles.glow}`}
      initial={{ opacity: 0, y: 60 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ 
        duration: 0.8, 
        delay: index * 0.15,
        ease: [0.16, 1, 0.3, 1]
      }}
      whileHover={{ scale: 1.02 }}
    >
      {/* Accent line */}
      <div className={`absolute top-0 left-8 right-8 h-px bg-gradient-to-r from-transparent via-white/20 to-transparent`} />
      
      {/* Icon */}
      <motion.div 
        className={`story-card-icon mb-6 bg-gradient-to-br ${styles.icon}`}
        whileHover={{ scale: 1.1, rotate: 5 }}
        transition={{ type: "spring", stiffness: 400, damping: 10 }}
      >
        {icon}
      </motion.div>
      
      {/* Content */}
      <h3 className={`heading-card mb-3 ${styles.text}`}>{title}</h3>
      <p className="text-slate-400 leading-relaxed mb-6">{description}</p>
      
      {/* Stats grid */}
      {stats && (
        <div className="grid grid-cols-2 gap-4 mb-6">
          {stats.map((stat, i) => (
            <div key={i} className="text-center p-3 rounded-xl bg-slate-900/50 border border-white/5">
              <div className={`text-2xl font-bold ${styles.text}`}>{stat.value}</div>
              <div className="text-xs text-slate-500 uppercase tracking-wider">{stat.label}</div>
            </div>
          ))}
        </div>
      )}
      
      {/* Chart/Visual content slot */}
      {children && (
        <div className="mt-6 relative">
          {children}
        </div>
      )}
      
      {/* Bottom accent */}
      <div className={`absolute bottom-0 left-1/2 -translate-x-1/2 w-24 h-1 rounded-t-full ${styles.accent} opacity-50`} />
    </motion.div>
  );
};

// Large feature card for primary content
const FeatureCard = ({ title, subtitle, description, visual, reversed, index }) => {
  const cardRef = useRef(null);
  const isInView = useInView(cardRef, { once: true, margin: "-100px" });
  
  return (
    <motion.div
      ref={cardRef}
      className={`grid lg:grid-cols-2 gap-8 lg:gap-16 items-center ${reversed ? 'lg:[direction:rtl]' : ''}`}
      initial={{ opacity: 0, y: 80 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ 
        duration: 1, 
        delay: 0.2,
        ease: [0.16, 1, 0.3, 1]
      }}
    >
      {/* Text content */}
      <div className={`${reversed ? 'lg:[direction:ltr]' : ''}`}>
        <motion.span 
          className="inline-block px-3 py-1 text-xs font-semibold text-indigo-400 bg-indigo-500/10 border border-indigo-500/20 rounded-full mb-4"
          initial={{ opacity: 0, x: -20 }}
          animate={isInView ? { opacity: 1, x: 0 } : {}}
          transition={{ delay: 0.4 }}
        >
          {subtitle}
        </motion.span>
        
        <motion.h3 
          className="heading-section text-white mb-6"
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 0.5 }}
        >
          {title}
        </motion.h3>
        
        <motion.p 
          className="text-lg text-slate-400 leading-relaxed"
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 0.6 }}
        >
          {description}
        </motion.p>
      </div>
      
      {/* Visual content */}
      <motion.div 
        className={`${reversed ? 'lg:[direction:ltr]' : ''} relative`}
        initial={{ opacity: 0, scale: 0.9 }}
        animate={isInView ? { opacity: 1, scale: 1 } : {}}
        transition={{ delay: 0.7, duration: 0.8 }}
      >
        <div className="glass-panel-solid p-6 relative overflow-hidden">
          {/* Decorative glow */}
          <div className="absolute -top-20 -right-20 w-40 h-40 bg-indigo-500/20 rounded-full blur-3xl" />
          <div className="absolute -bottom-20 -left-20 w-40 h-40 bg-cyan-500/20 rounded-full blur-3xl" />
          
          {/* Content */}
          <div className="relative z-10">
            {visual}
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
};

// Mini chart visualization
const MiniChart = ({ data, color }) => {
  const maxValue = Math.max(...data);
  
  return (
    <div className="flex items-end gap-1.5 h-20">
      {data.map((value, i) => (
        <motion.div
          key={i}
          className={`flex-1 rounded-t-sm ${color}`}
          initial={{ height: 0 }}
          whileInView={{ height: `${(value / maxValue) * 100}%` }}
          transition={{ delay: i * 0.05, duration: 0.5, ease: "easeOut" }}
          viewport={{ once: true }}
        />
      ))}
    </div>
  );
};

// Animated ring chart
const RingChart = ({ percentage, color, size = 120 }) => {
  const circumference = 2 * Math.PI * 45;
  const strokeDashoffset = circumference - (percentage / 100) * circumference;
  
  return (
    <div className="relative" style={{ width: size, height: size }}>
      <svg className="w-full h-full -rotate-90" viewBox="0 0 100 100">
        <circle
          cx="50"
          cy="50"
          r="45"
          fill="none"
          stroke="rgba(255,255,255,0.05)"
          strokeWidth="8"
        />
        <motion.circle
          cx="50"
          cy="50"
          r="45"
          fill="none"
          stroke={color}
          strokeWidth="8"
          strokeLinecap="round"
          strokeDasharray={circumference}
          initial={{ strokeDashoffset: circumference }}
          whileInView={{ strokeDashoffset }}
          transition={{ duration: 1.5, ease: "easeOut" }}
          viewport={{ once: true }}
        />
      </svg>
      <div className="absolute inset-0 flex items-center justify-center">
        <motion.span 
          className="text-2xl font-bold text-white"
          initial={{ opacity: 0, scale: 0.5 }}
          whileInView={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.5 }}
          viewport={{ once: true }}
        >
          {percentage}%
        </motion.span>
      </div>
    </div>
  );
};

export default function StoryBlocks() {
  const sectionRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"]
  });
  
  const opacity = useTransform(scrollYProgress, [0, 0.2, 0.8, 1], [0, 1, 1, 0]);
  const y = useTransform(scrollYProgress, [0, 0.2], [100, 0]);
  
  const stories = [
    {
      icon: (
        <svg className="w-10 h-10 text-cyan-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13 10V3L4 14h7v7l9-11h-7z" />
        </svg>
      ),
      title: "Smart Grid Intelligence",
      description: "AI-powered analysis monitors every node in real-time, predicting demand surges and optimizing power distribution across the network.",
      color: "cyan",
      stats: [
        { value: "50ms", label: "Response" },
        { value: "99.9%", label: "Accuracy" }
      ],
      chart: <MiniChart data={[30, 45, 28, 60, 42, 75, 55, 80, 65, 90, 72, 85]} color="bg-cyan-500/60" />
    },
    {
      icon: (
        <svg className="w-10 h-10 text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
        </svg>
      ),
      title: "Solar Integration",
      description: "Seamlessly integrate rooftop solar and distributed energy resources. Watch renewable generation flow through the grid in real-time.",
      color: "emerald",
      stats: [
        { value: "42%", label: "Renewable" },
        { value: "2.1GW", label: "Capacity" }
      ],
      chart: <MiniChart data={[10, 25, 45, 70, 85, 95, 90, 75, 50, 30, 15, 5]} color="bg-emerald-500/60" />
    },
    {
      icon: (
        <svg className="w-10 h-10 text-indigo-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
        </svg>
      ),
      title: "Energy Storage",
      description: "Battery systems smooth out demand curves and store excess solar for peak hours. Intelligent discharge algorithms maximize efficiency.",
      color: "indigo",
      stats: [
        { value: "850", label: "MW Storage" },
        { value: "4hrs", label: "Duration" }
      ],
      chart: <MiniChart data={[60, 55, 50, 45, 55, 70, 85, 95, 80, 65, 55, 60]} color="bg-indigo-500/60" />
    },
    {
      icon: (
        <svg className="w-10 h-10 text-rose-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
        </svg>
      ),
      title: "Climate Resilience",
      description: "Stress-test your grid against extreme weather scenarios. From heatwaves to polar vortexes, ensure your infrastructure can handle the future.",
      color: "rose",
      stats: [
        { value: "100+", label: "Scenarios" },
        { value: "48hr", label: "Forecast" }
      ],
      chart: <MiniChart data={[40, 45, 50, 55, 70, 85, 95, 90, 75, 60, 50, 45]} color="bg-rose-500/60" />
    }
  ];

  return (
    <section ref={sectionRef} className="relative py-24 md:py-32 overflow-hidden">
      {/* Background elements */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/4 left-0 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 right-0 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl" />
      </div>
      
      <motion.div 
        className="max-w-7xl mx-auto px-6"
        style={{ opacity, y }}
      >
        {/* Section header */}
        <div className="text-center mb-16 md:mb-24">
          <motion.span 
            className="inline-block px-4 py-1.5 text-sm font-medium text-indigo-400 bg-indigo-500/10 border border-indigo-500/20 rounded-full mb-6"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            Explore Features
          </motion.span>
          
          <motion.h2 
            className="heading-section text-white mb-6"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            viewport={{ once: true }}
          >
            A Living Digital <span className="text-gradient-primary">Energy Ecosystem</span>
          </motion.h2>
          
          <motion.p 
            className="text-lg text-slate-400 max-w-2xl mx-auto"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            viewport={{ once: true }}
          >
            Dive deep into intelligent grid management through interactive visualizations 
            and real-time data insights. Every node tells a story.
          </motion.p>
        </div>
        
        {/* Story cards grid */}
        <div className="grid md:grid-cols-2 gap-6 lg:gap-8">
          {stories.map((story, index) => (
            <StoryCard
              key={index}
              icon={story.icon}
              title={story.title}
              description={story.description}
              stats={story.stats}
              color={story.color}
              index={index}
            >
              {story.chart}
            </StoryCard>
          ))}
        </div>
        
        {/* Divider */}
        <div className="section-divider" />
        
        {/* Feature highlight sections */}
        <div className="space-y-24 lg:space-y-32">
          <FeatureCard
            subtitle="AI-Powered Analysis"
            title="Gemini Intelligence at Your Fingertips"
            description="Our integrated Gemini AI continuously analyzes grid patterns, predicting issues before they occur and recommending optimal configurations. Natural language insights make complex data accessible to everyone."
            visual={
              <div className="space-y-4">
                <div className="flex items-center gap-4">
                  <RingChart percentage={94} color="#818CF8" />
                  <div>
                    <div className="text-2xl font-bold text-white">Grid Health</div>
                    <div className="text-slate-400">All systems operational</div>
                  </div>
                </div>
                <div className="p-4 rounded-xl bg-slate-900/50 border border-indigo-500/20">
                  <div className="flex items-center gap-2 mb-2">
                    <div className="w-2 h-2 rounded-full bg-indigo-500 animate-pulse" />
                    <span className="text-xs text-indigo-400 font-medium">GEMINI INSIGHT</span>
                  </div>
                  <p className="text-sm text-slate-300">
                    "Recommend increasing battery discharge by 15% during 5-7 PM peak to reduce grid stress and optimize costs."
                  </p>
                </div>
              </div>
            }
          />
          
          <FeatureCard
            subtitle="Real-Time Visualization"
            title="See Your Grid Come Alive"
            description="Watch energy flow through nodes in real-time. Interactive maps reveal the pulse of your power network, from generation sources to consumer endpoints, all rendered in stunning visual clarity."
            reversed
            visual={
              <div className="aspect-video bg-slate-900/50 rounded-xl border border-white/5 flex items-center justify-center relative overflow-hidden">
                <div className="absolute inset-0 grid-pattern opacity-30" />
                
                {/* Simulated node network */}
                <svg className="w-full h-full" viewBox="0 0 300 200">
                  <defs>
                    <linearGradient id="lineGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                      <stop offset="0%" stopColor="#22D3EE" stopOpacity="0.2" />
                      <stop offset="50%" stopColor="#22D3EE" stopOpacity="0.8" />
                      <stop offset="100%" stopColor="#22D3EE" stopOpacity="0.2" />
                    </linearGradient>
                  </defs>
                  
                  {/* Animated connection lines */}
                  <motion.line
                    x1="50" y1="100" x2="150" y2="60"
                    stroke="url(#lineGrad)"
                    strokeWidth="2"
                    initial={{ pathLength: 0 }}
                    animate={{ pathLength: 1 }}
                    transition={{ duration: 2, repeat: Infinity }}
                  />
                  <motion.line
                    x1="150" y1="60" x2="250" y2="100"
                    stroke="url(#lineGrad)"
                    strokeWidth="2"
                    initial={{ pathLength: 0 }}
                    animate={{ pathLength: 1 }}
                    transition={{ duration: 2, delay: 0.5, repeat: Infinity }}
                  />
                  <motion.line
                    x1="50" y1="100" x2="150" y2="140"
                    stroke="url(#lineGrad)"
                    strokeWidth="2"
                    initial={{ pathLength: 0 }}
                    animate={{ pathLength: 1 }}
                    transition={{ duration: 2, delay: 1, repeat: Infinity }}
                  />
                  <motion.line
                    x1="150" y1="140" x2="250" y2="100"
                    stroke="url(#lineGrad)"
                    strokeWidth="2"
                    initial={{ pathLength: 0 }}
                    animate={{ pathLength: 1 }}
                    transition={{ duration: 2, delay: 1.5, repeat: Infinity }}
                  />
                  
                  {/* Nodes */}
                  <motion.circle
                    cx="50" cy="100" r="12"
                    fill="#10B981"
                    animate={{ scale: [1, 1.2, 1] }}
                    transition={{ duration: 2, repeat: Infinity }}
                  />
                  <motion.circle
                    cx="150" cy="60" r="10"
                    fill="#818CF8"
                    animate={{ scale: [1, 1.15, 1] }}
                    transition={{ duration: 2, delay: 0.3, repeat: Infinity }}
                  />
                  <motion.circle
                    cx="250" cy="100" r="12"
                    fill="#3B82F6"
                    animate={{ scale: [1, 1.2, 1] }}
                    transition={{ duration: 2, delay: 0.6, repeat: Infinity }}
                  />
                  <motion.circle
                    cx="150" cy="140" r="10"
                    fill="#818CF8"
                    animate={{ scale: [1, 1.15, 1] }}
                    transition={{ duration: 2, delay: 0.9, repeat: Infinity }}
                  />
                </svg>
              </div>
            }
          />
        </div>
      </motion.div>
    </section>
  );
}
