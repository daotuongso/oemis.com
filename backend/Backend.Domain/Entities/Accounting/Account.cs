namespace Backend.Domain.Entities.Accounting;

public enum AccountType { Asset, Liability, Equity, Revenue, Expense }

public class Account
{
    public int Id { get; set; }
    public string Code { get; set; } = null!;
    public string Name { get; set; } = null!;
    public AccountType Type { get; set; }
    public int? ParentId { get; set; }
    public Account? Parent { get; set; }
    public ICollection<Account> Children { get; set; } = new List<Account>();
}
