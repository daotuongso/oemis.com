using Backend.Infrastructure.Data;
using Backend.Application.DTOs;
using Backend.Domain.Entities.Inventory;
using Backend.Application.Services.Interfaces;
using Microsoft.EntityFrameworkCore;

namespace Backend.Application.Services
{
    public sealed class ReportService : IReportService
    {
        private readonly OrchidContext _ctx;
        public ReportService(OrchidContext ctx) => _ctx = ctx;

        public async Task<IEnumerable<StockReportLineDto>> GetStockReportAsync(
            DateTime from, DateTime to)
        {
            /* ---------- 1. Lấy tồn hiện tại ---------- */
            var current = await _ctx.ProductStocks
                .AsNoTracking()
                .GroupBy(s => s.ProductId)
                .Select(g => new { g.Key, Qty = g.Sum(s => s.Qty) })
                .ToDictionaryAsync(k => k.Key, v => v.Qty);

            /* ---------- 2. Delta trước “from” ---------- */
            var deltaBefore = await _ctx.StockTxns
                .AsNoTracking()
                .Where(t => t.CreatedAt < from)
                .GroupBy(t => t.ProductId)
                .Select(g => new
                {
                    g.Key,
                    Delta = g.Where(t => t.Type == StockTxnType.In).Sum(t => t.Quantity) -
                            g.Where(t => t.Type == StockTxnType.Out).Sum(t => t.Quantity)
                })
                .ToDictionaryAsync(k => k.Key, v => v.Delta);

            /* ---------- 3. Giao dịch “from → to” ---------- */
            var period = await _ctx.StockTxns
                .AsNoTracking()
                .Where(t => t.CreatedAt >= from && t.CreatedAt <= to)
                .GroupBy(t => t.ProductId)
                .Select(g => new
                {
                    g.Key,
                    InQty = g.Where(t => t.Type == StockTxnType.In).Sum(t => t.Quantity),
                    OutQty = g.Where(t => t.Type == StockTxnType.Out).Sum(t => t.Quantity)
                })
                .ToDictionaryAsync(k => k.Key, v => (v.InQty, v.OutQty));

            /* ---------- 4. Tổng hợp báo cáo ---------- */
            var products = await _ctx.Products
                .AsNoTracking()
                .Select(p => new { p.Id, p.Name })
                .OrderBy(p => p.Id)
                .ToListAsync();

            var report = products.Select(p =>
            {
                deltaBefore.TryGetValue(p.Id, out var delta);
                current.TryGetValue(p.Id, out var qtyNow);
                var opening = qtyNow - delta;

                period.TryGetValue(p.Id, out var mv);
                var inQty = mv.InQty;
                var outQty = mv.OutQty;

                return new StockReportLineDto(
                    p.Id,
                    p.Name,
                    opening,
                    inQty,
                    outQty,
                    opening + inQty - outQty
                );
            });

            return report;
        }
    }
}
