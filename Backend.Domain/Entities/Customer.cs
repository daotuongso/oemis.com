// Models/Customer.cs
using System;
using System.Collections.Generic;

namespace Backend.Domain.Entities
{
    public class Customer
    {
        public int Id { get; set; }
        public string FullName { get; set; }      // Họ tên
        public string Email { get; set; }
        public string Phone { get; set; }
        public string Address { get; set; }
        public string? Notes { get; set; }
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
        public string? Tags { get; set; }
        public int? GroupId { get; set; }
        public CustomerGroup? Group { get; set; }
        public int? ExternalId { get; set; }   // CRM Id
        public ICollection<CustomerLog> Logs { get; set; } = new List<CustomerLog>();
    }
}
