namespace Backend.Domain.Entities.Procurement
{
    public class PurchaseRequestLine
    {
        public int Id { get; set; }
        public int PurchaseRequestId { get; set; }
        public int ProductId { get; set; }
        public int Qty { get; set; }
        public decimal Price { get; set; }

        public PurchaseRequest PurchaseRequest { get; set; } = null!;
        public Product Product { get; set; } = null!;
    }
}
