import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import Crops from "./pages/Crops";
import Orders from "./pages/Orders";
import Users from "./pages/Users";
import ProtectedRoute from "./components/ProtectedRoute";
import Navbar from "./pages/Navbar";
import Marketplace from "./pages/Marketplace";
import Footer from "./pages/Footer";

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
      <Navbar/>
        <Routes>
          <Route path="/login" element={<Login/>}/>
          <Route path="/register" element={<Register/>}/>
          <Route path="/" element={<ProtectedRoute><Dashboard/></ProtectedRoute>}/>
          <Route path="/crops" element={<ProtectedRoute roles={["FARMER","ADMIN"]}><Crops/></ProtectedRoute>}/>
          <Route path="/orders" element={<ProtectedRoute roles={["CLIENT","ADMIN","BROKER"]}><Orders/></ProtectedRoute>}/>
          <Route path="/users" element={<ProtectedRoute roles={["ADMIN"]}><Users/></ProtectedRoute>}/>
          <Route path="/market" element={<ProtectedRoute roles={["ADMIN","CLIENT","BROKER","FARMER"]}><Marketplace/></ProtectedRoute>}/>
        </Routes>
        <Footer/>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
