// File: Backend/Data/OrchidContext.cs
//
// ───────────────────────────────────────────────────────────────────
//  • DbContext dùng Identity (đăng nhập) + bảng Categories / Products / Orders
//  • Cột Slug duy nhất CHỈ KHI Slug IS NOT NULL   (HasFilter)
//  • Decimal(18,2) cho Price / UnitPrice          (tránh truncate)
// ───────────────────────────────────────────────────────────────────

using Backend.Models;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;
using Backend.Models.Inventory;
using Backend.Models.Procurement;
using Backend.Models.Accounting;

namespace Backend.Data;

public class OrchidContext : IdentityDbContext
{
  public OrchidContext(DbContextOptions<OrchidContext> opt) : base(opt) { }

  public DbSet<Category> Categories { get; set; } = null!;
  public DbSet<Product> Products { get; set; } = null!;
  public DbSet<Order> Orders { get; set; } = null!;
  public DbSet<OrderItem> OrderItems { get; set; } = null!;
  public DbSet<Customer> Customers { get; set; }
  public DbSet<CustomerGroup> CustomerGroups { get; set; }
  public DbSet<CustomerLog> CustomerLogs { get; set; }
  public DbSet<Warehouse> Warehouses => Set<Warehouse>();
  public DbSet<ProductStock> ProductStocks => Set<ProductStock>();
  public DbSet<StockTxn> StockTxns => Set<StockTxn>();
  public DbSet<Supplier> Suppliers => Set<Supplier>();
  public DbSet<PurchaseRequest> PurchaseRequests => Set<PurchaseRequest>();
  public DbSet<PurchaseRequestLine> PurchaseRequestLines => Set<PurchaseRequestLine>();
  public DbSet<PurchaseOrder> PurchaseOrders => Set<PurchaseOrder>();
  public DbSet<PurchaseOrderLine> PurchaseOrderLines => Set<PurchaseOrderLine>();
  public DbSet<GoodsReceipt> GoodsReceipts => Set<GoodsReceipt>();
  public DbSet<GoodsReceiptLine> GoodsReceiptLines => Set<GoodsReceiptLine>();
  public DbSet<SupplierPayment> SupplierPayments => Set<SupplierPayment>();
  public DbSet<StockCountSheet> StockCountSheets { get; set; } = null!;
  public DbSet<StockCountLine> StockCountLines { get; set; } = null!;
  public DbSet<Account> Accounts { get; set; } = null!;
  public DbSet<Journal> Journals { get; set; } = null!;
  public DbSet<JournalLine> JournalLines { get; set; } = null!;
  public DbSet<LedgerEntry> LedgerEntries { get; set; } = null!;
  public DbSet<SalesOrder> SalesOrders { get; set; } = null!;
  public DbSet<SalesLine> SalesLines { get; set; } = null!;



