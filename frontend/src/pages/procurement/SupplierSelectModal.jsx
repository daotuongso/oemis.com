import React, { useEffect, useState } from "react";
import { Modal, ListGroup, Spinner, Alert } from "react-bootstrap";
import { api } from "../../api/api";

export default function SupplierSelectModal({ pr, onClose }) {
  const [suppliers, setSuppliers] = useState([]);
  const [lines,     setLines    ] = useState(null);     // null = đang tải
  const [errMsg,    setErrMsg   ] = useState("");

  /* ─ Lấy danh sách NCC ─ */
  useEffect(() => {
    api.get("/api/purchase/suppliers")
       .then(r => setSuppliers(r.data))
       .catch(() => setErrMsg("Không tải được danh sách NCC"));
  }, []);

  /* ─ Nếu PR chưa có Lines ⇒ gọi API /pr/{id} để lấy chi tiết ─ */
  useEffect(() => {
    const existing =
      pr.lines ?? pr.Lines ?? pr.lineDtos ?? pr.LineDtos ?? null;

    if (Array.isArray(existing) && existing.length) {
      setLines(existing);
    } else {
      api.get(`/api/purchase/pr/${pr.id}`)
         .then(r => {
           const l =
             r.data.lines ?? r.data.Lines ?? r.data.lineDtos ?? [];
           setLines(l);
         })
         .catch(() =>
           setErrMsg("Không đọc được chi tiết PR – thử lại sau.")
         );
    }
  }, [pr]);

  /* ─ Chọn NCC ⇒ tạo PO ─ */
  const choose = async (supplierId) => {
    if (!Array.isArray(lines) || lines.length === 0) return;

    const payload = {
      SupplierId: supplierId,
      PurchaseRequestId: pr.id,
      Lines: lines.map((l) => ({
        ProductId: l.productId ?? l.ProductId ?? l.productID,
        Qty      : l.qty       ?? l.Qty,
        Price    : l.price     ?? l.Price
      }))
    };

    try {
      await api.post("/api/purchase/po", payload);
      onClose(true);               // thông báo tạo thành công
    } catch (e) {
      setErrMsg(
        e.response?.data?.message || "Tạo PO thất bại – kiểm tra dữ liệu."
      );
    }
  };

  /* ─ UI ─ */
  return (
    <Modal show centered onHide={() => onClose(false)}>
      <Modal.Header closeButton>
        <Modal.Title>
          Chọn NCC cho PR <b>{pr.code}</b>
        </Modal.Title>
      </Modal.Header>

      <Modal.Body>
        {errMsg && <Alert variant="danger">{errMsg}</Alert>}

        {/* Khi chưa tải xong Lines hoặc NCC ⇒ spinner */}
        {lines === null || suppliers.length === 0 ? (
          <div className="text-center py-3">
            <Spinner animation="border" />
          </div>
        ) : (
          <>
            {lines.length === 0 && (
              <Alert variant="danger" className="py-2">
                PR hiện không có dòng dữ liệu – không thể tạo PO.
              </Alert>
            )}

            <ListGroup>
              {suppliers.map((s) => (
                <ListGroup.Item
                  key={s.id}
                  action
                  onClick={() => choose(s.id)}
                  disabled={lines.length === 0}
                >
                  {s.name}
                  {s.phone && ` – ${s.phone}`}
                </ListGroup.Item>
              ))}
            </ListGroup>
          </>
        )}
      </Modal.Body>
    </Modal>
  );
}
