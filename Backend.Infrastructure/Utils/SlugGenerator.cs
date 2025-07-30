// Backend/Utils/SlugGenerator.cs
using System.Globalization;
using System.Text;
using System.Text.RegularExpressions;

namespace Backend.Infrastructure.Utils;

public static class SlugGenerator
{
    public static string ToSlug(this string phrase)
    {
        // 1) lowercase + tách dấu
        var nfkd = phrase.ToLowerInvariant().Normalize(NormalizationForm.FormD);
        var sb = new StringBuilder();
        foreach (var c in nfkd)
        {
            var cat = CharUnicodeInfo.GetUnicodeCategory(c);
            if (cat != UnicodeCategory.NonSpacingMark) sb.Append(c);
        }
        var s = sb.ToString().Normalize(NormalizationForm.FormC);

        // 2) bỏ ký tự không hợp lệ, rút gọn khoảng trắng
        s = Regex.Replace(s, @"[^a-z0-9\s-]", "");
        s = Regex.Replace(s, @"\s+", " ").Trim();
        s = s[..Math.Min(60, s.Length)];
        s = Regex.Replace(s, @"\s", "-");

        // 3) Nếu rỗng ⇒ trả guid
        return string.IsNullOrWhiteSpace(s)
            ? Guid.NewGuid().ToString("N")
            : s;
    }
}


