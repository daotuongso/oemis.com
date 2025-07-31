import React, { useEffect, useState } from "react";
import { api } from "../../api/api";
import { Table, Button, Spinner, Badge, Alert } from "react-bootstrap";
import dayjs from "dayjs";
import NewPrModal from "./NewPrModal";
import SupplierSelectModal from "./SupplierSelectModal";

export default function PrList() {
  const [list, setList]       = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError]     = useState("");      // ⬅ lỗi phân quyền
  const [showNew, setShowNew] = useState(false);
  const [chooseNcc, setChoose] = useState(null);

  const load = async () => {
    setLoading(true);
    setError("");
    try {
      const { data } = await api.get("/api/purchase/pr");
      setList(data);
    } catch (err) {
      if (err.response?.status === 401 || err.response?.status === 403) {
        setError("Bạn không có quyền truy cập Purchase Requests. Vui lòng đăng nhập tài khoản phù hợp.");
      } else {
        setError(err.response?.data?.title || "Không thể tải danh sách PR!");
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, []);

  const approve = async id => {
    try {
      await api.post(`/api/purchase/pr/${id}/approve`);
      load();
    } catch (err) {
      alert(err.response?.data?.title || "Duyệt PR thất bại!");
    }
  };

  return (
    <div className="container my-4">
      <h4>Purchase Requests</h4>

      {error && <Alert variant="danger">{error}</Alert>}

      {!error && (
        <>
          <Button className="mb-2" onClick={() => setShowNew(true)}>Thêm PR</Button>

          {loading ? <Spinner /> : (
            list.length === 0 ? <div>Không có PR.</div> :
              <Table hover>
                <thead>
                  <tr><th>#</th><th>Ngày</th><th>Dòng</th><th>Trạng thái</th><th/></tr>
                </thead>
                <tbody>
                  {list.map(p => (
                    <tr key={p.id}>
                      <td>{p.code}</td>
                      <td>{dayjs(p.createdAt).format("DD/MM")}</td>
                      <td>{p.lines}</td>
                      <td>
                        <Badge bg={{
                          Approved: "success",
                          Rejected: "danger",
                          Requested: "secondary"
                        }[p.status]}>{p.status}</Badge>
                      </td>
                      <td>
                        {p.status === "Requested" &&
                          <Button size="sm" onClick={() => approve(p.id)}>Duyệt</Button>}
                        {p.status === "Approved" &&
                          <Button size="sm" variant="outline-primary"
                            onClick={() => setChoose(p)}>Tạo PO</Button>}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </Table>
          )}

          {showNew && (
            <NewPrModal onClose={ok => { setShowNew(false); if (ok) load(); }} />
          )}

          {chooseNcc && (
            <SupplierSelectModal pr={chooseNcc}
              onClose={ok => { setChoose(null); if (ok) load(); }} />
          )}
        </>
      )}
    </div>
  );
}
