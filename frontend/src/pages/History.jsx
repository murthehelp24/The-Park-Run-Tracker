import { useEffect } from 'react';
import { useAuthStore } from '../store/useAuthStore';
import { useHistoryStore } from '../store/useHistoryStore';
import TopAppBar from '../components/TopAppBar';
import BottomNavBar from '../components/BottomNavBar';
import styles from './History.module.css';

const History = () => {
  const { user } = useAuthStore();

  const {
    sessions,
    sessionLaps,
    expandedSession,
    loading,
    totalSessions,
    totalLaps,
    personalBest,
    fetchHistory,
    toggleSessionExpand,
  } = useHistoryStore();

  useEffect(() => {
    if (user) {
      fetchHistory(user.id);
    }
  }, [user, fetchHistory]);

  const formatTime = (totalSeconds) => {
    if (!totalSeconds) return '--:--';
    const mins = Math.floor(totalSeconds / 60);
    const secs = totalSeconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const formatShortDate = (dateString) => {
    const date = new Date(dateString);
    const days = ['อา.', 'จ.', 'อ.', 'พ.', 'พฤ.', 'ศ.', 'ส.'];
    const months = ['ม.ค.', 'ก.พ.', 'มี.ค.', 'เม.ย.', 'พ.ค.', 'มิ.ย.', 'ก.ค.', 'ส.ค.', 'ก.ย.', 'ต.ค.', 'พ.ย.', 'ธ.ค.'];
    return `${days[date.getDay()]}ที่ ${date.getDate()} ${months[date.getMonth()]} ${date.getFullYear()}`;
  };

  if (loading) {
    return (
      <div className="loading-screen">
        <div className="spinner"></div>
        <p style={{ fontFamily: 'var(--font-mono)', fontSize: '11px', letterSpacing: '0.05em' }}>Loading Run History...</p>
      </div>
    );
  }

  return (
    <div className={styles['history']}>
      <TopAppBar />

      <main className={styles['history__main']}>
        <div className="flex items-center justify-between mb-4">
          <h2 className={styles['history__title']}>
            ประวัติการวิ่ง
          </h2>
        </div>

        {/* Summary Dashboard Grid */}
        <section className={styles['history__summary-grid']}>
          <div className={`${styles['history__summary-card']} glass-card`}>
            <span className={styles['history__summary-label']}>
              จำนวนครั้งที่วิ่ง
            </span>
            <div className={styles['history__summary-value-wrapper']}>
              <span className={`${styles['history__summary-value']} ${styles['history__summary-value--orange']}`}>
                {totalSessions}
              </span>
              <span className={styles['history__summary-unit']}>ครั้ง</span>
            </div>
          </div>
          <div className={`${styles['history__summary-card']} glass-card`}>
            <span className={styles['history__summary-label']}>
              รอบวิ่งสะสม
            </span>
            <div className={styles['history__summary-value-wrapper']}>
              <span className={styles['history__summary-value']}>
                {totalLaps}
              </span>
              <span className={styles['history__summary-unit']}>รอบ</span>
            </div>
          </div>
          <div className={`${styles['history__summary-card']} ${styles['history__summary-card--pb']} glass-card`}>
            <span className={`${styles['history__summary-label']} ${styles['history__summary-label--pb']}`}>
              รอบเร็วที่สุด
            </span>
            <div className={styles['history__summary-value-wrapper']}>
              <span className={styles['history__summary-value']}>
                {personalBest > 0 ? formatTime(personalBest) : '--:--'}
              </span>
              <span className={`${styles['history__summary-unit']} ${styles['history__summary-unit--orange']}`}>นาที</span>
            </div>
          </div>
        </section>

        {/* Historical List */}
        <section className={styles['history__list-section']}>
          <div className={styles['history__list-header']}>
            <h3 className={styles['history__list-title']}>
              รายการวิ่งทั้งหมด
            </h3>
            <div className={styles['history__list-divider']}></div>
          </div>

          {sessions.length === 0 ? (
            <div className={styles['history__empty-state']}>
              <span className={`material-symbols-outlined ${styles['history__empty-icon']}`}>history</span>
              <p className={styles['history__empty-text']}>ไม่พบประวัติการวิ่ง</p>
            </div>
          ) : (
            <div className={styles['history__session-list']}>
              {sessions.map((session) => {
                const isExpanded = expandedSession === session.id;
                const lapsList = sessionLaps[session.id] || [];

                return (
                  <div key={session.id} className={`${styles['history__session-card']} glass-card`}>
                    <button 
                      onClick={() => toggleSessionExpand(session.id)}
                      className={styles['history__session-trigger']}
                    >
                      <div className={styles['history__session-info']}>
                        <div className={styles['history__session-icon-box']}>
                          <span className="material-symbols-outlined text-lg">directions_run</span>
                        </div>
                        <div className={styles['history__session-meta']}>
                          <h4 className={styles['history__session-date']}>
                            {formatShortDate(session.startTime)}
                          </h4>
                          <p className={styles['history__session-laps']}>
                            {session.totalLaps} รอบ
                          </p>
                        </div>
                      </div>
                      <span className={`material-symbols-outlined ${styles['history__arrow-icon']}`} style={{ transform: isExpanded ? 'rotate(180deg)' : 'none' }}>
                        keyboard_arrow_down
                      </span>
                    </button>

                    {/* Collapsible details list */}
                    {isExpanded && (
                      <div className={styles['history__session-laps-list']}>
                        {lapsList.length === 0 ? (
                          <div className="text-center py-2 text-xs text-slate-500">
                            {session.totalLaps === 0 ? 'ไม่มีบันทึกรอบวิ่ง' : 'กำลังโหลดข้อมูล...'}
                          </div>
                        ) : (
                          <div>
                            {lapsList.map((lap) => (
                              <div key={lap.id} className={styles['history__lap-row']}>
                                <span className={styles['history__lap-label']}>LAP {lap.lapNumber}</span>
                                <span className={`${styles['history__lap-time']} ${lap.lapDuration === personalBest ? styles['history__lap-time--pb'] : ''}`}>
                                  {formatTime(lap.lapDuration)}
                                  {lap.lapDuration === personalBest && (
                                    <span className={styles['history__pb-badge']}>PB</span>
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
