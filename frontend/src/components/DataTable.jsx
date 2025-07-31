import React from "react";

/**
 * cols: [{ key, label, render? }]
 * rows: mảng object
 * onRow(row): optional – click tr toàn bộ hàng
 */
export default function DataTable({ cols, rows, onRow }) {
  return (
    <table className="table table-hover">
      <thead>
        <tr>{cols.map(c => <th key={c.key}>{c.label}</th>)}</tr>
      </thead>
      <tbody>
        {rows.map(r => (
          <tr key={r.id}
              style={{ cursor: onRow ? "pointer" : "default" }}
              onClick={() => onRow && onRow(r)}>
            {cols.map(c => (
              <td key={c.key}>
                {c.render ? c.render(r[c.key], r) : r[c.key]}
              </td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  );
}
