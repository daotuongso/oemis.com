import React, { useState } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { toast } from 'react-toastify';

export default function LoginPage() {
  const nav = useNavigate();
  const location = useLocation();
  const { login } = useAuth();

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
      await login(form.email, form.password);
      toast.success('Đăng nhập thành công!');
      const from = location.state?.from || '/';
      nav(from, { replace: true });
    } catch (e) {
      toast.error(e.response?.data?.detail || 'Đăng nhập thất bại!');
    }
    setLoading(false);
  };

  return (
    <div className="container" style={{ maxWidth: 400 }}>
      <h2 className="mb-4">Đăng nhập</h2>
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
            autoComplete="current-password"
            disabled={loading}
          />
        </div>
        <button
          type="submit"
          className="btn btn-primary w-100"
          disabled={loading}
        >
          {loading ? 'Đang đăng nhập...' : 'Đăng nhập'}
        </button>
        {/* Thêm hai link tiện dụng bên dưới */}
        <div className="d-flex justify-content-between mt-3">
          <Link to="/register">Đăng ký tài khoản mới</Link>
          <Link to="/forgot-password">Quên mật khẩu?</Link>
        </div>
      </form>
    </div>
  );
}
