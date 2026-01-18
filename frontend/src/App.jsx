import { useRef } from 'react';
import { motion } from 'framer-motion';
import HeroSection from './components/HeroSection';
import StoryBlocks from './components/StoryBlocks';
import Dashboard from './components/Dashboard';
import SmartCitySimulation from './components/SmartCitySimulation';

function App() {
  const dashboardRef = useRef(null);
  
  const scrollToExplore = () => {
    dashboardRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen relative">
      {/* Noise overlay for texture */}
      <div className="noise-overlay" />
      
      {/* Hero Section */}
      <HeroSection onExplore={scrollToExplore} />
      
      {/* Story Blocks - Feature exploration */}
      <StoryBlocks />
      
      {/* Section divider */}
      <div className="section-divider max-w-7xl mx-auto" />
      
      {/* Dashboard Section */}
      <div ref={dashboardRef} className="relative z-10">
        <Dashboard />
      </div>
      
      {/* Smart City Simulation */}
      <SmartCitySimulation />
      
      {/* Footer */}
      <footer className="py-16 border-t border-white/5">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex flex-col md:flex-row justify-between items-center gap-6">
            <div>
              <h3 className="text-2xl font-bold">
                <span className="text-gradient-primary">ANYGRID</span>
              </h3>
              <p className="text-slate-500 text-sm mt-1">Powering Tomorrow's Cities</p>
            </div>
            
            <div className="flex items-center gap-8 text-sm text-slate-500">
              <span>Built with AI-Powered Intelligence</span>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                <span>System Online</span>
              </div>
            </div>
          </div>
          
          <div className="mt-8 pt-8 border-t border-white/5 text-center text-xs text-slate-600">
            © 2026 ANYGRID Command. Real-time energy management for a sustainable future.
          </div>
        </div>
      </footer>
    </div>
  );
}

export default App;
