import { useEffect, useState } from "react";
import api from "../services/api";

export default function Users() {
  const [users, setUsers] = useState([]);
  const [editUser, setEditUser] = useState(null);

  // Fetch all users
  useEffect(() => {
    api.get("/users")
      .then(res => setUsers(res.data))
      .catch(err => console.error(err));
  }, []);

  // Update user role
  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      const res = await api.put(`/users/${editUser._id}`, { role: editUser.role });
      setUsers(users.map(u => u._id === res.data.id ? { ...u, role: res.data.role } : u));
      setEditUser(null);
    } catch (err) {
      alert(err.response?.data?.message || "Update failed");
    }
  };

  // Delete user
  const handleDelete = async (id) => {
    if (!window.confirm("Delete this user?")) return;
    try {
      await api.delete(`/users/${id}`);
      setUsers(users.filter(u => u._id !== id));
    } catch (err) {
      alert(err.response?.data?.message || "Delete failed");
    }
  };

  return (
    <div className="container mt-4">
      <h2>User Management</h2>
      <table className="table table-striped">
        <thead>
          <tr>
            <th>Name</th><th>Email</th><th>Role</th><th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {users.map(u=>(
            <tr key={u._id}>
              <td>{u.name}</td>
              <td>{u.email}</td>
              <td>{u.role}</td>
              <td>
                <button className="btn btn-sm btn-primary me-2" onClick={()=>setEditUser(u)}>Edit</button>
                <button className="btn btn-sm btn-danger" onClick={()=>handleDelete(u._id)}>Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Edit User Modal */}
      {editUser && (
        <div className="modal show d-block" tabIndex="-1">
          <div className="modal-dialog">
            <div className="modal-content">
              <form onSubmit={handleUpdate}>
                <div className="modal-header">
                  <h5 className="modal-title">Edit User</h5>
                  <button type="button" className="btn-close" onClick={()=>setEditUser(null)}></button>
                </div>
                <div className="modal-body">
                  <p><strong>{editUser.name}</strong> ({editUser.email})</p>
                  <select className="form-control" value={editUser.role}
                    onChange={(e)=>setEditUser({...editUser, role:e.target.value})}>
                    <option value="ADMIN">Admin</option>
                    <option value="FARMER">Farmer</option>
                    <option value="BROKER">Broker</option>
                    <option value="CLIENT">Client</option>
                  </select>
                </div>
                <div className="modal-footer">
                  <button type="submit" className="btn btn-success">Save</button>
                  <button type="button" className="btn btn-secondary" onClick={()=>setEditUser(null)}>Cancel</button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
