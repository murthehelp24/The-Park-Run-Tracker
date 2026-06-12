import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email || !password) {
      setErrorMsg('กรุณากรอกข้อมูลให้ครบถ้วน');
      return;
    }

    setIsSubmitting(true);
    setErrorMsg('');
    
    const result = await login(email, password);
    if (result.success) {
      navigate('/dashboard');
    } else {
      setErrorMsg(result.message || 'เข้าสู่ระบบล้มเหลว กรุณาตรวจสอบข้อมูล');
      setIsSubmitting(false);
    }
  };

  return (
    <main className="min-h-screen flex-grow flex flex-col items-center justify-center px-6 py-12 bg-slate-950">
      <div className="w-full max-w-sm space-y-12">
        {/* Logo and Greeting */}
        <div className="flex flex-col items-center text-center space-y-6">
          <div className="w-16 h-16 bg-slate-900 flex items-center justify-center rounded-2xl border border-slate-800 shadow-xl">
            <span 
              className="material-symbols-outlined text-orange-500 text-4xl" 
              style={{ fontVariationSettings: "'FILL' 1" }}
            >
              bolt
            </span>
          </div>
          <div className="space-y-2">
            <h1 className="font-display-metrics text-3xl font-extrabold uppercase tracking-tight text-slate-100">
              Welcome back
            </h1>
            <p className="text-sm text-slate-400">เข้าสู่ระบบเพื่อติดตามรอบวิ่งเรียลไทม์ของคุณ</p>
          </div>
        </div>

        {/* Login Form Container */}
        <div className="glass-card rounded-2xl p-6 shadow-2xl relative overflow-hidden">
          {errorMsg && (
            <div className="mb-4 p-3 bg-red-950/50 border border-red-500/30 text-red-400 text-xs rounded-lg flex items-center gap-2">
              <span className="material-symbols-outlined text-sm">error</span>
              <span>{errorMsg}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-1.5">
              <label className="block font-label-caps text-[11px] text-slate-400 uppercase tracking-widest px-1">
                อีเมล (Email)
              </label>
              <div className="flex items-center px-4 bg-slate-900 border border-slate-800 rounded-xl focus-within:border-orange-500 transition-colors h-14">
                <span className="material-symbols-outlined text-slate-500 mr-3 text-lg">mail</span>
                <input 
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="alex@example.com"
                  className="bg-transparent border-none outline-none focus:ring-0 w-full text-slate-100 placeholder:text-slate-600 text-sm"
                  disabled={isSubmitting}
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="block font-label-caps text-[11px] text-slate-400 uppercase tracking-widest px-1">
                รหัสผ่าน (Password)
              </label>
              <div className="flex items-center px-4 bg-slate-900 border border-slate-800 rounded-xl focus-within:border-orange-500 transition-colors h-14">
                <span className="material-symbols-outlined text-slate-500 mr-3 text-lg">lock</span>
                <input 
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="bg-transparent border-none outline-none focus:ring-0 w-full text-slate-100 placeholder:text-slate-600 text-sm"
                  disabled={isSubmitting}
                />
              </div>
            </div>

            <button 
              type="submit"
              disabled={isSubmitting}
              className="w-full h-14 bg-orange-500 hover:bg-orange-600 text-slate-950 font-label-caps text-xs tracking-wider font-extrabold transition-all duration-200 active:scale-[0.98] uppercase flex items-center justify-center gap-2 rounded-xl shadow-lg shadow-orange-500/10 cursor-pointer disabled:opacity-50"
            >
              {isSubmitting ? 'กำลังเข้าสู่ระบบ...' : 'Continue with Email'}
            </button>
          </form>
        </div>

        {/* Footer Link */}
        <div className="text-center">
          <p className="text-sm text-slate-400">
            ยังไม่มีบัญชีนักวิ่ง? 
            <button 
              onClick={() => navigate('/register')}
              className="text-orange-500 font-bold hover:underline ml-1.5 underline-offset-4 decoration-2 cursor-pointer bg-transparent border-none p-0"
            >
              สมัครสมาชิก
            </button>
          </p>
        </div>
      </div>
    </main>
  );
};

export default Login;
