import React, { useEffect, useState } from "react";
import API from "../../services/api";
import { LineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid, ResponsiveContainer } from "recharts";

export default function StudentProgress() {
  const [data, setData] = useState([]);

  useEffect(() => {
    const userId = localStorage.getItem("userId");
    API.get(`/assessments/student/${userId}/progress`)
      .then(res => setData(res.data))
      .catch(() => setData([]));
  }, []);

  return (
    <div className="container py-4">
      <h2 className="fw-bold">My Assessment Progress</h2>
      {data.length === 0 ? (
        <div>No results yet.</div>
      ) : (
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={data}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="assessmentTitle" />
            <YAxis />
            <Tooltip />
            <Line type="monotone" dataKey="score" stroke="#82ca9d" />
          </LineChart>
        </ResponsiveContainer>
      )}
    </div>
  );
}
