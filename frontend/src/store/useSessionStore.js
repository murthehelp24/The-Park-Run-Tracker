import { create } from 'zustand';
import { getSessionsAPI, getSessionLapsAPI, simulateScanAPI, finishSessionAPI } from '../services/api';
import { initiateSocketConnection, disconnectSocket } from '../services/socket';

export const useSessionStore = create((set, get) => ({
  // --- States ---
  activeSession: null,
  laps: [],
  lapSeconds: 0,
  isSocketConnected: false,
  loading: true,
  personalBestMsg: '',
  isSimulating: false,
  simError: '',
  isFinishing: false,
  timerInterval: null,

  // --- Actions & API Calls ---
  fetchActiveSession: async (userId) => {
    if (!userId) return;
    set({ loading: true });
    try {
      const res = await getSessionsAPI(userId);
      if (res.success && res.data && res.data.length > 0) {
        const latest = res.data[0];
        if (latest.endTime === null) {
          set({ activeSession: latest });
          // Fetch its laps
          const lapsRes = await getSessionLapsAPI(latest.id);
          if (lapsRes.success && lapsRes.data) {
            set({ laps: lapsRes.data.laps || [] });
            
            // Calculate elapsed seconds for the current lap
            const startTime = new Date(latest.startTime).getTime();
            const now = new Date().getTime();
            const totalElapsedSec = Math.floor((now - startTime) / 1000);
            
            if (lapsRes.data.laps.length > 0) {
              // Find elapsed time since the last lap scanned
              const lastLapTime = new Date(lapsRes.data.laps[lapsRes.data.laps.length - 1].scannedAt).getTime();
              const lapElapsed = Math.floor((now - lastLapTime) / 1000);
              set({ lapSeconds: lapElapsed >= 0 ? lapElapsed : 0 });
            } else {
              set({ lapSeconds: totalElapsedSec >= 0 ? totalElapsedSec : 0 });
            }

            // Start the stopwatch timer since session is active
            get().startTimer();
          }
        } else {
          // Latest is not active, clear session state
          get().stopTimer();
          set({ activeSession: null, laps: [], lapSeconds: 0 });
        }
      } else {
        // No sessions at all
        get().stopTimer();
        set({ activeSession: null, laps: [], lapSeconds: 0 });
      }
    } catch (err) {
      console.error("Failed to load active session:", err);
    } finally {
      set({ loading: false });
    }
  },

  // --- Stopwatch timer control ---
  startTimer: () => {
    // Clear any existing timer first to avoid duplicates
    get().stopTimer();
    const interval = setInterval(() => {
      set((state) => ({ lapSeconds: state.lapSeconds + 1 }));
    }, 1000);
    set({ timerInterval: interval });
  },

  stopTimer: () => {
    const interval = get().timerInterval;
    if (interval) {
      clearInterval(interval);
      set({ timerInterval: null });
    }
  },

  // --- Socket.io connection and listeners setup ---
  setupSocket: (user, formatTime) => {
    if (!user) return () => {};
    const socket = initiateSocketConnection();

    socket.connect();

    socket.on('connect', () => {
      set({ isSocketConnected: true });
    });

    socket.on('disconnect', () => {
      set({ isSocketConnected: false });
    });

    socket.on('session-started', (data) => {
      if (data.user?.id === user.id) {
        set({
          activeSession: data.session,
          laps: [],
          lapSeconds: 0,
          personalBestMsg: ''
        });
        get().startTimer();
      }
    });

    socket.on('new-lap', (data) => {
      if (data.user?.id === user.id) {
        set({ activeSession: data.session });
        set((state) => {
          const updated = [...state.laps, data.lap];
          let pbMsg = state.personalBestMsg;
          if (updated.length > 1) {
            const fastestSoFar = Math.min(...updated.slice(0, -1).map(l => l.lapDuration));
            if (data.lap.lapDuration < fastestSoFar) {
              pbMsg = `ทำเวลาได้ดีที่สุด! รอบที่ ${data.lap.lapNumber}: ${formatTime(data.lap.lapDuration)}`;
            }
          }
          return { laps: updated, lapSeconds: 0, personalBestMsg: pbMsg };
        });
      }
    });

    socket.on('session-finished', (data) => {
      if (data.userId === user.id) {
        get().stopTimer();
        set({
          activeSession: null,
          laps: [],
          lapSeconds: 0,
          personalBestMsg: ''
        });
      }
    });

    // Return cleanup function to be run on component unmount
    return () => {
      socket.off('connect');
      socket.off('disconnect');
      socket.off('session-started');
      socket.off('new-lap');
      socket.off('session-finished');
      disconnectSocket();
      get().stopTimer();
    };
  },

  // --- API Actions ---
  handleSimulateScan: async (wristbandUid) => {
    if (!wristbandUid) return;
    set({ isSimulating: true, simError: '' });
    try {
      await simulateScanAPI(wristbandUid);
    } catch (err) {
      console.error("Failed to simulate scan:", err);
      set({ simError: err.response?.data?.message || 'การจำลองสแกนล้มเหลว' });
    } finally {
      set({ isSimulating: false });
    }
  },

  handleFinishSession: async () => {
    set({ isFinishing: true });
    try {
      const res = await finishSessionAPI();
      if (res.success) {
        get().stopTimer();
        set({
          activeSession: null,
          laps: [],
          lapSeconds: 0,
          personalBestMsg: ''
        });
      }
    } catch (err) {
      console.error("Failed to finish session:", err);
    } finally {
      set({ isFinishing: false });
    }
  },

  setPersonalBestMsg: (msg) => set({ personalBestMsg: msg }),
}));
