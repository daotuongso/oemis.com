import React from 'react';
import { Link } from 'react-router-dom';

export default function Hero() {
  return (
    <div className="bg-light text-center py-5" data-aos="fade-up">
      <h1 className="display-4 fw-bold">Lan Hồ Điệp Cao Cấp</h1>
      <p className="lead">Giao toàn quốc, bảo hành nở hoa 7&nbsp;ngày</p>
      <Link to="/#shop" className="btn btn-primary btn-lg px-4">Mua ngay</Link>
    </div>
  );
}
