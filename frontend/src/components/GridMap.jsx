import React, { useCallback, useMemo } from 'react';
import { motion } from 'framer-motion';
import ReactFlow, { 
  MiniMap, 
  Controls, 
  Background, 
  Handle, 
  Position 
} from 'reactflow';
import 'reactflow/dist/style.css';

// Enhanced custom node with animations
const CustomNode = ({ data, selected }) => {
  const isSource = data.type === 'source';
  const isWarning = data.status !== 'active';
  
  return (
    <motion.div 
      className={`
        relative p-5 min-w-[180px] text-center rounded-2xl backdrop-blur-xl
        transition-all duration-300 cursor-pointer
        ${isWarning ? 'react-flow__node warning' : ''}
        ${isSource ? 'react-flow__node-source' : 'react-flow__node-consumer'}
      `}
      initial={{ scale: 0.8, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      whileHover={{ scale: 1.05 }}
      style={{
        background: 'rgba(15, 23, 42, 0.9)',
        border: `2px solid ${isWarning ? 'rgba(239, 68, 68, 0.7)' : isSource ? 'rgba(52, 211, 153, 0.5)' : 'rgba(59, 130, 246, 0.5)'}`,
        boxShadow: isWarning 
          ? '0 0 30px rgba(239, 68, 68, 0.3), inset 0 0 20px rgba(239, 68, 68, 0.1)' 
          : isSource 
            ? '0 0 30px rgba(52, 211, 153, 0.2), inset 0 0 20px rgba(52, 211, 153, 0.05)'
            : '0 0 30px rgba(59, 130, 246, 0.2), inset 0 0 20px rgba(59, 130, 246, 0.05)'
      }}
    >
      <Handle 
        type="target" 
        position={Position.Top} 
        className="!w-3 !h-3 !bg-slate-600 !border-2 !border-slate-500"
      />
      
      {/* Status indicator */}
      <div className="absolute -top-1 -right-1">
        <span className={`relative flex h-3 w-3`}>
          <span className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 ${
            isWarning ? 'bg-red-400' : isSource ? 'bg-emerald-400' : 'bg-blue-400'
          }`}></span>
          <span className={`relative inline-flex rounded-full h-3 w-3 ${
            isWarning ? 'bg-red-500' : isSource ? 'bg-emerald-500' : 'bg-blue-500'
          }`}></span>
        </span>
      </div>
      
      {/* Node type icon */}
      <div className="flex justify-center mb-3">
        {isSource ? (
          <div className="w-10 h-10 rounded-xl bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center">
            <svg className="w-5 h-5 text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
            </svg>
          </div>
        ) : (
          <div className="w-10 h-10 rounded-xl bg-blue-500/20 border border-blue-500/30 flex items-center justify-center">
            <svg className="w-5 h-5 text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
            </svg>
          </div>
        )}
      </div>
      
      {/* Node name */}
      <div className="font-bold text-white text-sm mb-1">{data.label}</div>
      <div className="text-xs text-slate-500 font-mono mb-3">{data.details}</div>
      
      {/* Power values */}
      <div className="flex justify-center gap-4 text-xs">
        {data.generation > 0 && (
          <div className="flex items-center gap-1">
            <div className="w-1.5 h-1.5 rounded-full bg-emerald-500"></div>
            <span className="text-emerald-400 font-medium">{data.generation.toFixed(1)} kW</span>
          </div>
        )}
        {data.load > 0 && (
          <div className="flex items-center gap-1">
            <div className="w-1.5 h-1.5 rounded-full bg-blue-500"></div>
            <span className="text-blue-400 font-medium">{data.load.toFixed(1)} kW</span>
          </div>
        )}
      </div>
      
      <Handle 
        type="source" 
        position={Position.Bottom} 
        className="!w-3 !h-3 !bg-slate-600 !border-2 !border-slate-500"
      />
    </motion.div>
  );
};

const nodeTypes = {
  custom: CustomNode,
};

// Custom edge with animation
const edgeOptions = {
  style: { strokeWidth: 3 },
  animated: true,
};

export default function GridMap({ gridState, onToggleNode }) {
  const nodes = useMemo(() => {
    if (!gridState) return [];
    
    // List to keep track of ALL taken positions to prevent any overlap
    const placedPositions = [];
    
    // Filter out potential (0,0) outliers which squish the map
    const lats = gridState.nodes.filter(n => n.lat && n.lat !== 0).map(n => n.lat);
    const lons = gridState.nodes.filter(n => n.lon && n.lon !== 0).map(n => n.lon);
    
    const minLat = lats.length ? Math.min(...lats) : 38.9;
    const maxLat = lats.length ? Math.max(...lats) : 38.95;
    const minLon = lons.length ? Math.min(...lons) : -77.05;
    const maxLon = lons.length ? Math.max(...lons) : -77.0;

    const latRange = Math.max(0.005, maxLat - minLat);
    const lonRange = Math.max(0.005, maxLon - minLon);

    return gridState.nodes.map((n, i) => {
      let x, y;
      
      if (n.lat && n.lon && n.lat !== 0) {
        // Normalize coordinates
        x = ((n.lon - minLon) / lonRange) * 1000;
        y = ((maxLat - n.lat) / latRange) * 800;
      } else {
        // Fallback for nodes without coords - place in a "Districts" grid at the bottom
        const col = i % 4;
        const row = Math.floor(i / 4);
        x = col * 320;
        y = row * 250 + 1500; 
      }

      // Feature the main generator
      if (n.id === 'gen1') {
        x = -250; 
        y = 300;
      }

      // --- DYNAMIC COLLISION AVOIDANCE ---
      // Iteratively move node if it's too close to ANY already placed node
      let collision = true;
      let attempts = 0;
      const MIN_DIST = 260; // Minimum distance between node centers

      while (collision && attempts < 15) {
        collision = false;
        for (const pos of placedPositions) {
          const dx = x - pos.x;
          const dy = y - pos.y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          
          if (dist < MIN_DIST) {
            // Calculate push direction
            // If they are exactly on top of each other, use a default angle
            const angle = dist < 1 ? (i * 1.5) : Math.atan2(dy, dx);
            const moveDist = MIN_DIST - dist + 50; // Push out with buffer
            x += Math.cos(angle) * moveDist;
            y += Math.sin(angle) * moveDist;
            collision = true;
            break; // Re-check against all nodes from new position
          }
        }
        attempts++;
      }
      
      placedPositions.push({ x, y });

      return {
        id: n.id,
        type: 'custom',
        position: { x, y },
        data: { 
          label: n.name, 
          details: n.id,
          type: n.type,
          status: n.status,
          generation: n.generation,
          load: n.load
        },
      };
    });
  }, [gridState]);

  const edges = useMemo(() => {
    if (!gridState) return [];
    return gridState.links.map(l => ({
      id: l.id,
      source: l.source_id,
      target: l.target_id,
      animated: l.status === 'active',
      style: { 
        stroke: l.status === 'active' ? '#6366f1' : '#ef4444', 
        strokeWidth: 3,
        filter: l.status === 'active' ? 'drop-shadow(0 0 8px rgba(99, 102, 241, 0.5))' : 'drop-shadow(0 0 8px rgba(239, 68, 68, 0.5))'
      },
    }));
  }, [gridState]);

  const onNodeClick = useCallback((event, node) => {
    onToggleNode(node.id);
  }, [onToggleNode]);

  return (
    <div className="h-[450px] rounded-2xl overflow-hidden relative">
      {/* Decorative glow */}
      <div className="absolute inset-0 pointer-events-none z-10">
        <div className="absolute top-0 left-1/4 w-32 h-32 bg-indigo-500/10 rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-1/4 w-32 h-32 bg-cyan-500/10 rounded-full blur-3xl" />
      </div>
      
      <ReactFlow
        nodes={nodes}
        edges={edges}
        nodeTypes={nodeTypes}
        onNodeClick={onNodeClick}
        defaultEdgeOptions={edgeOptions}
        fitView
        fitViewOptions={{ padding: 0.3 }}
        proOptions={{ hideAttribution: true }}
        minZoom={0.5}
        maxZoom={1.5}
      >
        <Background 
          color="rgba(99, 102, 241, 0.15)" 
          gap={30} 
          size={1}
          style={{ backgroundColor: 'rgba(10, 22, 40, 0.8)' }}
        />
        <Controls 
          className="!bg-slate-900/80 !border-white/10 !rounded-xl !shadow-xl"
          position="bottom-right"
        />
      </ReactFlow>
    </div>
  );
}
