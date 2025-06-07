import React, { useEffect, useState } from "react";
import API from "../../services/api";
import { useParams } from "react-router-dom";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ResponsiveContainer
} from "recharts";

export default function AssessmentAnalytics() {
  const { assessmentId } = useParams();
  const [data, setData] = useState(null);

  useEffect(() => {
    API.get(`/assessments/${assessmentId}/analytics`)
      .then(res => setData(res.data))
      .catch(() => setData({ error: true }));
  }, [assessmentId]);

  if (!data) return <div>Loading analytics...</div>;
  if (data.error || !data.count) return <div>No assessment results yet.</div>;

  return (
    <div className="container py-5">
      <h2 className="fw-bold mb-4">Assessment Analytics</h2>
      <div className="mb-4">
        <strong>Average Score:</strong> {data.average}<br />
        <strong>Highest:</strong> {data.highest}<br />
        <strong>Lowest:</strong> {data.lowest}
      </div>

      <div className="mb-4">
        <h5>Top Students</h5>
        <ol>
          {data.topStudents.map((s, idx) => (
            <li key={idx}>{s.name}: {s.score}</li>
          ))}
        </ol>
      </div>

      <div>
        <h5>Score Distribution</h5>
        {data.distribution.length === 0
          ? <div>No scores to display.</div>
          : (
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={data.distribution}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="score" />
                <YAxis allowDecimals={false} />
                <Tooltip />
                <Bar dataKey="count" fill="#8884d8" />
              </BarChart>
            </ResponsiveContainer>
          )
        }
      </div>
    </div>
  );
}
