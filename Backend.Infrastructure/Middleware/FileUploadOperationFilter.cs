using Microsoft.AspNetCore.Http;
using Microsoft.OpenApi.Models;
using Swashbuckle.AspNetCore.SwaggerGen;

namespace Backend.Infrastructure.Middleware
{
    /// <summary>Hiển thị upload 1 file multipart/form‑data</summary>
    public class FileUploadOperationFilter : IOperationFilter
    {
        public void Apply(OpenApiOperation op, OperationFilterContext ctx)
        {
            // Áp dụng khi DTO chứa IFormFile
            var hasFile = ctx.MethodInfo.GetParameters()
                          .Any(p => p.ParameterType.GetProperties()
                                     .Any(prop => prop.PropertyType == typeof(IFormFile)));
            if (!hasFile) return;

            op.RequestBody = new OpenApiRequestBody
            {
                Content =
                {
                    ["multipart/form-data"] = new OpenApiMediaType
                    {
                        Schema = new OpenApiSchema
                        {
                            Type = "object",
                            Properties =
                            {
                                ["file"] = new OpenApiSchema
                                {
                                    Type   = "string",
                                    Format = "binary"
                                }
                            },
                            Required = new HashSet<string> { "file" }
                        }
                    }
                }
            };
        }
    }
}
