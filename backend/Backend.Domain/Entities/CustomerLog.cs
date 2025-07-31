// Models/CustomerLog.cs
using System;

namespace Backend.Domain.Entities
{
    public class CustomerLog
    {
        public int Id { get; set; }
        public int CustomerId { get; set; }
        public Customer? Customer { get; set; }
        public DateTime LogTime { get; set; } = DateTime.UtcNow;
        public string Content { get; set; }
        public string? Result { get; set; }
        public string? CreatedBy { get; set; }
    }
}
