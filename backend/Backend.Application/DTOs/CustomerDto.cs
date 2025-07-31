using System.ComponentModel.DataAnnotations;
namespace Backend.Application.DTOs
{
    public class CustomerDto
    {
        public int? Id { get; set; }

        [Required(ErrorMessage = "Họ tên không được để trống.")]
        public string FullName { get; set; }

        [Required(ErrorMessage = "Email không được để trống.")]
        [EmailAddress(ErrorMessage = "Email không đúng định dạng.")]
        public string Email { get; set; }

        [Required(ErrorMessage = "Số điện thoại không được để trống.")]
        public string Phone { get; set; }

        [Required(ErrorMessage = "Địa chỉ không được để trống.")]
        public string Address { get; set; }

        public string? Notes { get; set; }
        public string? Tags { get; set; }
        public int? GroupId { get; set; }
    }
}

