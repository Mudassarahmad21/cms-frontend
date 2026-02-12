import { useState, useContext } from "react";
import api from "../services/api";
import { AuthContext } from "../context/AuthContext";
import { useNavigate, Link } from "react-router-dom";

export default function Register() {
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    role: "CLIENT",
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await api.post("/auth/register", form);
      login(res.data);
      navigate("/");
    } catch (err) {
      alert(err.response?.data?.message || "Registration failed");
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
            Create Account
          </h4>
          <p className="text-center text-muted small mb-3">
            Join AgriSystem For Better Management
          </p>

          <form onSubmit={handleSubmit}>
            {/* Name */}
            <div className="mb-2">
              <label className="form-label small">Full Name</label>
              <input
                type="text"
                className="form-control form-control-sm"
                value={form.name}
                onChange={(e) =>
                  setForm({ ...form, name: e.target.value })
                }
                required
              />
            </div>

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
            <div className="mb-2">
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

            {/* Role */}
            <div className="mb-3">
              <label className="form-label small">Register As</label>
              <select
                className="form-select form-select-sm"
                value={form.role}
                onChange={(e) =>
                  setForm({ ...form, role: e.target.value })
                }
              >
                <option value="ADMIN">Admin</option>
                <option value="CLIENT">Client</option>
                <option value="FARMER">Farmer</option>
                <option value="BROKER">Broker</option>
              </select>
            </div>

            <button className="btn btn-success btn-sm w-100">
              Register
            </button>
          </form>

          <p className="text-center small mt-3 mb-0">
            Already have an account?{" "}
            <Link to="/login" className="fw-semibold text-decoration-none">
              Login
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
