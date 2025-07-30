using Backend.Domain.Entities.Inventory;

namespace Backend.Domain.Entities
{

    public class Product
    {
        public int Id { get; set; }
        public string Name { get; set; } = default!;
        public string Slug { get; set; } = default!;
        public string Description { get; set; } = default!;
        public decimal Price { get; set; }
        public string ImageUrl { get; set; } = default!;
        public int CategoryId { get; set; }
        public Category Category { get; set; } = default!;
        public int MinStock { get; set; } = 0;
        public int? ExternalId { get; set; }
        public ICollection<ProductStock> Stocks { get; set; } = new List<ProductStock>();
    }
}
