import React, { useState } from "react";
import { Modal, Button, Form, Alert } from "react-bootstrap";
import { api } from "../api/api";

export default function StockAdjustModal({ show, onHide, product }) {
  const [qty, setQty]           = useState(0);
  const [reference, setRef]     = useState("");
  const [saving, setSaving]     = useState(false);
  const [error, setError]       = useState("");

  const submit = async () => {
    setSaving(true);
    setError("");
    try {
      await api.post("/api/stock/adjust", {
        productId : product.id,
        qty       : Number(qty),
        reference : reference || "Manual"
      });
      onHide(true);          // reload list
    } catch {
      setError("Không đủ tồn kho để xuất.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <Modal show={show} onHide={() => onHide(false)} centered>
      <Modal.Header closeButton>
        <Modal.Title>Điều chỉnh kho – {product.name}</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        {error && <Alert variant="danger">{error}</Alert>}
        <Form.Group className="mb-3">
          <Form.Label>Số lượng (+ nhập / – xuất)</Form.Label>
          <Form.Control
            type="number"
            value={qty}
            onChange={(e) => setQty(e.target.value)}
          />
        </Form.Group>
        <Form.Group>
          <Form.Label>Tham chiếu</Form.Label>
          <Form.Control
            value={reference}
            onChange={(e) => setRef(e.target.value)}
            placeholder="PO#123 / Manual"
          />
        </Form.Group>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={() => onHide(false)}>
          Hủy
        </Button>
        <Button variant="primary" disabled={saving} onClick={submit}>
          Lưu
        </Button>
      </Modal.Footer>
    </Modal>
  );
}
