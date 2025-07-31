import React, { useEffect, useState } from "react";
import { api } from '../api/api';
import { Form, Button, Spinner, Row, Col } from "react-bootstrap";
import { useParams, useNavigate } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import CustomerLogPanel from "./CustomerLogPanel";
import CustomerOrderHistory from "./CustomerOrderHistory";
import "react-toastify/dist/ReactToastify.css";

export default function CustomerDetailAdmin() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [customer, setCustomer] = useState(null);
  const [groups, setGroups] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    // Load thông tin khách
    api.get(`/api/customers/${id}`)
      .then(res => setCustomer(res.data))
      .catch(() => toast.error("Không thể tải dữ liệu khách hàng!"))
      .finally(() => setLoading(false));
    // Load danh sách nhóm
    api.get("/api/customers/groups")
      .then(res => setGroups(res.data))
      .catch(() => setGroups([]));
  }, [id]);

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
      await api.put(`/api/customers/${id}`, customer);
      toast.success("Đã lưu thành công!");
      setTimeout(() => navigate("/admin/customers"), 1500);
    } catch (err) {
      toast.error("Lỗi khi lưu! Email hoặc SĐT có thể đã tồn tại.");
    }
    setSaving(false);
  };

  if (loading) {
    return (
      <div className="text-center mt-4">
        <Spinner animation="border" /> Đang tải dữ liệu...
      </div>
    );
  }
  if (!customer) return <div className="text-danger">Không tìm thấy khách hàng!</div>;

  return (
    <div className="container py-3">
      <h4>Chi tiết/Sửa khách hàng</h4>
      <Form onSubmit={handleSave}>
        <Row>
          <Col md={6}>
            <Form.Group className="mb-2">
              <Form.Label>Họ tên *</Form.Label>
              <Form.Control
                name="fullName"
                value={customer.fullName || ""}
                onChange={handleChange}
                required
              />
            </Form.Group>
            <Form.Group className="mb-2">
              <Form.Label>Email *</Form.Label>
              <Form.Control
                type="email"
                name="email"
                value={customer.email || ""}
                onChange={handleChange}
                required
              />
            </Form.Group>
            <Form.Group className="mb-2">
              <Form.Label>Điện thoại *</Form.Label>
              <Form.Control
                name="phone"
                value={customer.phone || ""}
                onChange={handleChange}
                required
              />
            </Form.Group>
            <Form.Group className="mb-2">
              <Form.Label>Địa chỉ</Form.Label>
              <Form.Control
                name="address"
                value={customer.address || ""}
                onChange={handleChange}
              />
            </Form.Group>
            <Form.Group className="mb-2">
              <Form.Label>Tags</Form.Label>
              <Form.Control
                name="tags"
                value={customer.tags || ""}
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
                value={customer.notes || ""}
                onChange={handleChange}
                rows={2}
              />
            </Form.Group>
          </Col>
        </Row>
        <div className="mt-3">
          <Button type="submit" variant="primary" disabled={saving}>
            {saving ? "Đang lưu..." : "Lưu thay đổi"}
          </Button>
          <Button variant="secondary" className="ms-2" onClick={() => navigate("/admin/customers")}>
            Quay lại
          </Button>
        </div>
      </Form>
      {customer?.id && <CustomerLogPanel customerId={customer.id} />}  
      {customer?.email && (
        <CustomerOrderHistory email={customer.email} />   // 🟥 THÊM DÒNG NÀY
      )}
      <ToastContainer position="top-center" autoClose={2000} />
    </div>
  );
}
