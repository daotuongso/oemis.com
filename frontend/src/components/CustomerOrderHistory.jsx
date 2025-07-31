import React, { useEffect, useState } from "react";
import { api } from '../api/api';
import { Table, Spinner } from "react-bootstrap";

export default function CustomerOrderHistory({ email }) {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!email) return;
    setLoading(true);
    api.get('/api/orders/my')
      .then(res => setOrders(res.data))
      .finally(() => setLoading(false));
  }, [email]);

  if (!email) return <p>Không có lịch sử đơn hàng.</p>;

  return (
    <div className="my-4">
      <h6>Lịch sử đơn hàng</h6>
      {loading ? (
        <Spinner animation="border" size="sm" />
      ) : orders.length === 0 ? (
        <div>Chưa có đơn hàng nào.</div>
      ) : (
        <Table striped bordered size="sm">
          <thead>
            <tr>
              <th>Mã đơn</th>
              <th>Ngày tạo</th>
              <th>Người nhận</th>
              <th>Địa chỉ</th>
              {/* Thêm các trường khác nếu muốn */}
            </tr>
          </thead>
          <tbody>
            {orders.map(o => (
              <tr key={o.id}>
                <td>{o.id}</td>
                <td>{o.createdAt && o.createdAt.substring(0,10)}</td>
                <td>{o.customerName}</td>
                <td>{o.customerAddress}</td>
              </tr>
            ))}
          </tbody>
        </Table>
      )}
    </div>
  );
}
