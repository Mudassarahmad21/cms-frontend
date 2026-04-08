import { createContext, useState, useContext } from "react";
import { jwtDecode } from "jwt-decode";

export const AuthContext = createContext();

// Default guest — no login needed to browse
const GUEST = { id: "guest", name: "Guest", role: "CLIENT", isGuest: true };

function getStoredUser() {
  try {
    const token = localStorage.getItem("token");
    const user  = JSON.parse(localStorage.getItem("user") || "null");
    if (!token || !user) return GUEST;

    const decoded = jwtDecode(token);
    if (decoded.exp * 1000 < Date.now()) {
      localStorage.clear();
      return GUEST;
    }
    return { ...user, isGuest: false };
  } catch {
    localStorage.clear();
    return GUEST;
  }
}

export function AuthProvider({ children }) {
  const [user,  setUser]  = useState(getStoredUser);
  const [token, setToken] = useState(() => localStorage.getItem("token") || null);

  // Real login from API response
  const login = (data) => {
    const u = { ...data.user, isGuest: false };
    setUser(u);
    setToken(data.token);
    localStorage.setItem("user",  JSON.stringify(u));
    localStorage.setItem("token", data.token);
  };

  // Logout → back to guest
  const logout = () => {
    setUser(GUEST);
    setToken(null);
    localStorage.removeItem("user");
    localStorage.removeItem("token");
  };

  // Switch role view (sidebar role-tabs, works for both guests and logged-in)
  const switchRole = (role) => {
    setUser((prev) => ({ ...prev, role }));
  };

  const isLoggedIn = !!token && !user.isGuest;

  return (
    <AuthContext.Provider value={{ user, token, isLoggedIn, login, logout, switchRole }}>
      {children}
    </AuthContext.Provider>
  );
}

// Convenience hook
export function useAuth() {
  return useContext(AuthContext);
}