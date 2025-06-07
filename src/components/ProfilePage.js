import React, { useEffect, useState } from "react";
import API from "../services/api";
import { getUserId, getUserRole } from "../utils/auth";

export default function ProfilePage() {
  const [user, setUser] = useState(null);
  const role = getUserRole();

  useEffect(() => {
    API.get(`/users/${getUserId()}`).then(res => setUser(res.data));
  }, []);

  const initials = user?.name ? user.name.split(" ").map(w => w[0]).join("").toUpperCase().slice(0,2) : "U";

  return (
    <div className="container py-5 d-flex justify-content-center">
      <div className="bg-white p-4 rounded-4 shadow" style={{maxWidth: 400, width: "100%"}}>
        <div className="d-flex flex-column align-items-center mb-4">
          <div className="bg-primary text-white rounded-circle d-flex justify-content-center align-items-center"
               style={{ width: 60, height: 60, fontWeight: "bold", fontSize: 24 }}>
            {initials}
          </div>
        </div>
        <h4 className="text-center mb-3 fw-bold">Profile</h4>
        {user && (
          <div>
            <div className="mb-2"><b>Name:</b> {user.name}</div>
            <div className="mb-2"><b>Email:</b> {user.email}</div>
            <div className="mb-2">
              <b>Role:</b> <span className={`badge ${role === "Instructor" ? "bg-success" : "bg-info"}`}>{user.role}</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
