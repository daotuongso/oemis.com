using Backend.Infrastructure.Data;
using Microsoft.AspNetCore.SignalR;
using Microsoft.EntityFrameworkCore;
using Backend.Application.Services;
using Backend.Application.Services.Interfaces;

public sealed class LowStockMiddleware
{
    private readonly RequestDelegate _next;
    public LowStockMiddleware(RequestDelegate next) => _next = next;

    public async Task Invoke(HttpContext ctx, OrchidContext db,
                             IInventoryService inv,
                             IHubContext<LowStockHub> hub)
    {
        var low = new List<object>();

        foreach (var p in await db.Products
                                  .Where(p => p.MinStock > 0)
                                  .ToListAsync())
        {
            var qty = await inv.GetStockAsync(p.Id);
            if (qty < p.MinStock)
                low.Add(new { p.Id, Name = p.Name, Qty = qty });
        }

        if (low.Count > 0)
        {
            ctx.Response.Headers["X-Low-Stock"] = low.Count.ToString();
            await hub.Clients.Group("Admin").SendAsync("lowStock", low);
        }

        await _next(ctx);
    }
}
