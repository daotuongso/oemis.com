import React, { useEffect, useState } from "react";
import { api } from "../../api/api";
import { Modal, Button, Form, Table, Spinner } from "react-bootstrap";

export default function NewPrModal({ onClose }) {
  const [products, setProducts] = useState([]);
  const [sel, setSel]           = useState({});
  const [saving, setSaving]     = useState(false);

  useEffect(() => {
    const load = async () => {
      const { data } = await api.get("/api/products");
      setProducts(data);
    };
    load();
  }, []);

  const toggle = p =>
    setSel(s => s[p.id] ? ({ ...s, [p.id]: undefined }) : ({ ...s, [p.id]: 1 }));

  const save = async () => {
    setSaving(true);
    const lines = Object.entries(sel)
      .filter(([_, q]) => q)
      .map(([id, qty]) => ({
        productId: +id,
        qty: +qty,
        price: products.find(p => p.id === +id).price
      }));
    await api.post("/api/purchase/pr", { lines });
    onClose(true);
  };

  return (
    <Modal show onHide={() => onClose(false)} size="lg" centered>
      <Modal.Header closeButton><Modal.Title>Tạo Purchase Request</Modal.Title></Modal.Header>
      <Modal.Body>
        {products.length === 0 ? <Spinner /> :
          <Table hover>
            <thead><tr><th></th><th>Sản phẩm</th><th>Còn kho</th><th>Số lượng</th></tr></thead>
            <tbody>
              {products.map(p => (
                <tr key={p.id}>
                  <td><Form.Check onChange={() => toggle(p)} checked={!!sel[p.id]} /></td>
                  <td>{p.name}</td>
                  <td>{p.inStock}</td>
                  <td style={{ width: 120 }}>
                    <Form.Control size="sm" type="number" min="1"
                      disabled={!sel[p.id]}
                      value={sel[p.id] || ""}
                      onChange={e => setSel(s => ({ ...s, [p.id]: e.target.value }))} />
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>}
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={() => onClose(false)}>Huỷ</Button>
        <Button onClick={save} disabled={saving || Object.values(sel).filter(Boolean).length === 0}>
          Lưu
        </Button>
      </Modal.Footer>
    </Modal>
  );
}
