import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";

export default function Tenant() {
  const [code, setCode] = useState("");
  const [error, setError] = useState("");
  const [checking, setChecking] = useState(true); // 👈 prevent flicker
  const navigate = useNavigate();

  // 🚀 Auto redirect if already exists
  useEffect(() => {
    const existing = localStorage.getItem("tenant_id");
    if (existing) {
      navigate("/login", { replace: true });
    } else {
      setChecking(false);
    }
  }, []);

  const handleProceed = () => {
    if (!code.trim()) {
      setError("Enter your code to continue");
      return;
    }

    localStorage.setItem("tenant_id", code.trim());
    setError("");
    window.location.href = "/login";
  };

  // ⛔ prevent UI flash before redirect
  if (checking) return null;

  return (
    <div className="min-h-screen w-[100vw] flex flex-col justify-between bg-gradient-to-br from-slate-50 via-white to-slate-100 text-slate-900">

      {/* Top Section */}
      <div className="flex flex-col items-center justify-center px-6 pt-20">

        {/* Illustration */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="w-full max-w-xs mb-10"
        >
          <div className="relative">
            <div className="absolute inset-0 bg-gradient-to-br from-blue-500 to-purple-500 blur-3xl opacity-20 rounded-full"></div>

            <svg viewBox="0 0 200 150" className="relative w-full">
              <rect x="70" y="40" width="60" height="80" rx="14" fill="#fff" stroke="#e5e7eb" strokeWidth="2" />
              <rect x="82" y="60" width="36" height="5" rx="3" fill="#e5e7eb" />
              <rect x="82" y="72" width="24" height="5" rx="3" fill="#e5e7eb" />
              <circle cx="100" cy="110" r="6" fill="#6366f1" />
            </svg>
          </div>
        </motion.div>

        {/* Heading */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="text-center max-w-sm"
        >
          <h1 className="text-3xl font-semibold tracking-tight mb-2">
            Welcome 👋
          </h1>
          <p className="text-slate-500 text-sm leading-relaxed">
            Enter your code to access your workspace
          </p>
        </motion.div>

        {/* Input */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="w-full max-w-sm mt-8"
        >
          <input
            type="text"
            placeholder="Enter code"
            value={code}
            onChange={(e) => setCode(e.target.value.toUpperCase())} // 👈 better UX
            onKeyDown={(e) => e.key === "Enter" && handleProceed()} // 👈 enter support
            autoFocus
            className={`w-full px-5 py-4 rounded-2xl border transition-all duration-200 
              ${error 
                ? "border-red-400 bg-red-50 focus:ring-red-100" 
                : "border-slate-200 bg-white focus:border-indigo-500 focus:ring-4 focus:ring-indigo-50"} 
              outline-none text-base shadow-sm`}
          />

          {error && (
            <p className="mt-2 text-sm text-red-500">{error}</p>
          )}
        </motion.div>
      </div>

      {/* Bottom Section */}
      <div className="px-6 pb-10 w-full max-w-sm mx-auto">

        {/* CTA */}
        <motion.button
          whileTap={{ scale: 0.97 }}
          whileHover={{ scale: 1.01 }}
          onClick={handleProceed}
          className="w-full py-4 rounded-2xl text-white font-semibold text-base
            bg-gradient-to-r from-indigo-600 to-purple-600
            shadow-lg shadow-indigo-200 hover:shadow-xl transition-all"
        >
          Continue
        </motion.button>

        {/* Help */}
        <p className="text-center text-xs text-slate-400 mt-5 hover:text-slate-600 cursor-pointer transition">
          Need help finding your code?
        </p>
      </div>
    </div>
  );
}