// import { useEffect, useState } from "react";
// import api from "../services/api";
// import { Pie, Bar } from "react-chartjs-2";
// import {
//   Chart as ChartJS,
//   ArcElement,
//   Tooltip,
//   Legend,
//   CategoryScale,
//   LinearScale,
//   BarElement,
// } from "chart.js";

// ChartJS.register(
//   ArcElement,
//   Tooltip,
//   Legend,
//   CategoryScale,
//   LinearScale,
//   BarElement,
// );

// export default function Dashboard() {
//   const [stats, setStats] = useState(null);

//   useEffect(() => {
//     api
//       .get("/stats")
//       .then((res) => setStats(res.data))
//       .catch((err) => console.error(err));
//   }, []);

//   if (!stats)
//     return (
//       <div className="container mt-4">
//         <p>Loading stats...</p>
//       </div>
//     );

//   // Pie chart for crop categories
//   const pieData = {
//     labels: stats.charts.map((c) => c._id),
//     datasets: [
//       {
//         data: stats.charts.map((c) => c.count),
//         backgroundColor: [
//           "#007bff",
//           "#28a745",
//           "#ffc107",
//           "#dc3545",
//           "#6f42c1",
//         ],
//       },
//     ],
//   };

//   // Bar chart for revenue
//   const barData = {
//     labels: ["Revenue"],
//     datasets: [
//       {
//         label: "Total Revenue",
//         data: [stats.cards.revenue],
//         backgroundColor: "#17a2b8",
//       },
//     ],
//   };

//   return (
//     <div className="container mt-4">
//       <h2>Dashboard</h2>
//       <div className="row mb-4">
//         <div className="col-md-3">
//           <div className="card text-center">
//             <div className="card-body">
//               <h5>Crops</h5>
//               <p>{stats.cards.crops}</p>
//             </div>
//           </div>
//         </div>
//         <div className="col-md-3">
//           <div className="card text-center">
//             <div className="card-body">
//               <h5>Users</h5>
//               <p>{stats.cards.users}</p>
//             </div>
//           </div>
//         </div>
//         <div className="col-md-3">
//           <div className="card text-center">
//             <div className="card-body">
//               <h5>Orders</h5>
//               <p>{stats.cards.orders}</p>
//             </div>
//           </div>
//         </div>
//         <div className="col-md-3">
//           <div className="card text-center">
//             <div className="card-body">
//               <h5>Revenue</h5>
//               <p>${stats.cards.revenue}</p>
//             </div>
//           </div>
//         </div>
//       </div>

//       {/* Charts Section */}
//       <div className="row">
//         <div className="col-md-6">
//           <h5>Crops by Category</h5>
//           <Pie data={pieData} />
//         </div>
//         <div className="col-md-6">
//           <h5>Total Revenue</h5>
//           <Bar data={barData} />
//         </div>
//       </div>
//     </div>
//   );
// }

// pages/Dashboard.jsx
import { useEffect, useState, useContext } from "react";
import api from "../services/api";
import { AuthContext } from "../context/AuthContext";
// 1. Import the specific elements needed
import { 
  Chart as ChartJS, 
  ArcElement, 
  Tooltip, 
  Legend, 
  CategoryScale, 
  LinearScale, 
  BarElement, 
  Title 
} from "chart.js";
import { Pie, Bar } from "react-chartjs-2";
// 2. Register them globally
ChartJS.register(
  ArcElement, 
  Tooltip, 
  Legend, 
  CategoryScale, 
  LinearScale, 
  BarElement, 
  Title
);
export default function Dashboard() {
  const { user } = useContext(AuthContext);
  const [stats, setStats] = useState(null);

  useEffect(() => {
    api.get("/stats")
      .then(res => setStats(res.data))
      .catch(err => console.error("Stats error:", err));
  }, []);

  if (!stats) return <div className="d-flex justify-content-center mt-5"><div className="spinner-border text-success"></div></div>;

  return (
    <div className="container mt-4">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2>Welcome back, <span className="text-success">{user.name}</span></h2>
        <span className="badge bg-secondary p-2">{user.role} VIEW</span>
      </div>

      {/* Role-Based Summary Cards */}
      <div className="row g-4 mb-5">
        <div className="col-md-3">
          <div className="card shadow-sm border-0 border-start border-4 border-primary">
            <div className="card-body">
              <h6 className="text-muted">Total Available Crops</h6>
              <h3>{stats.cards.crops}</h3>
            </div>
          </div>
        </div>

        {user.role === "ADMIN" && (
          <div className="col-md-3">
            <div className="card shadow-sm border-0 border-start border-4 border-info">
              <div className="card-body">
                <h6 className="text-muted">Registered Users</h6>
                <h3>{stats.cards.users}</h3>
              </div>
            </div>
          </div>
        )}

        <div className="col-md-3">
          <div className="card shadow-sm border-0 border-start border-4 border-success">
            <div className="card-body">
              <h6 className="text-muted">Total Orders</h6>
              <h3>{stats.cards.orders}</h3>
            </div>
          </div>
        </div>

        {(user.role === "ADMIN" || user.role === "FARMER") && (
          <div className="col-md-3">
            <div className="card shadow-sm border-0 border-start border-4 border-warning">
              <div className="card-body">
                <h6 className="text-muted">Gross Revenue</h6>
                <h3>${stats.cards.revenue.toLocaleString()}</h3>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Visual Analytics Section */}
      <div className="row">
        <div className="col-lg-7">
          <div className="card shadow-sm p-4 mb-4">
            <h5>Market Share by Crop Type</h5>
            <div style={{ height: "300px" }}>
              <Pie data={{
                labels: stats.charts.map(c => c._id),
                datasets: [{
                  data: stats.charts.map(c => c.count),
                  backgroundColor: ["#2ecc71", "#3498db", "#f1c40f", "#e74c3c", "#9b59b6"]
                }]
              }} options={{ maintainAspectRatio: false }} />
            </div>
          </div>
        </div>
        <div className="col-lg-5">
          <div className="card shadow-sm p-4 h-100">
            <h5>Recent Activity Log</h5>
            <ul className="list-group list-group-flush mt-3">
              <li className="list-group-item px-0">📦 New order placed for Wheat</li>
              <li className="list-group-item px-0">✅ User "Farmer Joe" approved</li>
              <li className="list-group-item px-0">💰 Revenue hit a new milestone!</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
