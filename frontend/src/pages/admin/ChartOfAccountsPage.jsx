import React, { useEffect, useState } from "react";
import { api } from "../../api/api";

export default function ChartOfAccountsPage() {
  const [rows, setRows] = useState([]);

  useEffect(() => {
    api.get("/api/accounts")
       .then(r => setRows(r.data))
       .catch(console.error);
  }, []);

  return (
    <div className="container mt-4">
      <h4>Sơ đồ tài khoản</h4>
      <table className="table table-hover">
        <thead>
          <tr>
            <th>Mã</th><th>Tên</th><th>Loại</th><th>Cha</th>
          </tr>
        </thead>
        <tbody>
          {rows.map(a => (
            <tr key={a.id}>
              <td>{a.code}</td>
              <td>{a.name}</td>
              <td>{a.type}</td>
              <td>{a.parentName ?? "-"}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
