import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../shared/api";
import { getUser } from "../../shared/auth";
import { useBranding } from "../../shared/hooks/useBranding";
import { Calendar, Clock, Video, Radio } from 'lucide-react';
import { PlayCircle, BookOpen, CheckCircle, TrendingUp } from 'lucide-react';

// import {
//   ResponsiveContainer,
//   AreaChart,
//   Area,
//   XAxis,
//   YAxis,
//   Tooltip,
//   CartesianGrid,
// } from "recharts";

export default function Dashboard() {
  const user = getUser();
  const navigate = useNavigate();
  const brand = useBranding();

  const primary = brand.colors?.primary || "#059669";

  const [data, setData] = useState(null);
  const [liveClasses, setLiveClasses] = useState([]);
  const [now, setNow] = useState(new Date());

  useEffect(() => {
    async function load() {
      const res = await api.get("/student/dashboard");
      const liveRes = await api.get("/live-classes/student");

      setData(res.data);
      console.log("hi", res.data)
      setLiveClasses(liveRes.data);
    }
    load();
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setNow(new Date());
    }, 1000);

    return () => clearInterval(interval);
  }, []);


  function isLive(start, end) {
    return now >= new Date(start) && now <= new Date(end);
  }

  function getCountdown(start) {
    const diff = new Date(start) - now;

    if (diff <= 0) return "Live";

    const h = Math.floor(diff / (1000 * 60 * 60));
    const m = Math.floor((diff / (1000 * 60)) % 60);
    const s = Math.floor((diff / 1000) % 60);

    return `${h}h ${m}m ${s}s`;
  }

  if (!data) {
    return (
      <div className="flex h-64 items-center justify-center text-sm opacity-60">
        Loading dashboard...
      </div>
    );
  }

  // Demo chart (replace with real later)
  const chartData = [
    { day: "Mon", progress: 20 },
    { day: "Tue", progress: 40 },
    { day: "Wed", progress: 35 },
    { day: "Thu", progress: 60 },
    { day: "Fri", progress: 55 },
    { day: "Sat", progress: 80 },
    { day: "Sun", progress: 75 },
  ];
  function isEnded(end) {
    return now > new Date(end);
  }

  return (
    <div className="min-h-screen bg-slate-50 pb-24 overflow-x-hidden">

      {/* ===== HEADER ===== */}
      <div className="px-4 pt-5 pb-3">
        <h2 className="text-lg font-semibold text-slate-900">
          Hi, {user?.name} 👋
        </h2>
        <p className="text-xs text-slate-500">
          Let’s continue learning
        </p>
      </div>

      {/* ===== STATS ===== */}
      <div className="flex gap-3 px-4 overflow-x-auto no-scrollbar pb-2">

        <OverviewCard
          label="Courses"
          value={data.stats.totalCourses}
          color="#6366f1"
        />

        <OverviewCard
          label="Done"
          value={data.stats.completedCourses}
          color="#16a34a"
        />

        <OverviewCard
          label="Progress"
          value={`${Math.round((data.stats.completedCourses / data.stats.totalCourses) * 100 || 0)}%`}
          color={primary}
        />
      </div>

      {/* ===== MY COURSES ===== */}
      <Section title="My Courses">
        <div className="space-y-4 px-4">
          {data.courses.map((c) => (
            <div
              key={c.id}
              className="bg-white rounded-2xl shadow-sm overflow-hidden active:scale-[0.98] transition"
            >
              {/* Image */}
              <div className="h-36 w-full overflow-hidden">
                <img
                  src={`${api.defaults.baseURL.replace("/api", "")}${c.thumbnail}`}
                  className="w-full h-full object-cover"
                />
              </div>

              {/* Content */}
              <div className="p-4 space-y-3">
                <h4 className="text-sm font-semibold line-clamp-2">
                  {c.title}
                </h4>

                {/* Progress */}
                <div>
                  <div className="flex justify-between text-xs mb-1">
                    <span className="text-slate-400">Progress</span>
                    <span style={{ color: primary }}>
                      {c.progress}%
                    </span>
                  </div>

                  <div className="h-1.5 bg-slate-100 rounded-full">
                    <div
                      className="h-full rounded-full"
                      style={{
                        width: `${c.progress}%`,
                        background: primary,
                      }}
                    />
                  </div>
                </div>

                <button
                  onClick={() => navigate(`/student/watch/${c.id}`)}
                  className="w-full py-2 text-sm font-semibold rounded-xl text-white"
                  style={{ background: primary }}
                >
                  {c.progress > 0 ? "Resume" : "Start"}
                </button>
              </div>
            </div>
          ))}
        </div>
      </Section>

      {/* ===== LIVE SESSIONS ===== */}
      {liveClasses.length > 0 && (
        <Section title="Live Sessions">
          <div className="space-y-4 px-4">

            {liveClasses.map((lc) => {
              const live = isLive(lc.startTime, lc.endTime);
              const ended = isEnded(lc.endTime);

              return (
                <div
                  key={lc.id}
                  className="bg-white rounded-2xl p-4 shadow-sm"
                >
                  <h4 className="text-sm font-semibold">
                    {lc.title}
                  </h4>

                  <p className="text-xs text-slate-500 mt-1">
                    {lc.course?.title}
                  </p>

                  <p className="text-xs text-slate-400 mt-2">
                    {new Date(lc.startTime).toLocaleTimeString([], {
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </p>

                  <div className="mt-3 text-xs font-medium">
                    {live
                      ? "🔴 Live Now"
                      : ended
                        ? "Ended"
                        : getCountdown(lc.startTime)}
                  </div>

                  <button
                    disabled={!live}
                    onClick={() => window.open(lc.meetLink, "_blank")}
                    className={`mt-3 w-full py-2 rounded-xl text-sm font-semibold ${live
                      ? "bg-black text-white"
                      : "bg-slate-100 text-slate-400"
                      }`}
                  >
                    {live ? "Join Session" : ended ? "Ended" : "Starting Soon"}
                  </button>
                </div>
              );
            })}
          </div>
        </Section>
      )}

      {/* ===== CONTINUE ===== */}
      {data.continueLearning?.length > 0 && (
        <Section title="Continue Learning">
          <div className="space-y-4 px-4">
            {Object.values(
              data.continueLearning.reduce((acc, item) => {
                if (!acc[item.courseId]) acc[item.courseId] = item;
                return acc;
              }, {})
            ).map((item, i) => (
              <CourseCard
                key={i}
                title={item.courseTitle}
                subtitle={item.chapterTitle}
                thumbnail={item.thumbnail}
                onClick={() =>
                  navigate(`/student/watch/${item.courseId}`)
                }
                primary={primary}
                action="Resume"
              />
            ))}
          </div>
        </Section>
      )}

      {/* ===== SUGGESTED ===== */}
      {data.suggestedCourses?.length > 0 && (
        <Section title="Suggested">
          <div className="space-y-4 px-4">
            {data.suggestedCourses.map((c) => (
              <CourseCard
                key={c.id}
                title={c.title}
                subtitle={`₹${c.price}`}
                onClick={() => navigate(`/course/${c.id}`)}
                primary={primary}
                thumbnail={c.thumbnail}
                action="View"
              />
            ))}
          </div>
        </Section>
      )}
    </div>
  );

}

/* ===== COMPONENTS ===== */

function Section({ title, children }) {
  return (
    <div className="mt-6">

      {/* Title with padding */}
      <h3 className="px-4 mb-3 text-sm font-semibold text-slate-900 tracking-tight">
        {title}
      </h3>

      {children}
    </div>
  );
}

function OverviewCard({ label, value, color }) {
  return (
    <div className="bg-white border rounded-2xl p-6 shadow-sm">
      <p className="text-xs uppercase tracking-widest text-gray-400">
        {label}
      </p>
      <h3
        className="text-2xl font-bold mt-2"
        style={{ color }}
      >
        {value}
      </h3>
    </div>
  );
}
function CourseCard({
  title,
  subtitle,
  thumbnail,
  onClick,
  primary,
  action,
}) {
  return (
    <div
      onClick={onClick}
      className="cursor-pointer  rounded-2xl overflow-hidden bg-white shadow-md hover:shadow-xl transition-all duration-300 group"
    >
      {/* IMAGE */}
      <div className="h-40 w-full overflow-hidden">
        <img
          src={`${api.defaults.baseURL.replace("/api", "")}${thumbnail}`}

          alt={title}
          className="w-full h-full object-cover group-hover:scale-105 transition duration-500"
        />
      </div>

      {/* CONTENT */}
      <div className="p-4">
        <h3 className="font-semibold text-lg text-gray-800 mb-1 line-clamp-2">
          {title}
        </h3>

        <p className="text-sm text-gray-500 mb-3">{subtitle}</p>

        <button
          className="text-sm font-semibold"
          style={{ color: primary }}
        >
          {action}
        </button>
      </div>
    </div>
  );
}