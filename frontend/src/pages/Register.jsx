import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Register = () => {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const { register } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!firstName || !lastName || !email || !password) {
      setErrorMsg('กรุณากรอกข้อมูลหลักให้ครบถ้วน');
      return;
    }

    setIsSubmitting(true);
    setErrorMsg('');
    setSuccessMsg('');

    const result = await register(firstName, lastName, email, password);
    if (result.success) {
      setSuccessMsg('สมัครสมาชิกสำเร็จแล้ว! กำลังนำคุณไปหน้าเข้าสู่ระบบ...');
      setTimeout(() => {
        navigate('/login');
      }, 2000);
    } else {
      setErrorMsg(result.message || 'สมัครสมาชิกไม่สำเร็จ กรุณาลองอีกครั้ง');
      setIsSubmitting(false);
    }
  };

  return (
    <main className="min-h-screen flex-grow flex flex-col items-center justify-center px-6 py-16 bg-slate-950">
      <div className="w-full max-w-sm space-y-8">
        {/* Branding header */}
        <div className="flex flex-col items-center text-center space-y-4">
          <div className="w-16 h-16 bg-slate-900 flex items-center justify-center rounded-2xl border border-slate-800 shadow-xl">
            <span 
              className="material-symbols-outlined text-orange-500 text-4xl" 
              style={{ fontVariationSettings: "'FILL' 1" }}
            >
              bolt
            </span>
          </div>
          <div className="space-y-1">
            <h1 className="font-display-metrics text-3xl font-extrabold uppercase tracking-tight text-slate-100">
              Get Started
            </h1>
            <p className="text-sm text-slate-400">สร้างบัญชีนักวิ่งใหม่เพื่อบันทึกประวัติความเร็ว</p>
          </div>
        </div>

        {/* Card for Registration form */}
        <div className="glass-card rounded-2xl p-6 shadow-2xl relative overflow-hidden">
          {errorMsg && (
            <div className="mb-4 p-3 bg-red-950/50 border border-red-500/30 text-red-400 text-xs rounded-lg flex items-center gap-2">
              <span className="material-symbols-outlined text-sm">error</span>
              <span>{errorMsg}</span>
            </div>
          )}
          
          {successMsg && (
            <div className="mb-4 p-3 bg-green-950/50 border border-green-500/30 text-green-400 text-xs rounded-lg flex items-center gap-2">
              <span className="material-symbols-outlined text-sm">check_circle</span>
              <span>{successMsg}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1">
                <label className="block font-label-caps text-[10px] text-slate-400 uppercase tracking-wider px-1">
                  ชื่อ (First Name)
                </label>
                <div className="flex items-center px-3 bg-slate-900 border border-slate-800 rounded-xl focus-within:border-orange-500 transition-colors h-12">
                  <input 
                    type="text"
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                    placeholder="สมชาย"
                    className="bg-transparent border-none outline-none focus:ring-0 w-full text-slate-100 placeholder:text-slate-600 text-sm"
                    disabled={isSubmitting}
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="block font-label-caps text-[10px] text-slate-400 uppercase tracking-wider px-1">
                  นามสกุล (Last Name)
                </label>
                <div className="flex items-center px-3 bg-slate-900 border border-slate-800 rounded-xl focus-within:border-orange-500 transition-colors h-12">
                  <input 
                    type="text"
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                    placeholder="รักวิ่ง"
                    className="bg-transparent border-none outline-none focus:ring-0 w-full text-slate-100 placeholder:text-slate-600 text-sm"
                    disabled={isSubmitting}
                  />
                </div>
              </div>
            </div>

            <div className="space-y-1">
              <label className="block font-label-caps text-[10px] text-slate-400 uppercase tracking-wider px-1">
                อีเมล (Email)
              </label>
              <div className="flex items-center px-3 bg-slate-900 border border-slate-800 rounded-xl focus-within:border-orange-500 transition-colors h-12">
                <span className="material-symbols-outlined text-slate-500 mr-2 text-base">mail</span>
                <input 
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="somchai@example.com"
                  className="bg-transparent border-none outline-none focus:ring-0 w-full text-slate-100 placeholder:text-slate-600 text-sm"
                  disabled={isSubmitting}
                />
              </div>
            </div>

            <div className="space-y-1">
              <label className="block font-label-caps text-[10px] text-slate-400 uppercase tracking-wider px-1">
                รหัสผ่าน (Password)
              </label>
              <div className="flex items-center px-3 bg-slate-900 border border-slate-800 rounded-xl focus-within:border-orange-500 transition-colors h-12">
                <span className="material-symbols-outlined text-slate-500 mr-2 text-base">lock</span>
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

            <div className="space-y-1">
              <label className="block font-label-caps text-[10px] text-slate-400 uppercase tracking-wider px-1">
                รหัสสายรัดข้อมือ NFC (ถ้ามี)
              </label>
              <div className="flex items-center px-3 bg-slate-900 border border-slate-800 rounded-xl focus-within:border-orange-500 transition-colors h-12">
                <span className="material-symbols-outlined text-slate-500 mr-2 text-base">contactless</span>
                <input 
                  type="text"
                  placeholder="ผูกข้อมูลทีหลังได้ในหน้า Profile"
                  className="bg-transparent border-none outline-none focus:ring-0 w-full text-slate-400 placeholder:text-slate-600 text-xs"
                  disabled={true} // Marked disabled for onboarding to be bound inside Profile screen
                />
              </div>
            </div>

            <button 
              type="submit"
              disabled={isSubmitting}
              className="w-full h-12 bg-orange-500 hover:bg-orange-600 text-slate-950 font-label-caps text-xs tracking-wider font-extrabold transition-all duration-200 active:scale-[0.98] uppercase flex items-center justify-center gap-2 rounded-xl shadow-lg shadow-orange-500/10 cursor-pointer disabled:opacity-50 mt-4"
            >
              {isSubmitting ? 'กำลังดำเนินการ...' : 'Create Account'}
            </button>
          </form>
        </div>

        {/* Back to Login Footer */}
        <div className="text-center">
          <p className="text-sm text-slate-400">
            มีบัญชีสมาชิกอยู่แล้ว? 
            <button 
              onClick={() => navigate('/login')}
              className="text-orange-500 font-bold hover:underline ml-1.5 underline-offset-4 decoration-2 cursor-pointer bg-transparent border-none p-0"
            >
              เข้าสู่ระบบ
            </button>
          </p>
        </div>
      </div>
    </main>
  );
};

export default Register;
