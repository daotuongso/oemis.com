import React, { useState } from "react";
import { Form, Button, Table, Alert, Spinner } from "react-bootstrap";
import { getLedgerEntries } from "../../api/api";
import dayjs from "dayjs";

export default function LedgerReport() {
  /* ----- STATE ----- */
  const today = dayjs().format("YYYY-MM-DD");
  const [accId, setAccId]   = useState(1);
  const [from,  setFrom]    = useState(today);
  const [to,    setTo]      = useState(today);
  const [rows,  setRows]    = useState([]);

  /* UI helper */
  const [loading, setLoading] = useState(false);
  const [error,   setError]   = useState("");

  /* ----- LOAD DATA ----- */
  const load = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const data = await getLedgerEntries(accId, from, to);   // call API
      setRows(data);
    } catch (err) {
      if (err.response?.status === 401) {
        setError(
          "Bạn không có quyền xem sổ cái. Vui lòng đăng nhập với vai trò Kế toán hoặc Admin."
        );
      } else if (err.response?.status === 404) {
        setError("Không tìm thấy dữ liệu sổ cái cho khoảng thời gian này.");
      } else {
        setError("Đã xảy ra lỗi, vui lòng thử lại.");
      }
    } finally {
      setLoading(false);
    }
  };

  /* ----- RENDER ----- */
  return (
    <div>
      <h4>Báo cáo sổ cái</h4>

      {/* Bộ lọc */}
      <Form className="d-flex gap-3 mb-3" onSubmit={load}>
        <Form.Select value={accId} onChange={(e) => setAccId(e.target.value)}>
          <option value="1">111 – Tiền mặt</option>
          <option value="2">112 – Tiền gửi NH</option>
          {/* Thêm TK khác nếu cần */}
        </Form.Select>

        <Form.Control
          type="date"
          value={from}
          onChange={(e) => setFrom(e.target.value)}
        />
        <Form.Control
          type="date"
          value={to}
          onChange={(e) => setTo(e.target.value)}
        />

        <Button type="submit">Xem</Button>
      </Form>

      {/* Thông báo & loading */}
      {error && <Alert variant="danger">{error}</Alert>}
      {loading && <Spinner />}

      {/* Bảng kết quả */}
      {!loading && rows.length > 0 && (
        <Table bordered size="sm">
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
                <td>{dayjs(r.date).format("DD/MM/YYYY")}</td>
                <td>{r.memo}</td>
                <td className="text-end">
                  {r.debit.toLocaleString("vi-VN")}
                </td>
                <td className="text-end">
                  {r.credit.toLocaleString("vi-VN")}
                </td>
                <td className="text-end">
                  {r.balance.toLocaleString("vi-VN")}
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      )}
    </div>
  );
}
