// Backend/Models/Dto/OrderLineDto.cs
namespace Backend.Application.DTOs
{
    public record OrderLineDto(
        string ProductName,
        int Quantity,
        decimal UnitPrice);
}


