
using System.Collections.Generic;
using System.Threading.Tasks;
using Backend.Domain.Entities.Procurement;

namespace Backend.Application.Services.Interfaces
{
    public interface IPurchaseService
    {
        /* ----- PURCHASE REQUEST ----- */
        Task<PurchaseRequest> CreateRequestAsync(
            string user,
            IEnumerable<(int productId, int qty, decimal price)> lines);

        Task ApproveRequestAsync(int prId, string approver);
        Task RejectRequestAsync(int prId, string approver, string reason);

        /* ----- PURCHASE ORDER ----- */
        Task<PurchaseOrder> CreatePOAsync(
            int supplierId,
            int prId,
            IEnumerable<(int productId, int qty, decimal price)> lines);

        Task ReceiveGoodsAsync(int poId, string user);
    }
}
