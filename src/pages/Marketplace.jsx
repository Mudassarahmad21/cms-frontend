import { useEffect, useState } from "react";
import api from "../services/api";

// ── Dummy crops shown when API has no data ────────────────────────────────────
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
  {
    _id: "d4",
    name: "Green Spinach",
    type: "Vegetable",
    price: 25,
    quantity: 150,
    location: "Faisalabad, Punjab",
    status: "available",
    farmer: { name: "Sara Malik" },
  },
  {
    _id: "d5",
    name: "Alphonso Mango",
    type: "Fruit",
    price: 180,
    quantity: 400,
    location: "Rahim Yar Khan",
    status: "available",
    farmer: { name: "Ali Hassan" },
  },
  {
    _id: "d6",
    name: "Kinnow Orange",
    type: "Fruit",
    price: 60,
    quantity: 600,
    location: "Sargodha, Punjab",
    status: "available",
    farmer: { name: "Sara Malik" },
  },
  {
    _id: "d7",
    name: "Yellow Corn",
    type: "Grain",
    price: 30,
    quantity: 350,
    location: "Okara, Punjab",
    status: "available",
    farmer: { name: "Ali Hassan" },
  },
  {
    _id: "d8",
    name: "Desi Potato",
    type: "Vegetable",
    price: 20,
    quantity: 800,
    location: "Sahiwal, Punjab",
    status: "available",
    farmer: { name: "Sara Malik" },
  },
  {
    _id: "d9",
    name: "Guava",
    type: "Fruit",
    price: 50,
    quantity: 250,
    location: "Sheikhupura, Punjab",
    status: "available",
    farmer: { name: "Ali Hassan" },
  },
];

const TYPE_EMOJI = { Grain: "🌾", Vegetable: "🥦", Fruit: "🍎" };
const TYPE_COLOR = {
  Grain: { bg: "rgba(245,158,11,0.12)", color: "#f59e0b" },
  Vegetable: { bg: "rgba(34,197,94,0.12)", color: "#22c55e" },
  Fruit: { bg: "rgba(236,72,153,0.12)", color: "#ec4899" },
};

