export default function Footer() {
  return (
    <footer
      style={{
        background: "var(--bg-surface)",
        borderTop: "1px solid var(--border-subtle)",
        padding: "14px 28px",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        flexShrink: 0,
      }}
    >
      <div
        style={{
          fontFamily: "var(--font-display)",
          fontSize: "13px",
          fontWeight: 700,
          color: "var(--text-muted)",
          letterSpacing: "-0.2px",
        }}
      >
        🌾 Agri<span style={{ color: "var(--green)" }}>System</span>
      </div>
      <div
        style={{
          fontSize: "12px",
          color: "var(--text-disabled)",
          display: "flex",
          gap: "20px",
          alignItems: "center",
        }}
      >
        <span>
          © {new Date().getFullYear()} by{" "}
          <strong style={{ color: "var(--text-muted)" }}>
            Malik Mudassar Ahmad
          </strong>
        </span>
        <span style={{ color: "var(--border-default)" }}>|</span>
        <span>Crop Management Platform</span>
      </div>
    </footer>
  );
}
