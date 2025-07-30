using System.Text;
using System.Text.Json.Serialization;
using Backend.Infrastructure.Data;
using Backend.Application.Services;
using Backend.Domain.Interfaces;
using Backend.Infrastructure.Utils;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using Microsoft.OpenApi.Models;

var builder = WebApplication.CreateBuilder(args);

/*──────────────────── DI & DB ───────────────────*/
builder.Services.AddDbContext<OrchidContext>(opt =>
    opt.UseSqlServer(builder.Configuration.GetConnectionString("DefaultConnection"),
        sql => sql.EnableRetryOnFailure()));

builder.Services.AddIdentity<IdentityUser, IdentityRole>()
    .AddEntityFrameworkStores<OrchidContext>()
    .AddDefaultTokenProviders();

/*────────────── JWT ─────────────*/
var jwt = builder.Configuration.GetSection("Jwt");
var key = Encoding.UTF8.GetBytes(jwt["Key"]!);

builder.Services.AddAuthentication(opt =>
{
    opt.DefaultAuthenticateScheme = JwtBearerDefaults.AuthenticationScheme;
    opt.DefaultChallengeScheme = JwtBearerDefaults.AuthenticationScheme;
})
.AddJwtBearer(opt =>
{
    opt.TokenValidationParameters = new TokenValidationParameters
    {
        ValidateIssuer = true,
        ValidateAudience = true,
        ValidateLifetime = true,
        ValidateIssuerSigningKey = true,
        ValidIssuer = jwt["Issuer"],
        ValidAudience = jwt["Audience"],
        IssuerSigningKey = new SymmetricSecurityKey(key)
    };
});

/*────────────── Swagger ─────────────*/
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen(c =>
{
    c.SwaggerDoc("v1", new OpenApiInfo { Title = "Orchid API", Version = "v1" });
    c.MapType<IFormFile>(() => new OpenApiSchema { Type = "string", Format = "binary" });
    c.OperationFilter<FileUploadOperationFilter>();
});

/*────────────── Controllers & JSON ─────────────*/
builder.Services.AddControllers()
    .AddJsonOptions(o =>
    {
        o.JsonSerializerOptions.Converters.Add(new JsonStringEnumConverter());
        o.JsonSerializerOptions.ReferenceHandler = ReferenceHandler.IgnoreCycles;
    });

/*────────────── App services ─────────────*/
builder.Services.Configure<SmtpOptions>(builder.Configuration.GetSection("Smtp"));
builder.Services.AddTransient<EmailService>();
builder.Services.AddScoped<IInventoryService, InventoryService>();
builder.Services.AddScoped<IReportService, ReportService>();
builder.Services.AddScoped<IStockCountService, StockCountService>();
builder.Services.AddScoped<IAccountingService, AccountingService>();
builder.Services.AddScoped<IPurchaseService, PurchaseService>();
builder.Services.AddScoped<ICrmSyncService, CrmSyncService>();

/*────────────── SignalR & Middleware ─────────────*/
builder.Services.AddSignalR();

builder.Services.AddCors(opt => opt.AddDefaultPolicy(p => p
    .WithOrigins("http://localhost:3000")
    .AllowAnyHeader()
    .AllowAnyMethod()
    .AllowCredentials()));

builder.Services.AddAuthorization(opts =>
    opts.AddPolicy("Acc.Manage", p => p.RequireRole("Admin", "Accountant")));

var app = builder.Build();

/*──────────────────── Middlewares ───────────────────*/
app.UseSwagger();
app.UseSwaggerUI(c =>
{
    c.SwaggerEndpoint("/swagger/v1/swagger.json", "Orchid API v1");
    c.DocExpansion(Swashbuckle.AspNetCore.SwaggerUI.DocExpansion.None);
});

if (app.Environment.IsDevelopment())
    app.UseDeveloperExceptionPage();

app.UseDefaultFiles();
app.UseStaticFiles();

app.UseRouting();
app.UseCors();
app.UseAuthentication();
app.UseAuthorization();

app.MapHub<LowStockHub>("/hubs/stock");
app.UseMiddleware<LowStockMiddleware>();

app.MapControllers();
// app.MapFallbackToFile("index.html");  // nếu phục vụ SPA

/*────────────── Seed duy nhất (roles + admin) ─────────────*/
using (var scope = app.Services.CreateScope())
{
    await DbInitializer.SeedAsync(scope.ServiceProvider);
}

app.Run();
