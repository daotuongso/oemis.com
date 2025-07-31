using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;

namespace Backend.Domain.Entities.Procurement
{
    public class GoodsReceipt
    {
        public int Id { get; set; }
        public int PurchaseOrderId { get; set; }
        public DateTime ReceivedAt { get; set; }
        [MaxLength(100)] public string ReceivedBy { get; set; } = null!;

        public PurchaseOrder PurchaseOrder { get; set; } = null!;
        public ICollection<GoodsReceiptLine> Lines { get; set; } = new List<GoodsReceiptLine>();
    }
}
