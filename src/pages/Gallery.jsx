import React, { useEffect, useState } from 'react';

const GALLERY_STORAGE_KEY = 'galleryEntries';

const getGalleryEntries = () => {
  try {
    const parsedEntries = JSON.parse(
      localStorage.getItem(GALLERY_STORAGE_KEY) ?? '[]'
    );

    return Array.isArray(parsedEntries) ? parsedEntries : [];
  } catch {
    return [];
  }
};

const Gallery = () => {
  const [entries, setEntries] = useState([]);

  useEffect(() => {
    const syncEntries = () => {
      setEntries(getGalleryEntries());
    };

    syncEntries();
    window.addEventListener('gallery-updated', syncEntries);
    window.addEventListener('challenge-reset', syncEntries);

    return () => {
      window.removeEventListener('gallery-updated', syncEntries);
      window.removeEventListener('challenge-reset', syncEntries);
    };
  }, []);

  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_top,_#0f766e_0%,_#0f172a_40%,_#020617_100%)] px-4 py-12 text-white">
      <div className="mx-auto max-w-5xl">
        <div className="rounded-[2rem] border border-white/10 bg-white/5 p-8 shadow-2xl backdrop-blur-xl">
          <p className="text-sm uppercase tracking-[0.35em] text-emerald-200/80">
            Gallery
          </p>
          <h1 className="mt-3 text-4xl font-bold">Submitted progress photos</h1>
          <p className="mt-4 max-w-2xl text-slate-200/75">
            Each submitted day with a photo appears here as a visual log of your challenge.
          </p>

          {entries.length === 0 ? (
            <div className="mt-8 rounded-3xl border border-white/10 bg-white/5 p-6 text-slate-300">
              No submitted progress photos yet. Upload a photo in the checklist and click
              submit to add your first entry.
            </div>
          ) : (
            <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {entries.map((entry) => (
                <article
                  key={`${entry.submittedAt}-${entry.day}`}
                  className="overflow-hidden rounded-3xl border border-white/10 bg-white/5 shadow-xl backdrop-blur-xl"
                >
                  <img
                    src={entry.photo}
                    alt={`Day ${entry.day} progress`}
                    className="h-64 w-full object-cover"
                  />
                  <div className="p-5">
                    <p className="text-xs uppercase tracking-[0.3em] text-emerald-200/75">
                      Submitted
                    </p>
                    <h2 className="mt-2 text-2xl font-bold">Day {entry.day}</h2>
                    <p className="mt-2 text-slate-300">{entry.submittedAt}</p>
                  </div>
                </article>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Gallery;
