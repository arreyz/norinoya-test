import React, { useState } from 'react';
import { Smartphone, Monitor, Shuffle } from 'lucide-react';

interface ViewportWrapperProps {
  children: React.ReactNode;
}

export default function ViewportWrapper({ children }: ViewportWrapperProps) {
  // 'auto' | 'desktop' | 'mobile'
  const [viewportMode, setViewportMode] = useState<'auto' | 'desktop' | 'mobile'>('auto');

  return (
    <div className="min-h-screen bg-neutral-100 dark:bg-neutral-950 flex flex-col transition-colors duration-200" id="viewport-sandbox">
      {/* Simulation Master Bar */}
      <div className="bg-white dark:bg-neutral-900 border-b border-neutral-200 dark:border-neutral-800 py-3 px-6 shrink-0 z-45 flex flex-wrap items-center justify-between gap-4 sticky top-0 shadow-xs select-none">
        
        {/* Brand identity mock */}
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 rounded bg-neutral-950 dark:bg-white flex items-center justify-center font-serif text-white dark:text-neutral-950 font-black text-[13px]">
            N
          </div>
          <span className="font-mono text-xs font-black tracking-wider text-neutral-900 dark:text-white uppercase">
            NORINOYA VIEWPORT SIMULATOR
          </span>
        </div>

        {/* Viewport Control Buttons */}
        <div className="flex items-center gap-1.5 bg-neutral-100 dark:bg-neutral-800 p-1 rounded-lg border border-neutral-200 dark:border-neutral-700">
          <button
            onClick={() => setViewportMode('auto')}
            className={`px-3 py-1.5 rounded-md text-xs font-mono font-bold flex items-center gap-2 transition-all cursor-pointer ${
              viewportMode === 'auto'
                ? 'bg-white dark:bg-neutral-900 text-neutral-950 dark:text-neutral-50 shadow-xs border border-neutral-200/50 dark:border-neutral-700'
                : 'text-neutral-500 hover:text-neutral-950 dark:text-neutral-400 dark:hover:text-white'
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
                ? 'bg-white dark:bg-neutral-900 text-neutral-950 dark:text-neutral-50 shadow-xs border border-neutral-200/50 dark:border-neutral-700'
                : 'text-neutral-500 hover:text-neutral-950 dark:text-neutral-400 dark:hover:text-white'
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
                ? 'bg-white dark:bg-neutral-900 text-neutral-950 dark:text-neutral-50 shadow-xs border border-neutral-200/50 dark:border-neutral-700'
                : 'text-neutral-500 hover:text-neutral-950 dark:text-neutral-400 dark:hover:text-white'
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
          <span className="text-neutral-950 dark:text-neutral-105 font-bold bg-neutral-100 dark:bg-neutral-800 rounded px-1.5 py-0.5">
            {viewportMode === 'auto' ? 'Dynamic Fluid' : viewportMode === 'desktop' ? '1280x800 Frame' : '390x844 iPhone'}
          </span>
        </div>
      </div>

      {/* Simulator Workspace with Background Frame */}
      <div className="flex-1 overflow-auto flex items-center justify-center p-2 sm:p-6 transition-all">
        {viewportMode === 'auto' && (
          <div 
            className="w-full h-[85vh] border border-neutral-300 dark:border-neutral-800 rounded-xl overflow-auto shadow-2xl bg-white dark:bg-neutral-950 transition-all duration-300 relative"
            style={{ willChange: 'transform' }}
          >
            <div className="bg-neutral-50 dark:bg-neutral-900 border-b border-neutral-200 dark:border-neutral-800 py-2.5 px-4 flex items-center justify-between sticky top-0 z-45 select-none">
              <div className="flex items-center gap-1.5">
                <span className="w-3 h-3 rounded-full bg-red-400"></span>
                <span className="w-3 h-3 rounded-full bg-amber-400"></span>
                <span className="w-3 h-3 rounded-full bg-green-400"></span>
              </div>
              <span className="text-[10px] font-mono text-neutral-400 dark:text-neutral-500 uppercase tracking-widest">
                Responsive Fluid Site Browser Window Frame
              </span>
              <div className="w-12"></div>
            </div>
            <div className="h-[calc(100%-38px)] overflow-auto bg-white dark:bg-neutral-950">
              {children}
            </div>
          </div>
        )}

        {viewportMode === 'desktop' && (
          <div 
            className="w-[1280px] max-w-full h-[85vh] border border-neutral-300 dark:border-neutral-800 rounded-xl overflow-auto shadow-2xl bg-white dark:bg-neutral-950 transition-all duration-300 relative"
            style={{ willChange: 'transform' }}
          >
            <div className="bg-neutral-50 dark:bg-neutral-900 border-b border-neutral-200 dark:border-neutral-800 py-2.5 px-4 flex items-center justify-between sticky top-0 z-45 select-none">
              <div className="flex items-center gap-1.5">
                <span className="w-3 h-3 rounded-full bg-red-400"></span>
                <span className="w-3 h-3 rounded-full bg-amber-400"></span>
                <span className="w-3 h-3 rounded-full bg-green-400"></span>
              </div>
              <span className="text-[10px] font-mono text-neutral-400 dark:text-neutral-500 uppercase tracking-widest">
                Desktop Site Browser Window Frame
              </span>
              <div className="w-12"></div>
            </div>
            <div className="h-[calc(100%-38px)] overflow-auto bg-white dark:bg-neutral-950">
              {children}
            </div>
          </div>
        )}

        {viewportMode === 'mobile' && (
          <div 
            className="w-[390px] max-w-full h-[85vh] border border-neutral-300 dark:border-neutral-800 rounded-xl overflow-hidden shadow-2xl bg-white dark:bg-neutral-950 transition-all duration-300 flex flex-col relative"
            style={{ willChange: 'transform' }}
          >
            <div className="bg-neutral-50 dark:bg-neutral-900 border-b border-neutral-200 dark:border-neutral-800 py-2.5 px-4 flex items-center justify-between sticky top-0 z-45 select-none shrink-0 border-neutral-100">
              <div className="flex items-center gap-1.5">
                <span className="w-3 h-3 rounded-full bg-red-400"></span>
                <span className="w-3 h-3 rounded-full bg-amber-400"></span>
                <span className="w-3 h-3 rounded-full bg-green-400"></span>
              </div>
              <span className="text-[10px] font-mono text-neutral-400 dark:text-neutral-500 uppercase tracking-widest">
                Mobile Dev Viewport Frame (390px)
              </span>
              <div className="w-12"></div>
            </div>
            <div className="flex-1 overflow-auto bg-white dark:bg-neutral-950">
              {children}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
