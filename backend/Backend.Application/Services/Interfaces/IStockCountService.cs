public interface IStockCountService
{
    Task<StockCountSheet> OpenAsync(CountSheetCreateDto dto, string user);
    Task<StockCountSheet> CloseAsync(int sheetId, CountSheetCloseDto dto, string user);
    Task<StockCountSheet?> GetByIdAsync(int id);
}