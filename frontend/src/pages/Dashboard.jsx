import { useEffect } from 'react';
import { useAuthStore } from '../store/useAuthStore';
import { useSessionStore } from '../store/useSessionStore';
import TopAppBar from '../components/TopAppBar';
import BottomNavBar from '../components/BottomNavBar';
import styles from './Dashboard.module.css';

const formatTime = (totalSeconds) => {
  const mins = Math.floor(totalSeconds / 60);
  const secs = totalSeconds % 60;
  return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
};

const Dashboard = () => {
  const { user, wristband } = useAuthStore();

  const {
    activeSession,
    laps,
    lapSeconds,
    isSocketConnected,
    loading,
    personalBestMsg,
    isSimulating,
    simError,
    isFinishing,
    fetchActiveSession,
    setupSocket,
    handleSimulateScan,
    handleFinishSession,
    setPersonalBestMsg,
  } = useSessionStore();

  // 1. Fetch active session on mount
  useEffect(() => {
    if (user) {
      fetchActiveSession(user.id);
    }
  }, [user, fetchActiveSession]);

  // 2. Setup Socket.io listeners
  useEffect(() => {
    const cleanup = setupSocket(user, formatTime);
    return cleanup;
  }, [user, setupSocket]);

  const getTotalSessionDuration = () => {
    if (!activeSession) return 0;
    const totalLapDuration = laps.reduce((sum, lap) => sum + lap.lapDuration, 0);
    return totalLapDuration + lapSeconds;
  };

  const getAverageLapDuration = () => {
    if (laps.length === 0) return 0;
    const sum = laps.reduce((acc, lap) => acc + lap.lapDuration, 0);
    return Math.floor(sum / laps.length);
  };

  const getLastLapTime = () => {
    if (laps.length === 0) return 0;
    return laps[laps.length - 1].lapDuration;
  };

  const handleSimulate = () => {
    if (wristband) {
      handleSimulateScan(wristband.uid);
    }
  };

  if (loading) {
    return (
      <div className="loading-screen">
        <div className="spinner"></div>
        <p style={{ fontFamily: 'var(--font-mono)', fontSize: '12px', letterSpacing: '0.05em' }}>Loading Live Data...</p>
      </div>
    );
  }

  return (
    <div className={styles['dashboard']}>
      <TopAppBar isSocketConnected={isSocketConnected} />

      <main className={styles['dashboard__main']}>
        {/* Personal Best Alert Banner */}
        {personalBestMsg && (
          <div className={styles['dashboard__alert-wrapper']}>
            <div className={`${styles['dashboard__alert-card']} glass-card`}>
              <div className={styles['dashboard__alert-icon-box']}>
                <span className="material-symbols-outlined text-lg" style={{ fontVariationSettings: "'FILL' 1" }}>
                  emoji_events
                </span>
              </div>
              <div className={styles['dashboard__alert-content']}>
                <p className={styles['dashboard__alert-title']}>NEW PERSONAL BEST</p>
                <p className={styles['dashboard__alert-text']}>{personalBestMsg}</p>
              </div>
              <button 
                onClick={() => setPersonalBestMsg('')} 
                className={`material-symbols-outlined ${styles['dashboard__alert-close-btn']}`}
              >
                close
              </button>
            </div>
          </div>
        )}

        {/* Hero Section: Active Running State */}
        {activeSession ? (
          <section className={styles['dashboard__timer-section']}>
            <div className={styles['dashboard__timer-ring-wrapper']}>
              <svg className={styles['dashboard__timer-ring-svg']} viewBox="0 0 100 100">
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
                    strokeDashoffset: `${282.7 - (282.7 * (lapSeconds % 60)) / 60}`
                  }}
                />
              </svg>

              <div className={styles['dashboard__timer-content']}>
                <p className={styles['dashboard__lap-label']}>
                  รอบที่ {laps.length + 1}
                </p>
                <h2 className={`${styles['dashboard__timer-text']} timer-glow`}>
                  {formatTime(lapSeconds)}
                </h2>
                <div className="flex justify-center mt-1">
                  <span className={`material-symbols-outlined ${styles['dashboard__timer-icon']}`}>timer</span>
                </div>
            </div>
          </div>

            <button 
              onClick={handleFinishSession}
              disabled={isFinishing}
              className={styles['dashboard__finish-btn']}
            >
              {isFinishing ? (
                <span>กำลังบันทึก...</span>
              ) : (
                <>
                  <span className="material-symbols-outlined">stop_circle</span>
                  <span>บันทึกและจบการวิ่ง</span>
                </>
              )}
            </button>
          </section>
        ) : (
          <section className={`${styles['dashboard__empty-state']} glass-card`}>
            <div className={styles['dashboard__empty-icon-box']}>
              <span className="material-symbols-outlined text-3xl">sensors</span>
            </div>
            <div className="space-y-2">
              <h3 className={styles['dashboard__empty-title']}>พร้อมเริ่มต้นวิ่ง</h3>
              <p className={styles['dashboard__empty-subtitle']}>
                แตะสายรัดข้อมือ NFC ที่จุดสแกนในสนามเพื่อเริ่มจับเวลาวิ่งโดยอัตโนมัติ
              </p>
            </div>
            <div className={styles['dashboard__empty-badge']}>
              <span className={styles['dashboard__empty-badge-dot']}></span>
              <span className={styles['dashboard__empty-badge-text']}>รอการแตะสัญญาณ NFC...</span>
            </div>
          </section>
        )}

        {/* Metrics Grid */}
        <section className={styles['dashboard__grid']}>
          <div className={`${styles['dashboard__metric-card']} glass-card`}>
            <span className="material-symbols-outlined text-orange-500 mb-1.5 text-xl">history</span>
            <p className={styles['dashboard__metric-label']}>เวลารอบล่าสุด</p>
            <p className={styles['dashboard__metric-value']}>
              {laps.length > 0 ? formatTime(getLastLapTime()) : '--:--'}
            </p>
          </div>
          <div className={`${styles['dashboard__metric-card']} glass-card`}>
            <span className="material-symbols-outlined text-orange-500 mb-1.5 text-xl">reorder</span>
            <p className={styles['dashboard__metric-label']}>จำนวนรอบรวม</p>
            <p className={styles['dashboard__metric-value']}>
              {activeSession ? `${laps.length} รอบ` : '0 รอบ'}
            </p>
          </div>
          <div className={`${styles['dashboard__metric-card']} glass-card`}>
            <span className="material-symbols-outlined text-orange-500 mb-1.5 text-xl">directions_run</span>
            <p className={styles['dashboard__metric-label']}>เวลารวมเซสชัน</p>
            <p className={styles['dashboard__metric-value']}>
              {activeSession ? formatTime(getTotalSessionDuration()) : '00:00'}
            </p>
          </div>
          <div className={`${styles['dashboard__metric-card']} glass-card`}>
            <span className="material-symbols-outlined text-orange-500 mb-1.5 text-xl">speed</span>
            <p className={styles['dashboard__metric-label']}>เวลาเฉลี่ย/รอบ</p>
            <p className={styles['dashboard__metric-value']}>
              {laps.length > 0 ? formatTime(getAverageLapDuration()) : '--:--'}
            </p>
          </div>
        </section>

        {/* Dynamic visualization */}
        <section className="mt-4">
          <div className={`${styles['dashboard__map-card']} glass-card`}>
            <div className={styles['dashboard__map-svg-wrapper']}>
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
            <div className={styles['dashboard__map-badge']}>
              <span className="material-symbols-outlined text-orange-500 text-sm">location_on</span>
              <span className={styles['dashboard__map-badge-text']}>
                PARK RUN CIRCUIT · <span className={styles['dashboard__map-badge-km']}>{activeSession ? `${(laps.length * 0.4).toFixed(1)}KM` : '0.0KM'}</span>
              </span>
            </div>
            <div className={styles['dashboard__map-overlay']}></div>
          </div>
        </section>

        {/* Lap splits list log */}
        {activeSession && laps.length > 0 && (
          <section className={styles['dashboard__splits-section']}>
            <h3 className={styles['dashboard__splits-title']}>
              Recent Lap Splits
            </h3>
            <div className={`${styles['dashboard__splits-card']} glass-card`}>
              {[...laps].reverse().map((lap, index) => {
                const lapIndex = laps.length - index;
                return (
                  <div key={lap.id || lapIndex} className={styles['dashboard__split-row']}>
                    <span className={styles['dashboard__split-label']}>LAP {lapIndex}</span>
                    <div className={styles['dashboard__split-value-wrapper']}>
                      <span className={styles['dashboard__split-value']}>
                        {formatTime(lap.lapDuration)}
                      </span>
                      {index === 0 && (
                        <span className={styles['dashboard__split-badge']}>
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

        {/* NFC Simulator panel - only shown in development or if a wristband is bound */}
        {wristband && (
          <section className={styles['dashboard__simulator-section']}>
            <div className={`${styles['dashboard__simulator-card']} glass-card`}>
              <div className={styles['dashboard__simulator-header']}>
                <span className="material-symbols-outlined text-orange-500">developer_board</span>
                <span className={styles['dashboard__simulator-title']}>NFC SIMULATOR (DEV MODE)</span>
              </div>
              <p className={styles['dashboard__simulator-desc']}>
                จำลองการแตะสายรัด UID: <strong>{wristband.uid}</strong> ที่จุดเช็คพอยต์
              </p>
              <button 
                onClick={handleSimulate}
                disabled={isSimulating}
                className={styles['dashboard__simulator-btn']}
              >
                {isSimulating ? (
                  <span>กำลังส่งข้อมูล...</span>
                ) : (
                  <>
                    <span className="material-symbols-outlined">sensors</span>
                    <span>จำลองการแตะการ์ด (Simulate Tap)</span>
                  </>
                )}
              </button>
              {simError && <p className={styles['dashboard__simulator-error']}>{simError}</p>}
            </div>
          </section>
        )}
      </main>

      <BottomNavBar />
    </div>
  );
};

export default Dashboard;
