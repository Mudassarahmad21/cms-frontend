import { Link } from "react-router-dom";
import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";

export default function Navbar() {
  const { user, logout } = useContext(AuthContext);

  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-dark">
      <div className="container-fluid">
        <Link className="navbar-brand" to="/">AgriSystem</Link>
        <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav">
          <span className="navbar-toggler-icon"></span>
        </button>
        <div className="collapse navbar-collapse" id="navbarNav">
          <ul className="navbar-nav me-auto">
            {user && (
              <>
                <li className="nav-item"><Link className="nav-link" to="/">Dashboard</Link></li>
                {(user.role==="FARMER" || user.role==="ADMIN") && (
                  <li className="nav-item"><Link className="nav-link" to="/crops">Crops</Link></li>
                )}
                {(user.role==="CLIENT" || user.role==="ADMIN" || user.role==="BROKER") && (
                  <li className="nav-item"><Link className="nav-link" to="/orders">Orders</Link></li>
                )}
                {user.role==="ADMIN" && (
                  <li className="nav-item"><Link className="nav-link" to="/users">Users</Link></li>
                )}
                {user && (
                  <li className="nav-item"><Link className="nav-link" to="/market">MarketPlace</Link></li>
)}

              </>
            )}
          </ul>
          <ul className="navbar-nav ms-auto">
            {user ? (
              <li className="nav-item">
                <button className="btn btn-outline-light" onClick={logout}>Logout</button>
              </li>
            ) : (
              <>
                <li className="nav-item"><Link className="nav-link" to="/login">Login</Link></li>
                <li className="nav-item"><Link className="nav-link" to="/register">Register</Link></li>
              </>
            )}
          </ul>
        </div>
      </div>
    </nav>
  );
}
