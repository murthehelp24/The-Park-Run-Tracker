import { useAuthStore } from '../store/useAuthStore';
import styles from './TopAppBar.module.css';

const TopAppBar = ({ isSocketConnected = false }) => {
  const { user, wristband } = useAuthStore();

  return (
    <header className={styles['top-bar']}>
      <div className={styles['top-bar__logo-wrapper']}>
        <span className={`material-symbols-outlined ${styles['top-bar__logo-icon']}`} style={{ fontVariationSettings: "'FILL' 1" }}>
          bolt
        </span>
        <span className={styles['top-bar__logo-text']}>
          PARK RUN
        </span>
      </div>
      
      {user && (
        <div className={styles['top-bar__badge-wrapper']}>
          {wristband ? (
            <div className={styles['top-bar__status-badge']}>
              <span className={`${styles['top-bar__status-indicator']} ${isSocketConnected ? styles['top-bar__status-indicator--active'] : styles['top-bar__status-indicator--inactive']}`}></span>
              <span className={styles['top-bar__status-text']}>
                {isSocketConnected ? 'NFC ACTIVE' : 'NFC READY'}
              </span>
            </div>
          ) : (
            <div className={`${styles['top-bar__status-badge']} ${styles['top-bar__status-badge--noband']}`}>
              <span className={`${styles['top-bar__status-indicator']} ${styles['top-bar__status-indicator--noband']}`}></span>
              <span className={styles['top-bar__status-text']}>
                NO BAND
              </span>
            </div>
          )}
        </div>
      )}
    </header>
  );
};

export default TopAppBar;
