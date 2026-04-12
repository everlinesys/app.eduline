import { useEffect, useState, useMemo } from "react";
import { useParams } from "react-router-dom";
import api from "../../shared/api";
import { getUser } from "../../shared/auth";
import { useBranding } from "../../shared/hooks/useBranding";
import { ChevronLeft } from "lucide-react";

import MobileSyllabus from "../components/MobileSyllabus";
import VideoPlayer from "../../shared/video/VideoPlayer";

export default function WatchCourse() {
  const { courseId } = useParams();
  const user = getUser();
  const brand = useBranding();

  const primary = brand.colors?.primary || "#111827";

  const [course, setCourse] = useState(null);
  const [units, setUnits] = useState([]);
  const [chaptersByUnit, setChaptersByUnit] = useState({});
  const [currentChapter, setCurrentChapter] = useState(null);
  const [loading, setLoading] = useState(true);

  const allChapters = useMemo(() => {
    return units.flatMap((unit) => chaptersByUnit[unit.id] || []);
  }, [units, chaptersByUnit]);

  const currentIndex = allChapters.findIndex(
    (ch) => ch.id === currentChapter?.id
  );
  const hasNext = currentIndex < allChapters.length - 1;
  const hasPrev = currentIndex > 0;

  useEffect(() => {
    async function load() {
      try {
        const [courseRes, unitsRes] = await Promise.all([
          api.get(`/courses/${courseId}`),
          api.get(`/units?courseId=${courseId}`),
        ]);

        const chaptersMap = {};
        for (const unit of unitsRes.data) {
          const chRes = await api.get(`/chapters?unitId=${unit.id}`);
          chaptersMap[unit.id] = chRes.data;
        }

        setCourse(courseRes.data);
        setUnits(unitsRes.data);
        setChaptersByUnit(chaptersMap);

        const firstChapter =
          chaptersMap[unitsRes.data?.[0]?.id]?.[0];
        if (firstChapter) setCurrentChapter(firstChapter);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }

    if (courseId) load();
  }, [courseId]);

  const handleNext = () =>
    hasNext && setCurrentChapter(allChapters[currentIndex + 1]);

  const handlePrev = () =>
    hasPrev && setCurrentChapter(allChapters[currentIndex - 1]);

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center text-sm opacity-60">
        Loading course...
      </div>
    );
  }

  if (!course) {
    return (
      <div className="p-10 text-center text-sm opacity-60">
        Course not found
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 overflow-x-hidden pb-20">

      {/* Mobile syllabus */}
      <MobileSyllabus
        units={units}
        chaptersByUnit={chaptersByUnit}
        onSelectChapter={setCurrentChapter}
        currentChapterId={currentChapter?.id}
      />

      <div className="lg:flex max-w-6xl mx-auto">

        {/* ===== SIDEBAR ===== */}
        <aside className="hidden lg:block w-72 bg-white border-r border-slate-100 pt-6">
          <div className="px-4 mb-6">
            <p className="text-[10px] text-slate-400 uppercase tracking-wider">
              Course
            </p>
            <h1 className="text-lg font-semibold mt-1 leading-tight">
              {course.title}
            </h1>
          </div>

          <nav className="px-2 pb-10 space-y-4">
            {units.map((unit) => (
              <div key={unit.id}>
                <h3 className="px-2 mb-2 text-[11px] font-semibold text-slate-500 uppercase">
                  {unit.title}
                </h3>

                {(chaptersByUnit[unit.id] || []).map((ch) => {
                  const active = currentChapter?.id === ch.id;

                  return (
                    <button
                      key={ch.id}
                      onClick={() => setCurrentChapter(ch)}
                      className={`w-full text-left px-3 py-2 rounded-lg text-sm transition ${
                        active
                          ? "bg-slate-100 text-slate-900 font-medium"
                          : "text-slate-500 hover:bg-slate-50"
                      }`}
                    >
                      {ch.title}
                    </button>
                  );
                })}
              </div>
            ))}
          </nav>
        </aside>

        {/* ===== MAIN CONTENT ===== */}
        <main className="flex-1 px-3">
          <div className="py-4 lg:py-6 max-w-3xl mx-auto space-y-5">

            {/* VIDEO */}
            <div className="aspect-video rounded-2xl overflow-hidden bg-black shadow-sm">
              {currentChapter && (
                <VideoPlayer videoId={currentChapter.bunnyVideoId} />
              )}
            </div>

            {/* TITLE + DESCRIPTION */}
            {currentChapter && (
              <div className="space-y-4">

                <div className="space-y-2">
                  <h2 className="text-base font-semibold text-slate-900">
                    {currentChapter.title}
                  </h2>

                  {currentChapter.description && (
                    <p className="text-sm text-slate-500 leading-relaxed whitespace-pre-line">
                      {currentChapter.description}
                    </p>
                  )}
                </div>

                {/* NAVIGATION */}
                <div className="flex items-center justify-between">

                  <button
                    disabled={!hasPrev}
                    onClick={handlePrev}
                    className="w-10 h-10 flex items-center justify-center rounded-full bg-white border border-slate-200 shadow-sm active:scale-95 disabled:opacity-30"
                  >
                    <ChevronLeft size={18} />
                  </button>

                  <button
                    disabled={!hasNext}
                    onClick={handleNext}
                    className="px-5 h-10 rounded-full text-sm font-semibold text-white active:scale-95 disabled:opacity-30"
                    style={{ background: primary }}
                  >
                    Next
                  </button>

                </div>

              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
}