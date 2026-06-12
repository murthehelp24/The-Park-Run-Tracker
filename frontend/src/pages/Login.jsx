import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import styles from './Login.module.css';

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
    <main className={styles['login']}>
      <div className={styles['login__wrapper']}>
        {/* Logo and Greeting */}
        <div className={styles['login__header']}>
          <div className={styles['login__logo-box']}>
            <span 
              className={`material-symbols-outlined ${styles['login__logo-icon']}`} 
              style={{ fontVariationSettings: "'FILL' 1" }}
            >
              bolt
            </span>
          </div>
          <div className={styles['login__title-wrapper']}>
            <h1 className={styles['login__title']}>
              Welcome back
            </h1>
            <p className={styles['login__subtitle']}>เข้าสู่ระบบเพื่อติดตามรอบวิ่งเรียลไทม์ของคุณ</p>
          </div>
        </div>

        {/* Login Form Container */}
        <div className={`${styles['login__form-card']} glass-card`}>
          {errorMsg && (
            <div className={styles['login__error-banner']}>
              <span className="material-symbols-outlined">error</span>
              <span>{errorMsg}</span>
            </div>
          )}

          <form onSubmit={handleSubmit}>
            <div className={styles['login__form-group']}>
              <label className={styles['login__form-label']}>
                อีเมล (Email)
              </label>
              <div className={styles['login__input-wrapper']}>
                <span className={`material-symbols-outlined ${styles['login__input-icon']}`}>mail</span>
                <input 
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="alex@example.com"
                  className={styles['login__input-field']}
                  disabled={isSubmitting}
                />
              </div>
            </div>

            <div className={styles['login__form-group']}>
              <label className={styles['login__form-label']}>
                รหัสผ่าน (Password)
              </label>
              <div className={styles['login__input-wrapper']}>
                <span className={`material-symbols-outlined ${styles['login__input-icon']}`}>lock</span>
                <input 
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className={styles['login__input-field']}
                  disabled={isSubmitting}
                />
              </div>
            </div>

            <button 
              type="submit"
              disabled={isSubmitting}
              className={styles['login__submit-btn']}
            >
              {isSubmitting ? 'กำลังเข้าสู่ระบบ...' : 'Continue with Email'}
            </button>
          </form>
        </div>

        {/* Footer Link */}
        <div className={styles['login__footer']}>
          <p className={styles['login__subtitle']}>
            ยังไม่มีบัญชีนักวิ่ง? 
            <button 
              onClick={() => navigate('/register')}
              className={styles['login__signup-link']}
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
