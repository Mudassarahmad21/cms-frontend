import { useEffect, useState, useContext } from "react";
import api from "../services/api";
import { AuthContext } from "../context/AuthContext";

export default function Orders() {
  const { user } = useContext(AuthContext);
  const [orders, setOrders] = useState([]);
  const [items, setItems] = useState([{ crop:"", quantity:1 }]);
  const [crops, setCrops] = useState([]);

  // Load crops for selection
  useEffect(() => {
    api.get("/crops").then(res => setCrops(res.data));
  }, []);

  // Load orders depending on role
  useEffect(() => {
    if (user.role === "CLIENT") {
      api.get("/orders/myorders").then(res => setOrders(res.data));
    } else if (["ADMIN","BROKER"].includes(user.role)) {
      api.get("/orders").then(res => setOrders(res.data));
    }
  }, [user.role]);

  // Place order (Client only)
  const handlePlaceOrder = async (e) => {
    e.preventDefault();
    const totalPrice = items.reduce((sum, i) => {
      const crop = crops.find(c => c._id === i.crop);
      return sum + (crop?.price || 0) * i.quantity;
    }, 0);

    try {
      const res = await api.post("/orders", { items, totalPrice });
      setOrders([...orders, res.data]);
      setItems([{ crop:"", quantity:1 }]);
    } catch (err) {
      alert(err.response?.data?.message || "Order failed");
    }
  };

  // Update order status (Admin/Broker)
  const handleStatusUpdate = async (id, status) => {
    const res = await api.put(`/orders/${id}/status`, { status });
    setOrders(orders.map(o => o._id === id ? res.data : o));
  };

  return (
    <div className="container mt-4">
      <h2>Orders</h2>

      {/* Client: Place Order */}
      {user.role === "CLIENT" && (
        <form onSubmit={handlePlaceOrder} className="mb-4">
          <h5>Place New Order</h5>
          {items.map((item, idx) => (
            <div className="row mb-2" key={idx}>
              <div className="col-md-6">
                <select className="form-control" value={item.crop}
                  onChange={(e)=> {
                    const newItems = [...items];
                    newItems[idx].crop = e.target.value;
                    setItems(newItems);
                  }}>
                  <option value="">Select Crop</option>
                  {crops.map(c => (
                    <option key={c._id} value={c._id}>{c.name} (${c.price})</option>
                  ))}
                </select>
              </div>
              <div className="col-md-3">
                <input type="number" className="form-control" min="1" value={item.quantity}
                  onChange={(e)=> {
                    const newItems = [...items];
                    newItems[idx].quantity = Number(e.target.value);
                    setItems(newItems);
                  }}/>
              </div>
            </div>
          ))}
          <button className="btn btn-success">Place Order</button>
        </form>
      )}

      {/* Orders Table */}
      <table className="table table-striped">
        <thead>
          <tr>
            <th>Client</th><th>Items</th><th>Total Price</th><th>Status</th><th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {orders.map(o=>(
            <tr key={o._id}>
              <td>{o.client?.name || "Me"}</td>
              <td>
                {o.items.map(i=>(
                  <div key={i._id}>{i.crop?.name} x {i.quantity}</div>
                ))}
              </td>
              <td>${o.totalPrice}</td>
              <td>{o.status}</td>
              <td>
                {["ADMIN","BROKER"].includes(user.role) && (
                  <>
                    {["pending","approved","delivered"].map(s=>(
                      <button key={s} className="btn btn-sm btn-outline-primary me-1"
                        onClick={()=>handleStatusUpdate(o._id, s)}>
                        {s}
                      </button>
                    ))}
                  </>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
