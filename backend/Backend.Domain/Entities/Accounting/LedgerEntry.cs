namespace Backend.Domain.Entities.Accounting;

public class LedgerEntry
{
    public int Id { get; set; }
    public int AccountId { get; set; }
    public Account Account { get; set; } = null!;
    public DateTime Date { get; set; }
    public decimal Debit { get; set; }
    public decimal Credit { get; set; }
    public int JournalId { get; set; }
    public string Memo { get; set; } = "";
}
