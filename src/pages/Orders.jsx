import { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import { Link } from "react-router-dom";
import api from "../services/api";

const DUMMY_CROPS = [
  { _id: "dc1", name: "Golden Wheat", price: 45 },
  { _id: "dc2", name: "Basmati Rice", price: 120 },
  { _id: "dc3", name: "Alphonso Mango", price: 180 },
];

const DUMMY_ORDERS = [
  {
    _id: "do1",
    client: { name: "Ahmed Client" },
    items: [{ crop: { name: "Golden Wheat" }, quantity: 10 }],
    totalPrice: 450,
    status: "delivered",
    createdAt: new Date().toISOString(),
  },
  {
    _id: "do2",
    client: { name: "Zara Client" },
    items: [{ crop: { name: "Basmati Rice" }, quantity: 20 }],
    totalPrice: 2400,
    status: "approved",
    createdAt: new Date().toISOString(),
  },
  {
    _id: "do3",
    client: { name: "Ahmed Client" },
    items: [{ crop: { name: "Alphonso Mango" }, quantity: 8 }],
    totalPrice: 1440,
    status: "pending",
    createdAt: new Date().toISOString(),
  },
];

const STATUS_STYLE = {
  pending: { bg: "rgba(245,158,11,0.12)", color: "#f59e0b" },
  approved: { bg: "rgba(59,130,246,0.12)", color: "#3b82f6" },
  delivered: { bg: "rgba(34,197,94,0.12)", color: "#22c55e" },
};

export default function Orders() {
  const { user, isLoggedIn } = useAuth();
  const [orders, setOrders] = useState([]);
  const [crops, setCrops] = useState([]);
  const [items, setItems] = useState([{ crop: "", quantity: 1 }]);
  const [loading, setLoading] = useState(true);
  const [placing, setPlacing] = useState(false);
  const [alert, setAlert] = useState(null);
  const [isDummy, setIsDummy] = useState(false);

  const isAdminOrBroker = isLoggedIn && ["ADMIN", "BROKER"].includes(user.role);
  const isClient = isLoggedIn && user.role === "CLIENT";

  useEffect(() => {
    // Always load crops for the order form dropdown
    api
      .get("/crops")
      .then((r) => setCrops(r.data.length ? r.data : DUMMY_CROPS))
      .catch(() => setCrops(DUMMY_CROPS));
  }, []);

  useEffect(() => {
    if (!isLoggedIn) {
      setOrders(DUMMY_ORDERS);
      setIsDummy(true);
      setLoading(false);
      return;
    }
    setLoading(true);
    const url = isClient ? "/orders/myorders" : "/orders";
    api
      .get(url)
      .then((r) => {
        if (r.data.length === 0) {
          setOrders(DUMMY_ORDERS);
          setIsDummy(true);
        } else {
          setOrders(r.data);
          setIsDummy(false);
        }
      })
      .catch(() => {
        setOrders(DUMMY_ORDERS);
        setIsDummy(true);
      })
      .finally(() => setLoading(false));
  }, [isLoggedIn, user.role]); // eslint-disable-line

  const showAlert = (type, text) => {
    setAlert({ type, text });
    setTimeout(() => setAlert(null), 4500);
  };

  const calcTotal = () =>
    items.reduce((sum, i) => {
      const c = crops.find((cr) => cr._id === i.crop);
      return sum + (c?.price || 0) * (Number(i.quantity) || 0);
    }, 0);

  const updateItem = (idx, field, val) => {
    const next = [...items];
    next[idx] = {
      ...next[idx],
      [field]: field === "quantity" ? Number(val) : val,
    };
    setItems(next);
  };

  const handlePlace = async (e) => {
    e.preventDefault();
    if (items.some((i) => !i.crop))
      return showAlert("error", "Select a crop for every item");
    if (items.some((i) => i.quantity < 1))
      return showAlert("error", "Each quantity must be at least 1");

    setPlacing(true);
    try {
      const res = await api.post("/orders", { items, totalPrice: calcTotal() });
      setOrders((p) => [res.data, ...p]);
      setItems([{ crop: "", quantity: 1 }]);
      setIsDummy(false);
      showAlert("success", "✅ Order placed successfully!");
    } catch (err) {
      showAlert(
        "error",
        err.response?.data?.message || "Failed to place order",
      );
    } finally {
      setPlacing(false);
    }
  };

  const handleStatus = async (id, status) => {
    try {
      const res = await api.put(`/orders/${id}/status`, { status });
      setOrders((p) => p.map((o) => (o._id === id ? res.data : o)));
    } catch (err) {
      showAlert("error", err.response?.data?.message || "Status update failed");
    }
  };

  return (
    <div className="page-wrapper page-enter">
      <h1 className="page-title">📦 Orders</h1>
      <p className="page-subtitle">
        {isClient
          ? "Place and track your orders"
          : isAdminOrBroker
            ? "Manage all customer orders"
            : "View order activity"}
      </p>

      {!isLoggedIn && (
        <div className="alert alert-success">
          💡 Showing sample orders —{" "}
          <Link to="/login" style={{ color: "var(--green)", fontWeight: 700 }}>
            Login as Client
          </Link>{" "}
          to place real orders, or as Admin/Broker to manage them
        </div>
      )}
      {isDummy && isLoggedIn && (
        <div className="alert alert-success">
          💡 No orders yet — run{" "}
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

      {/* ── Place Order (Client only) ── */}
      {isClient && (
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
            + Place New Order
          </h3>
          <form onSubmit={handlePlace}>
            {items.map((item, idx) => (
              <div
                key={idx}
                style={{
                  display: "flex",
                  gap: "10px",
                  marginBottom: "10px",
                  alignItems: "center",
                }}
              >
                <select
                  className="form-control"
                  style={{ flex: 2 }}
                  value={item.crop}
                  onChange={(e) => updateItem(idx, "crop", e.target.value)}
                  required
                >
                  <option value="">Select crop…</option>
                  {crops.map((c) => (
                    <option key={c._id} value={c._id}>
                      {c.name} — ${c.price}/kg
                    </option>
                  ))}
                </select>
                <input
                  type="number"
                  min="1"
                  className="form-control"
                  style={{ flex: 1 }}
                  value={item.quantity}
                  onChange={(e) => updateItem(idx, "quantity", e.target.value)}
                  placeholder="Qty"
                  required
                />
                <button
                  type="button"
                  className="btn btn-danger btn-icon"
                  onClick={() => setItems(items.filter((_, i) => i !== idx))}
                  disabled={items.length === 1}
                >
                  ✕
                </button>
              </div>
            ))}

            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "12px",
                marginTop: "14px",
                flexWrap: "wrap",
              }}
            >
              <button
                type="button"
                className="btn btn-ghost btn-sm"
                onClick={() => setItems([...items, { crop: "", quantity: 1 }])}
              >
                + Add Item
              </button>
              <span
                style={{
                  flex: 1,
                  color: "var(--text-secondary)",
                  fontSize: "14px",
                }}
              >
                Total:{" "}
                <strong
                  style={{
                    color: "var(--green)",
                    fontFamily: "var(--font-display)",
                    fontSize: "18px",
                  }}
                >
                  ${calcTotal().toFixed(2)}
                </strong>
              </span>
              <button
                type="submit"
                className="btn btn-primary"
                disabled={placing}
              >
                {placing ? "Placing…" : "Place Order"}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* ── Orders Table ── */}
      {loading ? (
        <div className="spinner-wrap">
          <div className="spinner" />
        </div>
      ) : orders.length === 0 ? (
        <div className="empty-state">
          <div className="empty-icon">📦</div>
          <h4>No orders yet</h4>
          <p>
            {isClient
              ? "Place your first order above"
              : "No orders in the system yet"}
          </p>
        </div>
      ) : (
        <div className="card" style={{ padding: 0, overflowX: "auto" }}>
          <table className="data-table">
            <thead>
              <tr>
                <th>Client</th>
                <th>Items</th>
                <th>Total</th>
                <th>Status</th>
                <th>Date</th>
                {isAdminOrBroker && <th>Update Status</th>}
              </tr>
            </thead>
            <tbody>
              {orders.map((o) => {
                const s = STATUS_STYLE[o.status] || STATUS_STYLE.pending;
                return (
                  <tr key={o._id}>
                    <td
                      style={{ color: "var(--text-primary)", fontWeight: 600 }}
                    >
                      {o.client?.name || user.name}
                    </td>
                    <td>
                      {o.items.map((i, idx) => (
                        <div
                          key={idx}
                          style={{
                            fontSize: "12px",
                            color: "var(--text-muted)",
                          }}
                        >
                          {i.crop?.name || "—"} × {i.quantity}
                        </div>
                      ))}
                    </td>
                    <td style={{ color: "var(--green)", fontWeight: 700 }}>
                      ${o.totalPrice.toLocaleString()}
                    </td>
                    <td>
                      <span
                        className="badge"
                        style={{ background: s.bg, color: s.color }}
                      >
                        {o.status}
                      </span>
                    </td>
                    <td style={{ fontSize: "12px" }}>
                      {o.createdAt
                        ? new Date(o.createdAt).toLocaleDateString()
                        : "—"}
                    </td>
                    {isAdminOrBroker && (
                      <td>
                        <div style={{ display: "flex", gap: "5px" }}>
                          {["pending", "approved", "delivered"].map((st) => (
                            <button
                              key={st}
                              className="btn btn-sm"
                              disabled={o.status === st || isDummy}
                              onClick={() => handleStatus(o._id, st)}
                              style={{
                                background:
                                  o.status === st
                                    ? STATUS_STYLE[st].bg
                                    : "transparent",
                                color:
                                  o.status === st
                                    ? STATUS_STYLE[st].color
                                    : "var(--text-muted)",
                                border: `1px solid ${o.status === st ? STATUS_STYLE[st].color + "55" : "var(--border-default)"}`,
                                textTransform: "capitalize",
                                cursor:
                                  o.status === st || isDummy
                                    ? "default"
                                    : "pointer",
                              }}
                            >
                              {st}
                            </button>
                          ))}
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
    </div>
  );
}
