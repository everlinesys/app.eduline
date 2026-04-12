import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import api from "../../shared/api";
import { useBranding } from "../../shared/hooks/useBranding";

export default function Register() {
  const navigate = useNavigate();
  const brand = useBranding();

  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const { data } = await api.post("/auth/register", form);

      localStorage.setItem("user", JSON.stringify(data.user));
      localStorage.setItem("token", data.token);

      if (data.user.role === "admin") {
        navigate("/admin");
      } else {
        navigate("/student");
      }
    } catch (err) {
      setError(
        err.response?.data?.message ||
        "Registration failed. Try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen min-w-[100vw] text-black flex items-center justify-center bg-gradient-to-br from-slate-50 via-white to-slate-100 px-6">

      {/* Card */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md bg-white/80 backdrop-blur-xl rounded-3xl shadow-xl border border-slate-100 p-8 space-y-6"
      >

        {/* Header */}
        <div className="text-center space-y-2">
          <h1 className="text-2xl font-semibold tracking-tight">
            Create account
          </h1>
          <p className="text-sm text-slate-500">
            Start your journey
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleRegister} className="space-y-4">

          <input
            type="text"
            name="name"
            placeholder="Full name"
            required
            value={form.name}
            onChange={handleChange}
            className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-white 
              focus:outline-none focus:ring-4 focus:ring-indigo-50 focus:border-indigo-500
              transition-all"
          />

          <input
            type="email"
            name="email"
            placeholder="Email"
            required
            value={form.email}
            onChange={handleChange}
            className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-white 
              focus:outline-none focus:ring-4 focus:ring-indigo-50 focus:border-indigo-500
              transition-all"
          />

          <input
            type="password"
            name="password"
            placeholder="Password (min 6 characters)"
            required
            minLength={6}
            value={form.password}
            onChange={handleChange}
            className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-white 
              focus:outline-none focus:ring-4 focus:ring-indigo-50 focus:border-indigo-500
              transition-all"
          />

          {error && (
            <p className="text-sm text-red-500">{error}</p>
          )}

          {/* CTA */}
          <motion.button
            whileTap={{ scale: 0.97 }}
            whileHover={{ scale: 1.01 }}
            type="submit"
            disabled={loading}
            style={{ background: brand.colors.primary }}
            className="w-full py-3 text-white font-semibold rounded-xl
              shadow-lg hover:shadow-xl transition-all disabled:opacity-50"
          >
            {loading ? "Creating account..." : "Continue"}
          </motion.button>
        </form>

        {/* Footer */}
        <p className="text-center text-xs text-slate-400">
          Already have an account?{" "}
          <span
            onClick={() => navigate("/login")}
            className="text-indigo-600 cursor-pointer hover:underline"
          >
            Sign in
          </span>
        </p>
      </motion.div>
    </div>
  );
}