using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using Backend.Domain.Entities.Accounting;
using Backend.Application.DTOs;
using Backend.Application.DTOs.Accounting;

namespace Backend.Application.Services.Interfaces
{
    public interface IAccountingService
    {
        /*───────────── POST JOURNAL ─────────────*/
        Task<Journal> PostAsync(JournalDto dto);

        /*───────────── LEDGER ───────────────────*/
        Task<IEnumerable<LedgerEntryDto>> GetLedgerEntriesAsync(
            int accountId,
            DateTime from,
            DateTime to);

        /*───────────── TRIAL BALANCE ────────────*/
        Task<IEnumerable<(Account Acc, decimal Debit, decimal Credit)>>
            GetTrialBalanceAsync(DateTime to);

        /*───────────── MỚI (ACC‑T4) ─────────────*/
        /// Danh sách journal (Id, Number, Date, Memo)
        Task<IEnumerable<object>> GetJournalHeadersAsync();

        /// Chi tiết journal kèm lines
        Task<Journal?> GetJournalDetailAsync(int id);
    }
}

