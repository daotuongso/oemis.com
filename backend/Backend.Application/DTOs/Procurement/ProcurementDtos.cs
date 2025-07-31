namespace Backend.Application.DTOs.Procurement
{
    /* Supplier */
    public record SupplierDto(int Id, string Name, string? Phone, string? Email, string? Address, bool IsActive);
    public record SupplierCreateDto(string Name, string? Phone, string? Email, string? Address);

    /* Purchase Request */
    public record PrLineDto(int ProductId, int Qty, decimal Price);
    public record PrCreateDto(IEnumerable<PrLineDto> Lines);

    /* Purchase Order */
    public record PoLineDto(int ProductId, int Qty, decimal Price);
    public record PoCreateDto(int SupplierId, int PurchaseRequestId, IEnumerable<PoLineDto> Lines);

    /* Receive */
    public record ReceiveDto(string ReceivedBy);
}
