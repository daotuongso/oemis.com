using Backend.Application.DTOs.Procurement;
using Backend.Domain.Entities.Procurement;
using Backend.Domain.Interfaces;
using Backend.Infrastructure.Data;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace Backend.Controllers
{
    [ApiController]
    [Route("api/[controller]")]

    /*  ⚠️  Cho phép cả Admin _và_ Purchasing đi vào các API của mua‑hàng            */
    [Authorize(Roles = "Admin,Purchasing")]
    public class PurchaseController : ControllerBase
    {
        private readonly OrchidContext _ctx;
        private readonly IPurchaseService _svc;

        public PurchaseController(OrchidContext ctx, IPurchaseService svc)
        {
            _ctx = ctx;
            _svc = svc;
        }

        /*────────────── SUPPLIER ──────────────*/
        [HttpGet("suppliers")]
        public async Task<IEnumerable<SupplierDto>> Suppliers() =>
            await _ctx.Suppliers
                      .Select(s => new SupplierDto(
                          s.Id, s.Name, s.Phone, s.Email, s.Address, s.IsActive))
                      .ToListAsync();

        [HttpPost("suppliers")]
        public async Task<IActionResult> AddSupplier([FromBody] SupplierCreateDto d)
        {
            var s = new Supplier
            {
                Name = d.Name,
                Phone = d.Phone,
                Email = d.Email,
                Address = d.Address
            };
            _ctx.Suppliers.Add(s);
            await _ctx.SaveChangesAsync();
            return Created($"suppliers/{s.Id}", new { s.Id });
        }

        /*──────────── PURCHASE REQUEST ────────────*/
        /* PR list (bảng) */
        [HttpGet("pr")]
        public async Task<IEnumerable<object>> ListPr() =>
            await _ctx.PurchaseRequests
                      .Select(p => new
                      {
                          p.Id,
                          p.Code,
                          p.CreatedAt,
                          lines = p.Lines.Count,
                          p.Status
                      })
                      .OrderByDescending(p => p.Id)
                      .ToListAsync();

        /* PR detail – tạo PO cần lines */
        [HttpGet("pr/{id:int}")]
        public async Task<IActionResult> PrDetail(int id)
        {
            var pr = await _ctx.PurchaseRequests
                               .Include(p => p.Lines)
                               .FirstOrDefaultAsync(p => p.Id == id);
            if (pr == null) return NotFound();

            return Ok(new
            {
                pr.Id,
                pr.Code,
                pr.Status,
                pr.CreatedAt,
                lines = pr.Lines.Select(l => new
                {
                    l.ProductId,
                    l.Qty,
                    l.Price
                })
            });
        }

        [HttpPost("pr")]
        public async Task<IActionResult> CreatePr([FromBody] PrCreateDto d)
        {
            var pr = await _svc.CreateRequestAsync(
                         User.Identity!.Name!,
                         d.Lines.Select(l => (l.ProductId, l.Qty, l.Price)));

            return Created($"pr/{pr.Id}", new { pr.Id });
        }

        [HttpPost("pr/{id:int}/approve")]
        public async Task<IActionResult> ApprovePr(int id)
        {
            await _svc.ApproveRequestAsync(id, User.Identity!.Name!);
            return NoContent();
        }

        [HttpPost("pr/{id:int}/reject")]
        public async Task<IActionResult> RejectPr(int id, [FromBody] string reason)
        {
            await _svc.RejectRequestAsync(id, User.Identity!.Name!, reason);
            return NoContent();
        }

        /*──────────── PURCHASE ORDER ────────────*/
        [HttpGet("po")]
        public async Task<IEnumerable<object>> ListPo() =>
            await _ctx.PurchaseOrders
                      .Include(p => p.Supplier)
                      .Select(p => new
                      {
                          p.Id,
                          p.Code,
                          p.OrderedAt,
                          supplierName = p.Supplier.Name,
                          p.Total,
                          p.Status
                      })
                      .OrderByDescending(p => p.Id)
                      .ToListAsync();

        [HttpPost("po")]
        public async Task<IActionResult> CreatePo([FromBody] PoCreateDto d)
        {
            var po = await _svc.CreatePOAsync(
                         d.SupplierId,
                         d.PurchaseRequestId,
                         d.Lines.Select(l => (l.ProductId, l.Qty, l.Price)));

            return Created($"po/{po.Id}", new { po.Id });
        }

        /* Nhận hàng – tăng kho */
        [HttpPost("po/{id:int}/receive")]
        public async Task<IActionResult> Receive(int id, [FromBody] ReceiveDto d)
        {
            await _svc.ReceiveGoodsAsync(id, d.ReceivedBy);
            return NoContent();
        }
    }
}
