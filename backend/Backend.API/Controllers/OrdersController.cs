using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using Backend.Infrastructure.Data;
using Backend.Domain.Entities;
using Backend.Application.DTOs;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Backend.Application.Services.Interfaces;
using Backend.Domain.Enums;

namespace Backend.API.Controllers;

[ApiController]
[Route("api/[controller]")]
public class OrdersController : ControllerBase
{
    private readonly OrchidContext _ctx;
    private readonly IInventoryService _inv;
    private readonly ICrmSyncService _sync;

    public OrdersController(
        OrchidContext ctx,
        IInventoryService inv,
        ICrmSyncService sync) =>
        (_ctx, _inv, _sync) = (ctx, inv, sync);

    /* ---------- tiện ích ---------- */
    private string CurrentEmail() =>
        User.FindFirstValue(ClaimTypes.Email) ??
        User.FindFirstValue(ClaimTypes.NameIdentifier) ??
        User.FindFirstValue(JwtRegisteredClaimNames.Sub) ??
        string.Empty;

    /* ---------- ADMIN & SALES: danh sách ---------- */
    [HttpGet]
    [Authorize(Roles = "Admin,Sales")]
    public async Task<IEnumerable<OrderListDto>> GetAll() =>
        await _ctx.Orders
            .Include(o => o.Items)
            .OrderByDescending(o => o.CreatedAt)
            .Select(o => new OrderListDto(
                o.Id,
                o.CustomerName,
                o.CreatedAt,
                o.Items.Sum(i => i.Quantity * i.UnitPrice),
                o.Status,
                o.PaymentStatus))
            .ToListAsync();

    /* ---------- ADMIN & SALES: đổi trạng thái ---------- */
    [HttpPatch("{id:int}/status")]
    [Authorize(Roles = "Admin,Sales")]
    public async Task<IActionResult> UpdateStatus(int id, [FromBody] OrderStatus status)
    {
        var ord = await _ctx.Orders
                            .Include(o => o.Items)
                            .FirstOrDefaultAsync(o => o.Id == id);
        if (ord == null) return NotFound();

        ord.Status = status;

        if (status == OrderStatus.Confirmed)
        {
            ord.ConfirmedAt = DateTime.UtcNow;
            await _inv.ReserveForOrderAsync(ord.Id);
            await _sync.SyncOrderAsync(ord);
        }
        else if (status == OrderStatus.Cancelled)
            await _inv.ReleaseOrderAsync(ord.Id);

        await _ctx.SaveChangesAsync();
        return NoContent();
    }

    /* ---------- ADMIN & SALES: đánh dấu thanh toán ---------- */
    [HttpPatch("{id:int}/pay")]
    [Authorize(Roles = "Admin,Sales")]
    public async Task<IActionResult> MarkPaid(int id)
    {
        var ord = await _ctx.Orders.FindAsync(id);
        if (ord == null) return NotFound();

        ord.PaymentStatus = PayStatus.Paid;
        ord.PaidAt = DateTime.UtcNow;
        await _ctx.SaveChangesAsync();
        return NoContent();
    }

    /* ---------- KHÁCH: tạo đơn ---------- */
    [HttpPost]
    [Authorize]
    public async Task<IActionResult> Create([FromBody] Order model)
    {
        if (!ModelState.IsValid) return ValidationProblem(ModelState);

        model.CreatedAt = DateTime.UtcNow;
        model.Status = OrderStatus.Pending;
        model.PaymentStatus = PayStatus.Unpaid;
        model.CustomerEmail = CurrentEmail();

        _ctx.Orders.Add(model);
        await _ctx.SaveChangesAsync();

        return CreatedAtAction(nameof(Get), new { id = model.Id }, new { model.Id });
    }

    /* ---------- KHÁCH: lịch sử đơn ---------- */
    [HttpGet("my")]
    [Authorize]
    public async Task<IEnumerable<OrderCustomerDto>> GetMyOrders()
    {
        var email = CurrentEmail();
        return await _ctx.Orders
            .Where(o => o.CustomerEmail == email)
            .Include(o => o.Items).ThenInclude(i => i.Product)
            .OrderByDescending(o => o.CreatedAt)
            .Select(o => new OrderCustomerDto(
                o.Id,
                o.CreatedAt,
                o.Items.Sum(i => i.Quantity * i.UnitPrice),
                o.Status,
                o.PaymentStatus,
                o.Items.Select(i => new OrderLineDto(
                    i.Product!.Name, i.Quantity, i.UnitPrice)),
                o.ConfirmedAt,
                o.ShippedAt,
                o.DeliveredAt,
                o.TrackingCode))
            .ToListAsync();
    }

    /* ---------- Chi tiết đơn ---------- */
    [HttpGet("{id:int}")]
    [Authorize]
    public async Task<IActionResult> Get(int id)
    {
        var ord = await _ctx.Orders
            .Include(o => o.Items).ThenInclude(i => i.Product)
            .FirstOrDefaultAsync(o => o.Id == id);

        if (ord == null) return NotFound();

        var email = CurrentEmail();
        if (!User.IsInRole("Admin") && !User.IsInRole("Sales") &&
            !string.Equals(ord.CustomerEmail, email, StringComparison.OrdinalIgnoreCase))
            return Forbid();

        return Ok(new OrderCustomerDto(
            ord.Id,
            ord.CreatedAt,
            ord.Items.Sum(i => i.Quantity * i.UnitPrice),
            ord.Status,
            ord.PaymentStatus,
            ord.Items.Select(i => new OrderLineDto(
                i.Product!.Name, i.Quantity, i.UnitPrice)),
            ord.ConfirmedAt,
            ord.ShippedAt,
            ord.DeliveredAt,
            ord.TrackingCode));
    }
}
