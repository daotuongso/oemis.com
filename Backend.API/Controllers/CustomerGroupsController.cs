using Backend.Infrastructure.Data;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Backend.Application.DTOs;
using Backend.Domain.Entities;

namespace Backend.API.Controllers;

[ApiController]
[Route("api/customers/groups")]
public class CustomerGroupsController : ControllerBase
{
    private readonly OrchidContext _ctx;
    public CustomerGroupsController(OrchidContext ctx) => _ctx = ctx;

    // GET api/customers/groups
    [HttpGet]
    public async Task<ActionResult<IEnumerable<CustomerGroupDto>>> Get() =>
        await _ctx.CustomerGroups
            .Select(g => new CustomerGroupDto(g.Id, g.Name, g.Description))
            .ToListAsync();

    // POST api/customers/groups
    [HttpPost]
    public async Task<IActionResult> Create(CustomerGroupDto dto)
    {
        var g = new CustomerGroup { Name = dto.Name, Description = dto.Description };
        _ctx.CustomerGroups.Add(g); await _ctx.SaveChangesAsync();
        return CreatedAtAction(nameof(Get), new { id = g.Id }, dto with { Id = g.Id });
    }

    // PUT api/customers/groups/{id}
    [HttpPut("{id:int}")]
    public async Task<IActionResult> Update(int id, CustomerGroupDto dto)
    {
        if (id != dto.Id) return BadRequest();
        var g = await _ctx.CustomerGroups.FindAsync(id);
        if (g == null) return NotFound();
        g.Name = dto.Name; g.Description = dto.Description;
        await _ctx.SaveChangesAsync(); return NoContent();
    }

    // DELETE api/customers/groups/{id}
    [HttpDelete("{id:int}")]
    public async Task<IActionResult> Delete(int id)
    {
        var g = await _ctx.CustomerGroups.Include(x => x.Customers)
                                         .FirstOrDefaultAsync(x => x.Id == id);
        if (g == null) return NotFound();
        if (g.Customers.Any())           // ràng buộc an toàn
            return BadRequest("Group is not empty.");
        _ctx.CustomerGroups.Remove(g); await _ctx.SaveChangesAsync();
        return NoContent();
    }
}
