namespace Backend.Domain.Entities.Procurement
{
    public class GoodsReceiptLine
    {
        public int Id { get; set; }
        public int GoodsReceiptId { get; set; }
        public int ProductId { get; set; }
        public int Qty { get; set; }

        public GoodsReceipt GoodsReceipt { get; set; } = null!;
        public Product Product { get; set; } = null!;
    }
}
