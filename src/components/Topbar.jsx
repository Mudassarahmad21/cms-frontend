import { useAuth } from "../context/AuthContext";

const ROLE_COLORS = {
  ADMIN: "var(--role-admin)",
  FARMER: "var(--role-farmer)",
  BROKER: "var(--role-broker)",
  CLIENT: "var(--role-client)",
};

export default function Topbar({ title }) {
  const { user, isLoggedIn } = useAuth();
  const color = ROLE_COLORS[user.role] || "var(--green)";

  return (
    <header
      style={{
        height: "54px",
        background: "var(--bg-surface)",
        borderBottom: "1px solid var(--border-subtle)",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        padding: "0 24px",
        flexShrink: 0,
        position: "sticky",
        top: 0,
        zIndex: 50,
      }}
    >
      <div
        style={{
          fontFamily: "var(--font-display)",
          fontSize: "15px",
          fontWeight: 700,
          color: "var(--text-secondary)",
          letterSpacing: "0.2px",
        }}
      >
        {title || "AgriSystem"}
      </div>

      <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
        <span
          style={{
            background: color + "1a",
            color: color,
            border: `1px solid ${color}44`,
            borderRadius: "var(--radius-full)",
            padding: "3px 12px",
            fontSize: "10px",
            fontWeight: 700,
            letterSpacing: "1px",
            textTransform: "uppercase",
          }}
        >
          {user.role}
        </span>
        <span
          style={{
            fontSize: "13px",
            color: "var(--text-secondary)",
            fontWeight: 500,
          }}
        >
          {isLoggedIn ? user.name : "Guest"}
        </span>
      </div>
    </header>
  );
}
