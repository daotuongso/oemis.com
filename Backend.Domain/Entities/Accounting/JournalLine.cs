namespace Backend.Domain.Entities.Accounting;

public class JournalLine
{
    public int Id { get; set; }
    public int JournalId { get; set; }
    public Journal Journal { get; set; } = null!;

    public int AccountId { get; set; }
    public Account Account { get; set; } = null!;

    public decimal Debit { get; set; }
    public decimal Credit { get; set; }
}
