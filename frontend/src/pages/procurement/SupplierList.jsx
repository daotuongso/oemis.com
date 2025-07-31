import React, { useEffect, useState } from "react";
import { api } from "../../api/api";
import { Table, Button, Modal, Form, Spinner } from "react-bootstrap";

export default function SupplierList() {
  const [list, setList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [show, setShow] = useState(false);
  const [form, setForm] = useState({ name: "", phone: "", email: "" });

  const load = async () => {
    setLoading(true);
    const { data } = await api.get("/api/purchase/suppliers");
    setList(data);
    setLoading(false);
  };

  /* ✅ không truyền hàm async thẳng cho useEffect */
  useEffect(() => { load(); }, []);

  const save = async () => {
    await api.post("/api/purchase/suppliers", form);
    setShow(false);
    load();
  };

  if (loading) return <Spinner />;
  return (
    <div className="container my-4">
      <h4>Nhà cung cấp</h4>
      <Button onClick={() => setShow(true)}>Thêm NCC</Button>

      <Table striped hover className="mt-3">
        <thead><tr><th>#</th><th>Tên</th><th>Phone</th><th>Email</th></tr></thead>
        <tbody>
          {list.map(s => (
            <tr key={s.id}>
              <td>{s.id}</td><td>{s.name}</td><td>{s.phone}</td><td>{s.email}</td>
            </tr>
          ))}
        </tbody>
      </Table>

      <Modal show={show} onHide={() => setShow(false)}>
        <Modal.Header closeButton><Modal.Title>Thêm NCC</Modal.Title></Modal.Header>
        <Modal.Body>
          <Form.Control className="mb-2" placeholder="Tên"
            value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} />
          <Form.Control className="mb-2" placeholder="Phone"
            value={form.phone} onChange={e => setForm(f => ({ ...f, phone: e.target.value }))} />
          <Form.Control placeholder="Email"
            value={form.email} onChange={e => setForm(f => ({ ...f, email: e.target.value }))} />
        </Modal.Body>
        <Modal.Footer>
          <Button onClick={save}>Lưu</Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
}
