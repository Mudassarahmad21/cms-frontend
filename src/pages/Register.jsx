// import { useState, useContext } from "react";
// import api from "../services/api";
// import { AuthContext } from "../context/AuthContext";
// import { useNavigate } from "react-router-dom";

// export default function Register() {
//   const { login } = useContext(AuthContext);
//   const navigate = useNavigate();
//   const [form, setForm] = useState({ name:"", email:"", password:"", role:"CLIENT" });

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
//     <div className="container mt-5">
//       <h2>Register</h2>
//       <form onSubmit={handleSubmit} className="col-md-6">
//         {["name","email","password"].map(f=>(
//           <input key={f} className="form-control mb-2" type={f==="password"?"password":"text"} placeholder={f} value={form[f]} onChange={(e)=>setForm({...form,[f]:e.target.value})}/>
//         ))}
//         <select className="form-control mb-2" value={form.role} onChange={(e)=>setForm({...form,role:e.target.value})}>
//           <option value="ADMIN">Admin</option>
//           <option value="CLIENT">Client</option>
//           <option value="FARMER">Farmer</option>
//           <option value="BROKER">Broker</option>
//         </select>
//         <button className="btn btn-success">Register</button>
//       </form>
//     </div>
//   );
// }


import { useState, useContext } from "react";
import api from "../services/api";
import { AuthContext } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";

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
    <div className="container mt-5">
      <h2>Register</h2>
      <form onSubmit={handleSubmit} className="col-md-6">
        {["name", "email", "password"].map((f) => (
          <input
            key={f}
            className="form-control mb-2"
            type={f === "password" ? "password" : "text"}
            placeholder={f}
            value={form[f]}
            onChange={(e) =>
              setForm({ ...form, [f]: e.target.value })
            }
          />
        ))}

        <select
          className="form-control mb-2"
          value={form.role}
          onChange={(e) =>
            setForm({ ...form, role: e.target.value })
          }
        >
          <option value="CLIENT">Client</option>
          <option value="FARMER">Farmer</option>
          <option value="BROKER">Broker</option>
        </select>

        <button className="btn btn-success">Register</button>
      </form>
    </div>
  );
}
