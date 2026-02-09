// pages/Marketplace.jsx
import { useEffect, useState } from "react";
import api from "../services/api";

export default function Marketplace() {
  const [crops, setCrops] = useState([]);
  const [search, setSearch] = useState("");
  const [filterType, setFilterType] = useState("");

  const fetchCrops = async () => {
    const params = { search, type: filterType };
    const res = await api.get("/crops", { params });
    setCrops(res.data);
  };

  useEffect(() => {
    fetchCrops();
  }, [filterType]); // Auto-refresh on filter change

  return (
    <div className="container mt-4">
      <div className="row mb-4 align-items-end">
        <div className="col-md-5">
          <label className="form-label fw-bold">Search Crops</label>
          <div className="input-group">
            <input 
              type="text" className="form-control" 
              placeholder="Search by name (e.g. Wheat)..." 
              value={search} onChange={(e) => setSearch(e.target.value)}
            />
            <button className="btn btn-primary" onClick={fetchCrops}>Search</button>
          </div>
        </div>
        <div className="col-md-3">
          <label className="form-label fw-bold">Category</label>
          <select className="form-select" onChange={(e) => setFilterType(e.target.value)}>
            <option value="">All Categories</option>
            <option value="Grain">Grains</option>
            <option value="Vegetable">Vegetables</option>
            <option value="Fruit">Fruits</option>
          </select>
        </div>
      </div>

      <div className="row g-4">
        {crops.length > 0 ? crops.map(c => (
          <div className="col-md-4 col-lg-3" key={c._id}>
            <div className="card h-100 shadow-sm hover-shadow transition">
              <div className="bg-light d-flex align-items-center justify-content-center" style={{height: "150px"}}>
                <span className="display-4">🌱</span>
              </div>
              <div className="card-body">
                <div className="d-flex justify-content-between border-bottom pb-2 mb-2">
                  <h5 className="card-title mb-0">{c.name}</h5>
                  <span className="badge bg-success-subtle text-success">${c.price}/kg</span>
                </div>
                <p className="text-muted small mb-1">Type: <strong>{c.type}</strong></p>
                <p className="text-muted small mb-3">📍 {c.location}</p>
                <button className="btn btn-outline-success w-100 mt-auto">
                  Add to Cart
                </button>
              </div>
            </div>
          </div>
        )) : (
          <div className="text-center mt-5">
            <h4>No crops found matching your criteria.</h4>
          </div>
        )}
      </div>
    </div>
  );
}