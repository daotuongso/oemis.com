import React, { useEffect, useState } from "react";
import { api } from "../api/api";
import { Table, Spinner, Alert, Badge, Button } from "react-bootstrap";
import { Link } from "react-router-dom";
import dayjs from "dayjs";

/* màu badge trạng thái */
const color = (s) =>
  ({
    Pending: "secondary",
    Confirmed: "info",
    Packing: "warning",
    Shipped: "primary",
    Delivered: "success",
    Cancelled: "danger",
  }[s] || "secondary");

export default function OrderListAdmin() {
  const [orders, setOrders]   = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError]     = useState("");

  useEffect(() => {
    api
      .get("/api/orders")
      .then((r) => setOrders(r.data))
      .catch(() => setError("Không lấy được danh sách đơn"))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <Spinner />;
  if (error)   return <Alert variant="danger">{error}</Alert>;

  return (
    <div className="container my-4">
      <h4>Quản lý đơn hàng</h4>

      <Table hover responsive>
        <thead>
          <tr>
            <th>#</th>
            <th>Khách</th>
            <th>Ngày</th>
            <th>Tổng (đ)</th>
            <th>Trạng thái</th>
            <th>Thanh toán</th>
            <th></th> {/* cột mới */}
          </tr>
        </thead>
        <tbody>
          {orders.map((o) => (
            <tr key={o.id}>
              <td>{o.id}</td>
              <td>{o.customerName}</td>
              <td>{dayjs(o.createdAt).format("DD/MM/YYYY")}</td>
              <td>{o.total.toLocaleString("vi-VN")}</td>
              <td>
                <Badge bg={color(o.status)}>{o.status}</Badge>
              </td>
              <td>
                <Badge
                  bg={o.paymentStatus === "Paid" ? "success" : "secondary"}
                >
                  {o.paymentStatus}
                </Badge>
              </td>
              <td>
                <Button
                  as={Link}
                  to={`/admin/orders/${o.id}`}
                  size="sm"
                  variant="outline-primary"
                >
                  Chi tiết
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>
    </div>
  );
}
