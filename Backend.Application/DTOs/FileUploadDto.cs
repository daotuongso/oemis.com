using Microsoft.AspNetCore.Http;

namespace Backend.Application.DTOs
{
    public class FileUploadDto
    {
        [System.ComponentModel.DataAnnotations.Required]
        public IFormFile File { get; set; } = default!;
    }
}
