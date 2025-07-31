import React, { useEffect, useState } from "react";
import { api } from '../api/api';
import {
  PieChart, Pie, Cell, Tooltip,
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Legend,
} from "recharts";

export default function DashboardPage() {
  const [groupData, setGroupData] = useState([]);
  const [logData, setLogData] = useState([]);
  const [revenueData, setRevenueData] = useState([]);

  useEffect(() => {
    /*api.get("/api/report/customers-by-group").then(res => setGroupData(res.data));
    api.get("/api/report/logs-by-customer").then(res => setLogData(res.data));
    api.get("/api/report/revenue-by-customer").then(res => setRevenueData(res.data));*/
  }, []);

  const COLORS = ["#8884d8", "#82ca9d", "#ffc658", "#8dd1e1", "#d0ed57", "#a4de6c", "#d88484"];

  return (
    <div className="container my-4">
      <h4>Dashboard – Báo cáo khách hàng & doanh số</h4>

      <div style={{ display: "flex", gap: 40 }}>
        {/* Biểu đồ nhóm khách */}
        <div>
          <h6>Khách theo nhóm</h6>
          <PieChart width={300} height={220}>
            <Pie
              data={groupData}
              dataKey="Count"
              nameKey="GroupName"
              cx="50%"
              cy="50%"
              outerRadius={80}
              label
            >
              {groupData.map((entry, idx) => (
                <Cell key={`cell-${idx}`} fill={COLORS[idx % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip />
          </PieChart>
        </div>

        {/* Biểu đồ số lần chăm sóc */}
        <div>
          <h6>Số lần chăm sóc khách</h6>
          <BarChart width={320} height={220} data={logData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="Name" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar dataKey="LogCount" fill="#8884d8" />
          </BarChart>
        </div>
      </div>

      {/* Biểu đồ doanh số */}
      <div className="mt-5">
        <h6>Doanh số theo khách hàng</h6>
        <BarChart width={640} height={270} data={revenueData}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="CustomerEmail" />
          <YAxis />
          <Tooltip />
          <Legend />
          <Bar dataKey="TotalRevenue" fill="#82ca9d" />
        </BarChart>
      </div>
    </div>
  );
}
