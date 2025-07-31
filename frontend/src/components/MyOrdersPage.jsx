import React, { useEffect, useState } from "react";
import { api } from "../api/api";
import { Spinner, Alert, Badge, Table } from "react-bootstrap";
import dayjs from "dayjs";

/* màu badge theo trạng thái */
const color = (s) =>
  ({
    Pending: "secondary",
    Confirmed: "info",
    Packing: "warning",
    Shipped: "primary",
    Delivered: "success",
    Cancelled: "danger",
  }[s] || "secondary");

export default function MyOrdersPage() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    api
      .get("/api/orders/my")
      .then((r) => setOrders(r.data))
      .catch(() => setError("Không lấy được đơn"))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <Spinner />;
  if (error) return <Alert variant="danger">{error}</Alert>;
  if (!orders.length)
    return <Alert variant="info">Bạn chưa có đơn hàng nào.</Alert>;

  return (
    <div className="container my-4">
      <h3>Lịch sử đơn hàng</h3>

      {orders.map((o) => (
        <div key={o.id} className="mb-4 border rounded p-3">
          <h5 className="mb-1">
            Đơn #{o.id}{" "}
            <Badge bg={color(o.status)} className="me-1">
              {o.status}
            </Badge>
            <Badge bg={o.paymentStatus === "Paid" ? "success" : "secondary"}>
              {o.paymentStatus}
            </Badge>
          </h5>

          <p className="mb-1">
            Ngày đặt: {dayjs(o.createdAt).format("DD/MM/YYYY")}
          </p>

          {/* --- TIMELINE --- */}
          <ul className="list-inline small mb-2">
            {o.confirmedAt && (
              <li className="list-inline-item">
                Xác nhận: {dayjs(o.confirmedAt).format("DD/MM")}
              </li>
            )}
            {o.shippedAt && (
              <li className="list-inline-item">
                | Gửi: {dayjs(o.shippedAt).format("DD/MM")}
              </li>
            )}
            {o.deliveredAt && (
              <li className="list-inline-item fw-bold text-success">
                | Đã giao: {dayjs(o.deliveredAt).format("DD/MM")}
              </li>
            )}
          </ul>

          {o.trackingCode && (
            <p className="small text-muted">
              Mã vận đơn: <strong>{o.trackingCode}</strong>
            </p>
          )}

          {/* --- ITEMS --- */}
          <Table bordered size="sm">
            <thead>
              <tr>
                <th>Sản phẩm</th>
                <th>Số lượng</th>
                <th>Giá</th>
              </tr>
            </thead>
            <tbody>
              {o.items.map((i, idx) => (
                <tr key={idx}>
                  <td>{i.productName}</td>
                  <td>{i.quantity}</td>
                  <td>{i.unitPrice.toLocaleString("vi-VN")}</td>
                </tr>
              ))}
            </tbody>
            <tfoot>
              <tr>
                <td colSpan="2" className="text-end fw-bold">
                  Tổng
                </td>
                <td className="fw-bold">
                  {o.total.toLocaleString("vi-VN")}
                </td>
              </tr>
            </tfoot>
          </Table>
        </div>
      ))}
    </div>
  );
}
