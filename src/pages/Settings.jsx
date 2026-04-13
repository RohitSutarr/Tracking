import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const resetKeys = [
  'galleryEntries',
  'progressCompletedDates',
  'progressCurrentDay',
  'progressStartDate',
  'progressSubmittedDate',
  'checklistData',
  'checklistDate',
  'checklistPhoto',
];

const Settings = () => {
  const [isConfirming, setIsConfirming] = useState(false);
  const navigate = useNavigate();

  const handleReset = () => {
    resetKeys.forEach((key) => localStorage.removeItem(key));
    localStorage.setItem('progressCurrentDay', '0');
    window.dispatchEvent(new Event('challenge-reset'));
    setIsConfirming(false);
    navigate('/');
  };

  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_top,_#7f1d1d_0%,_#0f172a_38%,_#020617_100%)] px-4 py-12 text-white">
      <div className="mx-auto max-w-4xl">
        <div className="rounded-[2rem] border border-white/10 bg-white/5 p-8 shadow-2xl backdrop-blur-xl">
          <p className="text-sm uppercase tracking-[0.35em] text-rose-200/80">
            Settings
          </p>
          <h1 className="mt-3 text-4xl font-bold">Reset Challenge</h1>
          <p className="mt-4 max-w-2xl text-slate-200/75">
            Start the 75-day challenge from day 1 again. This clears saved
            progress, daily checklist data, and the uploaded progress photo from
            local storage.
          </p>

          <div className="mt-8 rounded-3xl border border-rose-300/20 bg-rose-300/10 p-6">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <p className="text-xs uppercase tracking-[0.28em] text-rose-100/70">
                  Danger Zone
                </p>
                <h2 className="mt-2 text-2xl font-semibold">Reset 75 Days</h2>
                <p className="mt-2 text-slate-200/75">
                  This action cannot be undone.
                </p>
              </div>

              {!isConfirming ? (
                <button
                  type="button"
                  onClick={() => setIsConfirming(true)}
                  className="rounded-2xl bg-rose-500 px-5 py-3 font-semibold text-white transition hover:bg-rose-400"
                >
                  Reset 75 Days
                </button>
              ) : (
                <div className="flex flex-col items-start gap-3 sm:items-end">
                  <p className="text-sm font-semibold text-rose-100">
                    Are you sure?
                  </p>
                  <div className="flex gap-3">
                    <button
                      type="button"
                      onClick={() => setIsConfirming(false)}
                      className="rounded-2xl border border-white/15 bg-white/5 px-4 py-2 font-semibold text-white transition hover:bg-white/10"
                    >
                      Cancel
                    </button>
                    <button
                      type="button"
                      onClick={handleReset}
                      className="rounded-2xl bg-rose-500 px-4 py-2 font-semibold text-white transition hover:bg-rose-400"
                    >
                      Yes, Reset
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>

          <div className="mt-8 rounded-3xl border border-white/10 bg-white/5 p-6">
            <p className="text-sm uppercase tracking-[0.3em] text-cyan-100/70">
              Later Upgrade
            </p>
            <h2 className="mt-2 text-2xl font-semibold">Edit Daily Goals</h2>
            <p className="mt-3 text-slate-200/75">
              This can be added later for custom targets like changing the water
              goal or adding and removing daily tasks.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Settings;
