using System.Linq;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Backend.Infrastructure.Data;

namespace Backend.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class AccountsController : ControllerBase
    {
        private readonly OrchidContext _ctx;
        public AccountsController(OrchidContext ctx) => _ctx = ctx;

        [HttpGet]
        public IActionResult GetAll()
        {
            var list = _ctx.Accounts
                .Include(a => a.Parent)
                .Select(a => new
                {
                    id = a.Id,
                    code = a.Code,
                    name = a.Name,
                    type = a.Type,
                    parentId = a.ParentId,
                    parentName = a.Parent != null ? a.Parent.Name : null
                })
                .ToList();
            return Ok(list);
        }
    }
}
