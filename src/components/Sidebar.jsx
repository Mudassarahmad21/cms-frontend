import { NavLink } from 'react-router-dom';
import { useContext } from 'react';
import { AuthContext } from '../context/AuthContext';

const Sidebar = () => {
  const { user, logout } = useContext(AuthContext);

  const menuItems = [
    { path: '/', label: 'Dashboard', roles: ['ALL'] },
    { path: '/crops', label: 'Crops', roles: ['FARMER', 'ADMIN', 'GUEST'] },
    { path: '/market', label: 'Marketplace', roles: ['ALL'] },
    { path: '/orders', label: 'Orders', roles: ['CLIENT', 'ADMIN', 'BROKER'] },
    { path: '/users', label: 'Users', roles: ['ADMIN'] }
  ];

  return (
    <div className="col-md-3 col-lg-2 d-md-block bg-dark sidebar collapse" style={{ height: '100vh', position: 'fixed' }}>
      <div className="position-sticky pt-3">
        <ul className="nav flex-column">
          {menuItems.map((item) => {
            const show = !item.roles || item.roles.includes('ALL') || item.roles.includes(user?.role) || item.roles.includes('GUEST');
            if (show) {
              return (
                <li key={item.path} className="nav-item">
                  <NavLink to={item.path} className="nav-link text-white">
                    {item.label}
                  </NavLink>
                </li>
              );
            }
            return null;
          })}
          {user && (
            <li className="nav-item">
              <button className="nav-link btn btn-link text-white" onClick={logout}>Logout</button>
            </li>
          )}
        </ul>
      </div>
    </div>
  );
};

export default Sidebar;