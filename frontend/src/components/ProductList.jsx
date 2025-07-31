import React, { useState, useEffect } from 'react';
import { api } from '../api/api';
import ProductCard from './ProductCard';

export default function ProductList() {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    api.get('/api/products')
      .then(res => setProducts(res.data))
      .catch(err => {
        console.error('Lỗi tải sản phẩm:', err);
        alert('Không thể tải danh sách sản phẩm');
      });
  }, []);

  return (
    <div className="row g-4">
      {products.length > 0 ? (
        products.map(p => (
          <div key={p.id} className="col-12 col-sm-6 col-md-4 col-lg-3">
            <ProductCard product={p} />
          </div>
        ))
      ) : (
        <div className="col-12 text-center">Chưa có sản phẩm nào</div>
      )}
    </div>
  );
}
