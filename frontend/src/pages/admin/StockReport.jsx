import React, { useState } from "react";
import { Form, Button, Table, Spinner } from "react-bootstrap";
import { api } from "../../api/api";

export default function StockReport() {
  const [from, setFrom] = useState("");
  const [to, setTo]     = useState("");
  const [rows, setRows] = useState(null);
  const [loading, setLoading] = useState(false);

  const load = async () => {
    setLoading(true);
    const { data } = await api.get("/api/stock/report",
      { params: { from, to } });
    setRows(data);
    setLoading(false);
  };

  const downloadCSV = () => {
    const lines = [
      "ProductId,Name,Opening,InQty,OutQty,Closing",
      ...rows.map(r =>
        [r.productId, `"${r.name}"`, r.opening, r.inQty, r.outQty, r.closing]
          .join(","))
    ];
    const blob = new Blob([lines.join("\n")], { type: "text/csv" });
    const url  = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `StockReport_${from}_${to}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="container my-4">
      <h4>Báo cáo kho</h4>

      <Form className="d-flex gap-2 mb-3">
        <Form.Control type="date" value={from}
                      onChange={e=>setFrom(e.target.value)} />
        <Form.Control type="date" value={to}
                      onChange={e=>setTo(e.target.value)} />
        <Button onClick={load}>Xem</Button>
        {rows && <Button variant="outline-secondary" onClick={downloadCSV}>
          Tải CSV
        </Button>}
      </Form>

      {loading && <Spinner/>}

      {rows && !loading &&
        <Table striped hover responsive>
          <thead>
            <tr>
              <th>ID</th><th>Sản phẩm</th>
              <th>Đầu kỳ</th><th>Nhập</th><th>Xuất</th><th>Cuối kỳ</th>
            </tr>
          </thead>
          <tbody>
            {rows.map(r=>(
              <tr key={r.productId}>
                <td>{r.productId}</td>
                <td>{r.name}</td>
                <td>{r.opening}</td>
                <td>{r.inQty}</td>
                <td>{r.outQty}</td>
                <td>{r.closing}</td>
              </tr>
            ))}
          </tbody>
        </Table>}
    </div>
  );
}
