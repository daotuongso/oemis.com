using System;
using System.Linq;
using System.Threading.Tasks;
using Backend.Infrastructure.Data;
using Backend.Application.DTOs;
using Backend.Application.Services; // EmailService
using Backend.Infrastructure.Utils;    // PdfUtil
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;

namespace Backend.Application.Services
{
    /// <summary>
    /// Gửi báo cáo PDF doanh thu mỗi tuần (đơn hàng 7 ngày gần nhất).
    /// </summary>
    public class WeeklyReportService
    {
        private readonly OrchidContext _ctx;
        private readonly EmailService _mail;
        private readonly IConfiguration _cfg;

        public WeeklyReportService(
            OrchidContext ctx,
            EmailService mail,
            IConfiguration cfg)
        {
            _ctx = ctx;
            _mail = mail;
            _cfg = cfg;
        }

        public async Task SendWeeklyAsync()
        {
            var today = DateTime.UtcNow.Date;      // thứ Hai 00:00 khi Hangfire chạy
            var start = today.AddDays(-7);         // tuần trước

            /* 1) Lấy OrderItems trong phạm vi */
            var raw = await _ctx.OrderItems
                .Where(i => i.Order != null && i.Order!.CreatedAt.Date >= start && i.Order.CreatedAt.Date < today)
                .Select(i => new                       // chỉ 2 cột cần thiết
                {
                    Date = i.Order!.CreatedAt.Date,
                    Value = i.Quantity * i.UnitPrice
                })
                .AsNoTracking()
                .ToListAsync();

            /* 2) Gom nhóm & tổng hợp */
            var rows = raw
                .GroupBy(r => r.Date)
                .Select(g => new SalesDailyDto(g.Key, g.Sum(x => x.Value)))
                .OrderBy(r => r.Date)
                .ToList();

            if (rows.Count == 0) return;            // Không có dữ liệu, bỏ gửi

            /* 3) Sinh PDF */
            var pdf = PdfUtil.BuildSalesPdf(rows, start, today.AddDays(-1));

            /* 4) Gửi email */
            var recipients = _cfg["Report:Recipients"] ?? "boss@orchid.com";
            var subject = $"Báo cáo doanh thu {start:dd/MM} – {today.AddDays(-1):dd/MM}";
            const string body = "<p>Đính kèm báo cáo doanh thu tuần vừa qua.</p>";

            await _mail.SendAsync(
                recipients,
                subject,
                body,
                pdf,
                $"sales_{start:yyyyMMdd}_{today.AddDays(-1):yyyyMMdd}.pdf");
        }
    }
}
