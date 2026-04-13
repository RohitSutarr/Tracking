import React from 'react';

const ProgressBar = ({ currentDay = 0, totalDays = 75 }) => {
  const safeTotal = totalDays > 0 ? totalDays : 75;
  const safeDay = Math.min(Math.max(currentDay, 0), safeTotal);
  const percentage = Math.round((safeDay / safeTotal) * 100);

  return (
    <div className="rounded-3xl border border-white/20 bg-white/10 p-6 shadow-2xl backdrop-blur-xl">
      <div className="mb-4 flex items-end justify-between gap-4">
        <div>
          <p className="text-sm uppercase tracking-[0.3em] text-blue-100/80">
            75 Day Progress
          </p>
          <h2 className="mt-2 text-3xl font-bold text-white">
            Day {safeDay} / {safeTotal}
          </h2>
        </div>
        <div className="rounded-2xl bg-white/15 px-4 py-3 text-right">
          <p className="text-xs uppercase tracking-[0.25em] text-blue-100/70">
            Completed
          </p>
          <p className="text-2xl font-bold text-white">{percentage}%</p>
        </div>
      </div>

      <div className="h-5 overflow-hidden rounded-full bg-white/20">
        <div
          className="h-full rounded-full bg-gradient-to-r from-cyan-300 via-sky-300 to-indigo-200 transition-all duration-500 ease-out"
          style={{ width: `${percentage}%` }}
        />
      </div>

      <div className="mt-4 flex items-center justify-between text-sm text-blue-50/80">
        <span>Start</span>
        <span>{safeTotal - safeDay} days left</span>
        <span>Finish</span>
      </div>
    </div>
  );
};

export default ProgressBar;
