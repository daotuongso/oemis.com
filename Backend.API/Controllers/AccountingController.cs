using Backend.Application.DTOs.Accounting;
using Backend.Application.Services.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace Backend.Controllers;

[ApiController]
[Route("api/[controller]")]
[Authorize(Policy = "Acc.Manage")]          // Admin & Accountant
public class AccountingController : ControllerBase
{
    private readonly IAccountingService _acc;
    public AccountingController(IAccountingService acc) => _acc = acc;

    /*──────────── 1. POST JOURNAL ───────────*/
    [HttpPost("journals")]
    public async Task<IActionResult> PostJournal([FromBody] JournalDto dto)
    {
        var userName = User.Identity?.Name;
        var createdBy = !string.IsNullOrWhiteSpace(userName)
                                ? userName
                                : dto.CreatedBy;
        var jr = await _acc.PostAsync(dto with { CreatedBy = createdBy });
        return Created($"journals/{jr.Id}", jr);
    }

    /*──────────── 2. LIST / DETAIL ───────────*/
    [HttpGet("journals")]
    public async Task<IActionResult> List() =>
        Ok(await _acc.GetJournalHeadersAsync());      // helper nhỏ thêm sau (header only)

    [HttpGet("journals/{id:int}")]
    public async Task<IActionResult> Detail(int id)
    {
        var jr = await _acc.GetJournalDetailAsync(id);
        return jr == null ? NotFound() : Ok(jr);
    }

    /*──────────── 3. LEDGER ───────────*/
    // GET /api/accounting/ledger/3?from=2025-01-01&to=2025-12-31
    [HttpGet("ledger/{accId:int}")]
    public async Task<IActionResult> Ledger(
         int accId,
           [FromQuery] DateTime from,
           [FromQuery] DateTime to)
    {
        var result = await _acc.GetLedgerEntriesAsync(accId, from, to);
        return Ok(result);
    }

    /*──────────── 4. TRIAL BALANCE ────────*/
    // GET /api/accounting/trialbalance?to=2025-12-31
    [HttpGet("trialbalance")]
    public async Task<IActionResult> Trial(DateTime to) =>
            Ok(await _acc.GetTrialBalanceAsync(to));

}
