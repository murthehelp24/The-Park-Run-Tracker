import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

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
    <nav className="fixed bottom-0 left-0 w-full z-50 flex justify-around items-center px-5 pb-8 pt-3 bg-slate-900/80 backdrop-blur-xl border-t border-slate-800 rounded-t-2xl shadow-2xl">
      {navItems.map((item) => {
        const isActive = currentPath === item.path;
        return (
          <button
            key={item.path}
            onClick={() => navigate(item.path)}
            className={`flex flex-col items-center justify-center transition-all active:scale-95 ${
              isActive
                ? 'text-orange-500 font-bold bg-orange-500/10 rounded-xl px-5 py-2 border border-orange-500/20 shadow-md shadow-orange-500/5'
                : 'text-slate-400 hover:text-orange-400'
            }`}
          >
            <span
              className="material-symbols-outlined mb-0.5"
              style={{ fontVariationSettings: isActive ? "'FILL' 1" : "'FILL' 0" }}
            >
              {item.icon}
            </span>
            <span className="font-label-caps text-[10px] mt-0.5">{item.name}</span>
          </button>
        );
      })}
    </nav>
  );
};

export default BottomNavBar;
