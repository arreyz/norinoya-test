import React, { useState } from 'react';
import { Smartphone, Monitor, Shuffle, Grid, BatteryMedium, Wifi, Clock } from 'lucide-react';

interface ViewportWrapperProps {
  children: React.ReactNode;
}

export default function ViewportWrapper({ children }: ViewportWrapperProps) {
  // 'auto' | 'desktop' | 'mobile'
  const [viewportMode, setViewportMode] = useState<'auto' | 'desktop' | 'mobile'>('auto');

  return (
    <div className="min-h-screen bg-neutral-100 flex flex-col" id="viewport-sandbox">
      {/* Simulation Master Bar */}
      <div className="bg-white border-b border-neutral-200 py-3 px-6 shrink-0 z-45 flex flex-wrap items-center justify-between gap-4 sticky top-0 shadow-xs select-none">
        
        {/* Brand identity mock */}
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 rounded bg-neutral-950 flex items-center justify-center font-serif text-white font-black text-[13px]">
            N
          </div>
          <span className="font-mono text-xs font-black tracking-wider text-neutral-900 uppercase">
            NORINOYA VIEWPORT SIMULATOR
          </span>
        </div>

        {/* Viewport Control Buttons */}
        <div className="flex items-center gap-1.5 bg-neutral-100 p-1 rounded-lg border border-neutral-200">
          <button
            onClick={() => setViewportMode('auto')}
            className={`px-3 py-1.5 rounded-md text-xs font-mono font-bold flex items-center gap-2 transition-all cursor-pointer ${
              viewportMode === 'auto'
                ? 'bg-white text-neutral-950 shadow-xs border border-neutral-200/50'
                : 'text-neutral-500 hover:text-neutral-950'
            }`}
            title="Auto Responsive Layout"
          >
            <Shuffle className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Responsive Auto</span>
          </button>
          
          <button
            onClick={() => setViewportMode('desktop')}
            className={`px-3 py-1.5 rounded-md text-xs font-mono font-bold flex items-center gap-2 transition-all cursor-pointer ${
              viewportMode === 'desktop'
                ? 'bg-white text-neutral-950 shadow-xs border border-neutral-200/50'
                : 'text-neutral-500 hover:text-neutral-950'
            }`}
            title="Force Desktop View"
          >
            <Monitor className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Desktop Only (1280px)</span>
          </button>

          <button
            onClick={() => setViewportMode('mobile')}
            className={`px-3 py-1.5 rounded-md text-xs font-mono font-bold flex items-center gap-2 transition-all cursor-pointer ${
              viewportMode === 'mobile'
                ? 'bg-white text-neutral-950 shadow-xs border border-neutral-200/50'
                : 'text-neutral-500 hover:text-neutral-950'
            }`}
            title="Force Mobile View"
          >
            <Smartphone className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Mobile Only (390px)</span>
          </button>
        </div>

        {/* Quick Instructions tag */}
        <div className="hidden lg:flex items-center gap-1.5 text-[10px] font-mono text-neutral-400 uppercase tracking-tight">
          <span>Current Mode:</span>
          <span className="text-neutral-950 font-bold bg-neutral-100 rounded px-1.5 py-0.5">
            {viewportMode === 'auto' ? 'Dynamic Fluid' : viewportMode === 'desktop' ? '1280x800 Frame' : '390x844 iPhone'}
          </span>
        </div>
      </div>

      {/* Simulator Workspace with Background Frame */}
      <div className="flex-1 overflow-auto flex items-center justify-center p-2 sm:p-6 transition-all">
        {viewportMode === 'auto' && (
          <div className="w-full h-full bg-white transition-all duration-300">
            {children}
          </div>
        )}

        {viewportMode === 'desktop' && (
          <div className="w-[1280px] max-w-full h-[85vh] border border-neutral-300 rounded-xl overflow-auto shadow-2xl bg-white transition-all duration-300 relative">
            <div className="bg-neutral-50 border-b border-neutral-200 py-2.5 px-4 flex items-center justify-between sticky top-0 z-40 select-none">
              <div className="flex items-center gap-1.5">
                <span className="w-3 h-3 rounded-full bg-red-400"></span>
                <span className="w-3 h-3 rounded-full bg-amber-400"></span>
                <span className="w-3 h-3 rounded-full bg-green-400"></span>
              </div>
              <span className="text-[10px] font-mono text-neutral-400 uppercase tracking-widest">
                Desktop Site Browser Window Frame
              </span>
              <div className="w-12"></div>
            </div>
            <div className="h-[calc(100%-38px)] overflow-auto bg-white">
              {children}
            </div>
          </div>
        )}

        {viewportMode === 'mobile' && (
          <div className="w-[400px] h-[844px] shrink-0 border-[10px] border-neutral-950 bg-black rounded-[46px] shadow-3xl overflow-hidden transition-all duration-300 flex flex-col relative scale-[0.9] sm:scale-100">
            {/* Phone Notch/Ear speaker */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 bg-neutral-950 h-5.5 w-36 rounded-b-2xl z-49 flex items-center justify-center select-none">
              <span className="w-10 h-1 bg-neutral-800 rounded-full"></span>
            </div>

            {/* Simulated Phone Status Bar */}
            <div className="bg-white h-11 pt-3 px-7 flex items-center justify-between z-48 select-none shrink-0 border-b border-neutral-50">
              <span className="font-mono text-xs font-bold text-neutral-950">13:46</span>
              <div className="flex items-center gap-1.5">
                <Wifi className="w-3.5 h-3.5 text-neutral-950" />
                <BatteryMedium className="w-4 h-4 text-neutral-950" />
              </div>
            </div>

            {/* Scrollable viewport client area */}
            <div className="flex-1 overflow-auto bg-white rounded-b-[36px]">
              {children}
            </div>

            {/* Simulated iPhone Home Swipe Indicator */}
            <div className="bg-white h-5 pb-1 flex items-center justify-center select-none shrink-0 pointer-events-none sticky bottom-0 border-t border-neutral-50 rounded-b-[36px]">
              <span className="w-28 h-1 bg-neutral-300 rounded-full"></span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
