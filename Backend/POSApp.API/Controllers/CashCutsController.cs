using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using POSApp.API.Data;
using POSApp.API.Models;
using System.Security.Claims;

namespace POSApp.API.Controllers;

[Authorize]
[ApiController]
[Route("api/[controller]")]
public class CashCutsController : ControllerBase
{
    private readonly AppDbContext _context;

    public CashCutsController(AppDbContext context)
    {
        _context = context;
    }

    [HttpGet]
    [Authorize(Roles = "Owner")]
    public async Task<IActionResult> GetCashCuts()
    {
        var cuts = await _context.CashCuts
            .Include(c => c.User)
            .OrderByDescending(c => c.Date)
            .Select(c => new
            {
                c.Id,
                c.Amount,
                c.Date,
                EmployeeName = c.User.Username
            })
            .ToListAsync();
            
        return Ok(cuts);
    }

    [HttpPost]
    [Authorize]
    public async Task<IActionResult> CreateCashCut([FromBody] CashCutRequest request)
    {
        var userIdString = User.FindFirstValue(ClaimTypes.NameIdentifier);
        if (!int.TryParse(userIdString, out int userId))
        {
            return Unauthorized();
        }

        var cashCut = new CashCut
        {
            Amount = request.Amount,
            Date = DateTime.Now,
            UserId = userId
        };

        _context.CashCuts.Add(cashCut);
        await _context.SaveChangesAsync();

        return Ok(cashCut);
    }
}

public class CashCutRequest
{
    public decimal Amount { get; set; }
}
