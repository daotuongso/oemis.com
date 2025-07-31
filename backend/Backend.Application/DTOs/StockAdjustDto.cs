namespace Backend.Application.DTOs
{
    /// <summary>Yêu cầu nhập / xuất kho thủ công.</summary>
    public class StockAdjustDto
    {
        public int ProductId { get; set; }
        /// <remarks>+ số lượng → nhập; – số lượng → xuất.</remarks>
        public int Qty { get; set; }
        /// <example>PO#123, Manual, CORRECT</example>
        public string Reference { get; set; } = "";
    }
}
