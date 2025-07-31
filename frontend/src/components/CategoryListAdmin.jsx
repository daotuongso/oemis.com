// File: src/components/CategoryListAdmin.jsx

import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { api } from '../api/api';

export default function CategoryListAdmin() {
  const [cats, setCats] = useState([]);
  const navigate = useNavigate();

  // ---------- EFFECT AN TOÀN ----------
  useEffect(() => {
    let isMounted = true;         // flag để tránh setState khi component đã unmount

    async function fetchCategories() {
      try {
        const res = await api.get('/api/categories');
        if (isMounted) setCats(res.data);
      } catch {
        alert('Không tải được danh mục');
      }
    }

    fetchCategories();

    // cleanup chỉ return hàm
    return () => {
      isMounted = false;
    };
  }, []); // chỉ chạy một lần

  const refresh = () => {
    api.get('/api/categories')
       .then(res => setCats(res.data))
       .catch(() => alert('Không tải được danh mục'));
  };

  const onDelete = async id => {
    if (!window.confirm('Xác nhận xoá?')) return;
    try {
      await api.delete(`/api/categories/${id}`);
      refresh();
    } catch {
      alert('Xoá thất bại');
    }
  };

  return (
    <div>
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h3>Quản lý danh mục</h3>
        <button
          className="btn btn-primary"
          onClick={() => navigate('/admin/categories/new')}
        >
          Thêm danh mục
        </button>
      </div>

      <table className="table table-bordered">
        <thead>
          <tr>
            <th style={{ width: '80px' }}>ID</th>
            <th>Tên danh mục</th>
            <th style={{ width: '150px' }}>Hành động</th>
          </tr>
        </thead>
        <tbody>
          {cats.map(c => (
            <tr key={c.id}>
              <td>{c.id}</td>
              <td>{c.name}</td>
              <td>
                <button
                  className="btn btn-sm btn-info me-2"
                  onClick={() => navigate(`/admin/categories/${c.id}/edit`)}
                >
                  Sửa
                </button>
                <button
                  className="btn btn-sm btn-danger"
                  onClick={() => onDelete(c.id)}
                >
                  Xoá
                </button>
              </td>
            </tr>
          ))}
          {cats.length === 0 && (
            <tr>
              <td colSpan="3" className="text-center text-muted">
                Chưa có danh mục nào.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}