export default function Marketplace() {
  const [crops, setCrops] = useState([]);
  const [search, setSearch] = useState("");
  const [filterType, setFilterType] = useState("");
  const [loading, setLoading] = useState(true);
  const [isDummy, setIsDummy] = useState(false);

  const fetchCrops = async (s = search, t = filterType) => {
    setLoading(true);
    try {
      const params = {};
      if (s) params.search = s;
      if (t) params.type = t;
      const res = await api.get("/crops", { params });
      if (res.data.length === 0 && !s && !t) {
        setCrops(DUMMY_CROPS);
        setIsDummy(true);
      } else {
        setCrops(res.data);
        setIsDummy(false);
      }
    } catch {
      setCrops(DUMMY_CROPS);
      setIsDummy(true);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCrops();
  }, []); // eslint-disable-line

  const handleSearch = (e) => {
    e.preventDefault();
    fetchCrops(search, filterType);
  };

  const handleTypeChange = (t) => {
    setFilterType(t);
    fetchCrops(search, t);
  };

  return (
    <div className="page-wrapper page-enter">
      <h1 className="page-title">🏪 Marketplace</h1>
      <p className="page-subtitle">
        Browse fresh crops direct from farmers across Pakistan
      </p>

      {isDummy && (
        <div className="alert alert-success">
          💡 Showing sample listings — run{" "}
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
          in backend to load real data
        </div>
      )}

      {/* ── Search bar ── */}
      <form
        onSubmit={handleSearch}
        style={{
          display: "flex",
          gap: "10px",
          marginBottom: "24px",
          flexWrap: "wrap",
        }}
      >
        <input
          className="form-control"
          style={{ flex: 1, minWidth: "200px" }}
          placeholder="Search crops by name…"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <select
          className="form-control"
          style={{ width: "160px" }}
          value={filterType}
          onChange={(e) => handleTypeChange(e.target.value)}
        >
          <option value="">All Types</option>
          <option value="Grain">🌾 Grains</option>
          <option value="Vegetable">🥦 Vegetables</option>
          <option value="Fruit">🍎 Fruits</option>
        </select>
        <button type="submit" className="btn btn-primary">
          Search
        </button>
        {(search || filterType) && (
          <button
            type="button"
            className="btn btn-ghost"
            onClick={() => {
              setSearch("");
              handleTypeChange("");
            }}
          >
            Clear
          </button>
        )}
      </form>

      {/* ── Results count ── */}
      {!loading && (
        <p
          style={{
            color: "var(--text-muted)",
            fontSize: "12px",
            marginBottom: "16px",
          }}
        >
          {crops.length} listing{crops.length !== 1 ? "s" : ""} found
        </p>
      )}

      {/* ── Grid ── */}
      {loading ? (
        <div className="spinner-wrap">
          <div className="spinner" />
        </div>
      ) : crops.length === 0 ? (
        <div className="empty-state">
          <div className="empty-icon">🔍</div>
          <h4>No crops found</h4>
          <p>Try a different search term or category</p>
        </div>
      ) : (
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(230px, 1fr))",
            gap: "16px",
          }}
        >
          {crops.map((c) => {
            const typeStyle = TYPE_COLOR[c.type] || {
              bg: "rgba(139,92,246,0.12)",
              color: "#8b5cf6",
            };
            const emoji = TYPE_EMOJI[c.type] || "🌱";
            return (
              <div
                key={c._id}
                className="card"
                style={{
                  padding: 0,
                  overflow: "hidden",
                  transition: "transform 0.15s, box-shadow 0.15s",
                  cursor: "default",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = "translateY(-3px)";
                  e.currentTarget.style.boxShadow = "var(--shadow-md)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = "translateY(0)";
                  e.currentTarget.style.boxShadow = "none";
                }}
              >
                {/* Card thumb */}
                <div
                  style={{
                    height: "100px",
                    background: `linear-gradient(135deg, ${typeStyle.bg}, var(--bg-elevated))`,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: "44px",
                    borderBottom: "1px solid var(--border-subtle)",
                  }}
                >
                  {emoji}
                </div>

                {/* Card body */}
                <div style={{ padding: "16px" }}>
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "flex-start",
                      marginBottom: "10px",
                    }}
                  >
                    <h4
                      style={{
                        fontFamily: "var(--font-display)",
                        fontSize: "15px",
                        fontWeight: 700,
                        color: "var(--text-primary)",
                        lineHeight: 1.2,
                      }}
                    >
                      {c.name}
                    </h4>
                    <span
                      style={{
                        background: "var(--green-dim)",
                        color: "var(--green)",
                        border: "1px solid var(--green-border)",
                        borderRadius: "var(--radius-full)",
                        padding: "2px 9px",
                        fontSize: "12px",
                        fontWeight: 700,
                        whiteSpace: "nowrap",
                        marginLeft: "8px",
                      }}
                    >
                      ${c.price}/kg
                    </span>
                  </div>

                  <div
                    style={{
                      display: "flex",
                      flexWrap: "wrap",
                      gap: "6px",
                      marginBottom: "12px",
                    }}
                  >
                    <span
                      className="badge"
                      style={{
                        background: typeStyle.bg,
                        color: typeStyle.color,
                      }}
                    >
                      {c.type}
                    </span>
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
                  </div>

                  <div
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      gap: "4px",
                    }}
                  >
                    <Row icon="📦" label={`${c.quantity} kg available`} />
                    <Row icon="📍" label={c.location} />
                    <Row icon="👤" label={c.farmer?.name || "—"} />
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

function Row({ icon, label }) {
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        gap: "6px",
        fontSize: "12px",
        color: "var(--text-muted)",
      }}
    >
      <span>{icon}</span>
      <span>{label}</span>
    </div>
  );
}
