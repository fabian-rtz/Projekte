using KinoTicketSystem.Extensions;
using KinoTicketSystem.Services;

using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using Microsoft.OpenApi.Models;

var builder = WebApplication.CreateBuilder(args);

// 🔥 Debugging: Prüfe, ob die Konfiguration aus `appsettings.json` gelesen wird



//Service Registrierung
builder.Services.AddControllers();
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddScoped<IUserService, UserService>();
builder.Services.ConfigureSwagger();
builder.Services.ConfigureDatabase(builder.Configuration);
builder.Services.ConfigureIdentity();
builder.Services.ConfigureCors();
builder.Services.AddResponseCaching();

builder.Services.AddControllers()
    .AddJsonOptions(options =>
                    {
                        options.JsonSerializerOptions.ReferenceHandler     = System.Text.Json.Serialization.ReferenceHandler.Preserve;
                        // options.JsonSerializerOptions.PropertyNamingPolicy = null;
                    });
// builder.Services.AddControllers()
//     .AddNewtonsoftJson(options =>
//                        {
//                            options.SerializerSettings.ReferenceLoopHandling = Newtonsoft.Json.ReferenceLoopHandling.Ignore;
//                            options.SerializerSettings.ContractResolver      = new Newtonsoft.Json.Serialization.DefaultContractResolver();
//                        });

var app = builder.Build();

if (!app.Environment.IsDevelopment())
{
    app.UseHsts();
    app.UseExceptionHandler("/error");
}

app.UseCors("AllowAll");

app.UseStaticFiles();

if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI(c => 
                     { 
                         c.SwaggerEndpoint("/swagger/v1/swagger.json", "KinoTicketSystem API v1"); 
                     });
}

app.UseRouting();
app.UseAuthentication();
app.UseAuthorization();
app.UseResponseCaching();

app.MapFallbackToFile("html/index.html");
app.MapControllers();

app.Run();