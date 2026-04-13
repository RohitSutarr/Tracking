import React, { useEffect, useState } from 'react';
import ProgressBar from '../components/ProgressBar';

const TOTAL_DAYS = 75;
const STORAGE_KEY = 'progressCurrentDay';
const START_DATE_KEY = 'progressStartDate';
const COMPLETED_DATES_KEY = 'progressCompletedDates';
const WEEKDAY_LABELS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

const getStoredDay = () => {
  const savedDay = Number(localStorage.getItem(STORAGE_KEY));
  return !Number.isNaN(savedDay) && savedDay >= 0 && savedDay <= TOTAL_DAYS
    ? savedDay
    : 0;
};

const getStoredStartDate = () => localStorage.getItem(START_DATE_KEY);

const getStoredCompletedDates = () => {
  try {
    const parsedDates = JSON.parse(
      localStorage.getItem(COMPLETED_DATES_KEY) ?? '[]'
    );
    return Array.isArray(parsedDates) ? parsedDates : [];
  } catch {
    return [];
  }
};

const formatDate = (dateValue) =>
  new Intl.DateTimeFormat('en-US', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  }).format(new Date(dateValue));

const formatMonthLabel = (dateValue) =>
  new Intl.DateTimeFormat('en-US', {
    month: 'long',
    year: 'numeric',
  }).format(dateValue);

const getProjectedStartDate = (currentDay) => {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  today.setDate(today.getDate() - Math.max(currentDay - 1, 0));
  return today.toISOString();
};

const getMonthStart = (dateValue = new Date()) =>
  new Date(dateValue.getFullYear(), dateValue.getMonth(), 1);

