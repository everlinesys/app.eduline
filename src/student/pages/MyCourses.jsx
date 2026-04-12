import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { PlayCircle, PlusCircle, BookOpen, ExternalLink } from "lucide-react";
import api from "../../shared/api";
import { getUser } from "../../shared/auth";

export default function MyCourses() {
  const user = getUser();
  const navigate = useNavigate();
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);

  // Helper to fix image URLs
  const getImgUrl = (path) => path ? `${api.defaults.baseURL.replace("/api", "")}${path}` : null;

  useEffect(() => {
    if (!user?.id) return;
    async function load() {
      try {
        const { data } = await api.get(`/purchase/my?userId=${user.id}`);
        setCourses(data);
      } catch (err) {
        console.error("MyCourses error:", err);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [user?.id]);

  if (loading) {
    return (
      <div className="flex flex-col justify-center items-center h-80 space-y-4">
        <div className="w-8 h-8 border-4 border-slate-200 border-t-black rounded-full animate-spin" />
        <p className="text-sm font-medium text-slate-500">Loading your journey...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6 p-4 md:p-0">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-slate-900 tracking-tight flex items-center gap-2">
          <BookOpen className="text-indigo-600" size={24} />
          My Courses
        </h2>
        <span className="text-xs font-bold px-2 py-1 bg-slate-100 text-slate-500 rounded-lg">
          {courses.length} {courses.length === 1 ? 'Course' : 'Courses'}
        </span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Existing Course Cards */}
        {courses.map((p) => (
          <div
            key={p.id}
            className="group bg-white rounded-2xl border border-slate-200 overflow-hidden hover:shadow-xl hover:-translate-y-1 transition-all duration-300"
          >
            {/* Thumbnail Wrapper */}
            <div className="relative aspect-video bg-slate-100 overflow-hidden">
              {p.course?.thumbnail ? (
                <img
                  src={getImgUrl(p.course.thumbnail)}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  alt={p.course.title}
                />
              ) : (
                <div className="h-full flex items-center justify-center text-xs text-slate-400 font-medium">
                  No Thumbnail Available
                </div>
              )}
              {/* Hover Overlay */}
              <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                <PlayCircle className="text-white w-12 h-12" />
              </div>
            </div>

            <div className="p-5 flex flex-col h-[160px]">
              <h3 className="font-bold text-slate-800 line-clamp-2 text-lg leading-tight flex-grow">
                {p.course?.title}
              </h3>

              <button
                onClick={() => navigate(`/student/watch/${p.courseId}`)}
                className="w-full py-2.5 mt-4 rounded-xl bg-slate-900 hover:bg-black text-white text-sm font-bold flex items-center justify-center gap-2 transition-colors"
              >
                Continue Learning
              </button>
            </div>
          </div>
        ))}

        {/* Explore More Card */}
        <button
          onClick={() => navigate("/courses")}
          className="group border-2 border-dashed border-slate-200 rounded-2xl flex flex-col items-center justify-center p-8 space-y-4 hover:border-indigo-400 hover:bg-indigo-50/30 transition-all duration-300 min-h-[300px]"
        >
          <div className="w-16 h-16 rounded-full bg-indigo-50 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
            <PlusCircle className="text-indigo-600 w-8 h-8" />
          </div>
          <div className="text-center">
            <h3 className="font-bold text-slate-900">Explore More</h3>
            <p className="text-sm text-slate-500 mt-1">Discover new skills and courses</p>
          </div>
          <div className="flex items-center gap-2 text-xs font-bold text-indigo-600 uppercase tracking-widest">
            Browse Catalog <ExternalLink size={12} />
          </div>
        </button>
      </div>
    </div>
  );
}