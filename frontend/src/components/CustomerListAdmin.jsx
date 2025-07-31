import React, { useEffect, useState } from "react";
import { api } from '../api/api';
import { Table, Button, InputGroup, FormControl, Spinner, Modal } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function CustomerListAdmin() {
  const [list, setList] = useState([]);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState("");
  const [showDel, setShowDel] = useState(false);
  const [delId, setDelId] = useState(null);
  const navigate = useNavigate();

  // Load dữ liệu
  const fetchData = async () => {
    setLoading(true);
    try {
      const res = await api.get("/api/customers", {
        params: search ? { search } : {},
      });
      setList(res.data);
    } catch (e) {
      toast.error("Không thể tải dữ liệu khách hàng!");
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchData();
    // eslint-disable-next-line
  }, []);

  // Tìm kiếm khi nhấn Enter hoặc nút search
  const handleSearch = (e) => {
    e.preventDefault();
    fetchData();
  };

  // Xem/sửa chi tiết
  const handleDetail = (id) => {
    navigate(`/admin/customers/${id}`);
  };

  // Thêm mới
  const handleAdd = () => {
    navigate('/admin/customers/new');
  };

  // Xác nhận xóa
  const handleShowDel = (id) => {
    setDelId(id);
    setShowDel(true);
  };
  const handleCloseDel = () => setShowDel(false);

  // Xóa khách hàng
  const handleDelete = async () => {
    try {
      await api.delete(`/api/customers/${delId}`);
      toast.success("Đã xóa khách hàng!");
      fetchData();
    } catch (e) {
      toast.error("Không thể xóa khách hàng!");
    }
    setShowDel(false);
  };

  return (
    <div className="container py-3">
      <h4>Danh sách khách hàng</h4>
      <form className="mb-2" onSubmit={handleSearch}>
        <InputGroup>
          <FormControl
            placeholder="Tìm kiếm theo tên, email, SĐT..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <Button type="submit" variant="primary">Tìm kiếm</Button>
          <Button variant="success" className="ms-2" onClick={handleAdd}>
            Thêm khách hàng
          </Button>
        </InputGroup>
      </form>

      <Table striped bordered hover size="sm" responsive>
        <thead>
          <tr>
            <th>#</th>
            <th>Họ tên</th>
            <th>Email</th>
            <th>Phone</th>
            <th>Địa chỉ</th>
            <th>Nhóm</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          {loading ? (
            <tr>
              <td colSpan={7} className="text-center">
                <Spinner animation="border" size="sm" /> Đang tải...
              </td>
            </tr>
          ) : list.length === 0 ? (
            <tr>
              <td colSpan={7} className="text-center">Không có dữ liệu</td>
            </tr>
          ) : (
            list.map((c, i) => (
              <tr key={c.id}>
                <td>{i + 1}</td>
                <td>{c.fullName}</td>
                <td>{c.email}</td>
                <td>{c.phone}</td>
                <td>{c.address}</td>
                <td>{c.group ? c.group.name : ''}</td>
                <td>
                  <Button
                    variant="outline-primary"
                    size="sm"
                    className="me-2"
                    onClick={() => handleDetail(c.id)}
                  >
                    Xem/Sửa
                  </Button>
                  <Button
                    variant="outline-danger"
                    size="sm"
                    onClick={() => handleShowDel(c.id)}
                  >
                    Xóa
                  </Button>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </Table>

      {/* Modal xác nhận xóa */}
      <Modal show={showDel} onHide={handleCloseDel} centered>
        <Modal.Header closeButton>
          <Modal.Title>Xác nhận xóa</Modal.Title>
        </Modal.Header>
        <Modal.Body>Bạn chắc chắn muốn xóa khách hàng này?</Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleCloseDel}>
            Hủy
          </Button>
          <Button variant="danger" onClick={handleDelete}>
            Xóa
          </Button>
        </Modal.Footer>
      </Modal>

      <ToastContainer position="top-center" autoClose={2000} />
    </div>
  );
}
