
import React from 'react';
import { motion } from "motion/react";

export const GeometricBackground = () => {
  return (
    <div className="fixed inset-0 -z-50 overflow-hidden pointer-events-none bg-[#F4F7F9]">
      {/* Atmospheric Gradients */}
      <div className="absolute top-[-10%] right-[-10%] w-[60%] h-[60%] rounded-full bg-accent/10 blur-[120px]" />
      <div className="absolute bottom-[-5%] left-[-5%] w-[40%] h-[40%] rounded-full bg-accent/5 blur-[100px]" />
      
      {/* Blurred Technical Elements */}
      <motion.div 
        animate={{ 
          y: [0, -20, 0],
          rotate: [0, 5, 0]
        }}
        transition={{ duration: 15, repeat: Infinity, ease: "easeInOut" }}
        className="absolute top-[15%] left-[10%] w-[400px] h-[300px] opacity-20 blur-[60px]"
      >
        <svg viewBox="0 0 100 100" className="w-full h-full text-accent">
          <polyline
            fill="none"
            stroke="currentColor"
            strokeWidth="4"
            points="0,80 10,70 20,75 30,40 40,55 50,20 60,35 70,10 80,45 90,5 100,15"
          />
          <circle cx="30" cy="40" r="5" fill="currentColor" />
          <circle cx="50" cy="20" r="5" fill="currentColor" />
          <circle cx="70" cy="10" r="5" fill="currentColor" />
        </svg>
      </motion.div>

      <motion.div 
        animate={{ 
          x: [0, 30, 0],
          y: [0, 20, 0]
        }}
        transition={{ duration: 20, repeat: Infinity, ease: "easeInOut" }}
        className="absolute bottom-[20%] right-[15%] w-[350px] h-[350px] opacity-10 blur-[80px]"
      >
        <svg viewBox="0 0 100 100" className="w-full h-full text-text-muted">
          <rect x="0" y="60" width="8" height="40" fill="currentColor" />
          <rect x="12" y="40" width="8" height="60" fill="currentColor" />
          <rect x="24" y="70" width="8" height="30" fill="currentColor" />
          <rect x="36" y="20" width="8" height="80" fill="currentColor" />
          <rect x="48" y="55" width="8" height="45" fill="currentColor" />
          <rect x="60" y="30" width="8" height="70" fill="currentColor" />
          <rect x="72" y="80" width="8" height="20" fill="currentColor" />
          <rect x="84" y="45" width="8" height="55" fill="currentColor" />
        </svg>
      </motion.div>

      {/* Subtle Data Grid - Very faint */}
      <div className="absolute inset-0 opacity-[0.04]" 
           style={{ 
             backgroundImage: 'linear-gradient(#64748B 1px, transparent 1px), linear-gradient(90deg, #64748B 1px, transparent 1px)', 
             backgroundSize: '80px 80px' 
           }} 
      />
      
      {/* Floating Micro-data (Sharp, tiny, professional) */}
      <div className="absolute inset-0">
         <div className="absolute top-[8%] left-[12%] font-mono text-[9px] text-text-muted/30 uppercase tracking-[0.3em] font-medium">System.Status: Operational</div>
         <div className="absolute top-[10%] left-[12%] w-32 h-[1px] bg-text-muted/10" />
         
         <div className="absolute bottom-[20%] left-[8%] font-mono text-[9px] text-text-muted/20 uppercase tracking-widest leading-relaxed">
            [DATA_CLUSTER_A]<br/>
            COORD_X: 44.022<br/>
            COORD_Y: 12.881
         </div>
         
         <div className="absolute top-[35%] right-[10%] font-mono text-[9px] text-text-muted/30 uppercase tracking-[0.2em] flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-accent animate-pulse" />
            LIVE_AI_ENGINE_v3.0.1
         </div>
      </div>

      {/* Grid Intersections (Recipe 1 style) */}
      <div className="absolute inset-0 pointer-events-none opacity-[0.05]">
        <div className="absolute top-[160px] left-0 right-0 h-[1px] bg-text-muted" />
        <div className="absolute bottom-[160px] left-0 right-0 h-[1px] bg-text-muted" />
        <div className="absolute left-[160px] top-0 bottom-0 w-[1px] bg-text-muted" />
        <div className="absolute right-[160px] top-0 bottom-0 w-[1px] bg-text-muted" />
      </div>

      {/* Center Glow */}
      <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[80vw] h-[80vh] bg-white opacity-[0.4] blur-[150px] pointer-events-none" />
    </div>
  );
};
