using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Backend.Infrastructure.Data;
using Backend.Domain.Entities;
using Backend.Domain.Entities.Accounting;
using Backend.Application.DTOs.Accounting;
using Backend.Application.Services.Interfaces;
using Microsoft.EntityFrameworkCore;

namespace Backend.Application.Services;

/// <summary>Đồng bộ dữ liệu CRM → ERP (cùng solution).</summary>
public class CrmSyncService : ICrmSyncService
{
    private readonly OrchidContext _db;
    private readonly IInventoryService _inv;
    private readonly IAccountingService _acc;

    public CrmSyncService(
        OrchidContext db,
        IInventoryService inv,
        IAccountingService acc)
        => (_db, _inv, _acc) = (db, inv, acc);

    /* ╔═════════════════════════════════════╗
       ║ 1. ĐỒNG BỘ KHÁCH HÀNG               ║
       ╚═════════════════════════════════════╝ */
    public async Task SyncCustomerAsync(Customer crmCus)
    {
        var exist = await _db.Customers
            .FirstOrDefaultAsync(c => c.ExternalId == crmCus.Id);

        if (exist == null)
        {
            var neo = new Customer
            {
                FullName = crmCus.FullName,
                Email = crmCus.Email,
                Address = crmCus.Address,
                Phone = crmCus.Phone,
                ExternalId = crmCus.Id
            };
            _db.Customers.Add(neo);
        }
        else
        {
            exist.FullName = crmCus.FullName;
            exist.Email = crmCus.Email;
            exist.Address = crmCus.Address;
            exist.Phone = crmCus.Phone;
        }

        await _db.SaveChangesAsync();
    }

    /* ╔═════════════════════════════════════╗
       ║ 2. ĐỒNG BỘ ĐƠN BÁN (CONFIRMED)      ║
       ╚═════════════════════════════════════╝ */
    public async Task SyncOrderAsync(Order crm)
    {
        /* Idempotent */
        bool existed = await _db.SalesOrders
            .AnyAsync(o => o.ExternalId == crm.Id);
        if (existed) return;

        /* Lấy (hoặc tạo) Customer ERP thông qua Email */
        var erpCustomer = await _db.Customers
            .FirstOrDefaultAsync(c => c.Email == crm.CustomerEmail);

        if (erpCustomer == null)
        {
            erpCustomer = new Customer
            {
                FullName = crm.CustomerName,
                Email = crm.CustomerEmail ?? $"guest-{Guid.NewGuid()}@erp.local",
                Address = crm.CustomerAddress,
                ExternalId = null              // guest
            };
            _db.Customers.Add(erpCustomer);
            await _db.SaveChangesAsync();
        }

        /* Map Lines */
        var lines = crm.Items.Select(it => new SalesLine
        {
            ProductId = it.ProductId,      // Product dùng chung Id
            Qty = it.Quantity,
            Price = it.UnitPrice
        }).ToList();

        decimal total = lines.Sum(l => l.Qty * l.Price);

        /* Tạo SalesOrder ERP */
        var so = new SalesOrder
        {
            Code = $"SO{crm.Id:000000}",
            Date = DateTime.UtcNow,
            CustomerId = erpCustomer.Id,
            Total = total,
            Lines = lines,
            ExternalId = crm.Id
        };
        _db.SalesOrders.Add(so);
        await _db.SaveChangesAsync();

        /* Giữ kho */
        await _inv.ReserveForOrderAsync(crm.Id);

        /* Bút toán Nợ 131 / Có 511 */
        var acc131 = await _db.Accounts.SingleAsync(a => a.Code == "131");
        var acc511 = await _db.Accounts.SingleAsync(a => a.Code == "511");

        await _acc.PostAsync(new JournalDto(
            so.Date,
            so.Code,
            "system",
            false,
            new()
            {
                new JournalLineDto(acc131.Id, total, 0),
                new JournalLineDto(acc511.Id, 0, total)
            }));
    }
}
