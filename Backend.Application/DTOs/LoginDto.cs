// File: Backend/Models/LoginDto.cs

using System.ComponentModel.DataAnnotations;

namespace Backend.Application.DTOs
{
    public class LoginDto
    {
        [Required, EmailAddress]
        public string Email { get; set; } = null!;

        [Required]
        public string Password { get; set; } = null!;
    }
}
