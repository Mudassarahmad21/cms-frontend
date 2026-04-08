import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import Layout from "./components/Layout";

import Dashboard  from "./pages/Dashboard";
import Crops      from "./pages/Crops";
import Orders     from "./pages/Orders";
import Users      from "./pages/Users";
import Marketplace from "./pages/Marketplace";
import Login      from "./pages/Login";
import Register   from "./pages/Register";

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          {/* Auth pages — no layout wrapper */}
          <Route path="/login"    element={<Login />} />
          <Route path="/register" element={<Register />} />

          {/* All app pages inside layout — no login required */}
          <Route path="/" element={<Layout><Dashboard /></Layout>} />
          <Route path="/crops"  element={<Layout><Crops /></Layout>} />
          <Route path="/orders" element={<Layout><Orders /></Layout>} />
          <Route path="/users"  element={<Layout><Users /></Layout>} />
          <Route path="/market" element={<Layout><Marketplace /></Layout>} />

          {/* Catch-all */}
          <Route path="*" element={<Layout><Dashboard /></Layout>} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}