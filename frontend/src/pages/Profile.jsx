import { useState } from 'react';
import Swal from 'sweetalert2';
import { useAuth } from '../context/AuthContext';
import { assignWristbandAPI, deleteWristbandAPI } from '../services/api';
import TopAppBar from '../components/TopAppBar';
import BottomNavBar from '../components/BottomNavBar';
import styles from './Profile.module.css';

const ThemeSwal = Swal.mixin({
  background: '#1e293b', // var(--color-surface)
  color: '#e2e8f0', // var(--color-text)
  confirmButtonColor: '#f97316', // var(--color-primary)
  cancelButtonColor: '#475569', // var(--color-text-muted)
  customClass: {
    popup: 'glass-card',
  }
});

const Profile = () => {
  const { user, wristband, logout, updateWristbandState } = useAuth();
  const [nfcUid, setNfcUid] = useState('');
  const [isBinding, setIsBinding] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const handleBindWristband = async (e) => {
    e.preventDefault();
    if (!nfcUid.trim()) {
      ThemeSwal.fire({
        icon: 'warning',
        title: 'กรุณากรอกข้อมูล',
        text: 'กรุณากรอกรหัส NFC UID ของสายรัดข้อมือ',
      });
      return;
    }

    setIsBinding(true);

    try {
      const response = await assignWristbandAPI(nfcUid.trim());
      if (response.success && response.data) {
        updateWristbandState(response.data);
        ThemeSwal.fire({
          icon: 'success',
          title: 'ผูกอุปกรณ์สำเร็จ',
          text: 'ผูกสายรัดข้อมือ NFC สำเร็จเรียบร้อยแล้ว!',
          timer: 2000,
          showConfirmButton: false,
        });
      } else {
        ThemeSwal.fire({
          icon: 'error',
          title: 'เกิดข้อผิดพลาด',
          text: response.message || 'การผูกสายรัดข้อมือล้มเหลว',
        });
      }
    } catch (error) {
      const msg = error.response?.data?.message || 'ไม่พบอุปกรณ์นี้ หรือเกิดข้อผิดพลาดในการผูกอุปกรณ์';
      ThemeSwal.fire({
        icon: 'error',
        title: 'เกิดข้อผิดพลาด',
        text: msg,
      });
    } finally {
      setIsBinding(false);
    }
  };

  const handleUnbind = async () => {
    if (!wristband) return;

    const result = await ThemeSwal.fire({
      title: 'ยืนยันการยกเลิกผูก?',
      html: `คุณต้องการยกเลิกการผูกสายรัดข้อมือ NFC <br/><strong>(UID: ${wristband.uid})</strong> ใช่หรือไม่?<br/><br/><span style="color: var(--color-error); font-size: 13px;">*คำเตือน: ข้อมูลรอบการวิ่งของสายรัดนี้จะถูกลบไปด้วย*</span>`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'ยืนยัน',
      cancelButtonText: 'ยกเลิก',
      reverseButtons: true
    });

    if (!result.isConfirmed) return;

    setIsDeleting(true);

    try {
      const response = await deleteWristbandAPI(wristband.uid);
      if (response.success) {
        updateWristbandState(null);
        setNfcUid('');
        ThemeSwal.fire({
          icon: 'success',
          title: 'ยกเลิกการผูกสำเร็จ',
          text: 'ยกเลิกการผูกสายรัดข้อมือเรียบร้อยแล้ว!',
          timer: 2000,
          showConfirmButton: false,
        });
      } else {
        ThemeSwal.fire({
          icon: 'error',
          title: 'เกิดข้อผิดพลาด',
          text: response.message || 'เกิดข้อผิดพลาดในการยกเลิกการผูกสายรัดข้อมือ',
        });
      }
    } catch (error) {
      const msg = error.response?.data?.message || 'เกิดข้อผิดพลาดในการยกเลิกการผูกสายรัดข้อมือ';
      ThemeSwal.fire({
        icon: 'error',
        title: 'เกิดข้อผิดพลาด',
        text: msg,
      });
    } finally {
      setIsDeleting(false);
    }
  };

  const achievements = [
    { id: '1', name: '50 LAPS CLUB', icon: 'star', desc: 'วิ่งสะสมครบ 50 รอบสนาม', active: true },
    { id: '2', name: 'EARLY BIRD RUNNER', icon: 'wb_sunny', desc: 'วิ่งยามเช้าก่อนเวลา 07:00 น.', active: true },
    { id: '3', name: 'SPRINT MASTER', icon: 'bolt', desc: 'ทำเวลาเฉลี่ย/รอบ ต่ำกว่า 4 นาที', active: false },
  ];

  return (
    <div className={styles['profile']}>
      <TopAppBar />

      <main className={styles['profile__main']}>
        {/* Profile Card Header */}
        <section className={styles['profile__profile-card']}>
          <div className={styles['profile__avatar-wrapper']}>
            <div className={styles['profile__avatar-blur']}></div>
            <div className={styles['profile__avatar-box']}>
              <div className={styles['profile__avatar-fallback']}>
                {user?.firstName?.charAt(0) || 'R'}
              </div>
            </div>
            <div className={styles['profile__verified-badge']}>
              <span className={`material-symbols-outlined ${styles['profile__verified-icon']}`} style={{ fontVariationSettings: "'FILL' 1" }}>
                verified
              </span>
            </div>
          </div>
          <div className={styles['profile__profile-meta']}>
            <h2 className={styles['profile__profile-name']}>
              {user ? `${user.firstName} ${user.lastName}` : 'นักวิ่ง'}
            </h2>
            <p className={styles['profile__profile-email']}>{user?.email}</p>
          </div>
        </section>

        {/* NFC Wristband Section */}
        <section className="space-y-2">
          <h3 className={styles['profile__section-title']}>
            การจัดการสายรัดข้อมือ NFC
          </h3>
          <div className={`${styles['profile__card']} glass-card`}>

            {wristband ? (
              <div>
                <div className={styles['profile__info-row']}>
                  <div>
                    <span className={styles['profile__nfc-label']}>NFC WRISTBAND</span>
                    <p className={styles['profile__nfc-uid']}>{wristband.uid}</p>
                  </div>
                  <div className={styles['profile__active-badge']}>
                    <span className={styles['profile__active-dot']}></span>
                    <span className={styles['profile__active-text']}>ACTIVE</span>
                  </div>
                </div>
                <button 
                  onClick={handleUnbind}
                  disabled={isDeleting}
                  className={`${styles['profile__action-btn']} ${styles['profile__action-btn--unbind']}`}
                >
                  {isDeleting ? 'กำลังยกเลิกการผูก...' : 'เปลี่ยนสายรัดข้อมือ'}
                </button>
              </div>
            ) : (
              <form onSubmit={handleBindWristband} className={styles['profile__bind-form']}>
                <div className={styles['profile__form-hint']}>
                  <p>ยังไม่ได้ผูกสายรัดข้อมือ NFC สำหรับระบุตัวตนเวลาวิ่ง</p>
                </div>

                <div className={styles['profile__bind-group']}>
                  <input 
                    type="text"
                    value={nfcUid}
                    onChange={(e) => setNfcUid(e.target.value)}
                    placeholder="ป้อนรหัส NFC UID ของอุปกรณ์"
                    className={styles['profile__bind-input']}
                    disabled={isBinding}
                  />
                  <button 
                    type="submit"
                    disabled={isBinding}
                    className={styles['profile__bind-btn']}
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
          <h3 className={styles['profile__section-title']}>
            ความสำเร็จของฉัน
          </h3>
          <div className={`${styles['profile__card']} glass-card`}>
            <div className={styles['profile__achievements-list']}>
              {achievements.map((ach) => (
                <div key={ach.id} className={styles['profile__achievement-item']}>
                  <div className={`${styles['profile__ach-icon-box']} ${ach.active ? styles['profile__ach-icon-box--active'] : styles['profile__ach-icon-box--inactive']}`}>
                    <span className="material-symbols-outlined text-lg" style={{ fontVariationSettings: ach.active ? "'FILL' 1" : "'FILL' 0" }}>
                      {ach.icon}
                    </span>
                  </div>
                  <div className={styles['profile__ach-meta']}>
                    <h4 className={`${styles['profile__ach-name']} ${ach.active ? styles['profile__ach-name--active'] : ''}`}>{ach.name}</h4>
                    <p className={`${styles['profile__ach-desc']} ${ach.active ? styles['profile__ach-desc--active'] : ''}`}>{ach.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Logout Section */}
        <section className="pt-4 pb-6">
          <button 
            onClick={logout}
            className={styles['profile__logout-btn']}
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
