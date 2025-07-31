// src/components/ResetPasswordPage.jsx
import React, { useState } from 'react';
import { api } from '../api/api';
import { useSearchParams } from 'react-router-dom';
import { Form, Button, Alert, Spinner } from 'react-bootstrap';

export default function ResetPasswordPage() {
  const [params] = useSearchParams();
  const email = params.get('email') || '';
  const token = params.get('token') || '';
  const [pw, setPw] = useState('');
  const [done, setDone] = useState(false);
  const [err, setErr] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async e => {
    e.preventDefault();
    setLoading(true); setErr('');
    try {
      await api.post('/api/auth/reset-password', { email, token, newPassword: pw });
      setDone(true);
    } catch (e) {
      setErr('Không đặt lại được mật khẩu! Token đã hết hạn hoặc có lỗi khác.');
    }
    setLoading(false);
  };

  if (!email || !token) return <Alert variant="danger">Link đặt lại mật khẩu không hợp lệ!</Alert>;

  return (
    <div className="mx-auto" style={{maxWidth: 420, marginTop: 40}}>
      <h4>Đặt lại mật khẩu mới</h4>
      {done
        ? <Alert variant="success">Bạn đã đổi mật khẩu thành công! Hãy <a href="/login">đăng nhập lại</a>.</Alert>
        : <Form onSubmit={handleSubmit}>
            <Form.Group>
              <Form.Label>Mật khẩu mới</Form.Label>
              <Form.Control
                type="password"
                required
                minLength={6}
                value={pw}
                onChange={e => setPw(e.target.value)}
                autoFocus
              />
            </Form.Group>
            <Button type="submit" className="mt-3" disabled={loading}>
              {loading ? <Spinner size="sm" /> : "Đặt lại mật khẩu"}
            </Button>
            {err && <Alert variant="danger" className="mt-2">{err}</Alert>}
          </Form>
      }
    </div>
  );
}
