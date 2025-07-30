using System;
using System.ComponentModel.DataAnnotations;

namespace Backend.Domain.Entities.Procurement
{
    public class SupplierPayment
    {
        public int Id { get; set; }
        public int SupplierId { get; set; }
        public decimal Amount { get; set; }
        public DateTime PaidAt { get; set; }
        [MaxLength(50)] public string? Reference { get; set; }

        public Supplier Supplier { get; set; } = null!;
    }
}
