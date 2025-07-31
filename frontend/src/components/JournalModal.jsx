import React, { useState, useEffect } from "react";
import { api } from "../api/api";

export default function JournalModal({ id, onSaved, onClose }) {
  const [date, setDate] = useState(new Date().toISOString().slice(0, 10));
  const [memo, setMemo] = useState("");
  const [lines, setLines] = useState([{ accountId: "", debit: 0, credit: 0 }]);
  const [accounts, setAccounts] = useState([]);
  const [errMsg, setErrMsg] = useState("");

  useEffect(() => {
    api.get("/api/accounts").then((r) => setAccounts(r.data));

    if (id != null) {
      api.get(`/api/accounting/journals/${id}`).then((r) => {
        setDate(r.data.date.substring(0, 10));
        setMemo(r.data.memo);
        setLines(
          r.data.lines.map((l) => ({
            accountId: l.accountId,
            debit: l.debit,
            credit: l.credit,
          }))
        );
      });
    } else resetForm();
  }, [id]);

  const resetForm = () => {
    setDate(new Date().toISOString().slice(0, 10));
    setMemo("");
    setLines([{ accountId: "", debit: 0, credit: 0 }]);
    setErrMsg("");
  };

  /* ---------- helpers ---------- */
  const format = (n) =>
    n === 0 ? "" : n.toLocaleString("vi-VN");
  const unformat = (s) =>
    Number(String(s).replace(/\./g, "").replace(/,/g, "")) || 0;

  /* ---------- dòng bút toán ---------- */
  const addLine = () =>
    setLines([...lines, { accountId: "", debit: 0, credit: 0 }]);

  const updateLine = (idx, field, value) => {
    const copy = [...lines];
    copy[idx] = {
      ...copy[idx],
      [field]:
        field === "accountId" ? parseInt(value, 10) || "" : unformat(value),
    };
    setLines(copy);
  };

  const removeLine = (idx) => setLines(lines.filter((_, i) => i !== idx));

  /* ---------- lưu ---------- */
  const save = () => {
    setErrMsg("");
    const valid = lines.filter(
      (l) => l.accountId && (l.debit !== 0 || l.credit !== 0)
    );
    if (valid.length < 2) {
      setErrMsg("Phải có ≥2 dòng và chọn tài khoản.");
      return;
    }
    const dr = valid.reduce((s, l) => s + l.debit, 0);
    const cr = valid.reduce((s, l) => s + l.credit, 0);
    if (dr !== cr) {
      setErrMsg("Tổng Nợ phải bằng Tổng Có.");
      return;
    }

    const dto = {
      date,
      memo,
      createdBy: "",
      isPosted: false,
      lines: valid,
    };

    const req =
      id != null
        ? api.put(`/api/accounting/journals/${id}`, dto)
        : api.post("/api/accounting/journals", dto);

    req.then(onSaved).catch((e) =>
      setErrMsg(e.response?.data?.title || "Lỗi khi lưu!")
    );
  };

  /* ---------- render ---------- */
  return (
    <div className="modal show d-block" tabIndex="-1">
      <div className="modal-dialog modal-lg">
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title">
              {id != null ? "Chỉnh sửa bút toán" : "Thêm bút toán"}
            </h5>
            <button className="btn-close" onClick={onClose}></button>
          </div>
          <div className="modal-body">
            {errMsg && <div className="alert alert-danger py-2">{errMsg}</div>}

            <div className="mb-3">
              <label>Ngày</label>
              <input
                type="date"
                className="form-control"
                value={date}
                onChange={(e) => setDate(e.target.value)}
              />
            </div>

            <div className="mb-3">
              <label>Diễn giải</label>
              <textarea
                className="form-control"
                rows="3"
                value={memo}
                onChange={(e) => setMemo(e.target.value)}
              />
            </div>

            <table className="table table-bordered">
              <thead>
                <tr>
                  <th>Tài khoản</th>
                  <th className="text-end">Nợ</th>
                  <th className="text-end">Có</th>
                  <th />
                </tr>
              </thead>
              <tbody>
                {lines.map((l, i) => (
                  <tr key={i}>
                    <td>
                      <select
                        className="form-select"
                        value={l.accountId}
                        onChange={(e) =>
                          updateLine(i, "accountId", e.target.value)
                        }
                      >
                        <option value="">-- Chọn TK --</option>
                        {accounts.map((a) => (
                          <option key={a.id} value={a.id}>
                            {a.code} – {a.name}
                          </option>
                        ))}
                      </select>
                    </td>
                    <td className="text-end">
                      <input
                        type="text"
                        className="form-control text-end"
                        value={format(l.debit)}
                        onChange={(e) =>
                          updateLine(i, "debit", e.target.value)
                        }
                      />
                    </td>
                    <td className="text-end">
                      <input
                        type="text"
                        className="form-control text-end"
                        value={format(l.credit)}
                        onChange={(e) =>
                          updateLine(i, "credit", e.target.value)
                        }
                      />
                    </td>
                    <td>
                      <button
                        className="btn btn-sm btn-danger"
                        onClick={() => removeLine(i)}
                      >
                        X
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            <button className="btn btn-sm btn-success" onClick={addLine}>
              Thêm dòng
            </button>
          </div>
          <div className="modal-footer">
            <button className="btn btn-secondary" onClick={onClose}>
              Đóng
            </button>
            <button className="btn btn-primary" onClick={save}>
              Lưu
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
