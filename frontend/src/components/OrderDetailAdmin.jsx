import React, { useEffect, useState } from "react";
import { api } from "../api/api";
import { useParams } from "react-router-dom";
import {
  Spinner, Alert, Badge, Button, Form, Table, Row, Col,
} from "react-bootstrap";
import dayjs from "dayjs";

const STATUS = ["Pending","Confirmed","Packing","Shipped","Delivered","Cancelled"];

export default function OrderDetailAdmin() {
  const { id } = useParams();
  const [order, setOrder]   = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving,  setSaving]  = useState(false);
  const [error,   setError]   = useState("");

  /* tải đơn */
  useEffect(() => {
    api.get(`/api/orders/${id}`)
       .then(r => setOrder(r.data))
       .catch(() => setError("Không tìm thấy đơn"))
       .finally(() => setLoading(false));
  }, [id]);

  /* đổi trạng thái */
  const updateStatus = async (status) => {
    setSaving(true);
    await api.patch(`/api/orders/${id}/status`, JSON.stringify(status), {
      headers: { "Content-Type": "application/json" },
    });
    setOrder(o => ({ ...o, status }));
    setSaving(false);
  };

  /* đánh dấu đã thanh toán */
  const markPaid = async () => {
    setSaving(true);
    await api.patch(`/api/orders/${id}/pay`);
    setOrder(o => ({ ...o, paymentStatus: "Paid" }));
    setSaving(false);
  };

  /* lưu tracking */
  const saveTracking = async () => {
    setSaving(true);
    /*await api.put(`/api/orders/${id}`, { trackingCode: order.trackingCode });*/
    setSaving(false);
  };

  if (loading) return <Spinner />;
  if (error || !order) return <Alert variant="danger">{error}</Alert>;

  return (
    <div className="container my-4">
      <h4>
        Đơn #{order.id} –{" "}
        <Badge bg={order.paymentStatus === "Paid" ? "success" : "secondary"}>
          {order.paymentStatus}
        </Badge>
      </h4>
      <p>
        Ngày đặt: {dayjs(order.createdAt).format("DD/MM/YYYY")} | Trạng thái:{" "}
        <Badge bg="info">{order.status}</Badge>
      </p>

      {/* trạng thái + paid */}
      <Row className="mb-3">
        <Col md="4">
          <Form.Select
            disabled={saving}
            value={order.status}
            onChange={(e) => updateStatus(e.target.value)}
          >
            {STATUS.map((s) => (
              <option key={s}>{s}</option>
            ))}
          </Form.Select>
        </Col>
        <Col md="auto">
          <Button
            variant="success"
            disabled={saving || order.paymentStatus === "Paid"}
            onClick={markPaid}
          >
            Đánh dấu đã thanh toán
          </Button>
        </Col>
      </Row>

      {/* tracking */}
      <Row className="mb-4">
        <Col md="4">
          <Form.Control
            placeholder="Mã vận đơn"
            value={order.trackingCode || ""}
            onChange={(e) =>
              setOrder((o) => ({ ...o, trackingCode: e.target.value }))
            }
          />
        </Col>
        <Col md="auto">
          <Button disabled={saving} onClick={saveTracking}>
            Lưu mã
          </Button>
        </Col>
      </Row>

      {/* items */}
      <Table bordered>
        <thead>
          <tr>
            <th>Sản phẩm</th>
            <th>Số lượng</th>
            <th>Giá</th>
          </tr>
        </thead>
        <tbody>
          {order.items.map((i, idx) => (
            <tr key={idx}>
              <td>{i.productName}</td>
              <td>{i.quantity}</td>
              <td>{i.unitPrice.toLocaleString("vi-VN")}</td>
            </tr>
          ))}
        </tbody>
        <tfoot>
          <tr>
            <td colSpan="2" className="text-end fw-bold">Tổng</td>
            <td className="fw-bold">
              {order.total.toLocaleString("vi-VN")}
            </td>
          </tr>
        </tfoot>
      </Table>
    </div>
  );
}
