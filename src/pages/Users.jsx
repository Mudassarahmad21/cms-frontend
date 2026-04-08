import { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import { Link } from "react-router-dom";
import api from "../services/api";

const DUMMY_USERS = [
  {
    _id: "du1",
    name: "Admin User",
    email: "admin@agri.com",
    role: "ADMIN",
    isActive: true,
    createdAt: new Date().toISOString(),
  },
  {
    _id: "du2",
    name: "Ali Hassan",
    email: "ali@agri.com",
    role: "FARMER",
    isActive: true,
    createdAt: new Date().toISOString(),
  },
  {
    _id: "du3",
    name: "Sara Malik",
    email: "sara@agri.com",
    role: "FARMER",
    isActive: true,
    createdAt: new Date().toISOString(),
  },
  {
    _id: "du4",
    name: "Broker Khan",
    email: "broker@agri.com",
    role: "BROKER",
    isActive: true,
    createdAt: new Date().toISOString(),
  },
  {
    _id: "du5",
    name: "Ahmed Client",
    email: "ahmed@agri.com",
    role: "CLIENT",
    isActive: true,
    createdAt: new Date().toISOString(),
  },
  {
    _id: "du6",
    name: "Zara Client",
    email: "zara@agri.com",
    role: "CLIENT",
    isActive: false,
    createdAt: new Date().toISOString(),
  },
];

const ROLE_STYLE = {
  ADMIN: { bg: "rgba(245,158,11,0.12)", color: "#f59e0b" },
  FARMER: { bg: "rgba(34,197,94,0.12)", color: "#22c55e" },
  BROKER: { bg: "rgba(59,130,246,0.12)", color: "#3b82f6" },
  CLIENT: { bg: "rgba(139,92,246,0.12)", color: "#8b5cf6" },
};

export default function Users() {
  const { user: me, isLoggedIn } = useAuth();
  const [users, setUsers] = useState([]);
  const [editUser, setEditUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [alert, setAlert] = useState(null);
  const [isDummy, setIsDummy] = useState(false);

  const isAdmin = isLoggedIn && me.role === "ADMIN";

  useEffect(() => {
    if (!isAdmin) {
      setUsers(DUMMY_USERS);
      setIsDummy(true);
      setLoading(false);
      return;
    }
    api
      .get("/users")
      .then((r) => {
        if (r.data.length === 0) {
          setUsers(DUMMY_USERS);
          setIsDummy(true);
        } else {
          setUsers(r.data);
          setIsDummy(false);
        }
      })
      .catch(() => {
        setUsers(DUMMY_USERS);
        setIsDummy(true);
      })
      .finally(() => setLoading(false));
  }, [isAdmin]);

  const showAlert = (type, text) => {
    setAlert({ type, text });
    setTimeout(() => setAlert(null), 4000);
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const res = await api.put(`/users/${editUser._id}`, {
        name: editUser.name,
        email: editUser.email,
        role: editUser.role,
        isActive: editUser.isActive,
      });
      setUsers((p) =>
        p.map((u) => (u._id === editUser._id ? { ...u, ...res.data } : u)),
      );
      setEditUser(null);
      showAlert("success", "✅ User updated successfully");
    } catch (err) {
      showAlert("error", err.response?.data?.message || "Update failed");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Permanently delete this user?")) return;
    try {
      await api.delete(`/users/${id}`);
      setUsers((p) => p.filter((u) => u._id !== id));
      showAlert("success", "User removed");
    } catch (err) {
      showAlert("error", err.response?.data?.message || "Delete failed");
    }
  };

  return (
    <div className="page-wrapper page-enter">
      <h1 className="page-title">👥 User Management</h1>
      <p className="page-subtitle">Manage registered users and their roles</p>

      {!isAdmin && (
        <div className="alert alert-success">
          💡 This page is for Admins only. Showing sample data —{" "}
          <Link to="/login" style={{ color: "var(--green)", fontWeight: 700 }}>
            Login as Admin
          </Link>{" "}
          to manage users
        </div>
      )}
      {isDummy && isAdmin && (
        <div className="alert alert-success">
          💡 No users yet — run{" "}
          <code
            style={{
              background: "rgba(34,197,94,0.2)",
              padding: "1px 6px",
              borderRadius: 4,
              fontSize: 12,
            }}
          >
            node seed.js
          </code>{" "}
          to load sample data
        </div>
      )}

      {alert && <div className={`alert alert-${alert.type}`}>{alert.text}</div>}

      {loading ? (
        <div className="spinner-wrap">
          <div className="spinner" />
        </div>
      ) : (
        <div className="card" style={{ padding: 0, overflowX: "auto" }}>
          <table className="data-table">
            <thead>
              <tr>
                <th>Name</th>
                <th>Email</th>
                <th>Role</th>
                <th>Status</th>
                <th>Joined</th>
                {isAdmin && <th>Actions</th>}
              </tr>
            </thead>
            <tbody>
              {users.map((u) => {
                const rs = ROLE_STYLE[u.role] || ROLE_STYLE.CLIENT;
                return (
                  <tr key={u._id}>
                    <td
                      style={{ color: "var(--text-primary)", fontWeight: 600 }}
                    >
                      {u.name}
                    </td>
                    <td>{u.email}</td>
                    <td>
                      <span
                        className="badge"
                        style={{ background: rs.bg, color: rs.color }}
                      >
                        {u.role}
                      </span>
                    </td>
                    <td>
                      <span
                        className="badge"
                        style={{
                          background: u.isActive
                            ? "var(--green-dim)"
                            : "var(--red-dim)",
                          color: u.isActive ? "var(--green)" : "var(--red)",
                        }}
                      >
                        {u.isActive ? "Active" : "Inactive"}
                      </span>
                    </td>
                    <td style={{ fontSize: "12px" }}>
                      {u.createdAt
                        ? new Date(u.createdAt).toLocaleDateString()
                        : "—"}
                    </td>
                    {isAdmin && (
                      <td>
                        <div style={{ display: "flex", gap: "6px" }}>
                          <button
                            className="btn btn-ghost btn-sm"
                            onClick={() => setEditUser({ ...u })}
                            disabled={isDummy}
                          >
                            Edit
                          </button>
                          <button
                            className="btn btn-danger btn-sm"
                            onClick={() => handleDelete(u._id)}
                            disabled={isDummy || u._id === me.id}
                          >
                            Delete
                          </button>
                        </div>
                      </td>
                    )}
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      {/* ── Edit Modal ── */}
      {editUser && (
        <div
          className="modal-overlay"
          onClick={(e) => e.target === e.currentTarget && setEditUser(null)}
        >
          <div className="modal-box">
            <div className="modal-header">
              <h2 className="modal-title">Edit User</h2>
              <button
                className="btn btn-ghost btn-icon"
                onClick={() => setEditUser(null)}
              >
                ✕
              </button>
            </div>
            <form onSubmit={handleUpdate}>
              <div className="form-group">
                <label className="form-label">Full Name</label>
                <input
                  className="form-control"
                  value={editUser.name}
                  onChange={(e) =>
                    setEditUser({ ...editUser, name: e.target.value })
                  }
                  required
                />
              </div>
              <div className="form-group">
                <label className="form-label">Email</label>
                <input
                  type="email"
                  className="form-control"
                  value={editUser.email}
                  onChange={(e) =>
                    setEditUser({ ...editUser, email: e.target.value })
                  }
                  required
                />
              </div>
              <div className="form-group">
                <label className="form-label">Role</label>
                <select
                  className="form-control"
                  value={editUser.role}
                  onChange={(e) =>
                    setEditUser({ ...editUser, role: e.target.value })
                  }
                >
                  <option value="ADMIN">👑 Admin</option>
                  <option value="FARMER">🌾 Farmer</option>
                  <option value="BROKER">🤝 Broker</option>
                  <option value="CLIENT">🛒 Client</option>
                </select>
              </div>
              <div className="form-group">
                <label className="form-label">Status</label>
                <select
                  className="form-control"
                  value={editUser.isActive ? "true" : "false"}
                  onChange={(e) =>
                    setEditUser({
                      ...editUser,
                      isActive: e.target.value === "true",
                    })
                  }
                >
                  <option value="true">Active</option>
                  <option value="false">Inactive</option>
                </select>
              </div>
              <div style={{ display: "flex", gap: "10px", marginTop: "6px" }}>
                <button
                  type="submit"
                  className="btn btn-primary"
                  style={{ flex: 1, justifyContent: "center" }}
                  disabled={saving}
                >
                  {saving ? "Saving…" : "Save Changes"}
                </button>
                <button
                  type="button"
                  className="btn btn-ghost"
                  style={{ flex: 1, justifyContent: "center" }}
                  onClick={() => setEditUser(null)}
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
