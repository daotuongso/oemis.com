import React, { useEffect, useState } from "react";
import { api } from "../api/api";
import { Table, Spinner, Alert } from "react-bootstrap";
import { Link } from "react-router-dom";

export default function UserListAdmin() {
  const [users, setUsers]   = useState([]);
  const [loading, setLoad]  = useState(true);
  const [error, setError]   = useState("");

  /* Lấy danh sách user 1 lần khi mount */
  useEffect(() => {
    api.get("/api/users")
       .then(res => setUsers(res.data))
       .catch(()  => setError("Không thể tải danh sách người dùng!"))
       .finally(() => setLoad(false));
  }, []);

  if (loading) return <Spinner animation="border" />;
  if (error)   return <Alert variant="danger">{error}</Alert>;

  return (
    <div>
      <h3 className="mb-3">Danh sách người dùng</h3>

      <Table striped bordered hover>
        <thead>
          <tr>
            <th>#</th>
            <th>Email</th>
            <th>Roles</th>
            <th>Trạng thái</th>
            <th>Thao tác</th>
          </tr>
        </thead>

        <tbody>
          {users.map((u, idx) => (
            <tr key={u.id}>
              <td>{idx + 1}</td>
              <td>{u.email}</td>

              {/* hiển thị nhiều role nếu có */}
              <td>{Array.isArray(u.roles) ? u.roles.join(", ") : ""}</td>

              <td>
                {u.isLocked
                  ? <span className="badge bg-danger">Đã khóa</span>
                  : <span className="badge bg-success">Hoạt động</span>}
              </td>

              <td>
                {/* Link chỉ chứa id  ⇒  /admin/users/:id  */}
                <Link to={`/admin/users/${u.id}`}>
                  <button className="btn btn-sm btn-outline-primary">
                    Xem
                  </button>
                </Link>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>
    </div>
  );
}
