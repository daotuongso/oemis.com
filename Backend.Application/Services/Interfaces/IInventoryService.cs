using System.Threading.Tasks;

namespace Backend.Application.Services.Interfaces
{
    /// <summary>Giao diện dịch vụ quản lý tồn kho.</summary>
    public interface IInventoryService
    {
        /// Số lượng còn có thể bán (Qty – Reserved)
        Task<int> GetStockAsync(int productId);

        /// Điều chỉnh kho (IN/OUT). Trả về <c>false</c> nếu không đủ tồn xuất.
        Task<bool> AdjustStockAsync(int productId, int qty, string reference);

        /// Giữ hàng khi đơn ở trạng thái Confirmed
        Task ReserveForOrderAsync(int orderId);

        /// Trả hàng đã giữ khi đơn bị hủy
        Task ReleaseOrderAsync(int orderId);
    }
}
