// src/pages/admin/StockListAdmin.jsx
import React, { useEffect, useState } from "react";
import { Table, Button, Spinner } from "react-bootstrap";
import { api } from "../../api/api";                // ← đúng tới src/api/api.js
import StockAdjustModal from "../../components/StockAdjustModal"; // ← modal

export default function StockListAdmin() {
  const [rows, setRows]       = useState([]);
  const [loading, setLoading] = useState(true);
  const [popup, setPopup]     = useState(null);     // sản phẩm đang điều chỉnh

  const load = async () => {
    setLoading(true);
    const { data } = await api.get("/api/products");
    setRows(data.map(p => ({ id: p.id, name: p.name, qty: p.inStock })));
    setLoading(false);
  };

  useEffect(() => { load(); }, []);

  if (loading) return <Spinner className="m-3" />;

  return (
    <div className="container my-4">
      <h4>Tồn kho</h4>
      <Table hover responsive>
        <thead>
          <tr>
            <th>ID</th><th>Tên</th><th>Số lượng</th><th></th>
          </tr>
        </thead>
        <tbody>
          {rows.map(r => (
            <tr key={r.id}>
              <td>{r.id}</td>
              <td>{r.name}</td>
              <td>{r.qty}</td>
              <td>
                <Button size="sm" onClick={() => setPopup(r)}>
                  Điều chỉnh
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>

      {popup &&
        <StockAdjustModal
          show={true}
          product={popup}
          onHide={(ok) => { setPopup(null); if (ok) load(); }}
        />}
    </div>
  );
}
