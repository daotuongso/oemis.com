using Backend.Domain.Entities;

namespace Backend.Domain.Entities.Inventory
{
    public class ProductStock
    {
        public int ProductId { get; set; }
        public int WarehouseId { get; set; }

        public int Qty { get; set; }
        public int Reserved { get; set; }

        public Product Product { get; set; } = null!;
        public Warehouse Warehouse { get; set; } = null!;
    }
}
