using System.IO;
using System.Net.Mail;
using System.Threading.Tasks;
using Microsoft.Extensions.Options;

namespace Backend.Application.Services
{
    public record SmtpOptions(string Host, int Port, string User, string Pass, string From);

    /// <summary>Gửi email (HTML) và tuỳ chọn đính kèm file.</summary>
    public class EmailService
    {
        private readonly SmtpOptions _opt;
        public EmailService(IOptions<SmtpOptions> opt) => _opt = opt.Value;

        /// <param name="toEmail">Một hoặc nhiều email, phân tách dấu phẩy / chấm phẩy.</param>
        /// <param name="subject">Tiêu đề</param>
        /// <param name="htmlBody">Nội dung HTML</param>
        /// <param name="attachment">byte[] của file đính kèm (có thể null)</param>
        /// <param name="fileName">Tên file đính kèm</param>
        public async Task SendAsync(
            string toEmail,
            string subject,
            string htmlBody,
            byte[]? attachment = null,
            string? fileName = null)
        {
            using var smtp = new SmtpClient(_opt.Host)
            {
                Port = _opt.Port,
                EnableSsl = true,
                Credentials = new System.Net.NetworkCredential(_opt.User, _opt.Pass)
            };

            var mail = new MailMessage
            {
                From = new MailAddress(_opt.From, "Orchid Reports"),
                Subject = subject,
                Body = htmlBody,
                IsBodyHtml = true
            };

            foreach (var addr in toEmail.Split(new[] { ',', ';' }, System.StringSplitOptions.RemoveEmptyEntries))
                mail.To.Add(addr.Trim());

            if (attachment != null && fileName != null)
            {
                mail.Attachments.Add(new Attachment(new MemoryStream(attachment), fileName));
            }

            await smtp.SendMailAsync(mail);
        }
    }
}
