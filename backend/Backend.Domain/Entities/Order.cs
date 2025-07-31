using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using Backend.Domain.Enums;

namespace Backend.Domain.Entities
{

    public class Order
    {
        public int Id { get; set; }

        [Required, MaxLength(200)]
        public string CustomerName { get; set; } = null!;

        [Required, MaxLength(500)]
        public string CustomerAddress { get; set; } = null!;

        [MaxLength(200)]
        public string? CustomerEmail { get; set; }

        /* ---------- TRẠNG THÁI & THANH TOÁN ---------- */
        public OrderStatus Status { get; set; } = OrderStatus.Pending;
        public PayStatus PaymentStatus { get; set; } = PayStatus.Unpaid;

        /* ---------- MỐC THỜI GIAN ---------- */
        public DateTime? ConfirmedAt { get; set; }  // ✸ mới thêm
        public DateTime? PaidAt { get; set; }
        public DateTime? ShippedAt { get; set; }
        public DateTime? DeliveredAt { get; set; }

        /* ---------- VẬN CHUYỂN & GHI CHÚ ---------- */
        [MaxLength(100)]
        public string? ShippingMethod { get; set; }

        [MaxLength(100)]
        public string? TrackingCode { get; set; }

        [MaxLength(500)]
        public string? BuyerNote { get; set; }

        [MaxLength(500)]
        public string? AdminNote { get; set; }

        /* ---------- HỆ THỐNG ---------- */
        public DateTime CreatedAt { get; set; }

        public ICollection<OrderItem> Items { get; set; } = new List<OrderItem>();
    }
}
