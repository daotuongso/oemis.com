import React, { useEffect, useState } from "react";
import { api } from "../api/api";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Tooltip,
  Legend,
} from "chart.js";
import { Bar } from "react-chartjs-2";

/* Đăng ký các plugin Chart.js cần dùng */
ChartJS.register(CategoryScale, LinearScale, BarElement, Tooltip, Legend);

export default function SalesChart({ from, to, onData }) {
  const [data, setData] = useState([]);

  /* ---------- nạp dữ liệu khi from/to thay đổi ---------- */
  useEffect(() => {
    if (!from || !to) return;
    api
      .get("/api/report/sales", { params: { from, to } })
      .then((r) => {
        setData(r.data);
        /* gửi dữ liệu ngược lên parent nếu cần */
        if (onData) onData(r.data);
      })
      .catch(() => setData([]));
  }, [from, to, onData]);

  if (!data.length) return <p>Không có dữ liệu.</p>;

  const chartData = {
    labels: data.map((d) =>
      new Date(d.date).toLocaleDateString("vi-VN", { month: "2-digit", day: "2-digit" })
    ),
    datasets: [
      {
        label: "Doanh thu (₫)",
        data: data.map((d) => d.total),
      },
    ],
  };

  return (
    <Bar
      data={chartData}
      options={{
        responsive: true,
        plugins: { legend: { display: false }, tooltip: { callbacks: {
          label: ctx => ctx.raw.toLocaleString("vi-VN") + " ₫"
        }}},
        scales: {
          y: {
            ticks: {
              callback: (v) => v.toLocaleString("vi-VN"),
            },
          },
        },
      }}
    />
  );
}
