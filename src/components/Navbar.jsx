import React, { useEffect, useState } from 'react';
import { NavLink } from 'react-router-dom';

const TOTAL_DAYS = 75;
const STORAGE_KEY = 'progressCurrentDay';

const getStoredDay = () => {
  const savedDay = Number(localStorage.getItem(STORAGE_KEY));
  return !Number.isNaN(savedDay) && savedDay >= 0 && savedDay <= TOTAL_DAYS
    ? savedDay
    : 0;
};

const navItems = [
  { label: 'Dashboard', to: '/' },
  { label: 'Progress', to: '/progress' },
  { label: 'Gallery', to: '/gallery' },
  { label: 'Settings', to: '/settings' },
];

const Navbar = () => {
  const [currentDay, setCurrentDay] = useState(0);

  useEffect(() => {
    const syncCurrentDay = () => {
      setCurrentDay(getStoredDay());
    };

    syncCurrentDay();
    window.addEventListener('progress-updated', syncCurrentDay);
    window.addEventListener('challenge-reset', syncCurrentDay);

    return () => {
      window.removeEventListener('progress-updated', syncCurrentDay);
      window.removeEventListener('challenge-reset', syncCurrentDay);
    };
  }, []);

  return (
    <header className="sticky top-0 z-50 border-b border-white/10 bg-slate-950/80 px-4 py-4 text-white backdrop-blur-xl">
      <div className="mx-auto flex max-w-6xl flex-col gap-4 rounded-3xl border border-white/10 bg-white/5 px-5 py-4 shadow-2xl shadow-cyan-950/20 sm:px-6 lg:flex-row lg:items-center lg:justify-between">
        <NavLink
          to="/"
          className="flex items-center gap-3 text-white transition hover:text-cyan-200"
        >
          <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-br from-cyan-300 via-sky-400 to-indigo-400 text-lg font-black text-slate-950 shadow-lg shadow-cyan-500/20">
            T
          </div>
          <div>
            <p className="text-xs uppercase tracking-[0.35em] text-cyan-100/70">
              Logo
            </p>
            <p className="text-lg font-semibold">TrackForge</p>
          </div>
        </NavLink>

        <div className="rounded-2xl border border-cyan-300/20 bg-cyan-300/10 px-5 py-3 text-center">
          <p className="text-xs uppercase tracking-[0.28em] text-cyan-100/70">
            Streak
          </p>
          <p className="mt-1 text-lg font-semibold">
            Day {currentDay} / {TOTAL_DAYS}
          </p>
        </div>

        <nav className="flex flex-wrap items-center justify-center gap-2 sm:gap-3">
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) =>
                `rounded-2xl px-4 py-2 text-sm font-semibold transition ${
                  isActive
                    ? 'bg-white text-slate-950 shadow-lg'
                    : 'bg-white/5 text-slate-200 hover:bg-white/10 hover:text-white'
                }`
              }
            >
              {item.label}
            </NavLink>
          ))}
        </nav>
      </div>
    </header>
  );
};

export default Navbar;
