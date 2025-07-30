using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Backend.Infrastructure.Data;
using Backend.Domain.Entities.Accounting;
using Backend.Application.DTOs.Accounting;
using Backend.Application.Services.Interfaces;
using Microsoft.EntityFrameworkCore;
using Backend.Application.DTOs.Accounting;

namespace Backend.Application.Services
{
    public sealed class AccountingService : IAccountingService
    {
        private readonly OrchidContext _ctx;
        public AccountingService(OrchidContext ctx) => _ctx = ctx;

        /*────────────────── 1. POST JOURNAL ──────────────────*/
        public async Task<Journal> PostAsync(JournalDto dto)
        {
            if (dto.Lines.Sum(l => l.Debit) != dto.Lines.Sum(l => l.Credit))
                throw new InvalidOperationException("Bút toán không cân");

            var jr = new Journal
            {
                Number = await NextNumberAsync(),
                Date = dto.Date,
                Memo = dto.Memo,
                CreatedBy = dto.CreatedBy
            };

            _ctx.Journals.Add(jr);
            await _ctx.SaveChangesAsync();

            foreach (var line in dto.Lines)
            {
                _ctx.JournalLines.Add(new JournalLine
                {
                    JournalId = jr.Id,
                    AccountId = line.AccountId,
                    Debit = line.Debit,
                    Credit = line.Credit
                });

                _ctx.LedgerEntries.Add(new LedgerEntry
                {
                    JournalId = jr.Id,
                    Date = dto.Date,
                    AccountId = line.AccountId,
                    Debit = line.Debit,
                    Credit = line.Credit,
                    Memo = dto.Memo
                });
            }

            await _ctx.SaveChangesAsync();
            return jr;
        }

        /*────────────────── 2. LEDGER ENTRIES ──────────────────*/
        public async Task<IEnumerable<LedgerEntryDto>> GetLedgerEntriesAsync(
            int accountId, DateTime from, DateTime to)
        {
            var entries = await _ctx.LedgerEntries
                .Include(e => e.Account)
                .Where(e => e.AccountId == accountId && e.Date >= from && e.Date <= to)
                .OrderBy(e => e.Date).ThenBy(e => e.Id)
                .AsNoTracking()
                .ToListAsync();

            decimal runningBalance = 0;
            return entries.Select(e =>
            {
                runningBalance += e.Debit - e.Credit;
                return new LedgerEntryDto
                {
                    Id = e.Id,
                    JournalId = e.JournalId,
                    Date = e.Date,
                    AccountCode = e.Account.Code,
                    AccountName = e.Account.Name,
                    Debit = e.Debit,
                    Credit = e.Credit,
                    Balance = runningBalance,
                    Description = e.Memo
                };
            })
            .ToList();
        }

        [Obsolete("Use GetLedgerEntriesAsync instead")]
        public async Task<IEnumerable<LedgerEntry>> GetLedgerAsync(
            int accountId, DateTime from, DateTime to)
        {
            return await _ctx.LedgerEntries
                .Where(e => e.AccountId == accountId && e.Date >= from && e.Date <= to)
                .OrderBy(e => e.Date).ThenBy(e => e.Id)
                .AsNoTracking()
                .ToListAsync();
        }

        /*────────── TRIAL BALANCE & JOURNAL INFO ──────────*/
        public async Task<IEnumerable<(Account Acc, decimal Debit, decimal Credit)>> GetTrialBalanceAsync(DateTime to)
        {
            // Giữ nguyên logic cũ (nếu có) hoặc implement ở đây
            throw new NotImplementedException();
        }

        public async Task<IEnumerable<object>> GetJournalHeadersAsync()
        {
            return await _ctx.Journals
                .AsNoTracking()
                .OrderByDescending(j => j.Date)
                .Select(j => new { j.Id, j.Number, j.Date, j.Memo })
                .ToListAsync();
        }

        public async Task<Journal?> GetJournalDetailAsync(int id)
        {
            return await _ctx.Journals
                .Include(j => j.Lines)
                .AsNoTracking()
                .FirstOrDefaultAsync(j => j.Id == id);
        }

        /*────────────────── helper ───────────────────*/
        private async Task<string> NextNumberAsync()
        {
            var lastNo = await _ctx.Journals
                .OrderByDescending(j => j.Id)
                .Select(j => j.Number)
                .FirstOrDefaultAsync();

            var seq = lastNo != null && int.TryParse(lastNo.Substring(2), out var n)
                ? n + 1
                : 1;

            return $"JV{seq:D6}";
        }
    }
}
