// Models/CustomerGroup.cs
using System.Collections.Generic;

namespace Backend.Domain.Entities
{
    public class CustomerGroup
    {
        public int Id { get; set; }
        public string Name { get; set; }           // Tên nhóm
        public string? Description { get; set; }
        public ICollection<Customer> Customers { get; set; } = new List<Customer>();
    }
}
