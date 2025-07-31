public class StockCountLine
{
    public int Id { get; set; }
    public int StockCountSheetId { get; set; }
    public int ProductId { get; set; }
    public int QtySystem { get; set; }     // Số trong hệ thống tại thời điểm mở phiếu
    public int QtyActual { get; set; }     // Nhập thủ công
    public int Diff => QtyActual - QtySystem;
}