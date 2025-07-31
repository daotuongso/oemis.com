using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Backend.Infrastructure.Entities;

namespace Backend.API.Controllers;

[Authorize(Roles = "Admin")]
[ApiController]
[Route("api/[controller]")]
public class UsersController : ControllerBase
{
    private readonly UserManager<ApplicationUser> _userMgr;
    private readonly RoleManager<IdentityRole> _roleMgr;

    public UsersController(UserManager<ApplicationUser> u, RoleManager<IdentityRole> r)
        => (_userMgr, _roleMgr) = (u, r);

    /* -------- GET LIST -------- */
    [HttpGet]
    public async Task<IEnumerable<object>> GetUsers()
    {
        var list = new List<object>();
        foreach (var u in _userMgr.Users)
        {
            var roles = await _userMgr.GetRolesAsync(u);
            list.Add(new
            {
                u.Id,
                u.Email,
                Roles = roles,
                IsLocked = u.LockoutEnd != null && u.LockoutEnd > DateTime.UtcNow
            });
        }
        return list;
    }

    /* -------- GET SINGLE -------- */
    [HttpGet("{id}")]
    public async Task<IActionResult> GetUser(string id)
    {
        var u = await _userMgr.FindByIdAsync(id);
        if (u == null) return NotFound();

        var roles = await _userMgr.GetRolesAsync(u);
        return Ok(new
        {
            u.Id,
            u.Email,
            Roles = roles,
            IsLocked = u.LockoutEnd != null && u.LockoutEnd > DateTime.UtcNow
        });
    }

    /* -------- UPDATE ROLES -------- */
    [HttpPut("{id}/roles")]
    public async Task<IActionResult> UpdateRoles(string id, [FromBody] RoleUpdateDto dto)
    {
        if (dto.Roles == null || dto.Roles.Count == 0)
            return BadRequest("Roles rỗng!");

        foreach (var r in dto.Roles)
            if (!await _roleMgr.RoleExistsAsync(r))
                return BadRequest($"Role “{r}” không tồn tại.");

        var user = await _userMgr.FindByIdAsync(id);
        if (user == null) return NotFound();

        var current = await _userMgr.GetRolesAsync(user);
        await _userMgr.RemoveFromRolesAsync(user, current.Except(dto.Roles));
        var res = await _userMgr.AddToRolesAsync(user, dto.Roles.Except(current));

        return res.Succeeded ? NoContent() : BadRequest(res.Errors);
    }

    /* -------- LOCK / UNLOCK -------- */
    [HttpPatch("{id}/lock")] public Task<IActionResult> Lock(string id) => ToggleLock(id, true);
    [HttpPatch("{id}/unlock")] public Task<IActionResult> Unlock(string id) => ToggleLock(id, false);

    private async Task<IActionResult> ToggleLock(string id, bool lockUser)
    {
        var u = await _userMgr.FindByIdAsync(id);
        if (u == null) return NotFound();

        await _userMgr.SetLockoutEndDateAsync(u,
            lockUser ? DateTimeOffset.UtcNow.AddYears(100) : null);
        return NoContent();
    }

    public class RoleUpdateDto
    {
        public List<string> Roles { get; set; } = new();
    }
}
