using Backend.Infrastructure.Data;
using Backend.Domain.Entities;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Backend.Application.DTOs;

namespace Backend.API.Controllers;

[ApiController]
public class CustomerLogsController : ControllerBase
{
    private readonly OrchidContext _ctx;
    public CustomerLogsController(OrchidContext ctx) => _ctx = ctx;

    // GET api/customers/{customerId}/logs
    [HttpGet("api/customers/{customerId:int}/logs")]
    public async Task<ActionResult<IEnumerable<CustomerLogDto>>> GetLogs(int customerId) =>
        await _ctx.CustomerLogs.Where(l => l.CustomerId == customerId)
            .OrderByDescending(l => l.LogTime)
            .Select(l => new CustomerLogDto(l.Id, l.CustomerId, l.LogTime, l.Content))
            .ToListAsync();

    // POST api/customers/{customerId}/logs
    [HttpPost("api/customers/{customerId:int}/logs")]
    public async Task<IActionResult> AddLog(int customerId, [FromBody] CustomerLogDto body)
    {
        if (!await _ctx.Customers.AnyAsync(c => c.Id == customerId)) return NotFound();
        var log = new CustomerLog { CustomerId = customerId, Content = body.Content };
        _ctx.CustomerLogs.Add(log); await _ctx.SaveChangesAsync();
        return Ok(new CustomerLogDto(log.Id, customerId, log.LogTime, log.Content));
    }

    // DELETE api/customers/logs/{id}
    [HttpDelete("api/customers/logs/{id:int}")]
    public async Task<IActionResult> DeleteLog(int id)
    {
        var log = await _ctx.CustomerLogs.FindAsync(id);
        if (log == null) return NotFound();
        _ctx.CustomerLogs.Remove(log); await _ctx.SaveChangesAsync();
        return NoContent();
    }
}
