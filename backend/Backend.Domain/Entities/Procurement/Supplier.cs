using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;

namespace Backend.Domain.Entities.Procurement
{
    public class Supplier
    {
        public int Id { get; set; }
        [MaxLength(200)] public string Name { get; set; } = null!;
        [MaxLength(50)] public string? Phone { get; set; }
        [MaxLength(200)] public string? Email { get; set; }
        [MaxLength(300)] public string? Address { get; set; }
        public bool IsActive { get; set; } = true;

        public ICollection<PurchaseOrder> Orders { get; set; } = new List<PurchaseOrder>();
        public ICollection<SupplierPayment> Payments { get; set; } = new List<SupplierPayment>();
    }
}
