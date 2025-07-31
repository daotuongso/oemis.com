// File: src/components/CategoryForm.jsx

import React, { useState, useEffect } from 'react';
import { api } from '../api/api';
import { useNavigate, useParams } from 'react-router-dom';

export default function CategoryForm() {
  const { id } = useParams();
  const isEdit = Boolean(id);
  const navigate = useNavigate();
  const [name, setName] = useState('');

  useEffect(() => {
    if (!isEdit) return;

    // Định nghĩa async function bên trong effect
    const fetchCategory = async () => {
      try {
        const res = await api.get(`/api/categories/${id}`);
        setName(res.data.name);
      } catch {
        alert('Không tìm thấy danh mục');
        navigate('/admin/categories', { replace: true });
      }
    };

    // Gọi ngay
    fetchCategory();
  }, [isEdit, id, navigate]);

  const handleSubmit = async e => {
    e.preventDefault();

    const dto = isEdit
      ? { id: Number(id), name }
      : { name };

    try {
      if (isEdit) {
        await api.put(`/api/categories/${id}`, dto);
      } else {
        await api.post('/api/categories', dto);
      }
      navigate('/admin/categories');
    } catch {
      alert('Lỗi khi lưu danh mục');
    }
  };

  return (
    <div className="card mx-auto" style={{ maxWidth: '500px' }}>
      <div className="card-body">
        <h5 className="card-title">
          {isEdit ? 'Chỉnh sửa' : 'Thêm mới'} danh mục
        </h5>
        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label className="form-label">Tên danh mục</label>
            <input
              type="text"
              className="form-control"
              value={name}
              onChange={e => setName(e.target.value)}
              required
            />
          </div>
          <button type="submit" className="btn btn-primary">
            {isEdit ? 'Cập nhật' : 'Thêm'}
          </button>
          <button
            type="button"
            className="btn btn-secondary ms-2"
            onClick={() => navigate('/admin/categories')}
          >
            Huỷ
          </button>
        </form>
      </div>
    </div>
  );
}
