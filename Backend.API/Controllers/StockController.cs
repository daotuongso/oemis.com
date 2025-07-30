using System.Threading.Tasks;
using Backend.Application.DTOs;
using Backend.Domain.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace Backend.Controllers
{
    /// <summary>API tra cứu, điều chỉnh kho</summary>
    [ApiController]
    [Route("api/[controller]")]
    public class StockController : ControllerBase
    {
        private readonly IInventoryService _inv;
        public StockController(IInventoryService inv) => _inv = inv;

        /* ---------- GET: tồn có thể bán ---------- */
        /// <response code="200">Số lượng khả dụng</response>
        [HttpGet("{productId:int}")]
        public Task<int> Get(int productId) => _inv.GetStockAsync(productId);

        [HttpGet("report")]
        [Authorize(Roles = "Admin,Warehouse")]
        public async Task<IActionResult> Report(DateTime from, DateTime to,
                                        [FromServices] IReportService rep)
        {
            if (to < from) return BadRequest("Invalid date range");
            var data = await rep.GetStockReportAsync(from, to);
            return Ok(data);
        }

        /* ---------- POST: điều chỉnh kho ---------- */
        /// <remarks>
        /// Qty &gt; 0  →  nhập kho (IN)  
        /// Qty &lt; 0  →  xuất kho (OUT)
        /// </remarks>
        /// <response code="200">Điều chỉnh thành công</response>
        /// <response code="400">Không đủ tồn để xuất</response>
        [HttpPost("adjust")]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> Adjust([FromBody] StockAdjustDto dto)
        {
            var ok = await _inv.AdjustStockAsync(dto.ProductId, dto.Qty, dto.Reference);
            return ok ? Ok() : BadRequest("Kho không đủ để xuất.");
        }
    }
}
