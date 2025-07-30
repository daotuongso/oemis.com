// Models/Inventory/StockCountSheet.cs
public class StockCountSheet
{
    public int Id { get; set; }
    public string Code { get; set; } = null!;
    public DateTime StartedAt { get; set; }
    public DateTime? ClosedAt { get; set; }
    public ICollection<StockCountLine> Lines { get; set; } = new List<StockCountLine>();
}

// Models/Inventory/StockCountLine.cs

