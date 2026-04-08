import { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import api from "../services/api";

const DUMMY_CROPS = [
  {
    _id: "d1",
    name: "Golden Wheat",
    type: "Grain",
    price: 45,
    quantity: 500,
    location: "Lahore, Punjab",
    status: "available",
    farmer: { name: "Ali Hassan" },
  },
  {
    _id: "d2",
    name: "Basmati Rice",
    type: "Grain",
    price: 120,
    quantity: 300,
    location: "Gujranwala, Punjab",
    status: "available",
    farmer: { name: "Ali Hassan" },
  },
  {
    _id: "d3",
    name: "Red Tomatoes",
    type: "Vegetable",
    price: 35,
    quantity: 200,
    location: "Multan, Punjab",
    status: "available",
    farmer: { name: "Sara Malik" },
  },
];

const EMPTY = {
  name: "",
  type: "",
  quantity: "",
  price: "",
  location: "",
  description: "",
};

export default function Crops() {
  const { user, isLoggedIn } = useAuth();
  const [crops, setCrops] = useState([]);
  const [form, setForm] = useState(EMPTY);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [alert, setAlert] = useState(null);
  const [isDummy, setIsDummy] = useState(false);

  const canAdd = isLoggedIn && ["FARMER", "ADMIN"].includes(user.role);
  const canDelete = isLoggedIn && user.role === "ADMIN";

  useEffect(() => {
    api
      .get("/crops")
      .then((r) => {
        if (r.data.length === 0) {
          setCrops(DUMMY_CROPS);
          setIsDummy(true);
        } else {
          setCrops(r.data);
          setIsDummy(false);
        }
      })
      .catch(() => {
        setCrops(DUMMY_CROPS);
        setIsDummy(true);
      })
      .finally(() => setLoading(false));
  }, []);

  const showAlert = (type, text) => {
    setAlert({ type, text });
    setTimeout(() => setAlert(null), 4000);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.name || !form.type || !form.location)
      return showAlert("error", "Name, type, and location are required");
    if (Number(form.quantity) <= 0 || Number(form.price) <= 0)
      return showAlert("error", "Quantity and price must be > 0");

    setSaving(true);
    try {
      const res = await api.post("/crops", {
        ...form,
        quantity: Number(form.quantity),
        price: Number(form.price),
      });
      setCrops((p) => [res.data, ...p]);
      setForm(EMPTY);
      setIsDummy(false);
      showAlert("success", `✅ "${res.data.name}" added successfully`);
    } catch (err) {
      showAlert("error", err.response?.data?.message || "Failed to add crop");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this crop permanently?")) return;
    try {
      await api.delete(`/crops/${id}`);
      setCrops((p) => p.filter((c) => c._id !== id));
      showAlert("success", "Crop deleted");
    } catch (err) {
      showAlert("error", err.response?.data?.message || "Delete failed");
    }
  };

  return (
    <div className="page-wrapper page-enter">
      <h1 className="page-title">🌱 Crops Management</h1>
      <p className="page-subtitle">
        {canAdd
          ? "Add and manage crop listings"
          : "Browse all registered crops"}
      </p>

      {isDummy && (
        <div className="alert alert-success">
          💡 Showing sample data — run{" "}
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
          to load real data, or{" "}
          {canAdd ? "add a crop below" : "login as a Farmer to add crops"}
        </div>
      )}

      {alert && <div className={`alert alert-${alert.type}`}>{alert.text}</div>}

      {/* ── Add Form ── */}
      {canAdd && (
        <div className="card" style={{ marginBottom: "24px" }}>
          <h3
            style={{
              fontFamily: "var(--font-display)",
              fontSize: "15px",
              fontWeight: 700,
              color: "var(--text-secondary)",
              marginBottom: "18px",
            }}
          >
            + Add New Crop
          </h3>
          <form onSubmit={handleSubmit}>
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fit, minmax(160px, 1fr))",
                gap: "12px",
                marginBottom: "14px",
              }}
            >
              {[
                { f: "name", p: "Crop name *", t: "text" },
                { f: "type", p: "Type (e.g. Grain) *", t: "text" },
                { f: "quantity", p: "Quantity (kg) *", t: "number" },
                { f: "price", p: "Price / kg ($) *", t: "number" },
                { f: "location", p: "Location *", t: "text" },
                { f: "description", p: "Description", t: "text" },
              ].map(({ f, p, t }) => (
                <input
                  key={f}
                  type={t}
                  className="form-control"
                  placeholder={p}
                  value={form[f]}
                  min={t === "number" ? 1 : undefined}
                  onChange={(e) => setForm({ ...form, [f]: e.target.value })}
                />
              ))}
            </div>
            <button type="submit" className="btn btn-primary" disabled={saving}>
              {saving ? "Saving…" : "+ Add Crop"}
            </button>
          </form>
        </div>
      )}

      {/* ── Table ── */}
      {loading ? (
        <div className="spinner-wrap">
          <div className="spinner" />
        </div>
      ) : crops.length === 0 ? (
        <div className="empty-state">
          <div className="empty-icon">🌱</div>
          <h4>No crops yet</h4>
          <p>
            {canAdd
              ? "Add your first crop using the form above"
              : "No crops have been listed yet"}
          </p>
        </div>
      ) : (
        <div className="card" style={{ padding: 0, overflowX: "auto" }}>
          <table className="data-table">
            <thead>
              <tr>
                <th>Name</th>
                <th>Type</th>
                <th>Quantity</th>
                <th>Price</th>
                <th>Location</th>
                <th>Farmer</th>
                <th>Status</th>
                {canDelete && <th>Actions</th>}
              </tr>
            </thead>
            <tbody>
              {crops.map((c) => (
                <tr key={c._id}>
                  <td style={{ color: "var(--text-primary)", fontWeight: 600 }}>
                    {c.name}
                  </td>
                  <td>{c.type}</td>
                  <td>{c.quantity} kg</td>
                  <td style={{ color: "var(--green)", fontWeight: 700 }}>
                    ${c.price}
                  </td>
                  <td>📍 {c.location}</td>
                  <td>{c.farmer?.name || "—"}</td>
                  <td>
                    <span
                      className="badge"
                      style={{
                        background:
                          c.status === "available"
                            ? "var(--green-dim)"
                            : "var(--red-dim)",
                        color:
                          c.status === "available"
                            ? "var(--green)"
                            : "var(--red)",
                      }}
                    >
                      {c.status}
                    </span>
                  </td>
                  {canDelete && (
                    <td>
                      <button
                        className="btn btn-danger btn-sm"
                        onClick={() => handleDelete(c._id)}
                        disabled={isDummy}
                      >
                        Delete
                      </button>
                    </td>
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
