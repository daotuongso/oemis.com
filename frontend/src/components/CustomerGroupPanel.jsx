import React, { useEffect, useState } from "react";
import { api } from '../api/api';
import { Form, Button, Spinner } from "react-bootstrap";
import { toast } from "react-toastify";

export default function CustomerGroupPanel({ customer }) {
  const [groups, setGroups] = useState([]);
  const [groupId, setGroupId] = useState(customer.groupId || "");
  const [saving, setSaving] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get("/api/customers/groups")
      .then(res => setGroups(res.data))
      .catch(() => setGroups([]))
      .finally(() => setLoading(false));
    setGroupId(customer.groupId || "");
  }, [customer]);

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      await api.put(`/api/customers/${customer.id}/group`, { groupId: groupId ? Number(groupId) : null });
      toast.success("Đã cập nhật nhóm khách hàng!");
    } catch {
      toast.error("Lỗi khi cập nhật nhóm!");
    }
    setSaving(false);
  };

  return (
    <div className="my-3">
      <h6>Phân nhóm khách hàng</h6>
      {loading ? (
        <Spinner animation="border" size="sm" />
      ) : (
        <Form onSubmit={handleSave} style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <Form.Select
            value={groupId}
            onChange={e => setGroupId(e.target.value)}
            style={{ maxWidth: 300 }}
          >
            <option value="">-- Không nhóm --</option>
            {groups.map(g =>
              <option value={g.id} key={g.id}>{g.name}</option>
            )}
          </Form.Select>
          <Button type="submit" variant="primary" size="sm" disabled={saving}>
            {saving ? "Đang lưu..." : "Cập nhật"}
          </Button>
        </Form>
      )}
    </div>
  );
}
