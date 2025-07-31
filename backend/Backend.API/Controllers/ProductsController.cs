using Backend.Infrastructure.Data;
using Backend.Domain.Entities;
using Backend.API.Utils;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace Backend.API.Controllers;

[ApiController]
[Route("api/[controller]")]
public class ProductsController : ControllerBase
{
    private readonly OrchidContext _ctx;
    private readonly IWebHostEnvironment _env;
    public ProductsController(OrchidContext ctx, IWebHostEnvironment env)
    { _ctx = ctx; _env = env; }

    /*──────────────────────  GET DANH SÁCH  ──────────────────────*/
    // GET /api/products?categoryId=&search=&priceMin=&priceMax=
    [HttpGet]
    public async Task<IActionResult> GetAll(
        int? categoryId, string? search,
        decimal? priceMin, decimal? priceMax)
    {
        var q = _ctx.Products
                    .Include(p => p.Category)
                    .Include(p => p.Stocks)          // lấy tồn kho
                    .AsQueryable();

        if (categoryId is not null) q = q.Where(p => p.CategoryId == categoryId);
        if (!string.IsNullOrWhiteSpace(search))
            q = q.Where(p => p.Name.Contains(search));
        if (priceMin is not null) q = q.Where(p => p.Price >= priceMin);
        if (priceMax is not null) q = q.Where(p => p.Price <= priceMax);

        // Trả về DTO nhẹ + trường inStock
        var list = await q.OrderBy(p => p.Id)
                          .Select(p => new
                          {
                              id = p.Id,
                              name = p.Name,
                              slug = p.Slug,
                              categoryName = p.Category.Name,
                              description = p.Description,
                              price = p.Price,
                              imageUrl = p.ImageUrl,
                              inStock = p.Stocks
                                               .Where(s => s.WarehouseId == 1)
                                               .Select(s => s.Qty - s.Reserved)
                                               .FirstOrDefault()      // null ⇒ 0
                          })
                          .ToListAsync();

        return Ok(list);
    }


    /*───────── GET THEO SLUG (public) ─────────*/
    [HttpGet("slug/{slug}")]
    public async Task<IActionResult> GetBySlug(string slug)
    {
        var p = await _ctx.Products.Include(p => p.Category)
                                   .FirstOrDefaultAsync(p => p.Slug == slug);
        return p is null ? NotFound() : Ok(p);
    }

    /*───────── GET THEO ID (admin edit) ───────*/
    [Authorize(Roles = "Admin")]
    [HttpGet("{id:int}")]
    public async Task<IActionResult> GetById(int id)
    {
        var p = await _ctx.Products.FindAsync(id);
        return p is null ? NotFound() : Ok(p);
    }

    /*──────────────────────  CREATE  ───────────────────────*/
    [Authorize(Roles = "Admin")]
    [HttpPost]
    [RequestSizeLimit(10 * 1024 * 1024)]
    public async Task<IActionResult> Create([FromForm] ProductUploadDto dto)
    {
        var slug = await MakeUniqueSlug(dto.Name);

        var entity = new Product
        {
            Name = dto.Name,
            Description = dto.Description,
            Price = dto.Price,
            CategoryId = dto.CategoryId,
            Slug = slug,
            ImageUrl = dto.ImageUrl ?? ""
        };

        if (dto.File is { Length: > 0 })
            entity.ImageUrl = await SaveFile(dto.File);

        _ctx.Products.Add(entity);
        await _ctx.SaveChangesAsync();

        return CreatedAtAction(nameof(GetBySlug),
                               new { slug = entity.Slug }, entity);
    }

    /*──────────────────────  UPDATE  ───────────────────────*/
    [Authorize(Roles = "Admin")]
    [HttpPut("{id:int}")]
    [RequestSizeLimit(10 * 1024 * 1024)]
    public async Task<IActionResult> Update(int id, [FromForm] ProductUploadDto dto)
    {
        var entity = await _ctx.Products.FindAsync(id);
        if (entity is null) return NotFound();

        entity.Name = dto.Name;
        entity.Description = dto.Description;
        entity.Price = dto.Price;
        entity.CategoryId = dto.CategoryId;
        entity.Slug = await MakeUniqueSlug(dto.Name, entity.Id);
        entity.ImageUrl = dto.ImageUrl ?? entity.ImageUrl;

        if (dto.File is { Length: > 0 })
            entity.ImageUrl = await SaveFile(dto.File);

        await _ctx.SaveChangesAsync();
        return NoContent();
    }

    /*──────────────────────  DELETE  ───────────────────────*/
    [Authorize(Roles = "Admin")]
    [HttpDelete("{id:int}")]
    public async Task<IActionResult> Delete(int id)
    {
        var p = await _ctx.Products.FindAsync(id);
        if (p is null) return NotFound();
        _ctx.Products.Remove(p);
        await _ctx.SaveChangesAsync();
        return NoContent();
    }

    /*───────────────────  Helpers  ───────────────────*/

    // đảm bảo slug duy nhất
    private async Task<string> MakeUniqueSlug(string name, int? ignoreId = null)
    {
        var baseSlug = name.ToSlug();
        var slug = baseSlug;
        var i = 1;
        while (await _ctx.Products.AnyAsync(p => p.Slug == slug && p.Id != ignoreId))
            slug = $"{baseSlug}-{i++}";
        return slug;
    }

    private async Task<string> SaveFile(IFormFile file)
    {
        var dir = Path.Combine(_env.WebRootPath, "uploads");
        Directory.CreateDirectory(dir);

        var fname = $"{Guid.NewGuid()}{Path.GetExtension(file.FileName)}";
        var path = Path.Combine(dir, fname);

        await using var fs = new FileStream(path, FileMode.Create);
        await file.CopyToAsync(fs);

        return $"/uploads/{fname}";
    }
}

/*──────────── DTO cho multipart ────────────*/
public class ProductUploadDto
{
    public string Name { get; set; } = default!;
    public string Description { get; set; } = default!;
    public decimal Price { get; set; }
    public int CategoryId { get; set; }

    public IFormFile? File { get; set; }   // trùng key FormData.append("File", …)
    public string? ImageUrl { get; set; }   // giữ ảnh cũ khi edit
}
