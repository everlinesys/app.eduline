import { MdMenu, MdPerson } from "react-icons/md";
import { useNavigate } from "react-router-dom";
import { getUser } from "../../shared/auth";

export default function StudentHeader({ onMenuClick }) {
  const navigate = useNavigate();
  const user = getUser();

  return (
    <header className="sticky top-0 z-50 backdrop-blur-xl bg-white/80 border-b border-slate-100">

      <div className="h-16 flex items-center justify-between px-4">

        {/* LEFT */}
        <div className="flex items-center gap-2">

          {/* Hamburger */}
          <button
            onClick={onMenuClick}
            className="lg:hidden w-10 h-10 flex items-center justify-center rounded-full hover:bg-slate-100 active:scale-95 transition"
          >
            <MdMenu size={22} className="text-slate-700" />
          </button>

          {/* Title */}
          <h1 className="text-base font-semibold text-slate-900 tracking-tight">
            My Learning
          </h1>
        </div>

        {/* RIGHT */}
        <div className="flex items-center gap-3">

          {/* Profile Chip */}
          <div
            onClick={() => navigate("/student/profile")}
            className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-slate-100 hover:bg-slate-200 active:scale-95 transition cursor-pointer"
          >
            <MdPerson size={18} className="text-slate-700" />
            <span className="text-sm font-medium text-slate-700 max-w-[100px] truncate">
              {user?.name || "Student"}
            </span>
          </div>

        </div>
      </div>
    </header>
  );
}