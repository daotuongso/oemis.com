using Backend.Domain.Entities.Inventory;

namespace Backend.Application.DTOs
{

    public record StockAdjustmentDto
    (
        int ProductId,
        int Qty,
        StockTxnType Type,      // In / Out
        string Reason,
        string? Note
    );
}