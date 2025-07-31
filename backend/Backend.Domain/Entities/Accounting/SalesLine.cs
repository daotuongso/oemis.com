namespace Backend.Domain.Entities.Accounting;

public class SalesLine
{
    public int Id { get; set; }
    public int SalesOrderId { get; set; }
    public int ProductId { get; set; }
    public int Qty { get; set; }
    public decimal Price { get; set; }
}
