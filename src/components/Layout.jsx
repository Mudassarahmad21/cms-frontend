import Sidebar from "./Sidebar";
import Topbar from "./Topbar";
import Footer from "./Footer";
import { useLocation } from "react-router-dom";

const PAGE_TITLES = {
  "/":       "Dashboard",
  "/crops":  "Crops Management",
  "/orders": "Orders",
  "/users":  "User Management",
  "/market": "Marketplace",
};

export default function Layout({ children }) {
  const { pathname } = useLocation();
  const title = PAGE_TITLES[pathname] || "AgriSystem";

  return (
    <div style={{
      display: "flex",
      height: "100vh",
      overflow: "hidden",
    }}>
      {/* Sidebar — fixed height, scrolls independently */}
      <Sidebar />

      {/* Main column */}
      <div style={{
        flex: 1,
        display: "flex",
        flexDirection: "column",
        overflow: "hidden",
      }}>
        <Topbar title={title} />

        {/* Scrollable content + footer pinned at bottom */}
        <div style={{
          flex: 1,
          overflowY: "auto",
          display: "flex",
          flexDirection: "column",
        }}>
          <main style={{ flex: 1 }}>
            {children}
          </main>
          <Footer />
        </div>
      </div>
    </div>
  );
}