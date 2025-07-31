using System;
using System.Threading.Tasks;
using Backend.Infrastructure.Data;
using Backend.Application.Services.Interfaces;
using Microsoft.EntityFrameworkCore;
using Backend.Domain.Entities.Inventory;

namespace Backend.Application.Services
{
    /// <inheritdoc />
    public sealed class InventoryService : IInventoryService
    {
        private readonly OrchidContext _ctx;
        private const int DEFAULT_WAREHOUSE = 1;

        public InventoryService(OrchidContext ctx) => _ctx = ctx;

        /* ---------- TRA CỨU tồn khả dụng ---------- */
        public async Task<int> GetStockAsync(int productId)
        {
            var ps = await _ctx.ProductStocks
                               .AsNoTracking()
                               .SingleOrDefaultAsync(s => s.ProductId == productId &&
                                                          s.WarehouseId == DEFAULT_WAREHOUSE);

            return ps == null ? 0 : ps.Qty - ps.Reserved;
        }

        /* ---------- ĐIỀU CHỈNH tồn ---------- */
        public async Task<bool> AdjustStockAsync(int productId, int qty, string reference)
        {
            if (qty == 0) return false;

            var ps = await _ctx.ProductStocks
                               .SingleOrDefaultAsync(s => s.ProductId == productId &&
                                                          s.WarehouseId == DEFAULT_WAREHOUSE);

            if (ps == null)
            {
                ps = new ProductStock
                {
                    ProductId = productId,
                    WarehouseId = DEFAULT_WAREHOUSE,
                    Qty = 0,
                    Reserved = 0
                };
                _ctx.ProductStocks.Add(ps);
            }

            /* xuất kho nhưng không đủ hàng */
            if (qty < 0 && ps.Qty + qty < 0) return false;

            ps.Qty += qty;

            _ctx.StockTxns.Add(new StockTxn
            {
                ProductId = productId,
                WarehouseId = DEFAULT_WAREHOUSE,
                Quantity = Math.Abs(qty),
                Type = qty > 0 ? StockTxnType.In : StockTxnType.Out,
                Reference = reference,
                CreatedAt = DateTime.UtcNow
            });

            await _ctx.SaveChangesAsync();
            return true;
        }

        /* ---------- GIỮ HÀNG KHI XÁC NHẬN ĐƠN ---------- */
        public async Task ReserveForOrderAsync(int orderId)
        {
            var order = await _ctx.Orders
                                  .Include(o => o.Items)
                                  .SingleAsync(o => o.Id == orderId);

            foreach (var line in order.Items)
            {
                var ps = await _ctx.ProductStocks
                                   .SingleAsync(s => s.ProductId == line.ProductId &&
                                                     s.WarehouseId == DEFAULT_WAREHOUSE);

                if (ps.Qty - ps.Reserved < line.Quantity)
                    throw new InvalidOperationException("Không đủ tồn kho");

                ps.Reserved += line.Quantity;

                _ctx.StockTxns.Add(new StockTxn
                {
                    ProductId = line.ProductId,
                    WarehouseId = DEFAULT_WAREHOUSE,
                    Quantity = line.Quantity,
                    Type = StockTxnType.Reserve,
                    Reference = $"ORDER#{order.Id}",
                    CreatedAt = DateTime.UtcNow
                });
            }

            await _ctx.SaveChangesAsync();
        }

        /* ---------- HỦY GIỮ HÀNG ---------- */
        public async Task ReleaseOrderAsync(int orderId)
        {
            var order = await _ctx.Orders
                                  .Include(o => o.Items)
                                  .SingleAsync(o => o.Id == orderId);

            foreach (var line in order.Items)
            {
                var ps = await _ctx.ProductStocks
                                   .SingleAsync(s => s.ProductId == line.ProductId &&
                                                     s.WarehouseId == DEFAULT_WAREHOUSE);

                ps.Reserved -= line.Quantity;

                _ctx.StockTxns.Add(new StockTxn
                {
                    ProductId = line.ProductId,
                    WarehouseId = DEFAULT_WAREHOUSE,
                    Quantity = line.Quantity,
                    Type = StockTxnType.Release,
                    Reference = $"ORDER#{order.Id}",
                    CreatedAt = DateTime.UtcNow
                });
            }

            await _ctx.SaveChangesAsync();
        }
    }
}
