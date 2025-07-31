namespace Backend.Application.DTOs
{

    public record StockReportLineDto
    (
        int ProductId,
        string Name,
        int Opening,   // Tồn đầu kỳ
        int InQty,     // Nhập trong kỳ
        int OutQty,    // Xuất trong kỳ
        int Closing    // Tồn cuối kỳ
    );
}