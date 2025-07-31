// File: src/components/CategoryProductList.jsx

import React, { useEffect, useState } from 'react';
import { api } from '../api/api';
import ProductCard from './ProductCard';
import SearchFilter from './SearchFilter';

export default function CategoryProductList() {
  const [grouped, setGrouped] = useState({});
  const [loading, setLoading] = useState(true);

  // Dùng state lưu bộ filter hiện tại
  const [filter, setFilter] = useState({ search: '', priceMin: '', priceMax: '' });

  useEffect(() => {
    api.get('/api/products')
      .then(res => {
        const groups = res.data.reduce((acc, p) => {
          const cat = p.category?.name || 'Chưa phân loại';
          if (!acc[cat]) acc[cat] = [];
          acc[cat].push(p);
          return acc;
        }, {});
        setGrouped(groups);
      })
      .catch(err => {
        console.error('Lỗi tải sản phẩm:', err);
        alert('Không thể tải sản phẩm');
      })
      .finally(() => setLoading(false));
  }, []);

  // Hàm filter sản phẩm theo tiêu chí
  const filterProducts = (products) => {
    let res = products;
    if (filter.search)
      res = res.filter(
        p => p.name.toLowerCase().includes(filter.search.toLowerCase())
      );
    if (filter.priceMin)
      res = res.filter(p => p.price >= Number(filter.priceMin));
    if (filter.priceMax)
      res = res.filter(p => p.price <= Number(filter.priceMax));
    return res;
  };

  // Handler khi search/filter thay đổi
  const handleSearch = (filterObj) => {
    setFilter(filterObj);
  };

  if (loading) {
    return <p className="text-center text-muted">Đang tải sản phẩm…</p>;
  }

  return (
    <>
      <div className="mb-4">
        <SearchFilter onSearch={handleSearch} />
      </div>
      {Object.entries(grouped).map(([categoryName, products]) => {
        const filtered = filterProducts(products);
        // Không hiển thị group nếu không có sản phẩm phù hợp
        if (filtered.length === 0) return null;
        return (
          <section key={categoryName} className="mb-5">
            <h2 className="mb-3">{categoryName}</h2>
            <div className="row g-4">
              {filtered.map(p => (
                <div key={p.id} className="col-12 col-sm-6 col-md-4 col-lg-3">
                  <ProductCard product={p} />
                </div>
              ))}
            </div>
          </section>
        );
      })}
      {/* Nếu tất cả category đều rỗng (không có sản phẩm phù hợp) */}
      {Object.values(grouped).every(products => filterProducts(products).length === 0) &&
        <div className="alert alert-info text-center">Không tìm thấy sản phẩm phù hợp.</div>
      }
    </>
  );
}
