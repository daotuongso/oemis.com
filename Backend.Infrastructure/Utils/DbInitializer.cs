using Microsoft.AspNetCore.Identity;

public static class DbInitializer
{
    /// <summary>
    /// Seed rô‑lê cố định và 1 tài khoản Admin đầu tiên.
    /// Gọi hàm này đúng 1 lần trong Program.cs (sau khi tạo scope).
    /// </summary>
    public static async Task SeedAsync(IServiceProvider sp)
    {
        /* ────────────── 1. ROLE LIST ────────────── */
        var roleMgr = sp.GetRequiredService<RoleManager<IdentityRole>>();

        string[] roles =
        {
            "Admin",
            "Warehouse",
            "Purchasing",
            "Accountant",
            "Sales",
            "Customer"
        };

        foreach (var r in roles)
            if (!await roleMgr.RoleExistsAsync(r))
                await roleMgr.CreateAsync(new IdentityRole(r));


        /* ────────────── 2. SEED ADMIN ────────────── */
        var userMgr = sp.GetRequiredService<UserManager<IdentityUser>>();

        const string adminEmail = "daotuongso@gmail.com";
        const string adminPass = "Admin@123";

        var admin = await userMgr.FindByEmailAsync(adminEmail);

        if (admin == null)
        {
            admin = new IdentityUser
            {
                UserName = adminEmail,
                Email = adminEmail,
                EmailConfirmed = true
            };

            var result = await userMgr.CreateAsync(admin, adminPass);

            if (!result.Succeeded)
                throw new Exception(
                    "Không tạo được admin: " +
                    string.Join("; ", result.Errors.Select(e => e.Description)));
        }

        /* đảm bảo admin luôn thuộc role Admin dù đã tồn tại */
        if (!await userMgr.IsInRoleAsync(admin, "Admin"))
            await userMgr.AddToRoleAsync(admin, "Admin");
    }
}
