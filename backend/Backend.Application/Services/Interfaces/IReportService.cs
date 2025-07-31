using Backend.Application.DTOs;

namespace Backend.Application.Services.Interfaces
{
    public interface IReportService
    {
        Task<IEnumerable<StockReportLineDto>> GetStockReportAsync(
            DateTime from, DateTime to);
    }
}
