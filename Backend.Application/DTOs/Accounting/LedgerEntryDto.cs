namespace Backend.Application.DTOs.Accounting
{
    public class LedgerEntryDto
    {
        public int Id { get; set; }
        public int JournalId { get; set; }
        public DateTime Date { get; set; }
        public string AccountCode { get; set; }
        public string AccountName { get; set; }
        public decimal Debit { get; set; }
        public decimal Credit { get; set; }
        public decimal Balance { get; set; }
        public string Description { get; set; }
    }
}
