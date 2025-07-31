namespace Backend.Application.DTOs
{

    public class UserDto
    {
        public string Id { get; set; } = null!;
        public string Email { get; set; } = null!;
        public List<string> Roles { get; set; } = new();
        public bool IsLocked { get; set; }
        public DateTime? CreatedAt { get; set; }
    }
}