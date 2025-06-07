import React, { useEffect, useState } from "react";
import API from "../../services/api";

export default function UserManagement() {
  const [users, setUsers] = useState([]);
  const [msg, setMsg] = useState("");

  useEffect(() => {
    API.get("/users")
      .then(res => setUsers(res.data))
      .catch(() => setMsg("Failed to load users"));
  }, []);

  const handleDelete = async (userId) => {
    if (!window.confirm("Are you sure you want to delete this user?")) return;
    try {
      await API.delete(`/users/${userId}`);
      setUsers(prev => prev.filter(u => u.userId !== userId));
      setMsg("User deleted!");
    } catch {
      setMsg("Failed to delete user.");
    }
  };

  return (
    <div className="container py-5">
      <h3 className="fw-bold mb-4">User Management</h3>
      {msg && <div className="alert alert-info">{msg}</div>}
      <table className="table table-hover">
        <thead>
          <tr>
            <th>Name</th>
            <th>Email</th>
            <th>Role</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          {users
            .filter(u => u.role !== "Instructor") // optional: prevent self-deletion
            .map(u => (
            <tr key={u.userId}>
              <td>{u.name}</td>
              <td>{u.email}</td>
              <td>{u.role}</td>
              <td>
                <button
                  className="btn btn-danger btn-sm"
                  onClick={() => handleDelete(u.userId)}
                >
                  <i className="bi bi-trash"></i> Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
