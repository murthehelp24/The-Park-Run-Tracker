import { create } from 'zustand';
import { getSessionsAPI, getSessionLapsAPI } from '../services/api';

export const useHistoryStore = create((set, get) => ({
  // --- States ---
  sessions: [],
  sessionLaps: {},
  expandedSession: null,
  loading: true,
  totalSessions: 0,
  totalLaps: 0,
  personalBest: 0,

  // --- Actions ---
  fetchHistory: async (userId) => {
    if (!userId) return;
    set({ loading: true });
    try {
      const res = await getSessionsAPI(userId);
      if (res.success && res.data) {
        const allSessions = res.data;
        const totalSessionsCount = allSessions.length;
        const totalLapsCount = allSessions.reduce((acc, s) => acc + s.totalLaps, 0);
        
        set({
          sessions: allSessions,
          totalSessions: totalSessionsCount,
          totalLaps: totalLapsCount,
        });

        // Calculate Personal Best
        await get().calculatePersonalBest(allSessions);
      }
    } catch (err) {
      console.error("Failed to load history:", err);
    } finally {
      set({ loading: false });
    }
  },

  calculatePersonalBest: async (allSessions) => {
    try {
      let pbSec = Infinity;
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
      
      set({ personalBest: pbSec === Infinity ? 0 : pbSec });
    } catch (e) {
      console.error("Failed to calculate personal best lap:", e);
    }
  },

  toggleSessionExpand: async (sessionId) => {
    const currentExpanded = get().expandedSession;
    if (currentExpanded === sessionId) {
      set({ expandedSession: null });
      return;
    }

    set({ expandedSession: sessionId });

    const sessionLapsCached = get().sessionLaps;
    if (!sessionLapsCached[sessionId]) {
      try {
        const res = await getSessionLapsAPI(sessionId);
        if (res.success && res.data) {
          set((state) => ({
            sessionLaps: {
              ...state.sessionLaps,
              [sessionId]: res.data.laps || []
            }
          }));
        }
      } catch (error) {
        console.error("Failed to load session laps:", error);
      }
    }
  },

  resetHistory: () => {
    set({
      sessions: [],
      sessionLaps: {},
      expandedSession: null,
      loading: true,
      totalSessions: 0,
      totalLaps: 0,
      personalBest: 0,
    });
  }
}));
