namespace Backend.Domain.Entities.Accounting;

public class Journal
{
    public int Id { get; set; }
    public string Number { get; set; } = null!;
    public DateTime Date { get; set; }
    public string? Memo { get; set; }
    public string CreatedBy { get; set; } = null!;

    public ICollection<JournalLine> Lines { get; set; } = new List<JournalLine>();
}
