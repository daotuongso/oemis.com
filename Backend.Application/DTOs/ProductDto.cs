// File: Backend/Models/ProductDto.cs
using Microsoft.AspNetCore.Http;
using System.ComponentModel.DataAnnotations;

namespace Backend.Application.DTOs
{
    public class ProductDto
    {
        [Required] public int CategoryId { get; set; }
        [Required, MaxLength(200)]
        public string Name { get; set; } = null!;
        public string? Description { get; set; }
        [Required] public decimal Price { get; set; }

        public IFormFile? File { get; set; }
        public string? ImageUrl { get; set; }

        /* thêm cho thống nhất – API Create/Update không dùng trường này */
        public int InStock => 0;
    }
}
