import { useState } from "react";
import { useBranding } from "../../shared/hooks/useBranding";
import {
  MdChevronLeft,
  MdExpandMore,
  MdChevronRight,
  MdClose,
  MdPlayCircleOutline,
  MdList
} from "react-icons/md";

export default function MobileSyllabus({
  units = [],
  chaptersByUnit = {},
  onSelectChapter,
  currentChapterId,
}) {
  const [open, setOpen] = useState(false);
  const [openUnit, setOpenUnit] = useState(null);
  const brand = useBranding();
  const primary = brand.colors?.primary || "#111827";

  return (
    <>
      {/* ===== FLOATING BUTTON ===== */}
      <div className="lg:hidden fixed right-3 bottom-20 z-50">
        <button
          onClick={() => setOpen(true)}
          className="w-12 h-12 rounded-full shadow-lg flex items-center justify-center text-white active:scale-95 transition"
          style={{ background: primary }}
        >
          <MdList size={20} />
        </button>
      </div>

      {/* ===== OVERLAY ===== */}
      <div
        className={`fixed inset-0 bg-black/40 backdrop-blur-sm z-[60] transition-opacity duration-300 ${
          open ? "opacity-100" : "opacity-0 pointer-events-none"
        }`}
        onClick={() => setOpen(false)}
      />

      {/* ===== DRAWER ===== */}
      <div
        className={`fixed bottom-0 left-0 right-0 h-[85%] bg-white z-[70] transform transition-transform duration-300 ease-out rounded-t-3xl shadow-2xl flex flex-col
        ${open ? "translate-y-0" : "translate-y-full"}`}
      >

        {/* HANDLE (native bottom sheet feel) */}
        <div className="pt-3 pb-2 flex justify-center">
          <div className="w-10 h-1.5 bg-slate-300 rounded-full" />
        </div>

        {/* HEADER */}
        <div className="px-4 pb-3 flex items-center justify-between">
          <h2 className="text-sm font-semibold text-slate-900">
            Course Content
          </h2>

          <button
            onClick={() => setOpen(false)}
            className="w-9 h-9 rounded-full bg-slate-100 flex items-center justify-center active:scale-95"
          >
            <MdClose size={18} />
          </button>
        </div>

        {/* LIST */}
        <div className="flex-1 overflow-y-auto px-3 pb-6 space-y-3">

          {units.map((unit, idx) => {
            const isUnitOpen = openUnit === unit.id;
            const chapters = chaptersByUnit[unit.id] || [];

            return (
              <div key={unit.id}>

                {/* UNIT */}
                <button
                  onClick={() =>
                    setOpenUnit(isUnitOpen ? null : unit.id)
                  }
                  className={`w-full flex items-center justify-between px-4 py-3 rounded-xl text-sm transition ${
                    isUnitOpen
                      ? "bg-slate-100 text-slate-900"
                      : "bg-white text-slate-600"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <span className="text-[10px] text-slate-400 font-semibold">
                      {(idx + 1).toString().padStart(2, "0")}
                    </span>
                    <span className="text-sm text-left">
                      {unit.title}
                    </span>
                  </div>

                  {isUnitOpen ? (
                    <MdExpandMore size={18} />
                  ) : (
                    <MdChevronRight size={18} />
                  )}
                </button>

                {/* CHAPTERS */}
                <div
                  className={`overflow-hidden transition-all duration-300 ${
                    isUnitOpen ? "max-h-[500px] mt-2" : "max-h-0"
                  }`}
                >
                  <div className="space-y-1 pl-2">

                    {chapters.map((ch) => {
                      const active = currentChapterId === ch.id;

                      return (
                        <button
                          key={ch.id}
                          onClick={() => {
                            onSelectChapter(ch);
                            setOpen(false);
                          }}
                          className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-left text-sm transition ${
                            active
                              ? "bg-slate-900 text-white"
                              : "text-slate-600 hover:bg-slate-100"
                          }`}
                        >
                          <MdPlayCircleOutline
                            size={16}
                            className={
                              active
                                ? "text-white"
                                : "text-slate-400"
                            }
                          />

                          <span className="leading-tight">
                            {ch.title}
                          </span>
                        </button>
                      );
                    })}

                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </>
  );
}