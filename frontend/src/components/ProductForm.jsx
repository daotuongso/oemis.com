// File: src/components/ProductForm.jsx
import React, { useEffect, useState } from 'react';
import { api } from '../api/api';
import { useNavigate, useParams } from 'react-router-dom';

export default function ProductForm() {
  const { id }      = useParams();
  const isEdit      = Boolean(id);
  const navigate    = useNavigate();

  const [cats, setCats] = useState([]);
  const [form, setForm] = useState({
    name:'', description:'', priceRaw:'', priceNum:0,
    categoryId:'', imageFile:null, imageUrl:''
  });

  /* ─── tải danh mục & sản phẩm ─── */
  useEffect(() => {
    api.get('/api/categories').then(r => setCats(r.data));

    if (isEdit) {
      api.get(`/api/products/${id}`).then(r => {
        const p = r.data;
        setForm(f => ({
          ...f,
          name: p.name,
          description: p.description,
          priceNum: p.price,
          priceRaw: p.price.toLocaleString('vi-VN'),
          categoryId: p.categoryId.toString(),
          imageUrl: p.imageUrl
        }));
      });
    }
  }, [isEdit, id]);

  /* ─── helper format VND ─── */
  const fmt = v =>
    v.replace(/\D/g,'').replace(/\B(?=(\d{3})+(?!\d))/g,'.');

  const handleChange = e => {
    const { name, value } = e.target;

    if (name === 'priceRaw') {
      const raw = fmt(value);
      setForm(f => ({ ...f,
        priceRaw: raw,
        priceNum: parseFloat(raw.replace(/\./g,'')) || 0
      }));
    } else {
      setForm(f => ({ ...f, [name]: value }));
    }
  };

  const handleFile = e =>
    setForm(f => ({ ...f, imageFile: e.target.files?.[0] || null }));

  /* ─── submit ─── */
  const handleSubmit = async e => {
    e.preventDefault();

    // kiểm tra client
    if (!form.categoryId) {
      alert('Bạn chưa chọn danh mục'); return;
    }
    if (form.priceNum <= 0) {
      alert('Giá phải lớn hơn 0'); return;
    }

    const data = new FormData();
    data.append('Name',        form.name);
    data.append('Description', form.description);
    data.append('Price',       form.priceNum);          // số sạch
    data.append('CategoryId',  form.categoryId);        // đảm bảo có giá trị
    data.append('ImageUrl',    form.imageUrl);

    if (form.imageFile) data.append('File', form.imageFile);

    try {
      if (isEdit)
        await api.put(`/api/products/${id}`, data);
      else
        await api.post('/api/products', data);

      navigate('/admin/products');
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.detail ?? 'Không lưu được sản phẩm');
    }
  };

  return (
    <div className="card mx-auto" style={{maxWidth:600}}>
      <div className="card-body">
        <h5 className="card-title">{isEdit ? 'Chỉnh sửa':'Thêm mới'} sản phẩm</h5>

        <form onSubmit={handleSubmit}>
          {/* Danh mục */}
          <div className="mb-3">
            <label className="form-label">Danh mục</label>
            <select
              className="form-select"
              name="categoryId"
              value={form.categoryId}
              onChange={handleChange}
              required
            >
              <option value="" disabled>-- Chọn danh mục --</option>
              {cats.map(c => (
                <option key={c.id} value={c.id}>{c.name}</option>
              ))}
            </select>
          </div>

          {/* Tên */}
          <div className="mb-3">
            <label className="form-label">Tên</label>
            <input
              className="form-control"
              name="name"
              value={form.name}
              onChange={handleChange}
              required
            />
          </div>

          {/* Mô tả */}
          <div className="mb-3">
            <label className="form-label">Mô tả</label>
            <textarea
              className="form-control"
              name="description"
              value={form.description}
              onChange={handleChange}
            />
          </div>

          {/* Giá */}
          <div className="mb-3">
            <label className="form-label">Giá (đ)</label>
            <input
              className="form-control"
              name="priceRaw"
              value={form.priceRaw}
              onChange={handleChange}
              required
            />
          </div>

          {/* Ảnh */}
          <div className="mb-3">
            <label className="form-label">Ảnh sản phẩm</label>
            <input type="file" accept="image/*"
                   className="form-control"
                   onChange={handleFile}/>
            {form.imageUrl && (
              <img src={form.imageUrl} alt="preview"
                   className="img-thumbnail mt-2" style={{maxWidth:120}}/>
            )}
          </div>

          <button className="btn btn-primary" type="submit">
            {isEdit ? 'Cập nhật' : 'Thêm'}
          </button>
          <button className="btn btn-secondary ms-2" type="button"
                  onClick={() => navigate('/admin/products')}>
            Huỷ
          </button>
        </form>
      </div>
    </div>
  );
}
