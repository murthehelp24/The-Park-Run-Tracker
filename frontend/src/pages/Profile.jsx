import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { assignWristbandAPI } from '../services/api';
import TopAppBar from '../components/TopAppBar';
import BottomNavBar from '../components/BottomNavBar';

const Profile = () => {
  const { user, wristband, logout, updateWristbandState } = useAuth();
  const [nfcUid, setNfcUid] = useState('');
  const [isBinding, setIsBinding] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  const handleBindWristband = async (e) => {
    e.preventDefault();
    if (!nfcUid.trim()) {
      setErrorMsg('กรุณากรอกรหัส NFC UID ของสายรัดข้อมือ');
      return;
    }

    setIsBinding(true);
    setErrorMsg('');
    setSuccessMsg('');

    try {
      const response = await assignWristbandAPI(nfcUid.trim());
      if (response.success && response.data) {
        setSuccessMsg('ผูกสายรัดข้อมือ NFC สำเร็จเรียบร้อยแล้ว!');
        updateWristbandState(response.data);
      } else {
        setErrorMsg(response.message || 'การผูกสายรัดข้อมือล้มเหลว');
      }
    } catch (error) {
      const msg = error.response?.data?.message || 'ไม่พบอุปกรณ์นี้ หรือเกิดข้อผิดพลาดในการผูกอุปกรณ์';
      setErrorMsg(msg);
    } finally {
      setIsBinding(false);
    }
  };

  const handleUnbind = () => {
    // Note: If backend has no unbind route, we can just clear it locally or explain
    setErrorMsg('กรุณาติดต่อเจ้าหน้าที่ดูแลระบบเพื่อยกเลิกการผูกสายรัดข้อมือ');
  };

  const achievements = [
    { id: '1', name: '50 LAPS CLUB', icon: 'star', desc: 'วิ่งสะสมครบ 50 รอบสนาม', active: true },
    { id: '2', name: 'EARLY BIRD RUNNER', icon: 'wb_sunny', desc: 'วิ่งยามเช้าก่อนเวลา 07:00 น.', active: true },
    { id: '3', name: 'SPRINT MASTER', icon: 'bolt', desc: 'ทำเวลาเฉลี่ย/รอบ ต่ำกว่า 4 นาที', active: false },
  ];

  return (
    <div className="min-h-screen bg-slate-950 pb-32 pt-16 font-body-lg flex flex-col">
      <TopAppBar />

      <main className="flex-grow px-5 mt-4 max-w-lg mx-auto w-full overflow-y-auto space-y-6">
        {/* Profile Card Header */}
        <section className="flex flex-col items-center justify-center pt-4">
          <div className="relative group">
            <div className="absolute inset-0 bg-orange-500/10 rounded-full blur-xl"></div>
            <div className="relative w-24 h-24 rounded-full border-2 border-orange-500 p-1 overflow-hidden">
              <div className="w-full h-full bg-slate-800 rounded-full flex items-center justify-center text-slate-400 font-bold text-2xl uppercase">
                {user?.firstName?.charAt(0) || 'R'}
              </div>
            </div>
            <div className="absolute bottom-0 right-0 bg-orange-500 text-slate-950 rounded-full p-1 border-2 border-slate-950 flex items-center justify-center">
              <span className="material-symbols-outlined text-[16px]" style={{ fontVariationSettings: "'FILL' 1" }}>
                verified
              </span>
            </div>
          </div>
          <div className="text-center mt-4 space-y-1">
            <h2 className="font-display-metrics text-xl font-bold text-slate-100">
              {user ? `${user.firstName} ${user.lastName}` : 'นักวิ่ง'}
            </h2>
            <p className="text-xs text-slate-400 font-mono tracking-wider">{user?.email}</p>
          </div>
        </section>

        {/* NFC Wristband Section */}
        <section className="space-y-2">
          <h3 className="font-label-caps text-[10px] text-slate-400 uppercase tracking-widest px-1">
            การจัดการสายรัดข้อมือ NFC
          </h3>
          <div className="glass-card rounded-2xl p-5 border border-slate-800/80 shadow-md">
            {wristband ? (
              <div className="space-y-4">
                <div className="flex justify-between items-center bg-slate-900/50 p-3 rounded-xl border border-slate-800">
                  <div>
                    <span className="text-[10px] font-label-caps text-orange-500 font-bold">NFC WRISTBAND</span>
                    <p className="text-sm font-bold text-slate-200 mt-0.5 font-mono">{wristband.uid}</p>
                  </div>
                  <div className="flex items-center gap-1 bg-green-500/10 border border-green-500/20 px-2 py-0.5 rounded-full text-green-500">
                    <span className="w-1.5 h-1.5 bg-green-500 rounded-full animate-ping"></span>
                    <span className="text-[9px] font-label-caps font-bold">ACTIVE</span>
                  </div>
                </div>
                <button 
                  onClick={handleUnbind}
                  className="w-full py-2.5 rounded-xl border border-slate-800 hover:border-slate-700 text-slate-400 hover:text-slate-200 text-xs font-semibold transition-all cursor-pointer text-center"
                >
                  เปลี่ยนสายรัดข้อมือ
                </button>
              </div>
            ) : (
              <form onSubmit={handleBindWristband} className="space-y-3">
                <div className="text-center py-2 space-y-1">
                  <p className="text-xs text-slate-400">ยังไม่ได้ผูกสายรัดข้อมือ NFC สำหรับระบุตัวตนเวลาวิ่ง</p>
                </div>
                
                {errorMsg && (
                  <div className="p-2 bg-red-950/40 border border-red-500/20 text-red-400 text-xs rounded-lg flex items-center gap-2">
                    <span className="material-symbols-outlined text-sm">error</span>
                    <span>{errorMsg}</span>
                  </div>
                )}
                
                {successMsg && (
                  <div className="p-2 bg-green-950/40 border border-green-500/20 text-green-400 text-xs rounded-lg flex items-center gap-2">
                    <span className="material-symbols-outlined text-sm">check_circle</span>
                    <span>{successMsg}</span>
                  </div>
                )}

                <div className="flex gap-2">
                  <input 
                    type="text"
                    value={nfcUid}
                    onChange={(e) => setNfcUid(e.target.value)}
                    placeholder="ป้อนรหัส NFC UID ของอุปกรณ์"
                    className="flex-1 bg-slate-900 border border-slate-800 rounded-xl px-3 text-slate-100 placeholder:text-slate-600 text-xs outline-none focus:border-orange-500 transition-colors h-11"
                    disabled={isBinding}
                  />
                  <button 
                    type="submit"
                    disabled={isBinding}
                    className="bg-orange-500 hover:bg-orange-600 disabled:opacity-50 text-slate-950 text-xs font-bold font-label-caps px-4 rounded-xl transition-all cursor-pointer h-11 flex items-center justify-center"
                  >
                    {isBinding ? 'ผูกข้อมูล...' : 'ผูกอุปกรณ์'}
                  </button>
                </div>
              </form>
            )}
          </div>
        </section>

        {/* Achievements Section */}
        <section className="space-y-2">
          <h3 className="font-label-caps text-[10px] text-slate-400 uppercase tracking-widest px-1">
            ความสำเร็จของฉัน
          </h3>
          <div className="glass-card rounded-2xl p-4 border border-slate-800/80 shadow-md divide-y divide-slate-800/50">
            {achievements.map((ach) => (
              <div key={ach.id} className="flex items-center gap-3 py-2.5 first:pt-0 last:pb-0">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center ${ach.active ? 'bg-orange-500/10 text-orange-500 border border-orange-500/10' : 'bg-slate-900 text-slate-600 border border-slate-900'}`}>
                  <span className="material-symbols-outlined text-lg" style={{ fontVariationSettings: ach.active ? "'FILL' 1" : "'FILL' 0" }}>
                    {ach.icon}
                  </span>
                </div>
                <div>
                  <h4 className={`text-xs font-bold font-label-caps ${ach.active ? 'text-slate-200' : 'text-slate-500'}`}>{ach.name}</h4>
                  <p className={`text-[10px] ${ach.active ? 'text-slate-400' : 'text-slate-600'}`}>{ach.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Logout Section */}
        <section className="pt-4 pb-6">
          <button 
            onClick={logout}
            className="w-full py-3 rounded-xl border border-orange-500/30 text-orange-500 font-semibold text-sm flex items-center justify-center gap-2 hover:bg-orange-500/10 active:scale-95 transition-all cursor-pointer"
          >
            <span className="material-symbols-outlined text-lg">logout</span>
            ออกจากระบบ
          </button>
        </section>
      </main>

      <BottomNavBar />
    </div>
  );
};

export default Profile;
