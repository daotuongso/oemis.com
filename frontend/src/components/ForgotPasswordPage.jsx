// src/components/ForgotPasswordPage.jsx
import React, { useState } from 'react';
import { api } from '../api/api';
import { Form, Button, Alert, Spinner } from 'react-bootstrap';

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [sent, setSent] = useState(false);
  const [err, setErr] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async e => {
    e.preventDefault();
    setLoading(true); setErr('');
    try {
      await api.post('/api/auth/forgot-password', { email });
      setSent(true);
    } catch {
      setErr('Không gửi được email!');
    }
    setLoading(false);
  };

  return (
    <div className="mx-auto" style={{maxWidth: 420, marginTop: 40}}>
      <h4>Quên mật khẩu?</h4>
      {sent
        ? <Alert variant="success">Đã gửi link đặt lại mật khẩu tới email. Vui lòng kiểm tra hộp thư!</Alert>
        : <Form onSubmit={handleSubmit}>
            <Form.Group>
              <Form.Label>Email</Form.Label>
              <Form.Control
                type="email"
                required
                value={email}
                onChange={e => setEmail(e.target.value)}
                autoFocus
              />
            </Form.Group>
            <Button type="submit" className="mt-3" disabled={loading}>
              {loading ? <Spinner size="sm" /> : "Gửi link đặt lại mật khẩu"}
            </Button>
            {err && <Alert variant="danger" className="mt-2">{err}</Alert>}
          </Form>
      }
    </div>
  );
}
