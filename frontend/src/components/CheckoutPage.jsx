import React, { useState } from 'react';
import { useCart } from '../contexts/CartContext';
import { api } from '../api/api';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';

export default function CheckoutPage() {
  const { cart, clearCart } = useCart();
  const [name, setName] = useState('');
  const [address, setAddress] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async e => {
    e.preventDefault();
    if (!name || !address) {
      toast.error('Vui lòng nhập đầy đủ thông tin giao hàng!');
      return;
    }
    setLoading(true);
    try {
      // GỬI ĐÚNG ĐỊNH DẠNG CHO BACKEND
      await api.post('/api/orders', {
        CustomerName: name,
        CustomerAddress: address,
        Items: cart.items.map(i => ({
          ProductId: i.id,       // ĐÚNG key backend OrderItem yêu cầu
          Quantity: i.quantity,
          UnitPrice: i.price     // Gửi luôn giá (nếu backend dùng)
        }))
      });
      toast.success('Đặt hàng thành công!');
      clearCart();
      navigate('/myorders');
    } catch (err) {
      toast.error('Đặt hàng thất bại!');
    }
    setLoading(false);
  };

  if (cart.items.length === 0)
    return <div className="alert alert-info">Giỏ hàng của bạn đang trống.</div>;

  return (
    <div>
      <h3>Thông tin giao hàng</h3>
      <form onSubmit={handleSubmit} style={{ maxWidth: 400 }}>
        <div className="mb-3">
          <label>Họ tên</label>
          <input className="form-control" value={name} onChange={e => setName(e.target.value)} disabled={loading} />
        </div>
        <div className="mb-3">
          <label>Địa chỉ</label>
          <input className="form-control" value={address} onChange={e => setAddress(e.target.value)} disabled={loading} />
        </div>
        <button className="btn btn-success" type="submit" disabled={loading}>
          {loading ? 'Đang đặt hàng...' : 'Đặt hàng'}
        </button>
      </form>
    </div>
  );
}
