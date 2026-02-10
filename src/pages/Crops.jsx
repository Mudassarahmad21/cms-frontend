import { useEffect, useState } from "react";
import api from "../services/api";

export default function Crops() {
  const [crops, setCrops] = useState([]);
  const [form, setForm] = useState({ name:"", type:"", quantity:"", price:"", location:"" });

  // Fetch crops on load
  useEffect(() => {
    api.get("/crops")
      .then(res => setCrops(res.data))
      .catch(err => console.error(err));
  }, []);

// Add crop
  const handleSubmit = async (e) => {
  e.preventDefault();

  if (
    !form.name ||
    !form.type ||
    !form.location ||
    form.quantity <= 0 ||
    form.price <= 0
  ) {
    return alert("Please enter valid crop details");
  }

  try {
    const res = await api.post("/crops", {
      ...form,
      quantity: Number(form.quantity),
      price: Number(form.price),
    });
    setCrops([...crops, res.data]);
    setForm({ name:"", type:"", quantity:"", price:"", location:"" });
  } catch (err) {
    alert(err.response?.data?.message || "Failed to add crop");
  }
};


  // Delete crop
  const handleDelete = async (id) => {
    if (!window.confirm("Delete this crop?")) return;
    await api.delete(`/crops/${id}`);
    setCrops(crops.filter(c => c._id !== id));
  };

  return (
    <div className="container mt-4">
      <h2>Crops Management</h2>

      {/* Add Crop Form */}
      <form onSubmit={handleSubmit} className="mb-4">
        <div className="row">
          {["name","type","quantity","price","location"].map(f=>(
            <div className="col-md-2 mb-2" key={f}>
              <input
                className="form-control"
                placeholder={f}
                value={form[f]}
                onChange={(e)=>setForm({...form,[f]:e.target.value})}
              />
            </div>
          ))}
        </div>
        <button className="btn btn-success">Add Crop</button>
      </form>

      {/* Crops Table */}
      <table className="table table-striped">
        <thead>
          <tr>
            <th>Name</th><th>Type</th><th>Quantity</th><th>Price</th><th>Location</th><th>Farmer</th><th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {crops.map(c=>(
            <tr key={c._id}>
              <td>{c.name}</td>
              <td>{c.type}</td>
              <td>{c.quantity}</td>
              <td>{c.price}</td>
              <td>{c.location}</td>
              <td>{c.farmer?.name}</td>
              <td>
                <button className="btn btn-danger btn-sm" onClick={()=>handleDelete(c._id)}>Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
