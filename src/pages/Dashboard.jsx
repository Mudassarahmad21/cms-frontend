import { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import api from "../services/api";
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
} from "chart.js";
import { Pie, Bar } from "react-chartjs-2";

ChartJS.register(
  ArcElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
);

// ── Dummy fallback data shown to guests / when API not ready ──────────────────
const DUMMY_STATS = {
  cards: { crops: 12, users: 6, orders: 18, revenue: 24750 },
  charts: {
    cropsByType: [
      { _id: "Grain", count: 5 },
      { _id: "Vegetable", count: 4 },
      { _id: "Fruit", count: 3 },
    ],
    ordersByStatus: [
      { _id: "pending", count: 7 },
      { _id: "approved", count: 6 },
      { _id: "delivered", count: 5 },
    ],
  },
  recentOrders: [
    {
      _id: "d1",
      client: { name: "Ahmed Client" },
      items: [{ crop: { name: "Golden Wheat" } }],
      totalPrice: 450,
      status: "delivered",
    },
    {
      _id: "d2",
      client: { name: "Zara Client" },
      items: [{ crop: { name: "Basmati Rice" } }],
      totalPrice: 2400,
      status: "approved",
    },
    {
      _id: "d3",
      client: { name: "Ahmed Client" },
      items: [{ crop: { name: "Alphonso Mango" } }],
      totalPrice: 1440,
      status: "pending",
    },
    {
      _id: "d4",
      client: { name: "Zara Client" },
      items: [{ crop: { name: "Green Spinach" } }],
      totalPrice: 750,
      status: "delivered",
    },
    {
      _id: "d5",
      client: { name: "Ahmed Client" },
      items: [{ crop: { name: "Kinnow Orange" } }],
      totalPrice: 900,
      status: "pending",
    },
  ],
};

const ROLE_COLORS = {
  ADMIN: "#f59e0b",
  FARMER: "#22c55e",
  BROKER: "#3b82f6",
  CLIENT: "#8b5cf6",
};
const PIE_COLORS = [
  "#22c55e",
  "#3b82f6",
  "#f59e0b",
  "#ef4444",
  "#8b5cf6",
  "#ec4899",
];

const STATUS_STYLE = {
  pending: { bg: "rgba(245,158,11,0.12)", color: "#f59e0b" },
  approved: { bg: "rgba(59,130,246,0.12)", color: "#3b82f6" },
  delivered: { bg: "rgba(34,197,94,0.12)", color: "#22c55e" },
};

