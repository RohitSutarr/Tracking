import React, { useEffect, useState } from 'react';
import Checklist from '../components/Checklist';
import ProgressBar from '../components/ProgressBar';

const TOTAL_DAYS = 75;
const STORAGE_KEY = 'progressCurrentDay';

const getStoredDay = () => {
  const savedDay = Number(localStorage.getItem(STORAGE_KEY));
  return !Number.isNaN(savedDay) && savedDay >= 0 && savedDay <= TOTAL_DAYS
    ? savedDay
    : 0;
};

const Dashboard = () => {
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
    <div className="bg-slate-950">
      <section className="bg-[radial-gradient(circle_at_top,_#1d4ed8_0%,_#0f172a_45%,_#020617_100%)] px-4 py-10 text-white">
        <div className="mx-auto max-w-5xl">
          <div className="mb-8 text-center">
            <p className="text-sm uppercase tracking-[0.4em] text-cyan-200/80">
              Dashboard
            </p>
            <h1 className="mt-3 text-4xl font-bold sm:text-5xl">
              Daily habits and 75-day progress
            </h1>
            <p className="mx-auto mt-3 max-w-2xl text-base text-slate-200/80 sm:text-lg">
              This is your main overview page. Check today&apos;s habits and keep
              an eye on how far you&apos;ve come.
            </p>
          </div>

          <ProgressBar currentDay={currentDay} totalDays={TOTAL_DAYS} />
        </div>
      </section>

      <Checklist />
    </div>
  );
};

export default Dashboard;
