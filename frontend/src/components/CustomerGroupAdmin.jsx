import React, { useEffect, useState } from "react";
import { api } from '../api/api';
import { Table, Button, Modal, Form } from "react-bootstrap";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function CustomerGroupAdmin() {
  const [groups, setGroups] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState({ name: "", description: "" });

  // Load nhóm
  const fetchGroups = async () => {
    setLoading(true);
    try {
      const res = await api.get("/api/customers/groups");
      setGroups(res.data);
    } catch (err) {
      toast.error("Không thể tải danh sách nhóm!");
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchGroups();
    // eslint-disable-next-line
  }, []);

  // Thay đổi form
  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  // Thêm/sửa nhóm
  const handleSave = async (e) => {
    e.preventDefault();
    if (!form.name) {
      toast.warn("Vui lòng nhập tên nhóm!");
      return;
    }
    try {
      if (editing) {
        await api.put(`/api/customers/groups/${editing.id}`, form);
        toast.success("Đã cập nhật nhóm!");
      } else {
        await api.post("/api/customers/groups", form);
        toast.success("Đã thêm nhóm mới!");
      }
      setShowModal(false);
      fetchGroups();
    } catch {
      toast.error("Lỗi khi lưu nhóm!");
    }
  };

  // Sửa nhóm
  const handleEdit = (g) => {
    setEditing(g);
    setForm({ name: g.name, description: g.description || "" });
    setShowModal(true);
  };

  // Thêm mới
  const handleAdd = () => {
    setEditing(null);
    setForm({ name: "", description: "" });
    setShowModal(true);
  };

  // Xóa nhóm
  const handleDelete = async (id) => {
    if (!window.confirm("Bạn chắc chắn muốn xóa nhóm này?")) return;
    try {
      await api.delete(`/api/customers/groups/${id}`);
      toast.success("Đã xóa nhóm!");
      fetchGroups();
    } catch {
      toast.error("Không thể xóa nhóm (có thể nhóm vẫn còn khách hàng)!");
    }
  };

  return (
    <div className="container py-3">
      <h4>Quản lý nhóm khách hàng</h4>
      <Button variant="success" className="mb-2" onClick={handleAdd}>Thêm nhóm</Button>
      <Table bordered hover size="sm" responsive>
        <thead>
          <tr>
            <th>#</th>
            <th>Tên nhóm</th>
            <th>Mô tả</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          {loading ? (
            <tr>
              <td colSpan={4} className="text-center">
                <span className="spinner-border spinner-border-sm"></span> Đang tải...
              </td>
            </tr>
          ) : groups.length === 0 ? (
            <tr>
              <td colSpan={4} className="text-center">Chưa có nhóm khách hàng</td>
            </tr>
          ) : (
            groups.map((g, i) => (
              <tr key={g.id}>
                <td>{i + 1}</td>
                <td>{g.name}</td>
                <td>{g.description}</td>
                <td>
                  <Button variant="outline-primary" size="sm" className="me-2" onClick={() => handleEdit(g)}>
                    Sửa
                  </Button>
                  <Button variant="outline-danger" size="sm" onClick={() => handleDelete(g.id)}>
                    Xóa
                  </Button>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </Table>

      {/* Modal thêm/sửa */}
      <Modal show={showModal} onHide={() => setShowModal(false)} centered>
        <Form onSubmit={handleSave}>
          <Modal.Header closeButton>
            <Modal.Title>{editing ? "Sửa nhóm" : "Thêm nhóm mới"}</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Form.Group>
              <Form.Label>Tên nhóm *</Form.Label>
              <Form.Control name="name" value={form.name} onChange={handleChange} required />
            </Form.Group>
            <Form.Group className="mt-2">
              <Form.Label>Mô tả</Form.Label>
              <Form.Control name="description" value={form.description} onChange={handleChange} />
            </Form.Group>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={() => setShowModal(false)}>Hủy</Button>
            <Button type="submit" variant="primary">{editing ? "Lưu" : "Thêm mới"}</Button>
          </Modal.Footer>
        </Form>
      </Modal>
      <ToastContainer position="top-center" autoClose={1800} />
    </div>
  );
}