export default function Dashboard() {
  const { user, isLoggedIn } = useAuth();
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(false);
  const accent = ROLE_COLORS[user.role] || "#22c55e";

  useEffect(() => {
    if (!isLoggedIn) {
      setStats(DUMMY_STATS);
      return;
    }
    setLoading(true);
    api
      .get("/stats")
      .then((r) => setStats(r.data))
      .catch(() => setStats(DUMMY_STATS))
      .finally(() => setLoading(false));
  }, [isLoggedIn, user.role]);

  const data = stats || DUMMY_STATS;

  const pieData = {
    labels: data.charts.cropsByType.map((c) => c._id),
    datasets: [
      {
        data: data.charts.cropsByType.map((c) => c.count),
        backgroundColor: PIE_COLORS,
        borderWidth: 2,
        borderColor: "var(--bg-card)",
      },
    ],
  };

  const barData = {
    labels: data.charts.ordersByStatus.map((o) => o._id),
    datasets: [
      {
        label: "Orders",
        data: data.charts.ordersByStatus.map((o) => o.count),
        backgroundColor: accent + "bb",
        borderColor: accent,
        borderWidth: 2,
        borderRadius: 8,
        borderSkipped: false,
      },
    ],
  };

  const chartOpts = (dark) => ({
    maintainAspectRatio: false,
    plugins: {
      legend: {
        labels: { color: "#8fa3c0", font: { family: "DM Sans", size: 12 } },
      },
    },
    ...(dark && {
      scales: {
        x: {
          ticks: { color: "#4d6380" },
          grid: { color: "rgba(255,255,255,0.04)" },
        },
        y: {
          ticks: { color: "#4d6380" },
          grid: { color: "rgba(255,255,255,0.04)" },
          beginAtZero: true,
        },
      },
    }),
  });

  return (
    <div className="page-wrapper page-enter">
      {/* Header */}
      <div style={{ marginBottom: "28px" }}>
        <h1 className="page-title">
          Welcome back, <span style={{ color: accent }}>{user.name}</span> 👋
        </h1>
        <p className="page-subtitle">
          {isLoggedIn
            ? `Here's your ${user.role.toLowerCase()} overview for today`
            : "You're browsing as a guest. Log in to see live data."}
        </p>
        {!isLoggedIn && (
          <div
            className="alert alert-success"
            style={{ display: "inline-flex", marginBottom: 0 }}
          >
            💡 Sample data shown below —{" "}
            <a
              href="/login"
              style={{ color: "var(--green)", fontWeight: 700, marginLeft: 4 }}
            >
              Login
            </a>{" "}
            &nbsp;to see real stats
          </div>
        )}
      </div>

      {loading ? (
        <div className="spinner-wrap">
          <div className="spinner" />
        </div>
      ) : (
        <>
          {/* ── Stat Cards ── */}
          <div className="stat-grid">
            <StatCard
              icon="🌱"
              label="Total Crops"
              value={data.cards.crops}
              glow={accent}
            />
            <StatCard
              icon="📦"
              label="Total Orders"
              value={data.cards.orders}
              glow="#3b82f6"
            />
            {user.role === "ADMIN" && (
              <StatCard
                icon="👥"
                label="Users"
                value={data.cards.users}
                glow="#f59e0b"
              />
            )}
            {["ADMIN", "FARMER"].includes(user.role) && (
              <StatCard
                icon="💰"
                label="Revenue"
                value={`$${data.cards.revenue.toLocaleString()}`}
                glow="#22c55e"
              />
            )}
          </div>

          {/* ── Charts ── */}
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              gap: "18px",
              marginBottom: "24px",
            }}
          >
            <div className="card">
              <h3
                style={{
                  fontFamily: "var(--font-display)",
                  fontSize: "14px",
                  fontWeight: 700,
                  color: "var(--text-secondary)",
                  marginBottom: "16px",
                }}
              >
                🌾 Crops by Type
              </h3>
              <div style={{ height: "220px" }}>
                <Pie data={pieData} options={chartOpts(false)} />
              </div>
            </div>
            <div className="card">
              <h3
                style={{
                  fontFamily: "var(--font-display)",
                  fontSize: "14px",
                  fontWeight: 700,
                  color: "var(--text-secondary)",
                  marginBottom: "16px",
                }}
              >
                📦 Orders by Status
              </h3>
              <div style={{ height: "220px" }}>
                <Bar data={barData} options={chartOpts(true)} />
              </div>
            </div>
          </div>

          {/* ── Recent Orders ── */}
          <div className="card">
            <h3
              style={{
                fontFamily: "var(--font-display)",
                fontSize: "14px",
                fontWeight: 700,
                color: "var(--text-secondary)",
                marginBottom: "16px",
              }}
            >
              🕐 Recent Orders
            </h3>
            <table className="data-table">
              <thead>
                <tr>
                  <th>Client</th>
                  <th>Crop</th>
                  <th>Total</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {data.recentOrders.map((o) => {
                  const s = STATUS_STYLE[o.status] || {};
                  return (
                    <tr key={o._id}>
                      <td
                        style={{
                          color: "var(--text-primary)",
                          fontWeight: 500,
                        }}
                      >
                        {o.client?.name || "—"}
                      </td>
                      <td>
                        {o.items?.[0]?.crop?.name || "—"}
                        {o.items?.length > 1 ? ` +${o.items.length - 1}` : ""}
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
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </>
      )}
    </div>
  );
}

function StatCard({ icon, label, value, glow }) {
  return (
    <div className="stat-card">
      <div className="stat-glow" style={{ background: glow }} />
      <div className="stat-icon">{icon}</div>
      <div className="stat-label">{label}</div>
      <div className="stat-value">{value}</div>
    </div>
  );
}
