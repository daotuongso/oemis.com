using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;

namespace Backend.Domain.Entities.Inventory
{
    public class Warehouse
    {
        public int Id { get; set; }

        [MaxLength(100)]
        public string Name { get; set; } = null!;

        [MaxLength(250)]
        public string? Address { get; set; }

        public ICollection<ProductStock> Stocks { get; set; } = new List<ProductStock>();
    }
}
