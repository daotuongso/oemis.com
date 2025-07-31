import React from "react";
import { Badge, Button } from "react-bootstrap";
import { useCart } from "../contexts/CartContext";

export default function ProductCard({ product }) {
  const { addToCart } = useCart();
  const soldOut = product.inStock === 0;

  return (
    <div className="card h-100 position-relative shadow-sm">
      {product.imageUrl && (
        <img
          src={product.imageUrl}
          alt={product.name}
          className="card-img-top"
          style={{ height: 200, objectFit: "cover" }}
        />
      )}

      {/* nút + giỏ */}
      <Button
        size="sm"
        variant="success"
        className="position-absolute top-0 end-0 m-2"
        disabled={soldOut}
        onClick={() => addToCart(product, 1)}
      >
        +
      </Button>

      <div className="card-body d-flex flex-column">
        <h6 className="card-title">{product.name}</h6>
        <p className="card-text text-muted flex-grow-1">
          {product.description}
        </p>

        {/* tồn kho */}
        <p className="small mb-1">
          Còn:{" "}
          {soldOut ? (
            <span className="text-danger">Hết</span>
          ) : (
            <span className="fw-semibold">{product.inStock}</span>
          )}
        </p>

        {/* badge hết hàng */}
        {soldOut && (
          <Badge bg="secondary" className="mb-2">
            Hết hàng
          </Badge>
        )}

        <span className="fw-bold fs-6">
          {product.price.toLocaleString("vi-VN")}₫
        </span>
      </div>
    </div>
  );
}
