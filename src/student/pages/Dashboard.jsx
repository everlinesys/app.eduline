import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../shared/api";
import { getUser } from "../../shared/auth";
import { useBranding } from "../../shared/hooks/useBranding";

import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from "recharts";

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
  function joinLiveClass() {
    const meetLink = "https://meet.google.com/fhg-jqka-uuf";
    window.open(meetLink, "_blank");
  }
  return (
    <div className="space-y-10 p-4 md:p-0">

      {/* ===== HERO HEADER ===== */}
      <div
        className="p-8 rounded-3xl text-white shadow-xl"
        style={{ background: primary }}
      >
        <h2 className="text-2xl font-bold">
          Welcome back, {user?.name}
        </h2>
        <p className="text-sm opacity-90 mt-1">
          Let’s continue your learning journey.
        </p>
      </div>

      {/* ===== OVERVIEW CARDS ===== */}
      {/* ===== LIVE CLASS ===== */}
      {/* ===== LIVE CLASSES ===== */}
      {liveClasses.length > 0 && (
        <Section title="Live Sessions">

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">

            {liveClasses.map((lc) => {
              const live = isLive(lc.startTime, lc.endTime);

              return (
                <div
                  key={lc.id}
                  className="bg-white border rounded-2xl p-5 space-y-3 shadow-sm"
                >

                  {/* Course */}
                  <p className="text-[10px] uppercase text-slate-400 font-bold tracking-widest">
                    {lc.course?.title}
                  </p>

                  {/* Title */}
                  <h4 className="font-semibold text-slate-900">
                    {lc.title}
                  </h4>

                  {/* Time */}
                  <p className="text-sm text-slate-500">
                    {new Date(lc.startTime).toLocaleString()}
                  </p>

                  {/* Countdown */}
                  <p className={`text-lg font-mono ${live ? "text-red-500" : "text-indigo-600"
                    }`}>
                    {live ? "🔴 Live Now" : `⏳ ${getCountdown(lc.startTime)}`}
                  </p>

                  {/* Join */}
                  <button
                    disabled={!live}
                    onClick={() => window.open(lc.meetLink, "_blank")}
                    className={`w-full py-2 rounded-lg text-sm font-semibold transition
                ${live
                        ? "bg-red-600 hover:bg-red-700 text-white"
                        : "bg-slate-200 text-slate-400 cursor-not-allowed"
                      }`}
                  >
                    🔴 Join Class
                  </button>

                </div>
              );
            })}

          </div>
        </Section>
      )}
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">

        <OverviewCard
          label="Enrolled Courses"
          value={data.stats.totalCourses}
          color="#6366f1"
        />

        <OverviewCard
          label="Completed"
          value={data.stats.completedCourses}
          color="#16a34a"
        />

        <OverviewCard
          label="Completion Rate"
          value={`${Math.round(
            (data.stats.completedCourses /
              data.stats.totalCourses) *
            100 || 0
          )}%`}
          color={primary}
        />
      </div>

      {/* ===== ACTIVITY GRAPH ===== */}
      <div className="bg-white border rounded-2xl p-6 shadow-sm">
        <h3 className="font-semibold mb-4">
          Learning Activity
        </h3>

        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="day" />
              <YAxis />
              <Tooltip />
              <Area
                type="monotone"
                dataKey="progress"
                stroke={primary}
                fill={primary}
                fillOpacity={0.15}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* ===== CONTINUE LEARNING ===== */}
      {data.continueLearning?.length > 0 && (
        <Section title="Continue Learning">
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">

            {Object.values(
              data.continueLearning.reduce((acc, item) => {
                // keep first occurrence of each course
                if (!acc[item.courseId]) {
                  acc[item.courseId] = item;
                }
                return acc;
              }, {})
            ).map((item, i) => (
              <CourseCard
                key={i}
                title={item.courseTitle}
                subtitle={item.chapterTitle}
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

      {/* ===== MY COURSES ===== */}
      <Section title="My Courses">
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {data.courses.map((c) => (
            <div
              key={c.id}
              className="bg-white border rounded-2xl p-5 hover:shadow transition"
            >
              <h4 className="font-semibold">{c.title}</h4>

              {/* Progress */}
              <div className="mt-4">
                <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                  <div
                    className="h-full"
                    style={{
                      width: `${c.progress}%`,
                      background: primary,
                    }}
                  />
                </div>

                <p className="text-xs text-gray-500 mt-1">
                  {c.progress}% completed
                </p>
              </div>

              <button
                onClick={() =>
                  navigate(`/student/watch/${c.id}`)
                }
                className="mt-5 w-full py-2 rounded-lg text-white text-sm"
                style={{ background: primary }}
              >
                {c.progress > 0
                  ? "Resume"
                  : "Start Course"}
              </button>
            </div>
          ))}
        </div>
      </Section>

      {/* ===== SUGGESTED ===== */}
      {data.suggestedCourses?.length > 0 && (
        <Section title="Suggested for You">
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {data.suggestedCourses.map((c) => (
              <CourseCard
                key={c.id}
                title={c.title}
                subtitle={`₹${c.price}`}
                onClick={() => navigate(`/course/${c.id}`)}
                primary={primary}
                action="View Course"
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
    <div className="space-y-4">
      <h3 className="text-lg font-semibold">{title}</h3>
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

function CourseCard({ title, subtitle, onClick, primary, action }) {
  return (
    <div className="bg-white border rounded-2xl p-5 hover:shadow transition">
      <p className="text-sm text-gray-500">{subtitle}</p>
      <h4 className="font-semibold mt-1">{title}</h4>

      <button
        onClick={onClick}
        className="mt-4 w-full py-2 rounded-lg text-white text-sm"
        style={{ background: primary }}
      >
        {action}
      </button>
    </div>
  );
}
