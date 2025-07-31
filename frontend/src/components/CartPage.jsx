import React from 'react';
import { useCart } from '../contexts/CartContext';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import ProductCard from './ProductCard';

export default function CartPage() {
  const { cart, removeFromCart, updateQuantity } = useCart();
  const { token } = useAuth();
  const navigate = useNavigate();

  // TÍNH TỔNG TIỀN
  const total = cart.items.reduce((sum, item) => sum + item.price * item.quantity, 0);

  const handleCheckout = () => {
    if (!token) {
      navigate('/login', { state: { from: '/cart' } });
    } else {
      // Chuyển sang trang checkout (xác nhận đặt hàng)
      navigate('/checkout');
    }
  };

  if (cart.items.length === 0)
    return <div className="alert alert-info">Giỏ hàng của bạn đang trống.</div>;

  return (
    <div>
      <h3>Giỏ hàng</h3>
      <table className="table">
        <thead>
          <tr>
            <th>Sản phẩm</th>
            <th>Giá</th>
            <th>Số lượng</th>
            <th>Tổng</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          {cart.items.map(item => (
            <tr key={item.id}>
              <td><ProductCard product={item} minimal /></td>
              <td>{item.price.toLocaleString()}₫</td>
              <td>
                <input type="number" min={1} value={item.quantity}
                  onChange={e => updateQuantity(item.id, Number(e.target.value))}
                  style={{ width: 60 }} />
              </td>
              <td>{(item.price * item.quantity).toLocaleString()}₫</td>
              <td>
                <button className="btn btn-sm btn-danger"
                  onClick={() => removeFromCart(item.id)}>
                  Xóa
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <h4>Tổng cộng: {total.toLocaleString()}₫</h4>
      <button className="btn btn-primary" onClick={handleCheckout}>Thanh toán</button>
    </div>
  );
}
