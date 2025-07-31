using System;
using System.Collections.Generic;

namespace Backend.Application.DTOs.Accounting
{

    public record JournalDto(
        DateTime Date,
        string Memo,
        string CreatedBy,
        bool IsPosted,
        List<JournalLineDto> Lines);
}