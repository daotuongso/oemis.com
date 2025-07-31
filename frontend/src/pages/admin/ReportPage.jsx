import React, { useState } from "react";
import SalesChart from "../../components/SalesChart";
import { jsPDF } from "jspdf";
import autoTable from "jspdf-autotable";

/* ---------- helpers for quick range ---------- */
const firstDayOfMonth = (d) => new Date(d.getFullYear(), d.getMonth(), 1);
const lastDayOfMonth  = (d) => new Date(d.getFullYear(), d.getMonth() + 1, 0);
const rangeThisMonth  = () => { const t = new Date(); return [firstDayOfMonth(t), t]; };
const rangeLastMonth  = () => {
  const t = new Date();
  const p = new Date(t.getFullYear(), t.getMonth() - 1, 1);
  return [firstDayOfMonth(p), lastDayOfMonth(p)];
};
const rangeThisQuarter = () => {
  const t = new Date();
  const q = Math.floor(t.getMonth() / 3);
  const s = new Date(t.getFullYear(), q * 3, 1);
  return [s, t];
};
const rangeThisYear = () => {
  const t = new Date();
  return [new Date(t.getFullYear(), 0, 1), t];
};

/* ---------- format util ---------- */
const fmt = (d) => d.toISOString().slice(0, 10);

export default function ReportPage() {
  /* range */
  const [from, setFrom] = useState(fmt(rangeThisMonth()[0]));
  const [to,   setTo]   = useState(fmt(rangeThisMonth()[1]));

  /* store data to reuse for export */
  const [rows, setRows] = useState([]);

  /* load data once <SalesChart> emits */
  const handleData = (arr) => setRows(arr);

  /* quick range */
  const apply = ([f, t]) => {
    setFrom(fmt(f));
    setTo(fmt(t));
  };

  /* ---------- EXPORT CSV ---------- */
  const downloadCsv = () => {
    if (!rows.length) return;
    const header = "Date,Total\n";
    const body   = rows
      .map((r) => `${fmt(new Date(r.date))},${r.total}`)
      .join("\n");
    const blob = new Blob([header + body], {
      type: "text/csv;charset=utf-8",
    });
    const url  = URL.createObjectURL(blob);
    const a    = document.createElement("a");
    a.href = url;
    a.download = `sales_${from}_${to}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  /* ---------- EXPORT PDF ---------- */
  const downloadPdf = () => {
    if (!rows.length) return;
    const doc = new jsPDF();
    doc.text(`Báo cáo doanh thu ${from} → ${to}`, 14, 16);
    autoTable(doc, {
      startY: 24,
      head: [["Ngày", "Doanh thu (đ)"]],
      body: rows.map((r) => [
        new Date(r.date).toLocaleDateString("vi-VN"),
        r.total.toLocaleString("vi-VN"),
      ]),
    });
    doc.save(`sales_${from}_${to}.pdf`);
  };

  return (
    <div className="container my-4">
      <h3 className="mb-3">Báo cáo doanh thu</h3>

      {/* QUICK FILTER */}
      <div className="btn-group mb-3">
        <button
          className="btn btn-outline-secondary"
          onClick={() => apply(rangeThisMonth())}
        >
          Tháng này
        </button>
        <button
          className="btn btn-outline-secondary"
          onClick={() => apply(rangeLastMonth())}
        >
          Tháng trước
        </button>
        <button
          className="btn btn-outline-secondary"
          onClick={() => apply(rangeThisQuarter())}
        >
          Quý này
        </button>
        <button
          className="btn btn-outline-secondary"
          onClick={() => apply(rangeThisYear())}
        >
          Năm nay
        </button>
      </div>

      {/* RANGE PICKER */}
      <div className="d-flex gap-2 mb-3">
        <input
          type="date"
          value={from}
          onChange={(e) => setFrom(e.target.value)}
        />
        <input type="date" value={to} onChange={(e) => setTo(e.target.value)} />
      </div>

      {/* NÚT TẢI XUỐNG */}
      <div className="mb-3">
        <button
          className="btn btn-success me-2"
          onClick={downloadCsv}
          disabled={!rows.length}
        >
          Tải CSV
        </button>
        <button
          className="btn btn-danger"
          onClick={downloadPdf}
          disabled={!rows.length}
        >
          Tải PDF
        </button>
      </div>

      {/* CHART */}
      <SalesChart from={from} to={to} onData={handleData} />
    </div>
  );
}
