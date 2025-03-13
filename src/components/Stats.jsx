import React, { useEffect, useState } from "react";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";

const Stats = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("http://localhost:7777/resume/stats") // Change to your backend API URL
      .then((res) => res.json())
      .then((data) => {
        setStats(data);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching stats:", error);
        setLoading(false);
      });
  }, []);

  if (loading) return <p className="text-center text-lg font-semibold mt-5">Loading statistics...</p>;
  if (!stats) return <p className="text-center text-lg font-semibold mt-5 text-red-500">Failed to load statistics.</p>;

  // Transform score distribution for the bar chart
  const scoreData = stats.scoreDistribution.map((item) => ({
    rating: item._id * 10, // Convert range to actual score (10, 20, ..., 100)
    count: item.count,
  }));

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center py-10 px-4">
      <h1 className="text-3xl font-bold text-gray-800 mb-6">Resume Analysis Statistics</h1>

      {/* Total Resumes */}
      <div className="bg-white shadow-lg rounded-lg p-6 mb-8 w-full max-w-md text-center">
        <h2 className="text-xl font-semibold text-gray-700">Total Resumes Parsed</h2>
        <p className="text-4xl font-bold text-blue-600 mt-2">{stats.totalResumes}</p>
      </div>

      {/* Score Distribution Bar Chart */}
      <div className="bg-white shadow-lg rounded-lg p-6 w-full max-w-2xl">
        <h2 className="text-xl font-semibold text-gray-700 mb-4">Score Distribution</h2>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={scoreData}>
            <XAxis dataKey="rating" tick={{ fontSize: 14 }} label={{ value: "Score Range", position: "insideBottom", dy: 10 }} />
            <YAxis tick={{ fontSize: 14 }} label={{ value: "Users", angle: -90, position: "insideLeft", dy: -10 }} />
            <Tooltip />
            <Bar dataKey="count" fill="#4F46E5" radius={[5, 5, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default Stats;
