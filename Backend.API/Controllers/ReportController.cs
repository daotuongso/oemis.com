using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Backend.Infrastructure.Data;
using Backend.Application.DTOs;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace Backend.Controllers;

[ApiController]
[Route("api/report")]
public class ReportController : ControllerBase
{
    private readonly OrchidContext _ctx;
    public ReportController(OrchidContext ctx) => _ctx = ctx;

    // GET api/report/sales?from=YYYY-MM-DD&to=YYYY-MM-DD
    [HttpGet("sales")]
    public async Task<IReadOnlyList<SalesDailyDto>> GetSales(
        [FromQuery] DateTime from,
        [FromQuery] DateTime to)
    {
        // 1) Lấy OrderItem trong khoảng ngày — KHÔNG GroupBy
        var raw = await _ctx.OrderItems
            .Where(it => it.Order.CreatedAt >= from && it.Order.CreatedAt <= to)
            .Select(it => new
            {
                Date = it.Order.CreatedAt.Date,
                Value = it.Quantity * it.UnitPrice
            })
            .AsNoTracking()
            .ToListAsync();

        // 2) GroupBy & Sum phía client
        var result = raw
            .GroupBy(x => x.Date)
            .OrderBy(g => g.Key)
            .Select(g => new SalesDailyDto(g.Key, g.Sum(x => x.Value)))
            .ToList();

        return result;
    }
}
