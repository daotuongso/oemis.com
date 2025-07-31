using System;
using System.Linq;
using System.Threading.Tasks;
using Backend.Infrastructure.Data;
using Backend.Domain.Entities;
using Backend.Application.DTOs;
using Backend.API.Utils; // <-- Đảm bảo đã có dòng này!
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace Backend.API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class CategoriesController : ControllerBase
    {
        private readonly OrchidContext _context;

        public CategoriesController(OrchidContext context)
        {
            _context = context;
        }

        // GET: api/categories
        [HttpGet]
        [AllowAnonymous]
        public async Task<IActionResult> GetAll()
        {
            var list = await _context.Categories
                .Include(c => c.Products)
                .ToListAsync();
            return Ok(list);
        }

        // GET: api/categories/slug/{slug}
        [HttpGet("slug/{slug}")]
        [AllowAnonymous]
        public async Task<IActionResult> GetBySlug(string slug)
        {
            var cate = await _context.Categories
                .Include(c => c.Products)
                .FirstOrDefaultAsync(c => c.Slug == slug);
            if (cate == null) return NotFound();
            return Ok(cate);
        }

        // GET: api/categories/{id}
        [HttpGet("{id:int}")]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> Get(int id)
        {
            var cate = await _context.Categories
                .Include(c => c.Products)
                .FirstOrDefaultAsync(c => c.Id == id);
            if (cate == null) return NotFound();
            return Ok(cate);
        }

        // POST: api/categories
        [HttpPost]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> Create([FromBody] CategoryDto dto)
        {
            if (await _context.Categories.AnyAsync(c => c.Name == dto.Name))
                return Conflict(new { detail = "Tên danh mục đã tồn tại." });

            var slug = dto.Name.ToSlug(); // SỬ DỤNG HÀM EXTENSION ĐÚNG CHUẨN

            var cate = new Category
            {
                Name = dto.Name,
                Slug = slug
            };
            _context.Categories.Add(cate);
            await _context.SaveChangesAsync();
            return Ok(cate);
        }

        // PUT: api/categories/{id}
        [HttpPut("{id:int}")]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> Update(int id, [FromBody] CategoryDto dto)
        {
            var cate = await _context.Categories.FindAsync(id);
            if (cate == null) return NotFound();

            if (await _context.Categories.AnyAsync(c => c.Name == dto.Name && c.Id != id))
                return Conflict(new { detail = "Tên danh mục đã tồn tại." });

            cate.Name = dto.Name;
            cate.Slug = dto.Name.ToSlug(); // SỬ DỤNG HÀM EXTENSION ĐÚNG CHUẨN

            await _context.SaveChangesAsync();
            return Ok(cate);
        }

        // DELETE: api/categories/{id}
        [HttpDelete("{id:int}")]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> Delete(int id)
        {
            var cate = await _context.Categories.FindAsync(id);
            if (cate == null) return NotFound();

            _context.Categories.Remove(cate);
            await _context.SaveChangesAsync();
            return Ok(new { message = "Đã xóa danh mục thành công" });
        }
    }
}
