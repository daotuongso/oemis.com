import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { api } from "../api/api";
import { Form, Button, Badge, Spinner, Alert } from "react-bootstrap";

/* Danh sách role hợp lệ phải khớp với DbInitializer */
const ALL_ROLES = [
  "Admin",
  "Warehouse",
  "Purchasing",
  "Accountant",
  "Sales",
  "Customer",
];

export default function UserDetailAdmin() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [user,   setUser]   = useState(null);
  const [saving, setSaving] = useState(false);
  const [error,  setError]  = useState("");

  /* tải chi tiết user */
  useEffect(() => {
    api.get(`/api/users/${id}`)
       .then(res => setUser(res.data))
       .catch(() => setError("Không tải được dữ liệu người dùng!"));
  }, [id]);

  if (error) return <Alert variant="danger">{error}</Alert>;
  if (!user) return <Spinner animation="border" />;

  /* đổi vai trò */
  const handleChangeRole = async e => {
    const newRole = e.target.value;
    setSaving(true);
    try {
      await api.put(`/api/users/${id}/roles`, { roles: [newRole] });
      setUser(u => ({ ...u, roles: [newRole] }));
    } catch (err) {
      alert(err.response?.data?.detail || "Đổi vai trò thất bại!");
    } finally {
      setSaving(false);
    }
  };

  /* khóa / mở khóa */
  const toggleLock = async () => {
    setSaving(true);
    try {
      await api.patch(`/api/users/${id}/${user.isLocked ? "unlock" : "lock"}`);
      setUser(u => ({ ...u, isLocked: !u.isLocked }));
    } catch {
      alert("Thao tác thất bại!");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="container my-4" style={{ maxWidth: 600 }}>
      <h3 className="mb-4">Chi tiết người dùng</h3>

      <p><strong>Email:</strong> {user.email}</p>

      <Form.Group className="mb-3">
        <Form.Label>Vai trò:</Form.Label>
        <Form.Select
          value={user.roles[0] || ""}
          onChange={handleChangeRole}
          disabled={saving}
        >
          {ALL_ROLES.map(r => (
            <option key={r} value={r}>{r}</option> 
          ))}
        </Form.Select>
      </Form.Group>

      <p>
        Trạng thái:&nbsp;
        {user.isLocked
          ? <Badge bg="danger">Đã khóa</Badge>
          : <Badge bg="success">Hoạt động</Badge>}
      </p>

      <Button
        variant={user.isLocked ? "success" : "danger"}
        className="me-2"
        onClick={toggleLock}
        disabled={saving}
      >
        {user.isLocked ? "Mở khóa" : "Khóa"}
      </Button>

      <Button variant="secondary" onClick={() => navigate(-1)} disabled={saving}>
        Quay lại
      </Button>
    </div>
  );
}
