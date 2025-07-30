using System;
using System.Collections.Generic;
using QuestPDF.Drawing;
using QuestPDF.Fluent;
using QuestPDF.Helpers;
using QuestPDF.Infrastructure;
using Backend.Application.DTOs;

namespace Backend.Infrastructure.Utils
{
    public static class PdfUtil
    {
        /// <summary>Tạo PDF báo cáo doanh thu theo danh sách SalesDailyDto.</summary>
        public static byte[] BuildSalesPdf(
            IReadOnlyList<SalesDailyDto> rows,
            DateTime from,
            DateTime to)
        {
            return Document.Create(container =>
            {
                container.Page(page =>
                {
                    page.Margin(30);
                    page.Content().Column(col =>
                    {
                        col.Item().AlignCenter().Text(
                            $"BÁO CÁO DOANH THU {from:dd/MM/yyyy} – {to:dd/MM/yyyy}")
                            .FontSize(16).Bold();

                        col.Item().PaddingVertical(10).Table(t =>
                        {
                            t.ColumnsDefinition(c =>
                            {
                                c.RelativeColumn();
                                c.ConstantColumn(120);
                            });

                            // Header
                            t.Header(h =>
                            {
                                StaticHeaderCell(h.Cell(), "Ngày");
                                StaticHeaderCell(h.Cell(), "Doanh thu (đ)");
                            });

                            // Body
                            foreach (var r in rows)
                            {
                                t.Cell().Padding(4)
                                    .Text($"{r.Date:dd/MM/yyyy}");
                                t.Cell().Padding(4)
                                    .AlignRight().Text(r.Total.ToString("N0", new System.Globalization.CultureInfo("vi-VN")));
                            }
                        });
                    });
                });
            })
            .GeneratePdf();
        }

        private static void StaticHeaderCell(IContainer container, string text) =>
            container.Background(Colors.Grey.Lighten3)
                     .Padding(4)
                     .Text(text).Bold();
    }
}
