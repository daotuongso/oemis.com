namespace Backend.Domain.Entities.Procurement
{
    public class PurchaseOrderLine
    {
        public int Id { get; set; }
        public int PurchaseOrderId { get; set; }
        public int ProductId { get; set; }
        public int Qty { get; set; }
        public decimal Price { get; set; }

        public PurchaseOrder PurchaseOrder { get; set; } = null!;
        public Product Product { get; set; } = null!;
    }
}
