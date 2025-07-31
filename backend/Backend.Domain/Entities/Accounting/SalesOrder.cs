using System;
using System.Collections.Generic;

namespace Backend.Domain.Entities.Accounting;

public class SalesOrder
{
    public int Id { get; set; }
    public string Code { get; set; } = null!;
    public DateTime Date { get; set; }
    public int CustomerId { get; set; }
    public decimal Total { get; set; }
    public int? ExternalId { get; set; }
    public ICollection<SalesLine> Lines { get; set; } = new List<SalesLine>();
}
