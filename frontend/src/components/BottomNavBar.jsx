import { useNavigate, useLocation } from 'react-router-dom';
import styles from './BottomNavBar.module.css';

const BottomNavBar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const currentPath = location.pathname;

  const navItems = [
    {
      name: 'Dashboard',
      icon: 'speed',
      path: '/dashboard',
    },
    {
      name: 'History',
      icon: 'history',
      path: '/history',
    },
    {
      name: 'Profile',
      icon: 'person',
      path: '/profile',
    },
  ];

  return (
    <nav className={styles['bottom-nav']}>
      {navItems.map((item) => {
        const isActive = currentPath === item.path;
        return (
          <button
            key={item.path}
            onClick={() => navigate(item.path)}
            className={`${styles['bottom-nav__button']} ${isActive ? styles['bottom-nav__button--active'] : ''}`}
          >
            <span
              className={`material-symbols-outlined ${styles['bottom-nav__icon']}`}
              style={{ fontVariationSettings: isActive ? "'FILL' 1" : "'FILL' 0" }}
            >
              {item.icon}
            </span>
            <span className={styles['bottom-nav__text']}>{item.name}</span>
          </button>
        );
      })}
    </nav>
  );
};

export default BottomNavBar;
