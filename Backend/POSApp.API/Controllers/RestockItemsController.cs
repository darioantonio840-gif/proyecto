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
public class RestockItemsController : ControllerBase
{
    private readonly AppDbContext _context;

    public RestockItemsController(AppDbContext context)
    {
        _context = context;
    }

    [HttpGet]
    [Authorize(Roles = "Owner,Employee")] // Both can see, but UI might be different
    public async Task<IActionResult> GetItems()
    {
        var items = await _context.RestockItems
            .Include(r => r.User)
            .Where(r => !r.IsCompleted)
            .OrderByDescending(r => r.ReportedAt)
            .Select(r => new
            {
                r.Id,
                r.ProductName,
                r.ReportedAt,
                ReportedBy = r.User.Username
            })
            .ToListAsync();

        return Ok(items);
    }

    [HttpPost]
    [Authorize]
    public async Task<IActionResult> AddItem([FromBody] RestockItemRequest request)
    {
        var userIdString = User.FindFirstValue(ClaimTypes.NameIdentifier);
        if (!int.TryParse(userIdString, out int userId))
        {
            return Unauthorized();
        }

        var item = new RestockItem
        {
            ProductName = request.ProductName,
            ReportedAt = DateTime.Now,
            IsCompleted = false,
            UserId = userId
        };

        _context.RestockItems.Add(item);
        await _context.SaveChangesAsync();

        return Ok(item);
    }

    [HttpPut("{id}/complete")]
    [Authorize(Roles = "Owner")]
    public async Task<IActionResult> CompleteItem(int id)
    {
        var item = await _context.RestockItems.FindAsync(id);
        if (item == null)
        {
            return NotFound();
        }

        item.IsCompleted = true;
        await _context.SaveChangesAsync();

        return NoContent();
    }
}

public class RestockItemRequest
{
    public string ProductName { get; set; } = string.Empty;
}
