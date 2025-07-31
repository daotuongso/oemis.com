import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { api } from '../api/api';
import { toast } from 'react-toastify';
import { useAuth } from '../contexts/AuthContext';

export default function RegisterPage() {
  const nav = useNavigate();
  const { setToken } = useAuth?.() || {}; // chỉ nếu bạn export setToken, không thì bỏ dòng này
  const [form, setForm] = useState({ email: '', password: '' });
  const [loading, setLoading] = useState(false);

  const handleChange = e => {
    setForm(f => ({ ...f, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async e => {
    e.preventDefault();
    if (!form.email) {
      toast.error('Vui lòng nhập email!');
      return;
    }
    if (!form.password) {
      toast.error('Vui lòng nhập mật khẩu!');
      return;
    }
    setLoading(true);
    try {
      const res = await api.post('/api/auth/register', {
        Email: form.email,
        Password: form.password
      });
      if (res.data.token) {
        // Nếu AuthContext export setToken thì gọi dòng này, nếu không chỉ lưu localStorage
        if (setToken) setToken(res.data.token);
        localStorage.setItem('token', res.data.token);
        toast.success('Đăng ký thành công!');
        nav('/cart');
      } else {
        nav('/login');
      }
    } catch (e) {
      toast.error(
        e.response?.data?.detail ||
        e.response?.data?.errors?.Email?.[0] ||
        e.response?.data?.errors?.Password?.[0] ||
        'Đăng ký thất bại!'
      );
    }
    setLoading(false);
  };

  return (
    <div className="container" style={{ maxWidth: 400 }}>
      <h2 className="mb-4">Đăng ký</h2>
      <form onSubmit={handleSubmit}>
        <div className="mb-3">
          <label>Email</label>
          <input
            name="email"
            type="email"
            className="form-control"
            value={form.email}
            onChange={handleChange}
            autoFocus
            autoComplete="username"
            disabled={loading}
          />
        </div>
        <div className="mb-3">
          <label>Mật khẩu</label>
          <input
            name="password"
            type="password"
            className="form-control"
            value={form.password}
            onChange={handleChange}
            autoComplete="new-password"
            disabled={loading}
          />
        </div>
        <button
          type="submit"
          className="btn btn-primary w-100"
          disabled={loading}
        >
          {loading ? 'Đang đăng ký...' : 'Đăng ký'}
        </button>
      </form>
    </div>
  );
}
