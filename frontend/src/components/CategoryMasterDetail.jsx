import React, { useEffect, useState } from "react";
import { api } from "../api/api";
import SearchFilter from "../components/SearchFilter";
import ProductCard from "../components/ProductCard";

export default function CategoryMasterDetail() {
  const [cats, setCats] = useState([]);
  const [sel, setSel] = useState(null);
  const [prods, setProds] = useState([]);
  const [loading, setLoading] = useState(false);
  const [filter, setFilter] = useState({});

  /* nạp danh mục */
  useEffect(() => {
    api.get("/api/categories").then((r) => setCats(r.data));
  }, []);

  /* nạp sản phẩm */
  useEffect(() => {
    if (!sel) return;
    setLoading(true);

    const qs = new URLSearchParams();
    qs.append("categoryId", sel.toString());
    Object.entries(filter).forEach(([k, v]) => {
      if (v !== undefined && v !== "") qs.append(k, v);
    });

    api
      .get(`/api/products?${qs.toString()}`)
      .then((r) => setProds(r.data))
      .finally(() => setLoading(false));
  }, [sel, filter]);

  return (
    <div className="container">
      <div className="row">
        {/* sidebar */}
        <aside className="col-md-3 mb-3">
          <div className="list-group">
            {cats.map((c) => (
              <button
                key={c.id}
                className={
                  "list-group-item list-group-item-action" +
                  (sel === c.id ? " active" : "")
                }
                onClick={() => {
                  setSel(c.id);
                  setFilter({});
                }}
              >
                {c.name}
              </button>
            ))}
          </div>
        </aside>

        {/* main */}
        <main className="col-md-9">
          <SearchFilter onSearch={setFilter} className="mb-3" />

          {loading ? (
            <div>Đang tải sản phẩm...</div>
          ) : prods.length ? (
            <div className="row">
              {prods.map((p) => (
                <div key={p.id} className="col-12 col-sm-6 col-lg-4 mb-4">
                  <ProductCard product={p} />
                </div>
              ))}
            </div>
          ) : (
            <div className="alert alert-info">Không có sản phẩm.</div>
          )}
        </main>
      </div>
    </div>
  );
}
