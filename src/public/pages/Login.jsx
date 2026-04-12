import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { motion } from "framer-motion";
import api from "../../shared/api";
import { useBranding } from "../../shared/hooks/useBranding";

export default function Login() {
  const brand = useBranding();
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [popup, setPopup] = useState(false);

  const handleLogin = async () => {
    try {
      const { data } = await api.post("/auth/login", {
        email,
        password,
      });

      localStorage.setItem("user", JSON.stringify(data.user));
      localStorage.setItem("token", data.token);

      if (data.user.role === "ADMIN") navigate("/admin");
      else navigate("/student");
    } catch (err) {
      setPopup(true);
      setTimeout(() => setPopup(false), 3000);
    }
  };

  // 👈 NEW: back handler
  const handleBack = () => {
    localStorage.removeItem("tenant_id");
    navigate("/welcome", { replace: true });
  };

  return (
    <div className="min-h-screen min-w-[100vw] text-black flex items-center justify-center bg-gradient-to-br from-slate-50 via-white to-slate-100 px-6 relative">

      {/* 👈 Back Button */}
      <button
        onClick={handleBack}
        className="absolute top-6 left-6 flex items-center gap-2 text-sm text-slate-500 hover:text-slate-800 transition"
      >
        ← Back
      </button>

      {/* Card */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md bg-white/80 backdrop-blur-xl rounded-3xl shadow-xl border border-slate-100 p-8 space-y-6"
      >

        {/* Branding */}
        <div className="text-center space-y-2">
          <h1 className="text-2xl font-semibold tracking-tight">
            Welcome back
          </h1>
          <p className="text-sm text-slate-500">
            Sign in to continue
          </p>
        </div>

        {/* Inputs */}
        <div className="space-y-4">

          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-white 
              focus:outline-none focus:ring-4 focus:ring-indigo-50 focus:border-indigo-500
              transition-all"
          />

          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-white 
              focus:outline-none focus:ring-4 focus:ring-indigo-50 focus:border-indigo-500
              transition-all"
          />

        </div>

        {/* CTA */}
        <motion.button
          whileTap={{ scale: 0.97 }}
          whileHover={{ scale: 1.01 }}
          onClick={handleLogin}
          className="w-full py-3 text-white font-semibold rounded-xl
            bg-gradient-to-r from-indigo-600 to-purple-600
            shadow-lg shadow-indigo-200 hover:shadow-xl transition-all"
        >
          Continue
        </motion.button>

        {/* Footer */}
        <p className="text-center text-xs text-slate-400">
          New here?{" "}
          <Link to="/register" className="text-indigo-600 hover:underline">
            Create account
          </Link>
        </p>
      </motion.div>

      {/* Popup */}
      {popup && (
        <div className="fixed top-6 left-1/2 -translate-x-1/2 bg-red-500 text-white px-5 py-2 rounded-full shadow-lg text-sm">
          Invalid credentials. Please try again.
        </div>
      )}
    </div>
  );
}