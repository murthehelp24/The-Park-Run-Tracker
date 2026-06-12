import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import styles from './Register.module.css';

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
    <main className={styles['register']}>
      <div className={styles['register__wrapper']}>
        {/* Branding header */}
        <div className={styles['register__header']}>
          <div className={styles['register__logo-box']}>
            <span 
              className={`material-symbols-outlined ${styles['register__logo-icon']}`} 
              style={{ fontVariationSettings: "'FILL' 1" }}
            >
              bolt
            </span>
          </div>
          <div className={styles['register__title-wrapper']}>
            <h1 className={styles['register__title']}>
              Get Started
            </h1>
            <p className={styles['register__subtitle']}>สร้างบัญชีนักวิ่งใหม่เพื่อบันทึกประวัติความเร็ว</p>
          </div>
        </div>

        {/* Card for Registration form */}
        <div className={`${styles['register__form-card']} glass-card`}>
          {errorMsg && (
            <div className={styles['register__error-banner']}>
              <span className="material-symbols-outlined">error</span>
              <span>{errorMsg}</span>
            </div>
          )}
          
          {successMsg && (
            <div className={styles['register__success-banner']}>
              <span className="material-symbols-outlined">check_circle</span>
              <span>{successMsg}</span>
            </div>
          )}

          <form onSubmit={handleSubmit}>
            <div className={styles['register__grid']}>
              <div className={styles['register__form-group']}>
                <label className={styles['register__form-label']}>
                  ชื่อ (First Name)
                </label>
                <div className={styles['register__input-wrapper']}>
                  <input 
                    type="text"
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                    placeholder="สมชาย"
                    className={styles['register__input-field']}
                    disabled={isSubmitting}
                  />
                </div>
              </div>

              <div className={styles['register__form-group']}>
                <label className={styles['register__form-label']}>
                  นามสกุล (Last Name)
                </label>
                <div className={styles['register__input-wrapper']}>
                  <input 
                    type="text"
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                    placeholder="รักวิ่ง"
                    className={styles['register__input-field']}
                    disabled={isSubmitting}
                  />
                </div>
              </div>
            </div>

            <div className={styles['register__form-group']}>
              <label className={styles['register__form-label']}>
                อีเมล (Email)
              </label>
              <div className={styles['register__input-wrapper']}>
                <span className={`material-symbols-outlined ${styles['register__input-icon']}`}>mail</span>
                <input 
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="somchai@example.com"
                  className={styles['register__input-field']}
                  disabled={isSubmitting}
                />
              </div>
            </div>

            <div className={styles['register__form-group']}>
              <label className={styles['register__form-label']}>
                รหัสผ่าน (Password)
              </label>
              <div className={styles['register__input-wrapper']}>
                <span className={`material-symbols-outlined ${styles['register__input-icon']}`}>lock</span>
                <input 
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className={styles['register__input-field']}
                  disabled={isSubmitting}
                />
              </div>
            </div>

            <div className={styles['register__form-group']}>
              <label className={styles['register__form-label']}>
                รหัสสายรัดข้อมือ NFC (ถ้ามี)
              </label>
              <div className={styles['register__input-wrapper']}>
                <span className={`material-symbols-outlined ${styles['register__input-icon']}`}>contactless</span>
                <input 
                  type="text"
                  placeholder="ผูกข้อมูลทีหลังได้ในหน้า Profile"
                  className={styles['register__input-field']}
                  disabled={true}
                />
              </div>
            </div>

            <button 
              type="submit"
              disabled={isSubmitting}
              className={styles['register__submit-btn']}
            >
              {isSubmitting ? 'กำลังดำเนินการ...' : 'Create Account'}
            </button>
          </form>
        </div>

        {/* Back to Login Footer */}
        <div className={styles['register__footer']}>
          <p className={styles['register__subtitle']}>
            มีบัญชีสมาชิกอยู่แล้ว? 
            <button 
              onClick={() => navigate('/login')}
              className={styles['register__login-link']}
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
