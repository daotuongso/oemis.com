import React, { useState } from "react";

/* -------------------------------------------------- */
/*  Hàm tiện ích định dạng / bỏ định dạng số tiền VN   */
/* -------------------------------------------------- */
const unformat = (txt) => Number(txt.replaceAll(".", ""));
const formatVN = (num) => num.toLocaleString("vi-VN");

export default function SearchFilter({ onSearch, className = "" }) {
  const [search, setSearch] = useState("");
  const [priceMin, setPriceMin] = useState();   // lưu số thuần, KHÔNG format
  const [priceMax, setPriceMax] = useState();

  const handleSubmit = (e) => {
    e.preventDefault();
    onSearch({
      search: search.trim() || undefined,
      priceMin,
      priceMax,
    });
  };

  return (
    <form onSubmit={handleSubmit} className={`d-flex gap-2 ${className}`}>
      {/* Từ khóa */}
      <input
        className="form-control"
        placeholder="Tìm kiếm..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />

      {/* Giá từ */}
      <input
        className="form-control"
        placeholder="Giá từ (đ)"
        inputMode="numeric"       // mobile hiển thị bàn phím số
        value={priceMin !== undefined ? formatVN(priceMin) : ""}
        onChange={(e) => {
          const raw = unformat(e.target.value);
          setPriceMin(isNaN(raw) ? undefined : raw);
        }}
      />

      {/* Giá đến */}
      <input
        className="form-control"
        placeholder="Giá đến (đ)"
        inputMode="numeric"
        value={priceMax !== undefined ? formatVN(priceMax) : ""}
        onChange={(e) => {
          const raw = unformat(e.target.value);
          setPriceMax(isNaN(raw) ? undefined : raw);
        }}
      />

      <button className="btn btn-primary">Lọc</button>
    </form>
  );
}
