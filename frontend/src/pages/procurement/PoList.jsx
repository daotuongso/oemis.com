import React, { useEffect, useState } from "react";
import { api } from "../../api/api";
import { Table, Button, Spinner, Badge } from "react-bootstrap";
import PoReceiveModal from "./PoReceiveModal";
import JournalModal   from "../../components/JournalModal";   // ⬅ thêm
import dayjs from "dayjs";

export default function PoList() {
  const [list, set]      = useState([]);
  const [loading, setLoading] = useState(true);
  const [modal, setModal]     = useState(null);   // modal nhận hàng
  const [jrId, setJrId]       = useState(null);   // modal bút toán

  const load = async () => {
    setLoading(true);
    const { data } = await api.get("/api/purchase/po");
    set(data);
    setLoading(false);
  };

  useEffect(() => { load(); }, []);

  if (loading) return <Spinner />;

  return (
    <div className="container my-4">
      <h4>Purchase Orders</h4>

      <Table hover>
        <thead>
          <tr>
            <th>#</th>
            <th>Ngày</th>
            <th>NCC</th>
            <th className="text-end">Total</th>
            <th>Trạng thái</th>
            <th />
          </tr>
        </thead>
        <tbody>
          {list.map(p => (
            <tr key={p.id}>
              <td>{p.code}</td>
              <td>{dayjs(p.orderedAt).format("DD/MM")}</td>
              <td>{p.supplierName}</td>
              <td className="text-end">{p.total.toLocaleString("vi-VN")}₫</td>
              <td>
                <Badge bg={p.status === "Received" ? "success" : "warning"}>
                  {p.status}
                </Badge>
              </td>
              <td>
                {/* Nhận hàng */}
                {p.status === "Ordered" && (
                  <Button size="sm" onClick={() => setModal(p)}>
                    Nhận hàng
                  </Button>
                )}

                {/* Xem bút toán nếu đã sinh */}
                {p.journalId && (
                  <Button
                    size="sm"
                    variant="outline-secondary"
                    className="ms-1"
                    onClick={() => setJrId(p.journalId)}
                  >
                    Bút toán
                  </Button>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </Table>

      {/* Modal nhận hàng */}
      {modal && (
        <PoReceiveModal
          po={modal}
          onClose={ok => {
            setModal(null);
            if (ok) load();
          }}
        />
      )}

      {/* Modal xem bút toán */}
      {jrId && (
        <JournalModal
          id={jrId}
          onSaved={() => {
            setJrId(null);
            load();
          }}
          onClose={() => setJrId(null)}
        />
      )}
    </div>
  );
}
