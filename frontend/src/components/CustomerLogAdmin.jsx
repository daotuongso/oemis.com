import React, { useState, useEffect } from "react";
import { api } from '../api/api';
import { Button, Form, ListGroup, Modal, Spinner } from "react-bootstrap";
import { useParams } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function CustomerLogAdmin() {
  const { id: customerId } = useParams();
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(false);
  const [logContent, setLogContent] = useState("");
  const [saving, setSaving] = useState(false);
  const [delId, setDelId] = useState(null);
  const [showDel, setShowDel] = useState(false);

  // Load logs
  const fetchLogs = async () => {
    setLoading(true);
    try {
      const res = await api.get(`/api/customers/${customerId}/logs`);
      setLogs(
        (res.data || []).sort(
          (a, b) => new Date(b.dateCreated) - new Date(a.dateCreated)
        )
      );
    } catch (err) {
      toast.error("Không thể tải log chăm sóc!");
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchLogs();
    // eslint-disable-next-line
  }, [customerId]);

  // Thêm log mới
  const handleAdd = async (e) => {
    e.preventDefault();
    if (!logContent.trim()) {
      toast.warn("Nội dung log không được để trống!");
      return;
    }
    setSaving(true);
    try {
      await api.post(`/api/customers/${customerId}/logs`, {
        content: logContent,
      });
      setLogContent("");
      toast.success("Đã thêm log chăm sóc!");
      fetchLogs();
    } catch (err) {
      toast.error("Không thể thêm log!");
    }
    setSaving(false);
  };

  // Xoá log
  const handleShowDel = (id) => {
    setDelId(id);
    setShowDel(true);
  };
  const handleCloseDel = () => setShowDel(false);

  const handleDelete = async () => {
    try {
      await api.delete(`/api/customers/logs/${delId}`);
      toast.success("Đã xoá log!");
      fetchLogs();
    } catch {
      toast.error("Không thể xoá log!");
    }
    setShowDel(false);
  };

  return (
    <div className="container py-3">
      <h5>Lịch sử chăm sóc khách hàng</h5>
      <Form onSubmit={handleAdd} className="mb-3">
        <Form.Group>
          <Form.Label>Thêm ghi chú chăm sóc</Form.Label>
          <Form.Control
            as="textarea"
            rows={2}
            value={logContent}
            onChange={(e) => setLogContent(e.target.value)}
            placeholder="Nhập nội dung chăm sóc, nhắc nhở, tư vấn, v.v..."
          />
        </Form.Group>
        <Button
          type="submit"
          variant="success"
          className="mt-2"
          disabled={saving}
        >
          {saving ? "Đang lưu..." : "Thêm log"}
        </Button>
      </Form>

      <h6 className="mt-4 mb-2">Timeline log</h6>
      {loading ? (
        <div className="text-center my-3">
          <Spinner animation="border" size="sm" /> Đang tải...
        </div>
      ) : logs.length === 0 ? (
        <div className="text-center text-muted">Chưa có log chăm sóc nào.</div>
      ) : (
        <ListGroup>
          {logs.map((log) => (
            <ListGroup.Item key={log.id}>
              <div className="d-flex justify-content-between align-items-start">
                <div>
                  <b>{new Date(log.dateCreated).toLocaleString()}</b>
                  <div>{log.content}</div>
                </div>
                <Button
                  variant="outline-danger"
                  size="sm"
                  onClick={() => handleShowDel(log.id)}
                >
                  Xoá
                </Button>
              </div>
            </ListGroup.Item>
          ))}
        </ListGroup>
      )}

      {/* Modal xác nhận xoá */}
      <Modal show={showDel} onHide={handleCloseDel} centered>
        <Modal.Header closeButton>
          <Modal.Title>Xác nhận xoá</Modal.Title>
        </Modal.Header>
        <Modal.Body>Bạn chắc chắn muốn xoá log này?</Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleCloseDel}>
            Hủy
          </Button>
          <Button variant="danger" onClick={handleDelete}>
            Xoá
          </Button>
        </Modal.Footer>
      </Modal>
      <ToastContainer position="top-center" autoClose={1800} />
    </div>
  );
}
