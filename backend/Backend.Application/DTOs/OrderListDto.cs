using Backend.Domain.Enums;

namespace Backend.Application.DTOs
{
    public record OrderListDto(
        int Id,
        string CustomerName,
        DateTime CreatedAt,
        decimal Total,
        OrderStatus Status,
        PayStatus PaymentStatus
    );
}

