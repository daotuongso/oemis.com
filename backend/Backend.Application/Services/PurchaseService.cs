using Backend.Infrastructure.Data;
using Backend.Application.DTOs.Accounting;           // JournalDto, JournalLineDto
using Backend.Domain.Entities.Inventory;               // GoodsReceipt, GoodsReceiptLine
using Backend.Domain.Entities.Procurement;
using Backend.Application.Services.Interfaces;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Backend.Application.Services
{
    public class PurchaseService : IPurchaseService
    {
        private readonly OrchidContext _ctx;
        private readonly IInventoryService _inv;
        private readonly IAccountingService _acc;
        private readonly IConfiguration _cfg;

        public PurchaseService(OrchidContext ctx,
                               IInventoryService inv,
                               IAccountingService acc,
                               IConfiguration cfg)
        {
            _ctx = ctx;
            _inv = inv;
            _acc = acc;
            _cfg = cfg;
        }

        /* ────────── PURCHASE REQUEST ────────── */
        public async Task<PurchaseRequest> CreateRequestAsync(
            string user,
            IEnumerable<(int productId, int qty, decimal price)> lines)
        {
            var pr = new PurchaseRequest
            {
                Code = $"PR{DateTime.UtcNow:yyyyMMddHHmmss}",
                CreatedAt = DateTime.UtcNow,
                CreatedBy = string.IsNullOrWhiteSpace(user) ? "system" : user,
                Status = PrStatus.Requested,
                Lines = new List<PurchaseRequestLine>()
            };

            foreach (var l in lines)
            {
                pr.Lines.Add(new PurchaseRequestLine
                {
                    ProductId = l.productId,
                    Qty = l.qty,
                    Price = l.price
                });
            }

            _ctx.PurchaseRequests.Add(pr);
            await _ctx.SaveChangesAsync();
            return pr;
        }

        public async Task ApproveRequestAsync(int prId, string _)
        {
            var pr = await _ctx.PurchaseRequests.FindAsync(prId)
                     ?? throw new KeyNotFoundException("PR not found");
            if (pr.Status != PrStatus.Requested)
                throw new InvalidOperationException("Chỉ PR trạng thái Requested mới được duyệt");

            pr.Status = PrStatus.Approved;
            await _ctx.SaveChangesAsync();
        }

        public async Task RejectRequestAsync(int prId, string _, string __)
        {
            var pr = await _ctx.PurchaseRequests.FindAsync(prId)
                     ?? throw new KeyNotFoundException("PR not found");
            if (pr.Status != PrStatus.Requested)
                throw new InvalidOperationException("Chỉ PR trạng thái Requested mới được từ chối");

            pr.Status = PrStatus.Rejected;
            await _ctx.SaveChangesAsync();
        }

        /* ────────── PURCHASE ORDER ────────── */
        public async Task<PurchaseOrder> CreatePOAsync(
            int supplierId,
            int prId,
            IEnumerable<(int productId, int qty, decimal price)> lines)
        {
            var po = new PurchaseOrder
            {
                SupplierId = supplierId,
                PurchaseRequestId = prId,
                Code = $"PO{DateTime.UtcNow:yyyyMMddHHmmss}",
                OrderedAt = DateTime.UtcNow,
                Status = PoStatus.Ordered,
                Lines = new List<PurchaseOrderLine>()
            };

            foreach (var l in lines)
            {
                po.Lines.Add(new PurchaseOrderLine
                {
                    ProductId = l.productId,
                    Qty = l.qty,
                    Price = l.price
                });
                po.Total += l.qty * l.price;
            }

            _ctx.PurchaseOrders.Add(po);
            await _ctx.SaveChangesAsync();                // lưu PO trước khi hạch toán

            /* ---------- ACC‑T7: tự động Nợ 152 / Có 331 ---------- */
            decimal total = po.Total;

            string invCode = _cfg["Accounting:InventoryAccount"] ?? "152";
            string apCode = _cfg["Accounting:ApAccount"] ?? "331";

            var invAcc = await _ctx.Accounts.SingleAsync(a => a.Code == invCode);
            var apAcc = await _ctx.Accounts.SingleAsync(a => a.Code == apCode);

            var jrDto = new JournalDto(
                DateTime.UtcNow,
                $"PO#{po.Id} - Nhập kho NCC {supplierId}",
                "system",
                false,
                new List<JournalLineDto> {
                    new JournalLineDto(invAcc.Id, total, 0),   // accountId, debit, credit
                    new JournalLineDto(apAcc.Id,  0,    total)
                });

            await _acc.PostAsync(jrDto);
            return po;
        }

        /* ────────── RECEIVE GOODS ────────── */
        public async Task ReceiveGoodsAsync(int poId, string user)
        {
            var po = await _ctx.PurchaseOrders
                               .Include(p => p.Lines)
                               .FirstAsync(p => p.Id == poId && p.Status == PoStatus.Ordered);

            po.Status = PoStatus.Received;

            var gr = new GoodsReceipt
            {
                PurchaseOrderId = po.Id,
                ReceivedAt = DateTime.UtcNow,
                ReceivedBy = user,
                Lines = new List<GoodsReceiptLine>()
            };
            _ctx.GoodsReceipts.Add(gr);

            foreach (var l in po.Lines)
            {
                await _inv.AdjustStockAsync(l.ProductId, l.Qty, $"PO#{po.Id}");
                gr.Lines.Add(new GoodsReceiptLine { ProductId = l.ProductId, Qty = l.Qty });
            }

            await _ctx.SaveChangesAsync();
        }
    }
}
