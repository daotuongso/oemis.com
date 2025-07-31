using Backend.Domain.Entities;

namespace Backend.Application.Services.Interfaces
{

    /// <summary>Đồng bộ dữ liệu CRM sang ERP (cùng solution duy nhất).</summary>
    public interface ICrmSyncService
    {
        /// <summary>Đồng bộ khách hàng vừa tạo/cập nhật bên CRM.</summary>
        Task SyncCustomerAsync(Customer customer);

        /// <summary>Đồng bộ đơn bán khi trạng thái Confirmed.</summary>
        Task SyncOrderAsync(Order crmOrder);
    }

}