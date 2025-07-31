using System;
using System.Linq;
using System.Threading.Tasks;
using Backend.Infrastructure.Data;
using Backend.Application.DTOs;
using Backend.Domain.Entities;
using Backend.Application.Services.Interfaces;
using Microsoft.EntityFrameworkCore;

public class StockCountService : IStockCountService
{
    private readonly OrchidContext _ctx;
    private readonly IInventoryService _inv;
    public StockCountService(OrchidContext c, IInventoryService inv)
    {
        _ctx = c;
        _inv = inv;
    }

    /*────── 1. MỞ PHIẾU ──────*/
    public async Task<StockCountSheet> OpenAsync(
        CountSheetCreateDto dto, string user)
    {
        var sheet = new StockCountSheet
        {
            Code = $"SC{DateTime.UtcNow:yyyyMMddHHmmss}",
            StartedAt = DateTime.UtcNow,
        };

        foreach (var l in dto.Lines)
        {
            var qtySys = await _inv.GetStockAsync(l.ProductId);
            sheet.Lines.Add(new StockCountLine
            {
                ProductId = l.ProductId,
                QtySystem = qtySys,
                QtyActual = l.QtyActual
            });
        }

        _ctx.StockCountSheets.Add(sheet);
        await _ctx.SaveChangesAsync();
        return sheet;
    }

    /*────── 2. CHỐT PHIẾU ──────*/
    public async Task<StockCountSheet> CloseAsync(
        int id, CountSheetCloseDto dto, string user)
    {
        var sheet = await _ctx.StockCountSheets
                              .Include(s => s.Lines)
                              .SingleAsync(s => s.Id == id);

        if (sheet.ClosedAt != null)
            throw new InvalidOperationException("Sheet closed");

        foreach (var l in dto.Lines)
        {
            var line = sheet.Lines.Single(x => x.ProductId == l.ProductId);
            line.QtyActual = l.QtyActual;

            var diff = line.Diff;
            if (diff != 0)
            {
                await _inv.AdjustStockAsync(
                    l.ProductId,
                    diff,
                    $"COUNT#{sheet.Code}");
            }
        }

        sheet.ClosedAt = DateTime.UtcNow;
        await _ctx.SaveChangesAsync();
        return sheet;
    }

    /*────── 3. LẤY CHI TIẾT PHIẾU ──────*/
    public async Task<StockCountSheet?> GetByIdAsync(int id)
    {
        return await _ctx.StockCountSheets
                         .Include(s => s.Lines)
                         .AsNoTracking()
                         .FirstOrDefaultAsync(s => s.Id == id);
    }
}
