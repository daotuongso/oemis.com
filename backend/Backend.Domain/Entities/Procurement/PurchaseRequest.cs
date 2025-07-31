using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;

namespace Backend.Domain.Entities.Procurement
{
    public enum PrStatus { Draft, Requested, Approved, Rejected }

    public class PurchaseRequest
    {
        public int Id { get; set; }
        [MaxLength(20)] public string Code { get; set; } = null!;
        public DateTime CreatedAt { get; set; }
        public string CreatedBy { get; set; } = null!;
        public PrStatus Status { get; set; } = PrStatus.Draft;

        public ICollection<PurchaseRequestLine> Lines { get; set; } = new List<PurchaseRequestLine>();
    }
}
