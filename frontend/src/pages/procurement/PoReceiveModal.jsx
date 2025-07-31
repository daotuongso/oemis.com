import React, { useState } from "react";
import { Modal, Button } from "react-bootstrap";
import { api } from "../../api/api";

export default function PoReceiveModal({ po, onClose }) {
  const [saving, setSaving] = useState(false);
  const receive = async () => {
    setSaving(true);
    await api.post(`/api/purchase/po/${po.id}/receive`, { receivedBy: "admin" });
    onClose(true);
  };
  return (
    <Modal show onHide={() => onClose(false)}>
      <Modal.Header closeButton><Modal.Title>Nhập kho PO {po.code}</Modal.Title></Modal.Header>
      <Modal.Body>Bạn chắc chắn đã nhận đủ hàng?</Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={() => onClose(false)}>Hủy</Button>
        <Button onClick={receive} disabled={saving}>Xác nhận</Button>
      </Modal.Footer>
    </Modal>
  );
}
