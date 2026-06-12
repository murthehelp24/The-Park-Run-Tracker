import React from 'react';
import { useAuth } from '../context/AuthContext';

const TopAppBar = ({ isSocketConnected = false }) => {
  const { user, wristband } = useAuth();

  return (
    <header className="fixed top-0 left-0 w-full z-50 flex justify-between items-center px-5 h-16 bg-slate-900/80 backdrop-blur-md border-b border-slate-800">
      <div className="flex items-center gap-2">
        <span className="material-symbols-outlined text-orange-500" style={{ fontVariationSettings: "'FILL' 1" }}>
          bolt
        </span>
        <span className="font-label-caps text-sm tracking-widest text-orange-500 font-bold uppercase">
          PARK RUN
        </span>
      </div>
      
      {user && (
        <div className="flex items-center gap-3">
          {wristband ? (
            <div className="flex items-center gap-1.5 bg-slate-800 px-3 py-1 rounded-full border border-orange-500/20">
              <span className={`w-2.5 h-2.5 rounded-full ${isSocketConnected ? 'bg-orange-500 animate-pulse' : 'bg-slate-500'}`}></span>
              <span className="text-[10px] font-label-caps text-slate-300 font-semibold uppercase">
                {isSocketConnected ? 'NFC ACTIVE' : 'NFC READY'}
              </span>
            </div>
          ) : (
            <div className="flex items-center gap-1.5 bg-slate-800 px-3 py-1 rounded-full border border-slate-700">
              <span className="w-2.5 h-2.5 rounded-full bg-red-500"></span>
              <span className="text-[10px] font-label-caps text-slate-400 font-semibold uppercase">
                NO BAND
              </span>
            </div>
          )}
        </div>
      )}
    </header>
  );
};

export default TopAppBar;
