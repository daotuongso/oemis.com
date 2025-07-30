using System;
using System.ComponentModel.DataAnnotations;

namespace Backend.Domain.Entities.Inventory
{
    public class StockTxn
    {
        public int Id { get; set; }

        public int ProductId { get; set; }
        public int WarehouseId { get; set; }

        [MaxLength(10)]
        public StockTxnType Type { get; set; }

        public int Quantity { get; set; }

        [MaxLength(50)]
        public string? Reference { get; set; }

        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

        public Product Product { get; set; } = null!;
        public Warehouse Warehouse { get; set; } = null!;
    }
}
