import React, { useState } from "react";
import { Button, Table, Form } from "react-bootstrap";
import { api } from "../../api/api";

export default function StockCountPage() {
  const [sheet, setSheet] = useState(null);
  const [rows,  setRows ] = useState([]);

  const openSheet = async () => {
    // demo: lấy toàn bộ product, qtyActual = qtySystem
    const { data: prods } = await api.get("/api/products");
    const dto = { lines: prods.map(p => ({ productId: p.id, qtyActual: p.inStock })) };
    const { data } = await api.post("/api/stock/counts", dto);
    setSheet(data);
    setRows(data.lines);
  };

  const closeSheet = async () => {
    const payload = { lines: rows.map(r => ({ productId: r.productId, qtyActual: r.qtyActual })) };
    const { data } = await api.post(`/api/stock/counts/${sheet.id}/close`, payload);
    alert("Đã chốt. Chênh lệch đã điều chỉnh kho.");
    setSheet(data);
  };

  const updateQty = (id, v) =>
    setRows(rows.map(r => r.productId === id ? { ...r, qtyActual: v } : r));

  return (
    <div className="container my-4">
      <h4>Kiểm kê kho</h4>

      {!sheet && <Button onClick={openSheet}>Mở phiếu kiểm kê</Button>}

      {sheet &&
        <>
          <p>Mã phiếu: <b>{sheet.code}</b> – Bắt đầu: {new Date(sheet.startedAt).toLocaleString()}</p>

          <Table bordered size="sm">
            <thead><tr><th>ID</th><th>Tên</th><th>Hệ thống</th><th>Thực đếm</th><th>Chênh</th></tr></thead>
            <tbody>
              {rows.map(r => (
                <tr key={r.productId}>
                  <td>{r.productId}</td>
                  <td>{r.name || ""}</td>
                  <td>{r.qtySystem}</td>
                  <td>
                    <Form.Control
                      type="number"
                      value={r.qtyActual}
                      onChange={e=>updateQty(r.productId, Number(e.target.value))}
                      style={{ width:80 }}
                    />
                  </td>
                  <td>{r.qtyActual - r.qtySystem}</td>
                </tr>
              ))}
            </tbody>
          </Table>

          {!sheet.closedAt &&
            <Button variant="primary" onClick={closeSheet}>Chốt & điều chỉnh</Button>}
          {sheet.closedAt && <p className="text-success">Đã chốt: {new Date(sheet.closedAt).toLocaleString()}</p>}
        </>
      }
    </div>
  );
}
