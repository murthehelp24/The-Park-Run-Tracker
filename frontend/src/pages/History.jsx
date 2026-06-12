import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { getSessionsAPI, getSessionLapsAPI } from '../services/api';
import TopAppBar from '../components/TopAppBar';
import BottomNavBar from '../components/BottomNavBar';

const History = () => {
  const { user } = useAuth();
  const [sessions, setSessions] = useState([]);
  const [sessionLaps, setSessionLaps] = useState({}); // { [sessionId]: lapsArray }
  const [expandedSession, setExpandedSession] = useState(null);
  const [loading, setLoading] = useState(true);

  // Statistics summaries
  const [totalSessions, setTotalSessions] = useState(0);
  const [totalLaps, setTotalLaps] = useState(0);
  const [personalBest, setPersonalBest] = useState(0); // in seconds

  useEffect(() => {
    const fetchHistory = async () => {
      if (!user) return;
      try {
        const res = await getSessionsAPI(user.id);
        if (res.success && res.data) {
          const allSessions = res.data;
          setSessions(allSessions);
          setTotalSessions(allSessions.length);
          
          const lapsCount = allSessions.reduce((acc, s) => acc + s.totalLaps, 0);
          setTotalLaps(lapsCount);

          // Find the personal best lap by loading laps of sessions or querying
          // Since we don't have all laps pre-loaded, we can dynamically load them or estimate.
          // Let's load laps of the top few sessions or calculate it.
          // To keep it performant, we can inspect if any sessions are completed.
          // Let's fetch all session laps asynchronously to calculate PB.
          calculatePersonalBest(allSessions);
        }
      } catch (err) {
        console.error("Failed to load history:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchHistory();
  }, [user]);

  const calculatePersonalBest = async (allSessions) => {
    try {
      let pbSec = Infinity;
      // Load laps for all sessions to calculate the absolute best (fastest lap)
      const promises = allSessions.map(s => getSessionLapsAPI(s.id));
      const results = await Promise.all(promises);
      
      results.forEach(res => {
        if (res.success && res.data && res.data.laps) {
          res.data.laps.forEach(lap => {
            if (lap.lapDuration < pbSec) {
              pbSec = lap.lapDuration;
            }
          });
        }
      });
      
      setPersonalBest(pbSec === Infinity ? 0 : pbSec);
    } catch (e) {
      console.error("Failed to calculate personal best lap:", e);
    }
  };

  const toggleSessionExpand = async (sessionId) => {
    if (expandedSession === sessionId) {
      setExpandedSession(null);
      return;
    }

    setExpandedSession(sessionId);

    // If laps are not fetched yet for this session, fetch them now
    if (!sessionLaps[sessionId]) {
      try {
        const res = await getSessionLapsAPI(sessionId);
        if (res.success && res.data) {
          setSessionLaps(prev => ({
            ...prev,
            [sessionId]: res.data.laps || []
          }));
        }
      } catch (error) {
        console.error("Failed to load session laps:", error);
      }
    }
  };

  // Helper: Format seconds to MM:SS
  const formatTime = (totalSeconds) => {
    if (!totalSeconds) return '--:--';
    const mins = Math.floor(totalSeconds / 60);
    const secs = totalSeconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  // Helper: Format date
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('th-TH', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  // Helper: Format date summary (for header/history item)
  const formatShortDate = (dateString) => {
    const date = new Date(dateString);
    const days = ['อา.', 'จ.', 'อ.', 'พ.', 'พฤ.', 'ศ.', 'ส.'];
    const months = ['ม.ค.', 'ก.พ.', 'มี.ค.', 'เม.ย.', 'พ.ค.', 'มิ.ย.', 'ก.ค.', 'ส.ค.', 'ก.ย.', 'ต.ค.', 'พ.ย.', 'ธ.ค.'];
    return `${days[date.getDay()]}ที่ ${date.getDate()} ${months[date.getMonth()]} ${date.getFullYear()}`;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center text-slate-400">
        <div className="flex flex-col items-center gap-4">
          <div className="w-8 h-8 border-4 border-orange-500 border-t-transparent rounded-full animate-spin"></div>
          <p className="font-label-caps text-xs">Loading Run History...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950 pb-32 pt-16 font-body-lg flex flex-col">
      <TopAppBar />

      <main className="flex-grow px-5 mt-4 max-w-lg mx-auto w-full overflow-y-auto">
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-display-metrics text-xl font-bold text-slate-100 uppercase tracking-tight">
            ประวัติการวิ่ง
          </h2>
        </div>

        {/* Summary Dashboard Grid */}
        <section className="grid grid-cols-3 gap-2.5 mb-6">
          <div className="glass-card p-3 rounded-2xl flex flex-col justify-between h-28 border border-slate-800/80">
            <span className="font-label-caps text-[9px] text-slate-400 uppercase tracking-wider">
              จำนวนครั้งที่วิ่ง
            </span>
            <div className="flex items-baseline gap-1 mt-auto">
              <span className="font-display-metrics text-2xl font-bold text-orange-500 font-mono">
                {totalSessions}
              </span>
              <span className="text-[9px] text-slate-400 font-semibold uppercase">ครั้ง</span>
            </div>
          </div>
          <div className="glass-card p-3 rounded-2xl flex flex-col justify-between h-28 border border-slate-800/80">
            <span className="font-label-caps text-[9px] text-slate-400 uppercase tracking-wider">
              รอบวิ่งสะสม
            </span>
            <div className="flex items-baseline gap-1 mt-auto">
              <span className="font-display-metrics text-2xl font-bold text-slate-100 font-mono">
                {totalLaps}
              </span>
              <span className="text-[9px] text-slate-400 font-semibold uppercase">รอบ</span>
            </div>
          </div>
          <div className="glass-card p-3 rounded-2xl flex flex-col justify-between h-28 border border-orange-500/30 glow-orange">
            <div className="flex items-center gap-1">
              <span className="font-label-caps text-[9px] text-orange-500 uppercase tracking-wider font-bold">
                รอบเร็วที่สุด
              </span>
            </div>
            <div className="flex items-baseline gap-1 mt-auto">
              <span className="font-display-metrics text-xl font-bold text-slate-100 font-mono">
                {personalBest > 0 ? formatTime(personalBest) : '--:--'}
              </span>
              <span className="text-[9px] text-orange-500 font-semibold uppercase">นาที</span>
            </div>
          </div>
        </section>

        {/* Historical List */}
        <section className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-label-caps text-[10px] text-slate-400 uppercase tracking-widest px-1">
              รายการวิ่งทั้งหมด
            </h3>
            <div className="h-[1px] flex-grow ml-4 bg-slate-800"></div>
          </div>

          {sessions.length === 0 ? (
            <div className="py-12 text-center text-slate-500 glass-card rounded-2xl border border-slate-800">
              <span className="material-symbols-outlined text-4xl mb-2 text-slate-700">history</span>
              <p className="text-sm">ไม่พบประวัติการวิ่ง</p>
            </div>
          ) : (
            <div className="space-y-3">
              {sessions.map((session) => {
                const isExpanded = expandedSession === session.id;
                const lapsList = sessionLaps[session.id] || [];

                return (
                  <div key={session.id} className="glass-card rounded-2xl overflow-hidden border border-slate-800/80 shadow-md">
                    <button 
                      onClick={() => toggleSessionExpand(session.id)}
                      className="w-full flex items-center justify-between p-4 hover:bg-slate-900/40 transition-colors text-left group"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-orange-500/10 flex items-center justify-center text-orange-500 border border-orange-500/10">
                          <span className="material-symbols-outlined text-lg">directions_run</span>
                        </div>
                        <div>
                          <h4 className="text-xs text-slate-400 font-semibold">
                            {formatShortDate(session.startTime)}
                          </h4>
                          <p className="text-sm text-slate-100 font-bold mt-0.5">
                            {session.totalLaps} รอบ
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <div className="text-right">
                          <span className="material-symbols-outlined text-slate-500 text-xs transition-transform duration-300 group-hover:text-orange-500">
                            {isExpanded ? 'keyboard_arrow_up' : 'keyboard_arrow_down'}
                          </span>
                        </div>
                      </div>
                    </button>

                    {/* Collapsible details list */}
                    {isExpanded && (
                      <div className="border-t border-slate-800 bg-slate-950/40 px-4 py-3">
                        {lapsList.length === 0 ? (
                          <div className="text-center py-2 text-xs text-slate-500">
                            {session.totalLaps === 0 ? 'ไม่มีบันทึกรอบวิ่ง' : 'กำลังโหลดข้อมูล...'}
                          </div>
                        ) : (
                          <div className="space-y-2">
                            {lapsList.map((lap) => (
                              <div key={lap.id} className="flex items-center justify-between text-xs py-1 border-b border-slate-800/30 last:border-b-0">
                                <span className="font-label-caps text-slate-400">LAP {lap.lapNumber}</span>
                                <span className={`font-label-caps font-bold font-mono ${lap.lapDuration === personalBest ? 'text-orange-500' : 'text-slate-200'}`}>
                                  {formatTime(lap.lapDuration)}
                                  {lap.lapDuration === personalBest && (
                                    <span className="text-[9px] bg-orange-500/10 border border-orange-500/20 px-1.5 py-0.5 rounded-full ml-2">PB</span>
                                  )}
                                </span>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </section>
      </main>

      <BottomNavBar />
    </div>
  );
};

export default History;
