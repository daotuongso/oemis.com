using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Backend.Domain.Entities;
using Backend.Infrastructure.Data;
using Backend.Application.DTOs;

namespace Backend.Controllers;

[Route("api/[controller]")]
[ApiController]
[Authorize(Roles = "Admin,Sales")]
public class CustomersController : ControllerBase
{
    private readonly OrchidContext _context;
    public CustomersController(OrchidContext context) => _context = context;

    /* ---------- LIST ---------- */
    [HttpGet]
    public async Task<ActionResult<IEnumerable<CustomerDto>>> GetCustomers()
    {
        var data = await _context.Customers
            .Select(x => new CustomerDto
            {
                Id = x.Id,
                FullName = x.FullName,
                Email = x.Email,
                Phone = x.Phone,
                Address = x.Address,
                Notes = x.Notes,
                Tags = x.Tags,
                GroupId = x.GroupId
            })
            .ToListAsync();
        return Ok(data);
    }

    /* ---------- DETAIL ---------- */
    [HttpGet("{id:int}")]
    public async Task<ActionResult<CustomerDto>> GetCustomer(int id)
    {
        var x = await _context.Customers.FindAsync(id);
        if (x == null) return NotFound();

        return Ok(new CustomerDto
        {
            Id = x.Id,
            FullName = x.FullName,
            Email = x.Email,
            Phone = x.Phone,
            Address = x.Address,
            Notes = x.Notes,
            Tags = x.Tags,
            GroupId = x.GroupId
        });
    }

    /* ---------- CREATE ---------- */
    [HttpPost]
    public async Task<ActionResult<CustomerDto>> PostCustomer(CustomerDto dto)
    {
        var customer = new Customer
        {
            FullName = dto.FullName,
            Email = dto.Email,
            Phone = dto.Phone,
            Address = dto.Address,
            Notes = dto.Notes,
            Tags = dto.Tags,
            GroupId = dto.GroupId
        };
        _context.Customers.Add(customer);
        await _context.SaveChangesAsync();

        dto.Id = customer.Id;
        return CreatedAtAction(nameof(GetCustomer), new { id = customer.Id }, dto);
    }

    /* ---------- UPDATE ---------- */
    [HttpPut("{id:int}")]
    public async Task<IActionResult> PutCustomer(int id, CustomerDto dto)
    {
        if (id != dto.Id) return BadRequest();

        var customer = await _context.Customers.FindAsync(id);
        if (customer == null) return NotFound();

        customer.FullName = dto.FullName;
        customer.Email = dto.Email;
        customer.Phone = dto.Phone;
        customer.Address = dto.Address;
        customer.Notes = dto.Notes;
        customer.Tags = dto.Tags;
        customer.GroupId = dto.GroupId;

        _context.Entry(customer).State = EntityState.Modified;
        await _context.SaveChangesAsync();
        return NoContent();
    }

    /* ---------- UPDATE GROUP ---------- */
    [HttpPut("{id:int}/group")]
    public async Task<IActionResult> UpdateGroup(int id, [FromBody] dynamic body)
    {
        var customer = await _context.Customers.FindAsync(id);
        if (customer == null) return NotFound();

        int? newGroupId = body?.groupId?.Value as int?;
        customer.GroupId = newGroupId;
        await _context.SaveChangesAsync();
        return NoContent();
    }

    /* ---------- DELETE ---------- */
    [HttpDelete("{id:int}")]
    public async Task<IActionResult> DeleteCustomer(int id)
    {
        var customer = await _context.Customers.FindAsync(id);
        if (customer == null) return NotFound();

        _context.Customers.Remove(customer);
        await _context.SaveChangesAsync();
        return NoContent();
    }
}
