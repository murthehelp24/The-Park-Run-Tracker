import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../store/useAuthStore';
import styles from './Login.module.css';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { login, loginWithGoogle } = useAuthStore();
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

  const handleGoogleLogin = async () => {
    setErrorMsg('');
    const result = await loginWithGoogle();
    if (!result.success) {
      setErrorMsg(result.message || 'เข้าสู่ระบบด้วย Google ล้มเหลว');
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

            <div className={styles['login__divider']}>
              <span className={styles['login__divider-text']}>or</span>
            </div>

            <button 
              type="button"
              onClick={handleGoogleLogin}
              disabled={isSubmitting}
              className={styles['login__google-btn']}
            >
              <svg className={styles['login__google-icon-svg']} viewBox="0 0 24 24" width="18" height="18">
                <path
                  fill="#EA4335"
                  d="M5.26620003,9.76451677 C6.19878753,6.93863749 8.85468753,4.90909091 12,4.90909091 C13.6909091,4.90909091 15.2181818,5.52272727 16.4181818,6.54545455 L19.9090909,3.05454545 C17.7818182,1.16363636 15.0272727,0 12,0 C7.35454545,0 3.32727273,2.67272727 1.34545455,6.57272727 L5.26620003,9.76451677 Z"
                />
                <path
                  fill="#4285F4"
                  d="M16.0409091,18.0136364 C14.9045455,18.7227273 13.5272727,19.0909091 12,19.0909091 C8.85468753,19.0909091 6.19878753,17.0613636 5.26620003,14.2354832 L1.34545455,17.4272727 C3.32727273,21.3272727 7.35454545,24 12,24 C15.0545455,24 17.7909091,22.9909091 19.8954545,21.2727273 L16.0409091,18.0136364 Z"
                />
                <path
                  fill="#FBBC05"
                  d="M5.26620003,9.76451677 C5.03181818,10.4727273 4.90909091,11.2227273 4.90909091,12 C4.90909091,12.7772727 5.03181818,13.5272727 5.26620003,14.2354832 L1.34545455,17.4272727 C0.486363636,15.8 0,13.9545455 0,12 C0,10.0454545 0.486363636,8.2 1.34545455,6.57272727 L5.26620003,9.76451677 Z"
                />
                <path
                  fill="#34A853"
                  d="M24,12 C24,11.1272727 23.9181818,10.3363636 23.7545455,9.54545455 L12,9.54545455 L12,14.2363636 L18.7363636,14.2363636 C18.4454545,15.8272727 17.5181818,17.1545455 16.0409091,18.0136364 L19.8954545,21.2727273 C22.1545455,19.1818182 23.5090909,16.1454545 24,12 Z"
                />
              </svg>
              <span>Continue with Google</span>
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
