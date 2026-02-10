import { Link, NavLink } from "react-router-dom";
import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";

export default function Navbar() {
  const { user, logout } = useContext(AuthContext);

  return (
    <nav className="navbar navbar-expand-lg navbar-dark shadow-sm"
         style={{ background: "linear-gradient(90deg, #0f2027, #203a43, #2c5364)" }}>
      <div className="container-fluid">

        {/* Brand */}
        <Link className="navbar-brand fw-bold fs-4" to="/">
          🌾 Agri<span className="text-warning">System</span>
        </Link>

        {/* Toggle */}
        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarNav"
        >
          <span className="navbar-toggler-icon"></span>
        </button>

        {/* Links */}
        <div className="collapse navbar-collapse" id="navbarNav">
          <ul className="navbar-nav me-auto gap-2">

            {user && (
              <>
                <NavItem to="/" label="Dashboard" />

                {(user.role === "FARMER" || user.role === "ADMIN") && (
                  <NavItem to="/crops" label="Crops" />
                )}

                {(user.role === "CLIENT" ||
                  user.role === "ADMIN" ||
                  user.role === "BROKER") && (
                  <NavItem to="/orders" label="Orders" />
                )}

                {user.role === "ADMIN" && (
                  <NavItem to="/users" label="Users" />
                )}

                <NavItem to="/market" label="Marketplace" />
              </>
            )}
          </ul>

          {/* Right Side */}
          <ul className="navbar-nav ms-auto align-items-center gap-3">
            {user ? (
              <>
                {/* Role Badge */}
                <li className="nav-item">
                  <span className="badge rounded-pill bg-warning text-dark px-3 py-2 text-uppercase">
                    {user.role}
                  </span>
                </li>

                {/* Logout */}
                <li className="nav-item">
                  <button
                    className="btn btn-outline-light btn-sm px-3"
                    onClick={logout}
                  >
                    Logout
                  </button>
                </li>
              </>
            ) : (
              <>
                <NavItem to="/login" label="Login" />
                <NavItem to="/register" label="Register" />
              </>
            )}
          </ul>
        </div>
      </div>
    </nav>
  );
}

/* Reusable Nav Item */
function NavItem({ to, label }) {
  return (
    <li className="nav-item">
      <NavLink
        to={to}
        className={({ isActive }) =>
          `nav-link px-3 rounded ${
            isActive ? "bg-warning text-dark fw-semibold" : "text-light"
          }`
        }
      >
        {label}
      </NavLink>
    </li>
  );
}
