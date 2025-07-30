using Backend.Application.DTOs;
using Backend.Domain.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace Backend.Controllers
{
    /// <summary>
    /// API mở and chốt phiếu kiểm kê kho
    /// </summary>
    [ApiController]
    [Route("api/stock/counts")]
    [Authorize(Roles = "Admin,Warehouse")]          // chỉ quản‑trị & thủ‑kho
    public class StockCountController : ControllerBase
    {
        private readonly IStockCountService _svc;
        public StockCountController(IStockCountService svc) => _svc = svc;

        /*──────────── 1. MỞ PHIẾU KIỂM KÊ ────────────*/
        /// POST /api/stock/counts
        /// Body: { "lines":[{ "productId":1,"qtyActual":0 }, …] }
        [HttpPost]
        public async Task<ActionResult<StockCountSheet>> Open(
            [FromBody] CountSheetCreateDto dto)
        {
            var user = User.Identity!.Name ?? "system";
            var sheet = await _svc.OpenAsync(dto, user);
            return CreatedAtAction(nameof(GetById), new { id = sheet.Id }, sheet);
        }

        /*──────────── 2. XEM CHI TIẾT PHIẾU ───────────*/
        /// GET /api/stock/counts/5
        [HttpGet("{id:int}")]
        public async Task<ActionResult<StockCountSheet>> GetById(
            int id,
            [FromServices] IStockCountService svc)      // tái dùng service
        {
            var sheet = await svc.GetByIdAsync(id);      // (thêm hàm GetById nếu cần)
            return sheet is null ? NotFound() : Ok(sheet);
        }

        /*──────────── 3. CHỐT & ĐIỀU CHỈNH ────────────*/
        /// POST /api/stock/counts/5/close
        /// Body: { "lines":[{ "productId":1,"qtyActual":105 }, …] }
        [HttpPost("{id:int}/close")]
        public async Task<ActionResult<StockCountSheet>> Close(
            int id, [FromBody] CountSheetCloseDto dto)
        {
            var user = User.Identity!.Name ?? "system";
            var sheet = await _svc.CloseAsync(id, dto, user);
            return Ok(sheet);
        }
    }
}
