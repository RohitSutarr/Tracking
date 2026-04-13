import React, { useEffect, useRef, useState } from 'react';

const TOTAL_DAYS = 75;
const PROGRESS_STORAGE_KEY = 'progressCurrentDay';
const START_DATE_KEY = 'progressStartDate';
const SUBMITTED_DATE_KEY = 'progressSubmittedDate';
const GALLERY_STORAGE_KEY = 'galleryEntries';
const COMPLETED_DATES_KEY = 'progressCompletedDates';

const defaultItems = [
  { id: 1, label: 'Workout', icon: 'WO', checked: false },
  { id: 2, label: 'Water', icon: 'H2O', checked: false },
  { id: 3, label: 'Diet', icon: 'FD', checked: false },
  { id: 4, label: 'Reading', icon: 'RD', checked: false },
  { id: 5, label: 'Progress Photo', icon: 'PH', checked: false, isPhoto: true },
];

const getLocalDateKey = (dateValue) => {
  const date = new Date(dateValue);
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

const Checklist = () => {
  const [items, setItems] = useState(defaultItems);
  const [photoFile, setPhotoFile] = useState(null);
  const [photoPreview, setPhotoPreview] = useState(null);
  const [isSubmittedToday, setIsSubmittedToday] = useState(false);
  const fileInputRef = useRef(null);

  useEffect(() => {
    const savedData = localStorage.getItem('checklistData');
    const savedDate = localStorage.getItem('checklistDate');
    const today = new Date().toDateString();

    if (savedData && savedDate === today) {
      setItems(JSON.parse(savedData));
    } else {
      setItems(defaultItems);
      localStorage.setItem('checklistDate', today);
    }

    const savedPhoto = localStorage.getItem('checklistPhoto');
    if (savedPhoto) {
      setPhotoPreview(savedPhoto);
    }

    setIsSubmittedToday(localStorage.getItem(SUBMITTED_DATE_KEY) === today);
  }, []);

  useEffect(() => {
    const resetInterval = setInterval(() => {
      const savedDate = localStorage.getItem('checklistDate');
      const today = new Date().toDateString();

      if (savedDate !== today) {
        setItems(defaultItems);
        localStorage.setItem('checklistDate', today);
        setPhotoFile(null);
        setPhotoPreview(null);
        localStorage.removeItem('checklistPhoto');
        setIsSubmittedToday(false);
      }
    }, 60000);

    return () => clearInterval(resetInterval);
  }, []);

  useEffect(() => {
    localStorage.setItem('checklistData', JSON.stringify(items));
  }, [items]);

  const handleCheckItem = (id) => {
    setItems((currentItems) =>
      currentItems.map((item) =>
        item.id === id ? { ...item, checked: !item.checked } : item
      )
    );
  };

  const handlePhotoUpload = (event) => {
    const file = event.target.files[0];

    if (file && file.type.startsWith('image/')) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPhotoPreview(reader.result);
        localStorage.setItem('checklistPhoto', reader.result);
        setItems((currentItems) =>
          currentItems.map((item) =>
            item.id === 5 ? { ...item, checked: true } : item
          )
        );
      };
      reader.readAsDataURL(file);
      setPhotoFile(file);
    } else {
      alert('Please upload a valid image file');
    }
  };

  const triggerFileInput = () => {
    fileInputRef.current?.click();
  };

  const handleSubmitDay = () => {
    const today = new Date().toDateString();
    const todayDate = new Date();
    todayDate.setHours(0, 0, 0, 0);

    if (isSubmittedToday) {
      return;
    }

    const storedDay = Number(localStorage.getItem(PROGRESS_STORAGE_KEY));
    const safeStoredDay =
      !Number.isNaN(storedDay) && storedDay >= 0 && storedDay <= TOTAL_DAYS
        ? storedDay
        : 0;

    const nextDay = Math.min(safeStoredDay + 1, TOTAL_DAYS);
    const storedGalleryEntries = JSON.parse(
      localStorage.getItem(GALLERY_STORAGE_KEY) ?? '[]'
    );

    if (photoPreview) {
      const nextGalleryEntries = [
        {
          day: nextDay,
          submittedAt: today,
          photo: photoPreview,
        },
        ...storedGalleryEntries.filter((entry) => entry.submittedAt !== today),
      ];

      localStorage.setItem(
        GALLERY_STORAGE_KEY,
        JSON.stringify(nextGalleryEntries)
      );
      window.dispatchEvent(new Event('gallery-updated'));
    }

    const storedCompletedDates = JSON.parse(
      localStorage.getItem(COMPLETED_DATES_KEY) ?? '[]'
    );
    const todayKey = getLocalDateKey(todayDate);

    if (!storedCompletedDates.includes(todayKey)) {
      localStorage.setItem(
        COMPLETED_DATES_KEY,
        JSON.stringify([...storedCompletedDates, todayKey])
      );
    }

    localStorage.setItem(PROGRESS_STORAGE_KEY, String(nextDay));
    if (!localStorage.getItem(START_DATE_KEY)) {
      localStorage.setItem(START_DATE_KEY, todayDate.toISOString());
    }
    localStorage.setItem(SUBMITTED_DATE_KEY, today);
    setIsSubmittedToday(true);
    window.dispatchEvent(new Event('progress-updated'));
  };

  const completedCount = items.filter((item) => item.checked).length;
  const completionPercentage = Math.round((completedCount / items.length) * 100);
  const requiredItems = items.filter((item) => !item.isPhoto);
  const requiredCompletedCount = requiredItems.filter((item) => item.checked).length;
  const isSubmitDisabled =
    requiredCompletedCount !== requiredItems.length || isSubmittedToday;

  return (
    <section className="bg-[radial-gradient(circle_at_bottom,_#164e63_0%,_#0f172a_42%,_#020617_100%)] px-4 pb-12 pt-2 text-white">
      <div className="mx-auto w-full max-w-5xl">
        <div className="rounded-[2rem] border border-white/10 bg-white/5 p-6 shadow-2xl backdrop-blur-xl sm:p-8">
          <div className="mb-8 text-center">
            <p className="text-sm uppercase tracking-[0.35em] text-cyan-100/75">
              Checklist
            </p>
            <h2 className="mt-3 text-4xl font-bold">Daily Habits</h2>
            <p className="mt-2 text-lg text-slate-200/75">
              {completedCount} of {items.length} completed
            </p>
          </div>

          <div className="mb-8">
            <div className="h-3 w-full overflow-hidden rounded-full bg-white/10">
              <div
                className="h-full rounded-full bg-gradient-to-r from-cyan-300 via-sky-300 to-indigo-200 transition-all duration-500 ease-out"
                style={{ width: `${completionPercentage}%` }}
              />
            </div>
            <p className="mt-3 text-center font-semibold text-cyan-50">
              {completionPercentage}% Complete
            </p>
          </div>

          <div className="mb-8 space-y-3">
            {items.map((item) => (
              <div
                key={item.id}
                className={`flex items-center rounded-2xl p-4 backdrop-blur-md transition-all duration-300 ${
                  item.checked
                    ? 'border border-cyan-200/30 bg-cyan-200/10 shadow-lg shadow-cyan-950/20'
                    : 'border border-white/10 bg-white/5 hover:bg-white/10'
                }`}
              >
                {item.isPhoto ? (
                  <>
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept="image/*"
                      onChange={handlePhotoUpload}
                      className="hidden"
                    />
                    <button
                      onClick={triggerFileInput}
                      className={`mr-4 flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full border-2 transition-all duration-300 ${
                        item.checked
                          ? 'border-cyan-100 bg-cyan-100 shadow-md'
                          : 'border-white/30 hover:border-cyan-200'
                      }`}
                    >
                      {item.checked && <span className="font-bold text-slate-950">OK</span>}
                    </button>
                  </>
                ) : (
                  <button
                    onClick={() => handleCheckItem(item.id)}
                    className={`mr-4 flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full border-2 transition-all duration-300 ${
                      item.checked
                        ? 'border-cyan-100 bg-cyan-100 shadow-md'
                        : 'border-white/30 hover:border-cyan-200'
                    }`}
                  >
                    {item.checked && <span className="font-bold text-slate-950">OK</span>}
                  </button>
                )}

                <span className="mr-3 flex h-10 w-10 items-center justify-center rounded-xl bg-white/10 text-xs font-bold tracking-[0.2em] text-cyan-100">
                  {item.icon}
                </span>

                <span
                  className={`flex-1 text-lg font-semibold transition-all duration-300 ${
                    item.checked ? 'text-slate-300 line-through' : 'text-white'
                  }`}
                >
                  {item.label}
                </span>

                {item.isPhoto && item.checked && photoPreview && (
                  <div className="ml-3 h-12 w-12 flex-shrink-0 overflow-hidden rounded-xl border border-white/20">
                    <img
                      src={photoPreview}
                      alt="Progress"
                      className="h-full w-full object-cover"
                    />
                  </div>
                )}
              </div>
            ))}
          </div>

          {!photoPreview && (
            <button
              onClick={triggerFileInput}
              className="w-full rounded-2xl bg-cyan-300 px-4 py-3 text-lg font-bold text-slate-950 transition-all duration-300 hover:bg-cyan-200 hover:shadow-xl active:scale-[0.99]"
            >
              Upload Progress Photo
            </button>
          )}

          {photoPreview && (
            <div className="rounded-2xl border border-cyan-200/25 bg-cyan-200/10 p-4 text-center">
              <p className="font-semibold text-white">Photo uploaded successfully!</p>
              <button
                onClick={() => {
                  fileInputRef.current?.click();
                }}
                className="mt-2 text-sm text-cyan-100/80 underline hover:text-white"
              >
                Change photo
              </button>
            </div>
          )}

          <div className="mt-6 rounded-2xl border border-white/10 bg-slate-950/30 p-4 text-center">
            <p className="text-sm text-slate-300">
              Complete the 4 core habits to submit your day. Uploading a photo is optional and will appear in the gallery.
            </p>
            <button
              type="button"
              onClick={handleSubmitDay}
              disabled={isSubmitDisabled}
              className={`mt-4 w-full rounded-2xl px-4 py-3 text-lg font-bold transition-all duration-300 ${
                isSubmitDisabled
                  ? 'cursor-not-allowed bg-white/10 text-slate-400'
                  : 'bg-emerald-300 text-slate-950 hover:bg-emerald-200 hover:shadow-xl'
              }`}
            >
              {isSubmittedToday ? 'Submitted For Today' : 'Submit Day'}
            </button>
            {!isSubmittedToday && requiredCompletedCount !== requiredItems.length && (
              <p className="mt-3 text-sm text-slate-400">
                Finish Workout, Water, Diet, and Reading before submitting.
              </p>
            )}
            {isSubmittedToday && (
              <p className="mt-3 text-sm text-slate-400">
                Today has already been submitted. You can submit again tomorrow.
              </p>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};

export default Checklist;
