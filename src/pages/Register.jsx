import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import api from "../services/api";

export default function Register() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    role: "CLIENT",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    if (form.password.length < 6)
      return setError("Password must be at least 6 characters");
    setLoading(true);
    try {
      const res = await api.post("/auth/register", form);
      login(res.data);
      navigate("/");
    } catch (err) {
      setError(err.response?.data?.message || "Registration failed");
    } finally {
      setLoading(false);
    }
  };

  const roles = [
    { value: "CLIENT", label: "🛒 Client", desc: "Buy crops from farmers" },
    { value: "FARMER", label: "🌾 Farmer", desc: "List and sell your crops" },
    { value: "BROKER", label: "🤝 Broker", desc: "Manage and approve orders" },
    { value: "ADMIN", label: "👑 Admin", desc: "Full system access" },
  ];

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "var(--bg-base)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "24px",
        position: "relative",
        overflow: "hidden",
      }}
    >
      {/* Background decoration */}
      <div
        style={{
          position: "absolute",
          top: "-10%",
          left: "-5%",
          width: "500px",
          height: "500px",
          background:
            "radial-gradient(circle, rgba(34,197,94,0.06) 0%, transparent 70%)",
          pointerEvents: "none",
        }}
      />

      <div
        style={{
          width: "100%",
          maxWidth: "440px",
          position: "relative",
          zIndex: 1,
        }}
      >
        {/* Logo */}
        <div style={{ textAlign: "center", marginBottom: "28px" }}>
          <div
            style={{ fontSize: "48px", marginBottom: "10px", lineHeight: 1 }}
          >
            🌾
          </div>
          <h1
            style={{
              fontFamily: "var(--font-display)",
              fontSize: "28px",
              fontWeight: 800,
              color: "var(--text-primary)",
              letterSpacing: "-0.5px",
              marginBottom: "6px",
            }}
          >
            Create Account
          </h1>
          <p style={{ color: "var(--text-muted)", fontSize: "14px" }}>
            Join the AgriSystem platform
          </p>
        </div>

        <div className="card" style={{ padding: "28px" }}>
          {error && <div className="alert alert-error">{error}</div>}

          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label className="form-label">Full Name</label>
              <input
                type="text"
                required
                className="form-control"
                placeholder="Malik Ahmad"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
              />
            </div>
            <div className="form-group">
              <label className="form-label">Email Address</label>
              <input
                type="email"
                required
                className="form-control"
                placeholder="you@example.com"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
              />
            </div>
            <div className="form-group">
              <label className="form-label">Password</label>
              <input
                type="password"
                required
                className="form-control"
                placeholder="Min 6 characters"
                value={form.password}
                onChange={(e) => setForm({ ...form, password: e.target.value })}
              />
            </div>

            {/* Role selector as cards */}
            <div className="form-group">
              <label className="form-label">Register As</label>
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "1fr 1fr",
                  gap: "8px",
                }}
              >
                {roles.map((r) => {
                  const isActive = form.role === r.value;
                  return (
                    <div
                      key={r.value}
                      onClick={() => setForm({ ...form, role: r.value })}
                      style={{
                        padding: "10px 12px",
                        borderRadius: "var(--radius-md)",
                        border: `1px solid ${isActive ? "var(--green)" : "var(--border-default)"}`,
                        background: isActive
                          ? "var(--green-dim)"
                          : "var(--bg-elevated)",
                        cursor: "pointer",
                        transition: "all 0.15s",
                      }}
                    >
                      <div
                        style={{
                          fontSize: "13px",
                          fontWeight: 600,
                          color: isActive
                            ? "var(--green)"
                            : "var(--text-primary)",
                        }}
                      >
                        {r.label}
                      </div>
                      <div
                        style={{
                          fontSize: "11px",
                          color: "var(--text-muted)",
                          marginTop: "2px",
                        }}
                      >
                        {r.desc}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            <button
              type="submit"
              className="btn btn-primary"
              style={{
                width: "100%",
                justifyContent: "center",
                padding: "12px",
                fontSize: "14px",
                marginTop: "6px",
              }}
              disabled={loading}
            >
              {loading ? "Creating account…" : "Create Account →"}
            </button>
          </form>

          <p
            style={{
              textAlign: "center",
              color: "var(--text-muted)",
              fontSize: "13px",
              marginTop: "18px",
            }}
          >
            Already have an account?{" "}
            <Link
              to="/login"
              style={{
                color: "var(--green)",
                fontWeight: 700,
                textDecoration: "none",
              }}
            >
              Sign In
            </Link>
          </p>
          <p style={{ textAlign: "center", marginTop: "8px" }}>
            <Link
              to="/"
              style={{
                color: "var(--text-disabled)",
                fontSize: "12px",
                textDecoration: "none",
              }}
            >
              ← Continue as Guest
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
