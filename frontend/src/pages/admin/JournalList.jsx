import React, { useState, useEffect } from 'react';
import JournalModal from '../../components/JournalModal';
import { api } from '../../api/api';

export default function JournalList() {
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(true);
  const [show, setShow] = useState(false);
  const [editId, setEditId] = useState(null);

  const load = () => {
    setLoading(true);
    api.get('/api/accounting/journals')
      .then(r => setRows(r.data))
      .catch(console.error)
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    load();
  }, []);

  const handleSaved = () => {
    setShow(false);
    setEditId(null);
    load();
  };

  return (
    <div className="container mt-4">
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h4>Danh sách bút toán</h4>
        <button
          className="btn btn-sm btn-outline-success"
          onClick={() => {
            setEditId(null);
            setShow(true);
          }}
        >
          Thêm bút toán
        </button>
      </div>

      {loading ? (
        <div>Đang tải...</div>
      ) : rows.length === 0 ? (
        <div>Chưa có bút toán nào</div>
      ) : (
        <table className="table table-hover">
          <thead>
            <tr>
              <th>Số chứng từ</th>
              <th>Ngày</th>
              <th>Diễn giải</th>
              <th className="text-end">Tổng</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {rows.map(j => {
              const total = j.lines?.reduce(
                (sum, l) => sum + (l.debit || 0) + (l.credit || 0),
                0
              ) || 0;
              return (
                <tr key={j.id}>
                  <td>{j.number}</td>
                  <td>{new Date(j.date).toLocaleDateString()}</td>
                  <td>{j.memo}</td>
                  <td className="text-end">{total.toLocaleString()}</td>
                  <td>
                    <button
                      className="btn btn-sm btn-outline-secondary"
                      onClick={() => {
                        setEditId(j.id);
                        setShow(true);
                      }}
                    >
                      Xem
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      )}

      {show && (
        <JournalModal
          key={editId ?? 'new'}
          id={editId}
          onSaved={handleSaved}
          onClose={() => setShow(false)}
        />
      )}
    </div>
  );
}
