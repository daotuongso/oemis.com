using System;
using System.Collections.Generic;

namespace Backend.Application.DTOs
{
    public record OrderCustomerDto(
    int Id,
    DateTime CreatedAt,
    decimal Total,
    OrderStatus Status,
    PayStatus PaymentStatus,
    IEnumerable<OrderLineDto> Items,
    DateTime? ConfirmedAt = null,
    DateTime? ShippedAt = null,
    DateTime? DeliveredAt = null,
    string? TrackingCode = null);
}