const getLocalDateKey = (dateValue) => {
  const date = new Date(dateValue);
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

const buildCalendarDays = (monthDate, completedDates) => {
  const firstDayOfMonth = getMonthStart(monthDate);
  const startWeekday = firstDayOfMonth.getDay();
  const daysInMonth = new Date(
    monthDate.getFullYear(),
    monthDate.getMonth() + 1,
    0
  ).getDate();
  const todayKey = getLocalDateKey(new Date());

  return Array.from({ length: startWeekday + daysInMonth }, (_, index) => {
    if (index < startWeekday) {
      return { empty: true, key: `empty-${index}` };
    }

    const dayNumber = index - startWeekday + 1;
    const dateValue = new Date(
      monthDate.getFullYear(),
      monthDate.getMonth(),
      dayNumber
    );
    const dateKey = getLocalDateKey(dateValue);

    return {
      completed: completedDates.has(dateKey),
      dayNumber,
      isToday: dateKey === todayKey,
      key: dateKey,
    };
  });
};

const Progress = () => {
  const [currentDay, setCurrentDay] = useState(getStoredDay);
  const [startDate, setStartDate] = useState(getStoredStartDate);
  const [completedDates, setCompletedDates] = useState(getStoredCompletedDates);
  const [calendarMonth, setCalendarMonth] = useState(() => getMonthStart());

  useEffect(() => {
    const syncProgressData = () => {
      setCurrentDay(getStoredDay());
      setStartDate(getStoredStartDate());
      setCompletedDates(getStoredCompletedDates());
    };

    syncProgressData();
    window.addEventListener('progress-updated', syncProgressData);
    window.addEventListener('challenge-reset', syncProgressData);

    return () => {
      window.removeEventListener('progress-updated', syncProgressData);
      window.removeEventListener('challenge-reset', syncProgressData);
    };
  }, []);

  const completionPercentage = Math.round((currentDay / TOTAL_DAYS) * 100);
  const daysRemaining = TOTAL_DAYS - currentDay;
  const resolvedStartDate =
    startDate || (currentDay > 0 ? getProjectedStartDate(currentDay) : null);
  const completedDateSet = new Set(completedDates);
  const calendarDays = buildCalendarDays(calendarMonth, completedDateSet);
  const endDate = resolvedStartDate
    ? (() => {
        const projectedEndDate = new Date(resolvedStartDate);
        projectedEndDate.setDate(projectedEndDate.getDate() + (TOTAL_DAYS - 1));
        return projectedEndDate.toISOString();
      })()
    : null;

  const changeMonth = (offset) => {
    setCalendarMonth(
      (currentMonth) =>
        new Date(
          currentMonth.getFullYear(),
          currentMonth.getMonth() + offset,
          1
        )
    );
  };

  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_top,_#1d4ed8_0%,_#0f172a_45%,_#020617_100%)] px-4 py-10 text-white">
      <div className="mx-auto max-w-4xl">
        <div className="mb-8 text-center">
          <p className="text-sm uppercase tracking-[0.4em] text-cyan-200/80">
            Progress Tracker
          </p>
          <h1 className="mt-3 text-4xl font-bold sm:text-5xl">
            Keep your 75-day streak in sight
          </h1>
          <p className="mx-auto mt-3 max-w-2xl text-base text-slate-200/80 sm:text-lg">
            Track how far you have come and how much is left. Small daily wins
            add up fast.
          </p>
        </div>

        <ProgressBar currentDay={currentDay} totalDays={TOTAL_DAYS} />

        <div className="mt-8 grid gap-4 sm:grid-cols-3">
          <div className="rounded-3xl border border-white/15 bg-white/10 p-5 backdrop-blur-xl">
            <p className="text-sm uppercase tracking-[0.25em] text-cyan-100/70">
              Current Day
            </p>
            <p className="mt-2 text-3xl font-bold">{currentDay}</p>
          </div>
          <div className="rounded-3xl border border-white/15 bg-white/10 p-5 backdrop-blur-xl">
            <p className="text-sm uppercase tracking-[0.25em] text-cyan-100/70">
              Completion
            </p>
            <p className="mt-2 text-3xl font-bold">{completionPercentage}%</p>
          </div>
          <div className="rounded-3xl border border-white/15 bg-white/10 p-5 backdrop-blur-xl">
            <p className="text-sm uppercase tracking-[0.25em] text-cyan-100/70">
              Days Left
            </p>
            <p className="mt-2 text-3xl font-bold">{daysRemaining}</p>
          </div>
        </div>

        <div className="mt-8 rounded-3xl border border-white/15 bg-white/10 p-6 shadow-2xl backdrop-blur-xl">
          <div className="mb-5">
            <p className="text-sm uppercase tracking-[0.3em] text-cyan-100/70">
              Challenge Calendar
            </p>
            <h2 className="mt-2 text-2xl font-semibold">
              Start and finish dates
            </h2>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="rounded-3xl border border-white/10 bg-slate-950/25 p-5">
              <p className="text-sm uppercase tracking-[0.25em] text-cyan-100/70">
                Started On
              </p>
              <p className="mt-2 text-2xl font-bold">
                {resolvedStartDate ? formatDate(resolvedStartDate) : 'Not started yet'}
              </p>
            </div>
            <div className="rounded-3xl border border-white/10 bg-slate-950/25 p-5">
              <p className="text-sm uppercase tracking-[0.25em] text-cyan-100/70">
                Ends On
              </p>
              <p className="mt-2 text-2xl font-bold">
                {endDate ? formatDate(endDate) : 'Start challenge first'}
              </p>
            </div>
          </div>
        </div>

        <div className="mt-8 rounded-3xl border border-white/15 bg-white/10 p-6 shadow-2xl backdrop-blur-xl">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-sm uppercase tracking-[0.3em] text-cyan-100/70">
                Calendar Heatmap
              </p>
              <h2 className="mt-2 text-2xl font-semibold">
                Monthly consistency view
              </h2>
            </div>

            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={() => changeMonth(-1)}
                className="rounded-2xl border border-white/15 bg-white/5 px-4 py-2 font-semibold text-white transition hover:bg-white/10"
              >
                Prev
              </button>
              <div className="rounded-2xl border border-white/10 bg-slate-950/25 px-4 py-2 text-center">
                <p className="font-semibold text-white">
                  {formatMonthLabel(calendarMonth)}
                </p>
              </div>
              <button
                type="button"
                onClick={() => changeMonth(1)}
                className="rounded-2xl border border-white/15 bg-white/5 px-4 py-2 font-semibold text-white transition hover:bg-white/10"
              >
                Next
              </button>
            </div>
          </div>

          <div className="mt-6 grid grid-cols-7 gap-2">
            {WEEKDAY_LABELS.map((label) => (
              <div
                key={label}
                className="text-center text-xs uppercase tracking-[0.25em] text-cyan-100/65"
              >
                {label}
              </div>
            ))}
            {calendarDays.map((day) =>
              day.empty ? (
                <div
                  key={day.key}
                  className="aspect-square rounded-2xl border border-transparent"
                />
              ) : (
                <div
                  key={day.key}
                  className={`flex aspect-square items-center justify-center rounded-2xl border text-sm font-semibold transition ${
                    day.completed
                      ? 'border-emerald-200/30 bg-emerald-300 text-slate-950 shadow-lg shadow-emerald-950/20'
                      : 'border-white/10 bg-slate-950/25 text-slate-300'
                  } ${day.isToday ? 'ring-2 ring-cyan-300/70' : ''}`}
                  title={day.completed ? 'Completed day' : 'No submission'}
                >
                  {day.dayNumber}
                </div>
              )
            )}
          </div>

          <div className="mt-5 flex flex-wrap items-center gap-4 text-sm text-slate-300">
            <div className="flex items-center gap-2">
              <span className="h-4 w-4 rounded-md border border-white/10 bg-slate-950/25" />
              <span>No submission</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="h-4 w-4 rounded-md border border-emerald-200/30 bg-emerald-300" />
              <span>Completed day</span>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};

export default Progress;
