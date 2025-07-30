using Backend.Application.DTOs;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace Backend.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class UploadController : ControllerBase
    {
        [HttpPost]
        [Consumes("multipart/form-data")]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> Upload([FromForm] FileUploadDto dto)
        {
            var file = dto.File;                         // luôn khác null do [Required]
            var path = Path.Combine(Directory.GetCurrentDirectory(), "wwwroot", "images");
            if (!Directory.Exists(path)) Directory.CreateDirectory(path);

            var fileName = $"{Guid.NewGuid()}{Path.GetExtension(file.FileName)}";
            var fullPath = Path.Combine(path, fileName);

            await using var stream = System.IO.File.Create(fullPath);
            await file.CopyToAsync(stream);

            return Ok(new { url = $"/images/{fileName}", size = file.Length });
        }
    }
}