  protected override void OnModelCreating(ModelBuilder mb)
  {
    base.OnModelCreating(mb);

    /* ─── UNIQUE INDEX – chỉ khi Slug không NULL ─── */
    mb.Entity<Category>()
      .HasIndex(c => c.Slug)
      .IsUnique()
      .HasFilter("[Slug] IS NOT NULL");

    mb.Entity<Product>()
      .HasIndex(p => p.Slug)
      .IsUnique()
      .HasFilter("[Slug] IS NOT NULL");

    /* ─── Precision tiền tệ ─── */
    mb.Entity<Product>()
      .Property(p => p.Price)
      .HasPrecision(18, 2);

    mb.Entity<OrderItem>()
      .Property(i => i.UnitPrice)
      .HasPrecision(18, 2);

    /* ─── Quan hệ Order ↔ OrderItems ─── */
    mb.Entity<OrderItem>()
      .HasOne(i => i.Order)
      .WithMany(o => o.Items)
      .HasForeignKey(i => i.OrderId)
      .OnDelete(DeleteBehavior.Cascade);

    mb.Entity<Order>()
      .Property(o => o.Status)
      .HasConversion<string>()
      .HasMaxLength(20);

    mb.Entity<Order>()
      .Property(o => o.PaymentStatus)
      .HasConversion<string>()
      .HasMaxLength(20);
    /* Khóa chính kép (ProductId, WarehouseId) */
    mb.Entity<ProductStock>()
    .HasKey(ps => new { ps.ProductId, ps.WarehouseId });
    /* Lưu enum StockTxnType dưới dạng string */
    mb.Entity<StockTxn>()
    .Property(t => t.Type)
    .HasConversion<string>()
    .HasMaxLength(10);
    mb.Entity<PurchaseRequestLine>().HasOne(l => l.Product)
    .WithMany().HasForeignKey(l => l.ProductId);

    mb.Entity<PurchaseOrderLine>().HasOne(l => l.Product)
        .WithMany().HasForeignKey(l => l.ProductId);

    mb.Entity<GoodsReceiptLine>().HasOne(l => l.Product)
        .WithMany().HasForeignKey(l => l.ProductId);
    mb.Entity<Account>()
      .HasIndex(a => a.Code)
      .IsUnique();

    mb.Entity<Account>()
      .HasOne(a => a.Parent)
      .WithMany(a => a.Children)
      .HasForeignKey(a => a.ParentId);

    mb.Entity<JournalLine>()
      .HasOne(l => l.Account)
      .WithMany()
      .HasForeignKey(l => l.AccountId);

    mb.Entity<LedgerEntry>()
      .HasOne(e => e.Account)
      .WithMany()
      .HasForeignKey(e => e.AccountId);
    mb.Entity<Account>().HasData(
    new Account { Id = 1, Code = "111", Name = "Tiền mặt", Type = AccountType.Asset },
    new Account { Id = 2, Code = "112", Name = "Tiền gửi NH", Type = AccountType.Asset },
    new Account { Id = 3, Code = "152", Name = "Hàng tồn kho", Type = AccountType.Asset },
    new Account { Id = 4, Code = "211", Name = "TSCĐ hữu hình", Type = AccountType.Asset },
    new Account { Id = 5, Code = "214", Name = "Hao mòn lũy kế", Type = AccountType.Asset },

    new Account { Id = 6, Code = "331", Name = "Phải trả NCC", Type = AccountType.Liability },
    new Account { Id = 7, Code = "333", Name = "Thuế phải nộp", Type = AccountType.Liability },
    new Account { Id = 8, Code = "341", Name = "Vay dài hạn", Type = AccountType.Liability },

    new Account { Id = 9, Code = "411", Name = "Vốn chủ sở hữu", Type = AccountType.Equity },
    new Account { Id = 10, Code = "421", Name = "LN chưa PP", Type = AccountType.Equity },

    new Account { Id = 11, Code = "511", Name = "Doanh thu bán", Type = AccountType.Revenue },
    new Account { Id = 12, Code = "515", Name = "Doanh thu DV", Type = AccountType.Revenue },

    new Account { Id = 13, Code = "611", Name = "Giá vốn hàng", Type = AccountType.Expense },
    new Account { Id = 14, Code = "621", Name = "Lương", Type = AccountType.Expense },
    new Account { Id = 15, Code = "622", Name = "Thuê VP", Type = AccountType.Expense },
    new Account { Id = 16, Code = "623", Name = "Điện nước", Type = AccountType.Expense },
    new Account { Id = 17, Code = "627", Name = "Quảng cáo", Type = AccountType.Expense },
    new Account { Id = 18, Code = "629", Name = "Chi phí khác", Type = AccountType.Expense },
    new Account { Id = 19, Code = "631", Name = "Khấu hao", Type = AccountType.Expense },
    new Account { Id = 20, Code = "635", Name = "Chi phí lãi vay", Type = AccountType.Expense }
);


  }
}
