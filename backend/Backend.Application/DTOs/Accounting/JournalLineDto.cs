namespace Backend.Application.DTOs.Accounting
{

    public record JournalLineDto(
        int AccountId,
        decimal Debit,
        decimal Credit,
        string? AccountName = null,
        string? Memo = null);
}