import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import Sidebar from './components/Sidebar';
import Dashboard from './pages/Dashboard';
import Crops from './pages/Crops';
import Marketplace from './pages/Marketplace';
import Orders from './pages/Orders';
import Users from './pages/Users';
import Login from './pages/Login';
import Register from './pages/Register';
import Navbar from './pages/Navbar';
import Footer from './pages/Footer';

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Navbar />
        <div className="container-fluid">
          <div className="row">
            <Sidebar />
            <main className="col-md-9 ms-sm-auto col-lg-10 px-md-4">
              <Routes>
                <Route path="/" element={<Dashboard />} /> {/* Home is dashboard */}
                <Route path="/dashboard" element={<Dashboard />} />
                <Route path="/crops" element={<Crops />} />
                <Route path="/market" element={<Marketplace />} />
                <Route path="/orders" element={<Orders />} />
                <Route path="/users" element={<Users />} />
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
              </Routes>
            </main>
          </div>
        </div>
        <Footer />
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;