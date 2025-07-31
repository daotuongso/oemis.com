import React, { useState, useEffect } from 'react';
import { api } from '../api/api';
import { Link } from 'react-router-dom';

export default function ProductListAdmin() {
  const [products, setProducts] = useState([]);

  const fetchData = () => {
    api.get('/api/products')
      .then(res => setProducts(res.data))
      .catch(err => {
        console.error('Lỗi tải sản phẩm:', err);
        alert('Không thể tải danh sách sản phẩm');
      });
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleDelete = id => {
    if (!window.confirm('Xác nhận xoá sản phẩm?')) return;
    api.delete(`/api/products/${id}`)
      .then(() => fetchData())
      .catch(err => {
        console.error('Lỗi xoá sản phẩm:', err);
        alert('Xoá không thành công');
      });
  };

  return (
    <>
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2>Quản lý sản phẩm</h2>
        <Link to="/admin/products/new" className="btn btn-success">
          Thêm sản phẩm
        </Link>
      </div>

      <table className="table table-striped">
        <thead>
          <tr>
            <th style={{ width: '5%' }}>ID</th>
            <th style={{ width: '30%' }}>Tên</th>
            <th style={{ width: '20%' }}>Giá</th>
            <th style={{ width: '20%' }}>Ảnh</th>
            <th style={{ width: '25%' }}>Hành động</th>
          </tr>
        </thead>
        <tbody>
          {products.length > 0 ? (
            products.map(p => (
              <tr key={p.id}>
                <td>{p.id}</td>
                <td>{p.name}</td>
                <td>{p.price.toLocaleString()}₫</td>
                <td>
                  <img
                    src={p.imageUrl}
                    alt={p.name}
                    style={{ height: '50px', objectFit: 'cover' }}
                  />
                </td>
                <td>
                  <Link
                    to={`/admin/products/${p.id}/edit`}
                    className="btn btn-sm btn-primary me-2"
                  >
                    Sửa
                  </Link>
                  <button
                    className="btn btn-sm btn-danger"
                    onClick={() => handleDelete(p.id)}
                  >
                    Xoá
                  </button>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="5" className="text-center">
                Chưa có sản phẩm nào
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </>
  );
}
