using Backend.Infrastructure.Data;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace Backend.Controllers;

[ApiController]
[Route("sitemap.xml")]
public class SitemapController : ControllerBase
{
  private readonly OrchidContext _ctx;
  public SitemapController(OrchidContext ctx) => _ctx = ctx;

  [HttpGet]
  public async Task<IActionResult> Get()
  {
    var host = $"{Request.Scheme}://{Request.Host}";
    var urls = new List<string> { $"{host}/" };
    urls.AddRange(await _ctx.Categories.Select(c => $"{host}/danh-muc/{c.Slug}").ToListAsync());
    urls.AddRange(await _ctx.Products.Select(p => $"{host}/san-pham/{p.Slug}").ToListAsync());

    var xml = $"""
        <?xml version="1.0" encoding="utf-8"?>
        <urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
          {string.Join("", urls.Select(u => $"<url><loc>{u}</loc></url>"))}
        </urlset>
        """;
    return Content(xml, "application/xml");
  }
}
