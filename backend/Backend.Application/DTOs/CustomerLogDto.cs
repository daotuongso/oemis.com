namespace Backend.Application.DTOs
{
    public record CustomerLogDto(int Id, int CustomerId, DateTime DateCreated, string Content);
}