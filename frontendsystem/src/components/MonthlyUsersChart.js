import React from "react";
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from "recharts";

import { useTheme } from "../context/ThemeContext";

function MonthlyUsersChart({ data }) {
  const { darkMode } = useTheme();
  console.log(data);

  return (
    <div
      className="chart-card"
      style={{
        width: "100%",
        height: "350px",
      }}
    >
      <h3>Monthly Users</h3>
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data}>
          <CartesianGrid
            strokeDasharray="3 3"
            stroke={darkMode ? "#475569" : "#d1d5db"}
          />

          <XAxis dataKey="month" stroke={darkMode ? "#e5e7eb" : "#374151"} />

          <YAxis stroke={darkMode ? "#e5e7eb" : "#374151"} />

          <Tooltip
            contentStyle={{
              backgroundColor: darkMode ? "#1f2937" : "#ffffff",
              border: "none",
              borderRadius: "10px",
              color: darkMode ? "#ffffff" : "#111827",
            }}
            labelStyle={{
              color: darkMode ? "#ffffff" : "#111827",
            }}
          />

          <Legend
            wrapperStyle={{
              color: darkMode ? "#ffffff" : "#111827",
            }}
          />

          <Bar
            dataKey="users"
            fill={darkMode ? "#60a5fa" : "#2563eb"}
            radius={[8, 8, 0, 0]}
          />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}

export default MonthlyUsersChart;
