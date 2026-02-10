import { Link } from "react-router-dom";

export default function Footer() {
  return (
    <nav
      className="navbar navbar-dark shadow-sm mt-auto"
      style={{
        background: "linear-gradient(90deg, #0f2027, #203a43, #2c5364)",
      }}
    >
      <div className="container-fluid d-flex justify-content-between align-items-center">

        {/* Brand (same style as navbar) */}
        <Link className="navbar-brand fw-bold" to="/">
          🌾 Agri<span className="text-warning">System</span>
        </Link>

        {/* Footer Links */}
        <ul className="navbar-nav flex-row gap-3 align-items-center">
          <li className="nav-item">
            <a className="nav-link px-3 rounded text-light" href="#">
              Privacy
            </a>
          </li>

          <li className="nav-item">
            <a className="nav-link px-3 rounded text-light" href="#">
              Terms
            </a>
          </li>

          <li className="nav-item">
            <a className="nav-link px-3 rounded text-light" href="#">
              Contact
            </a>
          </li>

          {/* Copyright */}
          <li className="nav-item">
            <span className="nav-link text-light opacity-75 px-3">
              © {new Date().getFullYear()} By <b>Malik Mudassar Ahmad</b>.
            </span>
          </li>
        </ul>
      </div>
    </nav>
  );
}

