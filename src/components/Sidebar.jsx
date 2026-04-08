import { NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const ROLES = [
  { key: "ADMIN", label: "Admin", icon: "👑", color: "var(--role-admin)" },
  { key: "FARMER", label: "Farmer", icon: "🌾", color: "var(--role-farmer)" },
  { key: "BROKER", label: "Broker", icon: "🤝", color: "var(--role-broker)" },
  { key: "CLIENT", label: "Client", icon: "🛒", color: "var(--role-client)" },
];

const NAV = {
  ADMIN: [
    { to: "/", icon: "▦", label: "Dashboard" },
    { to: "/crops", icon: "🌱", label: "Crops" },
    { to: "/orders", icon: "📦", label: "Orders" },
    { to: "/users", icon: "👥", label: "Users" },
    { to: "/market", icon: "🏪", label: "Marketplace" },
  ],
  FARMER: [
    { to: "/", icon: "▦", label: "Dashboard" },
    { to: "/crops", icon: "🌱", label: "My Crops" },
    { to: "/market", icon: "🏪", label: "Marketplace" },
  ],
  BROKER: [
    { to: "/", icon: "▦", label: "Dashboard" },
    { to: "/orders", icon: "📦", label: "Orders" },
    { to: "/market", icon: "🏪", label: "Marketplace" },
  ],
  CLIENT: [
    { to: "/", icon: "▦", label: "Dashboard" },
    { to: "/orders", icon: "📦", label: "My Orders" },
    { to: "/market", icon: "🏪", label: "Marketplace" },
  ],
};

export default function Sidebar() {
  const { user, isLoggedIn, logout, switchRole } = useAuth();
  const navigate = useNavigate();

  const roleObj = ROLES.find((r) => r.key === user.role) || ROLES[3];
  const accentColor = roleObj.color;
  const navLinks = NAV[user.role] || NAV.CLIENT;

  const handleRoleSwitch = (role) => {
    switchRole(role);
    navigate("/");
  };

  return (
    <aside
      style={{
        width: "var(--sidebar-width)",
        minHeight: "100vh",
        background: "linear-gradient(180deg, #0c1626 0%, #0e1d33 100%)",
        borderRight: "1px solid var(--border-subtle)",
        display: "flex",
        flexDirection: "column",
        flexShrink: 0,
        position: "sticky",
        top: 0,
        height: "100vh",
        overflowY: "auto",
      }}
    >
      {/*  Logo  */}
      <div
        style={{
          padding: "22px 20px 18px",
          borderBottom: "1px solid var(--border-subtle)",
        }}
      >
        <div
          style={{
            fontFamily: "var(--font-display)",
            fontSize: "20px",
            fontWeight: 800,
            color: "var(--text-primary)",
            letterSpacing: "-0.5px",
            lineHeight: 1.2,
          }}
        >
          🌾 Agri<span style={{ color: accentColor }}>System</span>
        </div>
        <div
          style={{
            fontSize: "10px",
            fontWeight: 600,
            letterSpacing: "1.5px",
            textTransform: "uppercase",
            color: "var(--text-disabled)",
            marginTop: "4px",
          }}
        >
          Crop Management Platform
        </div>
      </div>

      {/* Role Switcher */}
      <div style={{ padding: "14px 14px 10px" }}>
        <p
          style={{
            fontSize: "10px",
            fontWeight: 700,
            letterSpacing: "1px",
            textTransform: "uppercase",
            color: "var(--text-disabled)",
            marginBottom: "8px",
            paddingLeft: "4px",
          }}
        >
          View As
        </p>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: "5px",
          }}
        >
          {ROLES.map((r) => {
            const isActive = user.role === r.key;
            return (
              <button
                key={r.key}
                onClick={() => handleRoleSwitch(r.key)}
                style={{
                  background: isActive ? r.color + "22" : "transparent",
                  color: isActive ? r.color : "var(--text-muted)",
                  border: `1px solid ${isActive ? r.color + "55" : "var(--border-subtle)"}`,
                  borderRadius: "var(--radius-sm)",
                  padding: "7px 6px",
                  fontSize: "11px",
                  fontWeight: isActive ? 700 : 500,
                  cursor: "pointer",
                  transition: "all 0.15s ease",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: "4px",
                  fontFamily: "var(--font-body)",
                }}
              >
                <span style={{ fontSize: "13px" }}>{r.icon}</span>
                {r.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* Navigation */}
      <nav style={{ flex: 1, padding: "4px 10px 12px" }}>
        <p
          style={{
            fontSize: "10px",
            fontWeight: 700,
            letterSpacing: "1px",
            textTransform: "uppercase",
            color: "var(--text-disabled)",
            margin: "10px 0 6px 6px",
          }}
        >
          Menu
        </p>
        {navLinks.map((link) => (
          <NavLink
            key={link.to + link.label}
            to={link.to}
            end={link.to === "/"}
            style={({ isActive }) => ({
              display: "flex",
              alignItems: "center",
              gap: "10px",
              padding: "9px 12px",
              borderRadius: "var(--radius-md)",
              marginBottom: "2px",
              textDecoration: "none",
              fontSize: "13px",
              fontWeight: isActive ? 600 : 400,
              color: isActive ? "var(--text-primary)" : "var(--text-secondary)",
              background: isActive ? accentColor + "1a" : "transparent",
              borderLeft: `2px solid ${isActive ? accentColor : "transparent"}`,
              transition: "all 0.12s ease",
            })}
          >
            <span
              style={{ fontSize: "15px", width: "18px", textAlign: "center" }}
            >
              {link.icon}
            </span>
            {link.label}
          </NavLink>
        ))}
      </nav>

      {/* User / Auth */}
      <div
        style={{
          padding: "14px",
          borderTop: "1px solid var(--border-subtle)",
          marginTop: "auto",
        }}
      >
        {isLoggedIn ? (
          <>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "10px",
                padding: "10px 12px",
                background: "var(--bg-elevated)",
                borderRadius: "var(--radius-md)",
                marginBottom: "10px",
              }}
            >
              <div
                style={{
                  width: "32px",
                  height: "32px",
                  borderRadius: "50%",
                  background: accentColor + "33",
                  border: `1px solid ${accentColor}55`,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: "14px",
                  flexShrink: 0,
                }}
              >
                {roleObj.icon}
              </div>
              <div style={{ overflow: "hidden" }}>
                <div
                  style={{
                    fontSize: "13px",
                    fontWeight: 600,
                    color: "var(--text-primary)",
                    whiteSpace: "nowrap",
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                  }}
                >
                  {user.name}
                </div>
                <div
                  style={{
                    fontSize: "11px",
                    color: accentColor,
                    fontWeight: 600,
                    textTransform: "uppercase",
                    letterSpacing: "0.5px",
                  }}
                >
                  {user.role}
                </div>
              </div>
            </div>
            <button
              onClick={logout}
              className="btn btn-danger"
              style={{ width: "100%", justifyContent: "center" }}
            >
              ↩ Logout
            </button>
          </>
        ) : (
          <>
            <div
              style={{
                fontSize: "11px",
                color: "var(--text-muted)",
                textAlign: "center",
                marginBottom: "10px",
              }}
            >
              Browsing as Guest
            </div>
            <div style={{ display: "flex", gap: "7px" }}>
              <NavLink
                to="/login"
                className="btn btn-primary"
                style={{
                  flex: 1,
                  justifyContent: "center",
                  textDecoration: "none",
                }}
              >
                Login
              </NavLink>
              <NavLink
                to="/register"
                className="btn btn-ghost"
                style={{
                  flex: 1,
                  justifyContent: "center",
                  textDecoration: "none",
                }}
              >
                Register
              </NavLink>
            </div>
          </>
        )}
      </div>
    </aside>
  );
}
