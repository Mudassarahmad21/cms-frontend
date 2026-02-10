import { useState, useContext } from "react";
import api from "../services/api";
import { AuthContext } from "../context/AuthContext";
import { useNavigate, Link } from "react-router-dom";

export default function Login() {
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

  const [form, setForm] = useState({
    email: "",
    password: "",
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await api.post("/auth/login", form);
      login(res.data);
      navigate("/");
    } catch (err) {
      alert(err.response?.data?.message || "Invalid credentials");
    }
  };

  return (
    <div
      className="container d-flex justify-content-center align-items-center"
      style={{ minHeight: "80vh" }}
    >
      <div
        className="card shadow border-0 w-100"
        style={{ maxWidth: "380px" }}
      >
        <div className="card-body p-3">

          <h4 className="text-center fw-bold mb-1">
            Welcome Back
          </h4>
          <p className="text-center text-muted small mb-3">
            Login to AgriSystem
          </p>

          <form onSubmit={handleSubmit}>
            {/* Email */}
            <div className="mb-2">
              <label className="form-label small">Email</label>
              <input
                type="email"
                className="form-control form-control-sm"
                value={form.email}
                onChange={(e) =>
                  setForm({ ...form, email: e.target.value })
                }
                required
              />
            </div>

            {/* Password */}
            <div className="mb-3">
              <label className="form-label small">Password</label>
              <input
                type="password"
                className="form-control form-control-sm"
                value={form.password}
                onChange={(e) =>
                  setForm({ ...form, password: e.target.value })
                }
                required
              />
            </div>

            <button className="btn btn-success btn-sm w-100">
              Login
            </button>
          </form>

          <p className="text-center small mt-3 mb-0">
            Don’t have an account?{" "}
            <Link to="/register" className="fw-semibold text-decoration-none">
              Register
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
