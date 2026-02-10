// // import { useState, useContext } from "react";
// // import api from "../services/api";
// // import { AuthContext } from "../context/AuthContext";
// // import { useNavigate } from "react-router-dom";

// // export default function Register() {
// //   const { login } = useContext(AuthContext);
// //   const navigate = useNavigate();

// //   const [form, setForm] = useState({
// //     name: "",
// //     email: "",
// //     password: "",
// //     role: "CLIENT",
// //   });

// //   const handleSubmit = async (e) => {
// //     e.preventDefault();
// //     try {
// //       const res = await api.post("/auth/register", form);
// //       login(res.data);
// //       navigate("/");
// //     } catch (err) {
// //       alert(err.response?.data?.message || "Registration failed");
// //     }
// //   };

// //   return (
// //     <div className="container mt-5">
// //       <h2>Register</h2>
// //       <form onSubmit={handleSubmit} className="col-md-6">
// //         {["name", "email", "password"].map((f) => (
// //           <input
// //             key={f}
// //             className="form-control mb-2"
// //             type={f === "password" ? "password" : "text"}
// //             placeholder={f}
// //             value={form[f]}
// //             onChange={(e) =>
// //               setForm({ ...form, [f]: e.target.value })
// //             }
// //           />
// //         ))}

// //         <select
// //           className="form-control mb-2"
// //           value={form.role}
// //           onChange={(e) =>
// //             setForm({ ...form, role: e.target.value })
// //           }
// //         >
// //           <option value="CLIENT">Client</option>
// //           <option value="FARMER">Farmer</option>
// //           <option value="BROKER">Broker</option>
// //         </select>

// //         <button className="btn btn-success">Register</button>
// //       </form>
// //     </div>
// //   );
// // }

// import { useState, useContext } from "react";
// import api from "../services/api";
// import { AuthContext } from "../context/AuthContext";
// import { useNavigate, Link } from "react-router-dom";

// export default function Register() {
//   const { login } = useContext(AuthContext);
//   const navigate = useNavigate();

//   const [form, setForm] = useState({
//     name: "",
//     email: "",
//     password: "",
//     role: "CLIENT",
//   });

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     try {
//       const res = await api.post("/auth/register", form);
//       login(res.data);
//       navigate("/");
//     } catch (err) {
//       alert(err.response?.data?.message || "Registration failed");
//     }
//   };

//   return (
//     <div className="container d-flex justify-content-center align-items-center"
//          style={{ minHeight: "85vh" }}>
//       <div className="card shadow-lg border-0" style={{ width: "420px" }}>
//         <div className="card-body p-4">

//           <h3 className="text-center mb-3 fw-bold">
//             Create Account
//           </h3>
//           <p className="text-center text-muted mb-4">
//             Join AgriSystem to manage crops and orders
//           </p>

//           <form onSubmit={handleSubmit}>
//             {/* Name */}
//             <div className="mb-3">
//               <label className="form-label">Full Name</label>
//               <input
//                 type="text"
//                 className="form-control"
//                 placeholder="Enter your name"
//                 value={form.name}
//                 onChange={(e) =>
//                   setForm({ ...form, name: e.target.value })
//                 }
//                 required
//               />
//             </div>

//             {/* Email */}
//             <div className="mb-3">
//               <label className="form-label">Email Address</label>
//               <input
//                 type="email"
//                 className="form-control"
//                 placeholder="Enter your email"
//                 value={form.email}
//                 onChange={(e) =>
//                   setForm({ ...form, email: e.target.value })
//                 }
//                 required
//               />
//             </div>

//             {/* Password */}
//             <div className="mb-3">
//               <label className="form-label">Password</label>
//               <input
//                 type="password"
//                 className="form-control"
//                 placeholder="Create a password"
//                 value={form.password}
//                 onChange={(e) =>
//                   setForm({ ...form, password: e.target.value })
//                 }
//                 required
//               />
//             </div>

//             {/* Role */}
//             <div className="mb-4">
//               <label className="form-label">Register As</label>
//               <select
//                 className="form-select"
//                 value={form.role}
//                 onChange={(e) =>
//                   setForm({ ...form, role: e.target.value })
//                 }
//               >
//                 <option value="CLIENT">Client</option>
//                 <option value="FARMER">Farmer</option>
//                 <option value="BROKER">Broker</option>
//               </select>
//             </div>

//             {/* Submit */}
//             <button className="btn btn-success w-100 fw-semibold">
//               Register
//             </button>
//           </form>

//           <hr className="my-4" />

//           <p className="text-center mb-0">
//             Already have an account?{" "}
//             <Link to="/login" className="text-decoration-none fw-semibold">
//               Login
//             </Link>
//           </p>
//         </div>
//       </div>
//     </div>
//   );
// }

import { useState, useContext } from "react";
import api from "../services/api";
import { AuthContext } from "../context/AuthContext";
import { useNavigate, Link } from "react-router-dom";

export default function Register() {
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    role: "CLIENT",
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await api.post("/auth/register", form);
      login(res.data);
      navigate("/");
    } catch (err) {
      alert(err.response?.data?.message || "Registration failed");
    }
  };

  return (
    <div
      className="container d-flex justify-content-center align-items-center"
      style={{ minHeight: "80vh" }}
    >
      <div
        className="card shadow border-0 w-100"
        style={{ maxWidth: "380px" }}
      >
        <div className="card-body p-3">

          <h4 className="text-center fw-bold mb-1">
            Create Account
          </h4>
          <p className="text-center text-muted small mb-3">
            Join AgriSystem For Better Management
          </p>

          <form onSubmit={handleSubmit}>
            {/* Name */}
            <div className="mb-2">
              <label className="form-label small">Full Name</label>
              <input
                type="text"
                className="form-control form-control-sm"
                value={form.name}
                onChange={(e) =>
                  setForm({ ...form, name: e.target.value })
                }
                required
              />
            </div>

            {/* Email */}
            <div className="mb-2">
              <label className="form-label small">Email</label>
              <input
                type="email"
                className="form-control form-control-sm"
                value={form.email}
                onChange={(e) =>
                  setForm({ ...form, email: e.target.value })
                }
                required
              />
            </div>

            {/* Password */}
            <div className="mb-2">
              <label className="form-label small">Password</label>
              <input
                type="password"
                className="form-control form-control-sm"
                value={form.password}
                onChange={(e) =>
                  setForm({ ...form, password: e.target.value })
                }
                required
              />
            </div>

            {/* Role */}
            <div className="mb-3">
              <label className="form-label small">Register As</label>
              <select
                className="form-select form-select-sm"
                value={form.role}
                onChange={(e) =>
                  setForm({ ...form, role: e.target.value })
                }
              >
                <option value="CLIENT">Client</option>
                <option value="FARMER">Farmer</option>
                <option value="BROKER">Broker</option>
              </select>
            </div>

            <button className="btn btn-success btn-sm w-100">
              Register
            </button>
          </form>

          <p className="text-center small mt-3 mb-0">
            Already have an account?{" "}
            <Link to="/login" className="fw-semibold text-decoration-none">
              Login
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
