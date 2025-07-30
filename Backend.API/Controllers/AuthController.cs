using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using System.Net.Mail;
using Backend.Application.DTOs;
using Backend.Domain.Entities;

[ApiController]
[Route("api/[controller]")]
public class AuthController : ControllerBase
{
    private readonly UserManager<IdentityUser> _userMgr;
    private readonly IConfiguration _cfg;

    public AuthController(UserManager<IdentityUser> users, IConfiguration cfg)
        => (_userMgr, _cfg) = (users, cfg);

    /* ───────────── LOGIN ───────────── */
    [AllowAnonymous]
    [HttpPost("login")]
    public async Task<IActionResult> Login([FromBody] LoginDto dto)
    {
        if (!ModelState.IsValid) return BadRequest(ModelState);

        var user = await _userMgr.FindByEmailAsync(dto.Email);
        if (user == null) return Unauthorized(new { detail = "Email hoặc mật khẩu không đúng." });

        if (!await _userMgr.CheckPasswordAsync(user, dto.Password))
            return Unauthorized(new { detail = "Email hoặc mật khẩu không đúng." });

        var roles = await _userMgr.GetRolesAsync(user);

        var claims = new List<Claim>
        {
            new(JwtRegisteredClaimNames.Sub,  user.Email!),
            new(ClaimTypes.NameIdentifier,    user.Id),
            new(ClaimTypes.Email,             user.Email!)
        };
        claims.AddRange(roles.Select(r => new Claim(ClaimTypes.Role, r)));

        return Ok(new { token = BuildToken(claims) });
    }

    /* ─────────── REGISTER ─────────── */
    [AllowAnonymous]
    [HttpPost("register")]
    public async Task<IActionResult> Register([FromBody] RegisterDto dto)
    {
        if (!ModelState.IsValid) return BadRequest(ModelState);

        if (await _userMgr.FindByEmailAsync(dto.Email) != null)
            return Conflict(new { detail = "Email đã tồn tại." });

        var user = new IdentityUser
        {
            UserName = dto.Email,
            Email = dto.Email,
            EmailConfirmed = true          // Cho phép đăng nhập ngay
        };

        var create = await _userMgr.CreateAsync(user, dto.Password);
        if (!create.Succeeded)
            return BadRequest(new
            {
                detail = string.Join(", ",
                                create.Errors.Select(e => e.Description))
            });

        await _userMgr.AddToRoleAsync(user, "Customer");      // Gán quyền mặc định

        var claims = new List<Claim>
        {
            new(JwtRegisteredClaimNames.Sub,  user.Email!),
            new(ClaimTypes.NameIdentifier,    user.Id),
            new(ClaimTypes.Email,             user.Email!),
            new(ClaimTypes.Role,              "Customer")
        };

        return Ok(new { token = BuildToken(claims) });
    }

    /* ─────────── PASSWORD FLOW ─────────── */
    public record ForgotPasswordDto(string Email);
    public record ResetPasswordDto(string Email, string Token, string NewPassword);

    [AllowAnonymous]
    [HttpPost("forgot-password")]
    public async Task<IActionResult> ForgotPassword([FromBody] ForgotPasswordDto dto)
    {
        var user = await _userMgr.FindByEmailAsync(dto.Email);
        if (user == null) return Ok();          // Không tiết lộ

        var token = await _userMgr.GeneratePasswordResetTokenAsync(user);
        var baseUrl = _cfg["App:BaseUrl"] ?? "http://localhost:3000";
        var link = $"{baseUrl}/reset-password?email={Uri.EscapeDataString(dto.Email)}&token={Uri.EscapeDataString(token)}";

        try
        {
            await SendEmailAsync(dto.Email, "Đặt lại mật khẩu",
                $"<p>Nhấn vào link sau để đặt lại mật khẩu:</p><p><a href=\"{link}\">{link}</a></p>");
            return Ok();
        }
        catch
        {
            return StatusCode(500, new { detail = "Không gửi được email." });
        }
    }

    [AllowAnonymous]
    [HttpPost("reset-password")]
    public async Task<IActionResult> ResetPassword([FromBody] ResetPasswordDto dto)
    {
        var user = await _userMgr.FindByEmailAsync(dto.Email);
        if (user == null) return BadRequest(new { detail = "Không tìm thấy user." });

        var res = await _userMgr.ResetPasswordAsync(user, dto.Token, dto.NewPassword);
        if (!res.Succeeded)
            return BadRequest(new
            {
                detail = string.Join(", ",
                                res.Errors.Select(e => e.Description))
            });
        return Ok();
    }

    /* ─────────── HELPERS ─────────── */
    private string BuildToken(IEnumerable<Claim> claims)
    {
        var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(_cfg["Jwt:Key"]!));
        var creds = new SigningCredentials(key, SecurityAlgorithms.HmacSha256);

        var jwt = new JwtSecurityToken(
            issuer: _cfg["Jwt:Issuer"],
            audience: _cfg["Jwt:Audience"],
            claims: claims,
            expires: DateTime.UtcNow.AddHours(6),
            signingCredentials: creds);

        return new JwtSecurityTokenHandler().WriteToken(jwt);
    }

    private static async Task SendEmailAsync(string to, string subject, string html)
    {
        using var smtp = new SmtpClient("smtp.gmail.com")
        {
            Port = 587,
            EnableSsl = true,
            Credentials = new System.Net.NetworkCredential("daotuongso@gmail.com", "azzghoihsxfkcave")
        };
        var mail = new MailMessage
        {
            From = new MailAddress("daotuongso@gmail.com", "E‑COMMERCE"),
            Subject = subject,
            Body = html,
            IsBodyHtml = true
        };
        mail.To.Add(to);
        await smtp.SendMailAsync(mail);
    }
}
