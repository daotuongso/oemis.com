using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using Backend.Domain.Entities.Accounting;   // Journal
using Backend.Domain.Entities.Inventory;    // GoodsReceipt

namespace Backend.Domain.Entities.Procurement
{
    public enum PoStatus { Draft, Ordered, Received, Cancelled }

    public class PurchaseOrder
    {
        public int Id { get; set; }

        [MaxLength(20)]
        public string Code { get; set; } = null!;

        /* Liên kết Nhà cung cấp */
        public int SupplierId { get; set; }
        public Supplier Supplier { get; set; } = null!;

        /* Liên kết PR (nếu có) */
        public int? PurchaseRequestId { get; set; }
        public PurchaseRequest? PurchaseRequest { get; set; }

        public DateTime OrderedAt { get; set; }
        public PoStatus Status { get; set; } = PoStatus.Draft;

        /* Tổng tiền PO */
        public decimal Total { get; set; }

        /* Dòng chi tiết */
        public ICollection<PurchaseOrderLine> Lines { get; set; } = new List<PurchaseOrderLine>();

        /* ACC‑T7: link bút toán */
        public int? JournalId { get; set; }
        public Journal? Journal { get; set; }

        /* Hàng nhập kho */
        public ICollection<GoodsReceipt>? GoodsReceipts { get; set; }
    }
}
