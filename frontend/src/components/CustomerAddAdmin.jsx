import React, { useState, useEffect } from "react";
import { api } from '../api/api';
import { Form, Button, Row, Col } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function CustomerAddAdmin() {
  const [customer, setCustomer] = useState({
    fullName: "",
    email: "",
    phone: "",
    address: "",
    notes: "",
    tags: "",
    groupId: ""
  });
  const [groups, setGroups] = useState([]);
  const [saving, setSaving] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    api.get("/api/customers/groups")
      .then(res => setGroups(res.data))
      .catch(() => setGroups([]));
  }, []);

  const handleChange = (e) => {
    setCustomer({ ...customer, [e.target.name]: e.target.value });
  };

  const handleSave = async (e) => {
    e.preventDefault();
    if (!customer.fullName || !customer.email || !customer.phone) {
      toast.warn("Vui lòng nhập đầy đủ họ tên, email, số điện thoại!");
      return;
    }
    setSaving(true);
    try {
      await api.post("/api/customers", customer);
      toast.success("Đã thêm khách hàng!");
      setTimeout(() => navigate("/admin/customers"), 1200);
    } catch (err) {
      toast.error("Lỗi khi thêm khách hàng! Email hoặc SĐT có thể đã tồn tại.");
    }
    setSaving(false);
  };

  return (
    <div className="container py-3">
      <h4>Thêm khách hàng mới</h4>
      <Form onSubmit={handleSave}>
        <Row>
          <Col md={6}>
            <Form.Group className="mb-2">
              <Form.Label>Họ tên *</Form.Label>
              <Form.Control
                name="fullName"
                value={customer.fullName}
                onChange={handleChange}
                required
              />
            </Form.Group>
            <Form.Group className="mb-2">
              <Form.Label>Email *</Form.Label>
              <Form.Control
                type="email"
                name="email"
                value={customer.email}
                onChange={handleChange}
                required
              />
            </Form.Group>
            <Form.Group className="mb-2">
              <Form.Label>Điện thoại *</Form.Label>
              <Form.Control
                name="phone"
                value={customer.phone}
                onChange={handleChange}
                required
              />
            </Form.Group>
            <Form.Group className="mb-2">
              <Form.Label>Địa chỉ</Form.Label>
              <Form.Control
                name="address"
                value={customer.address}
                onChange={handleChange}
              />
            </Form.Group>
            <Form.Group className="mb-2">
              <Form.Label>Tags</Form.Label>
              <Form.Control
                name="tags"
                value={customer.tags}
                onChange={handleChange}
                placeholder="phân cách dấu phẩy (VIP,thường...)"
              />
            </Form.Group>
            <Form.Group className="mb-2">
              <Form.Label>Nhóm</Form.Label>
              <Form.Select
                name="groupId"
                value={customer.groupId || ""}
                onChange={handleChange}
              >
                <option value="">-- Không nhóm --</option>
                {groups.map(g =>
                  <option value={g.id} key={g.id}>{g.name}</option>
                )}
              </Form.Select>
            </Form.Group>
            <Form.Group className="mb-2">
              <Form.Label>Ghi chú</Form.Label>
              <Form.Control
                as="textarea"
                name="notes"
                value={customer.notes}
                onChange={handleChange}
                rows={2}
              />
            </Form.Group>
          </Col>
        </Row>
        <div className="mt-3">
          <Button type="submit" variant="success" disabled={saving}>
            {saving ? "Đang lưu..." : "Thêm mới"}
          </Button>
          <Button variant="secondary" className="ms-2" onClick={() => navigate("/admin/customers")}>
            Quay lại
          </Button>
        </div>
      </Form>
      <ToastContainer position="top-center" autoClose={2000} />
    </div>
  );
}
