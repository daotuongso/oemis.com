import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { api } from "../../api/api";  // import api instance

export default function LedgerPage() {
  const [rows, setRows] = useState([]);
  const { accId } = useParams();

  useEffect(() => {
    if (!accId) return; 
    const id    = parseInt(accId, 10);
    const today = new Date().toISOString().substring(0,10);
    const from  = `${today.substring(0,4)}-01-01`;
    // gọi thẳng vào /api/accounting/ledger
    api.get(`/api/accounting/ledger/${id}?from=${from}&to=${today}`)
      .then(response => setRows(response.data))
      .catch(console.error);
  }, [accId]);

  return (
    <div className="container mt-4">
      <h4>Sổ cái tài khoản #{accId}</h4>
      <table className="table">
        <thead>
          <tr>
            <th>Ngày</th>
            <th>Diễn giải</th>
            <th className="text-end">Nợ</th>
            <th className="text-end">Có</th>
            <th className="text-end">Số dư</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((r, i) => (
            <tr key={i}>
              <td>{new Date(r.date).toLocaleDateString()}</td>
              <td>{r.description}</td>
              <td className="text-end">{r.debit?.toLocaleString()}</td>
              <td className="text-end">{r.credit?.toLocaleString()}</td>
              <td className="text-end">{r.balance?.toLocaleString()}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
