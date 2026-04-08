import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import api from "../services/api";

export default function Login() {
  const { login } = useAuth();
  const navigate  = useNavigate();
  const [form,    setForm]    = useState({ email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [error,   setError]   = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const res = await api.post("/auth/login", form);
      login(res.data);
      navigate("/");
    } catch (err) {
      setError(err.response?.data?.message || "Invalid email or password");
    } finally {
      setLoading(false);
    }
  };

  const quickLogin = (email, password) => {
    setForm({ email, password });
  };

  return (
    <div style={{
      minHeight: "100vh",
      background: "var(--bg-base)",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      padding: "24px",
      position: "relative",
      overflow: "hidden",
    }}>
      {/* Background decoration */}
      <div style={{
        position: "absolute", top: "-10%", right: "-5%",
        width: "500px", height: "500px",
        background: "radial-gradient(circle, rgba(34,197,94,0.06) 0%, transparent 70%)",
        pointerEvents: "none",
      }} />
      <div style={{
        position: "absolute", bottom: "-10%", left: "-5%",
        width: "400px", height: "400px",
        background: "radial-gradient(circle, rgba(59,130,246,0.06) 0%, transparent 70%)",
        pointerEvents: "none",
      }} />

      <div style={{ width: "100%", maxWidth: "400px", position: "relative", zIndex: 1 }}>
        {/* Logo */}
        <div style={{ textAlign: "center", marginBottom: "32px" }}>
          <div style={{ fontSize: "48px", marginBottom: "10px", lineHeight: 1 }}>🌾</div>
          <h1 style={{
            fontFamily: "var(--font-display)",
            fontSize: "28px", fontWeight: 800,
            color: "var(--text-primary)",
            letterSpacing: "-0.5px", marginBottom: "6px",
          }}>
            Welcome Back
          </h1>
          <p style={{ color: "var(--text-muted)", fontSize: "14px" }}>Sign in to AgriSystem</p>
        </div>

        {/* Card */}
        <div className="card" style={{ padding: "28px" }}>
          {error && <div className="alert alert-error">{error}</div>}

          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label className="form-label">Email Address</label>
              <input
                type="email" required
                className="form-control"
                placeholder="you@example.com"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
              />
            </div>
            <div className="form-group" style={{ marginBottom: "22px" }}>
              <label className="form-label">Password</label>
              <input
                type="password" required
                className="form-control"
                placeholder="••••••••"
                value={form.password}
                onChange={(e) => setForm({ ...form, password: e.target.value })}
              />
            </div>
            <button
              type="submit"
              className="btn btn-primary"
              style={{ width: "100%", justifyContent: "center", padding: "12px", fontSize: "14px" }}
              disabled={loading}
            >
              {loading ? "Signing in…" : "Sign In →"}
            </button>
          </form>

          <p style={{ textAlign: "center", color: "var(--text-muted)", fontSize: "13px", marginTop: "18px" }}>
            Don't have an account?{" "}
            <Link to="/register" style={{ color: "var(--green)", fontWeight: 700, textDecoration: "none" }}>Register</Link>
          </p>
          <p style={{ textAlign: "center", marginTop: "8px" }}>
            <Link to="/" style={{ color: "var(--text-disabled)", fontSize: "12px", textDecoration: "none" }}>
              ← Continue as Guest
            </Link>
          </p>
        </div>

        {/* Quick login shortcuts */}
        <div className="card" style={{ marginTop: "16px", padding: "16px" }}>
          <p style={{ fontSize: "11px", fontWeight: 700, textTransform: "uppercase", letterSpacing: "1px", color: "var(--text-disabled)", marginBottom: "10px" }}>
            Quick Login (Demo)
          </p>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "6px" }}>
            {[
              { label: "👑 Admin",  email: "admin@agri.com",  pass: "admin123"  },
              { label: "🌾 Farmer", email: "ali@agri.com",    pass: "farmer123" },
              { label: "🤝 Broker", email: "broker@agri.com", pass: "broker123" },
              { label: "🛒 Client", email: "ahmed@agri.com",  pass: "client123" },
            ].map((q) => (
              <button
                key={q.label}
                type="button"
                className="btn btn-ghost btn-sm"
                style={{ justifyContent: "center", fontSize: "12px" }}
                onClick={() => quickLogin(q.email, q.pass)}
              >
                {q.label}
              </button>
            ))}
          </div>
          <p style={{ fontSize: "11px", color: "var(--text-disabled)", textAlign: "center", marginTop: "8px" }}>
            Click a role above to pre-fill, then hit Sign In
          </p>
        </div>
      </div>
    </div>
  );
}