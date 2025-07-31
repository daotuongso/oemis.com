import React, { useEffect, useState } from "react";
import { api } from "../api/api";
import { Table, Spinner, Alert, Badge, Button } from "react-bootstrap";
import StockAdjustModal from "../components/StockAdjustModal";

export default function WarehouseListAdmin() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading]   = useState(true);
  const [error, setError]       = useState("");
  const [modal, setModal]       = useState({ show: false, product: null });

  /* fetch products + stock */
  useEffect(() => {
    const load = async () => {
      try {
        const res = await api.get("/api/products");
        const list = res.data;

        // fetch stock in parallel
        const withStock = await Promise.all(
          list.map(async (p) => {
            const s = await api.get(`/api/stock/${p.id}`);
            return { ...p, inStock: s.data };
          })
        );
        setProducts(withStock);
      } catch {
        setError("Lỗi lấy dữ liệu kho.");
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [modal.show]);  // reload sau khi điều chỉnh

  if (loading) return <Spinner />;
  if (error)   return <Alert variant="danger">{error}</Alert>;

  return (
    <div className="container my-4">
      <h4>Kho hàng – Kho Tổng</h4>

      <Table hover responsive>
        <thead>
          <tr>
            <th>#</th>
            <th>Sản phẩm</th>
            <th>Còn bán</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          {products.map((p) => (
            <tr key={p.id}>
              <td>{p.id}</td>
              <td>{p.name}</td>
              <td>
                {p.inStock > 10 ? (
                  p.inStock
                ) : (
                  <Badge bg="danger">{p.inStock}</Badge>
                )}
              </td>
              <td>
                <Button
                  size="sm"
                  variant="outline-primary"
                  onClick={() => setModal({ show: true, product: p })}
                >
                  Điều chỉnh
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>

      {modal.show && (
        <StockAdjustModal
          show={modal.show}
          product={modal.product}
          onHide={() => setModal({ show: false, product: null })}
        />
      )}
    </div>
  );
}
