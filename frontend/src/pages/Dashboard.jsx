import React, { useState, useEffect, useRef } from 'react';
import { useAuth } from '../context/AuthContext';
import { getSessionsAPI, getSessionLapsAPI } from '../services/api';
import { initiateSocketConnection, disconnectSocket } from '../services/socket';
import TopAppBar from '../components/TopAppBar';
import BottomNavBar from '../components/BottomNavBar';

const Dashboard = () => {
  const { user } = useAuth();
  const [activeSession, setActiveSession] = useState(null);
  const [laps, setLaps] = useState([]);
  const [lapSeconds, setLapSeconds] = useState(0);
  const [isSocketConnected, setIsSocketConnected] = useState(false);
  const [loading, setLoading] = useState(true);
  const [personalBestMsg, setPersonalBestMsg] = useState('');

  const timerRef = useRef(null);

  // 1. Load active session on mount
  useEffect(() => {
    const fetchActiveSession = async () => {
      if (!user) return;
      try {
        const res = await getSessionsAPI(user.id);
        if (res.success && res.data && res.data.length > 0) {
          // Check if latest session is active (endTime is null)
          const latest = res.data[0];
          if (latest.endTime === null) {
            setActiveSession(latest);
            // Fetch its laps
            const lapsRes = await getSessionLapsAPI(latest.id);
            if (lapsRes.success && lapsRes.data) {
              setLaps(lapsRes.data.laps || []);
              
              // Calculate elapsed seconds for the current lap
              const startTime = new Date(latest.startTime).getTime();
              const now = new Date().getTime();
              const totalElapsedSec = Math.floor((now - startTime) / 1000);
              
              if (lapsRes.data.laps.length > 0) {
                // Find elapsed time since the last lap scanned
                const lastLapTime = new Date(lapsRes.data.laps[lapsRes.data.laps.length - 1].scannedAt).getTime();
                const lapElapsed = Math.floor((now - lastLapTime) / 1000);
                setLapSeconds(lapElapsed >= 0 ? lapElapsed : 0);
              } else {
                setLapSeconds(totalElapsedSec >= 0 ? totalElapsedSec : 0);
              }
            }
          }
        }
      } catch (err) {
        console.error("Failed to load active session:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchActiveSession();
  }, [user]);

  // 2. Setup Socket.io listeners
  useEffect(() => {
    if (!user) return;
    const socket = initiateSocketConnection();

    socket.connect();
    setIsSocketConnected(socket.connected);

    socket.on('connect', () => {
      setIsSocketConnected(true);
    });

    socket.on('disconnect', () => {
      setIsSocketConnected(false);
    });

    socket.on('session-started', (data) => {
      // Data format: { type, session, user: { id, firstName, lastName } }
      if (data.user?.id === user.id) {
        setActiveSession(data.session);
        setLaps([]);
        setLapSeconds(0);
        setPersonalBestMsg('');
      }
    });

    socket.on('new-lap', (data) => {
      // Data format: { type, lap, session, user }
      if (data.user?.id === user.id) {
        setActiveSession(data.session);
        setLaps((prevLaps) => {
          const updated = [...prevLaps, data.lap];
          // Check if this is a personal best (simulate check or check against previous bests)
          // Simple trigger: if this lap is faster than average
          if (updated.length > 1) {
            const fastestSoFar = Math.min(...updated.slice(0, -1).map(l => l.lapDuration));
            if (data.lap.lapDuration < fastestSoFar) {
              setPersonalBestMsg(`ทำเวลาได้ดีที่สุด! รอบที่ ${data.lap.lapNumber}: ${formatTime(data.lap.lapDuration)}`);
            }
          }
          return updated;
        });
        setLapSeconds(0); // Reset stopwatch for the new lap
      }
    });

    return () => {
      socket.off('connect');
      socket.off('disconnect');
      socket.off('session-started');
      socket.off('new-lap');
      disconnectSocket();
    };
  }, [user]);

  // 3. Stopwatch timer effect
  useEffect(() => {
    if (activeSession) {
      timerRef.current = setInterval(() => {
        setLapSeconds((prev) => prev + 1);
      }, 1000);
    } else {
      clearInterval(timerRef.current);
    }

    return () => clearInterval(timerRef.current);
  }, [activeSession]);

  // Helper: Format seconds to MM:SS
  const formatTime = (totalSeconds) => {
    const mins = Math.floor(totalSeconds / 60);
    const secs = totalSeconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  // Helper: Calculate total session duration
  const getTotalSessionDuration = () => {
    if (!activeSession) return 0;
    const totalLapDuration = laps.reduce((sum, lap) => sum + lap.lapDuration, 0);
    return totalLapDuration + lapSeconds;
  };

  // Helper: Calculate average lap duration
  const getAverageLapDuration = () => {
    if (laps.length === 0) return 0;
    const sum = laps.reduce((acc, lap) => acc + lap.lapDuration, 0);
    return Math.floor(sum / laps.length);
  };

  // Helper: Get last lap time
  const getLastLapTime = () => {
    if (laps.length === 0) return 0;
    return laps[laps.length - 1].lapDuration;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center text-slate-400">
        <div className="flex flex-col items-center gap-4">
          <div className="w-8 h-8 border-4 border-orange-500 border-t-transparent rounded-full animate-spin"></div>
          <p className="font-label-caps text-xs">Loading Live Data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950 pb-32 pt-16 font-body-lg flex flex-col">
      <TopAppBar isSocketConnected={isSocketConnected} />

      <main className="flex-grow px-5 mt-4 overflow-y-auto">
        {/* Personal Best Alert Banner */}
        {personalBestMsg && (
          <div className="mt-4 animate-bounce">
            <div className="glass-card rounded-2xl p-4 border-l-4 border-orange-500 flex items-center gap-3 shadow-lg">
              <div className="bg-orange-500/20 p-2 rounded-full flex items-center justify-center text-orange-500">
                <span className="material-symbols-outlined text-lg" style={{ fontVariationSettings: "'FILL' 1" }}>
                  emoji_events
                </span>
              </div>
              <div className="flex-1">
                <p className="font-label-caps text-orange-500 text-[10px] tracking-wider font-bold">NEW PERSONAL BEST</p>
                <p className="text-sm text-slate-100 font-semibold">{personalBestMsg}</p>
              </div>
              <button 
                onClick={() => setPersonalBestMsg('')} 
                className="material-symbols-outlined text-slate-400 text-sm hover:text-white cursor-pointer"
              >
                close
              </button>
            </div>
          </div>
        )}

        {/* Hero Section: Active Running State */}
        {activeSession ? (
          <section className="mt-6 flex flex-col items-center justify-center relative py-6">
            <div className="relative w-64 h-64 flex items-center justify-center">
              {/* SVG Circular Progress Ring */}
              <svg className="absolute inset-0 w-full h-full" viewBox="0 0 100 100">
                <circle 
                  className="text-slate-800 stroke-current" 
                  cx="50" 
                  cy="50" 
                  fill="transparent" 
                  r="45" 
                  strokeWidth="5"
                />
                <circle 
                  className="text-orange-500 stroke-current progress-ring" 
                  cx="50" 
                  cy="50" 
                  fill="transparent" 
                  r="45" 
                  strokeLinecap="round" 
                  strokeWidth="5" 
                  style={{
                    strokeDasharray: '282.7',
                    // Oscillate or fill based on seconds
                    strokeDashoffset: `${282.7 - (282.7 * (lapSeconds % 60)) / 60}`
                  }}
                />
              </svg>

              <div className="text-center z-10 space-y-1">
                <p className="font-label-caps text-slate-400 text-[11px] uppercase tracking-wider">
                  รอบที่ {laps.length + 1}
                </p>
                <h2 className="font-display-metrics text-5xl font-black text-orange-500 timer-glow font-mono">
                  {formatTime(lapSeconds)}
                </h2>
                <div className="flex justify-center mt-1 text-orange-500/70">
                  <span className="material-symbols-outlined animate-pulse text-base">timer</span>
                </div>
              </div>
            </div>
          </section>
        ) : (
          <section className="mt-12 mb-12 flex flex-col items-center justify-center py-10 glass-card rounded-2xl border border-slate-800 text-center px-6 space-y-6">
            <div className="w-16 h-16 bg-slate-900/50 border border-slate-800 rounded-full flex items-center justify-center text-slate-600 animate-pulse">
              <span className="material-symbols-outlined text-3xl">sensors</span>
            </div>
            <div className="space-y-2">
              <h3 className="font-headline-md text-slate-200">พร้อมเริ่มต้นวิ่ง</h3>
              <p className="text-sm text-slate-400 max-w-[260px] mx-auto leading-relaxed">
                แตะสายรัดข้อมือ NFC ที่จุดสแกนในสนามเพื่อเริ่มจับเวลาวิ่งโดยอัตโนมัติ
              </p>
            </div>
            <div className="flex items-center gap-1.5 bg-orange-500/10 border border-orange-500/20 px-3 py-1.5 rounded-full text-orange-500">
              <span className="w-2 h-2 bg-orange-500 rounded-full animate-ping"></span>
              <span className="text-[10px] font-label-caps font-bold">รอการแตะสัญญาณ NFC...</span>
            </div>
          </section>
        )}

        {/* Metrics Grid */}
        <section className="grid grid-cols-2 gap-4 mt-4">
          <div className="glass-card rounded-2xl p-5 flex flex-col items-center text-center shadow-lg border border-slate-800/80">
            <span className="material-symbols-outlined text-orange-500 mb-1.5 text-xl">history</span>
            <p className="font-label-caps text-[10px] text-slate-400 uppercase tracking-wider">เวลารอบล่าสุด</p>
            <p className="font-display-metrics text-2xl font-bold text-slate-100 mt-1 font-mono">
              {laps.length > 0 ? formatTime(getLastLapTime()) : '--:--'}
            </p>
          </div>
          <div className="glass-card rounded-2xl p-5 flex flex-col items-center text-center shadow-lg border border-slate-800/80">
            <span className="material-symbols-outlined text-orange-500 mb-1.5 text-xl">reorder</span>
            <p className="font-label-caps text-[10px] text-slate-400 uppercase tracking-wider">จำนวนรอบรวม</p>
            <p className="font-display-metrics text-2xl font-bold text-slate-100 mt-1 font-mono">
              {activeSession ? `${laps.length} รอบ` : '0 รอบ'}
            </p>
          </div>
          <div className="glass-card rounded-2xl p-5 flex flex-col items-center text-center shadow-lg border border-slate-800/80">
            <span className="material-symbols-outlined text-orange-500 mb-1.5 text-xl">directions_run</span>
            <p className="font-label-caps text-[10px] text-slate-400 uppercase tracking-wider">เวลารวมเซสชัน</p>
            <p className="font-display-metrics text-2xl font-bold text-slate-100 mt-1 font-mono">
              {activeSession ? formatTime(getTotalSessionDuration()) : '00:00'}
            </p>
          </div>
          <div className="glass-card rounded-2xl p-5 flex flex-col items-center text-center shadow-lg border border-slate-800/80">
            <span className="material-symbols-outlined text-orange-500 mb-1.5 text-xl">speed</span>
            <p className="font-label-caps text-[10px] text-slate-400 uppercase tracking-wider">เวลาเฉลี่ย/รอบ</p>
            <p className="font-display-metrics text-2xl font-bold text-slate-100 mt-1 font-mono">
              {laps.length > 0 ? formatTime(getAverageLapDuration()) : '--:--'}
            </p>
          </div>
        </section>

        {/* Dynamic visualization / Map simulation */}
        <section className="mt-4">
          <div className="glass-card rounded-2xl h-32 relative overflow-hidden flex items-center justify-center border border-slate-800/80 shadow-lg">
            <div className="absolute inset-0 opacity-20">
              <svg className="w-full h-full" viewBox="0 0 400 150">
                <path 
                  d="M40,75 C40,40 100,30 200,30 C300,30 360,40 360,75 C360,110 300,120 200,120 C100,120 40,110 40,75 Z" 
                  fill="none" 
                  stroke="#f97316" 
                  strokeWidth="3.5"
                  strokeDasharray="5,5"
                />
                <circle 
                  cx={activeSession ? 200 + 160 * Math.cos(lapSeconds / 10) : 200} 
                  cy={activeSession ? 75 + 45 * Math.sin(lapSeconds / 10) : 30} 
                  fill="#f97316" 
                  r="5.5"
                  className={activeSession ? 'animate-pulse' : ''}
                />
              </svg>
            </div>
            <div className="relative z-10 bg-slate-950/75 backdrop-blur-sm px-4 py-2 rounded-full border border-slate-800 flex items-center gap-2">
              <span className="material-symbols-outlined text-orange-500 text-sm">location_on</span>
              <span className="font-label-caps text-[9px] text-slate-200 tracking-wider uppercase">
                PARK RUN CIRCUIT · <span className="text-orange-500 font-bold">{activeSession ? `${(laps.length * 0.4).toFixed(1)}KM` : '0.0KM'}</span>
              </span>
            </div>
            <div className="absolute inset-0 pointer-events-none bg-gradient-to-t from-slate-950/40 to-transparent"></div>
          </div>
        </section>

        {/* Lap splits list log */}
        {activeSession && laps.length > 0 && (
          <section className="mt-4 mb-4">
            <h3 className="font-label-caps text-[10px] text-slate-400 uppercase tracking-widest px-1 mb-2">
              Recent Lap Splits
            </h3>
            <div className="glass-card rounded-2xl p-4 border border-slate-800/80 shadow-lg divide-y divide-slate-800/50">
              {[...laps].reverse().map((lap, index) => {
                const lapIndex = laps.length - index;
                return (
                  <div key={lap.id || lapIndex} className="flex items-center justify-between py-2 first:pt-0 last:pb-0">
                    <span className="font-label-caps text-xs text-slate-400">LAP {lapIndex}</span>
                    <div className="flex items-center gap-2">
                      <span className="font-label-caps text-xs text-slate-100 font-bold font-mono">
                        {formatTime(lap.lapDuration)}
                      </span>
                      {index === 0 && (
                        <span className="text-[10px] text-orange-500 font-semibold bg-orange-500/10 px-2 py-0.5 rounded-full border border-orange-500/20">
                          LATEST
                        </span>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </section>
        )}
      </main>

      <BottomNavBar />
    </div>
  );
};

export default Dashboard;
