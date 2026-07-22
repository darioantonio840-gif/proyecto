using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using POSApp.API.Data;
using POSApp.API.Models;
using BCrypt.Net;

namespace POSApp.API.Controllers;

[Authorize(Roles = "Admin")]
[ApiController]
[Route("api/[controller]")]
public class UsersController : ControllerBase
{
    private readonly AppDbContext _context;

    public UsersController(AppDbContext context)
    {
        _context = context;
    }

    [HttpGet]
    public async Task<IActionResult> GetUsers()
    {
        var users = await _context.Users
            .Select(u => new { u.Id, u.Username, u.Role })
            .ToListAsync();
        return Ok(users);
    }

    [HttpPost]
    public async Task<IActionResult> CreateUser([FromBody] CreateUserRequest request)
    {
        if (await _context.Users.AnyAsync(u => u.Username == request.Username))
        {
            return BadRequest("El nombre de usuario ya existe en el sistema.");
        }

        var user = new User
        {
            Username = request.Username,
            PasswordHash = BCrypt.Net.BCrypt.HashPassword(request.Password), // Secure BCrypt Hashing
            Role = request.Role
        };

        _context.Users.Add(user);
        await _context.SaveChangesAsync();

        return Ok(new { user.Id, user.Username, user.Role });
    }

    [HttpPut("{id}")]
    public async Task<IActionResult> UpdateUser(int id, [FromBody] UpdateUserRequest request)
    {
        var user = await _context.Users.FindAsync(id);
        if (user == null)
        {
            return NotFound("Usuario no encontrado.");
        }

        // Prevent admin from changing their own role (basic safety)
        if (user.Role == "Admin" && request.Role != "Admin")
        {
            return BadRequest("No puedes quitarle el rol de Administrador al usuario Admin principal.");
        }

        // Check if new username already exists on another user
        if (request.Username != user.Username && await _context.Users.AnyAsync(u => u.Username == request.Username))
        {
            return BadRequest("El nombre de usuario ya está en uso por otra cuenta.");
        }

        user.Username = request.Username;
        user.Role = request.Role;
        
        // Hash password securely if a new password was provided
        if (!string.IsNullOrWhiteSpace(request.Password))
        {
            user.PasswordHash = BCrypt.Net.BCrypt.HashPassword(request.Password);
        }

        await _context.SaveChangesAsync();

        return Ok(new { user.Id, user.Username, user.Role });
    }

    [HttpDelete("{id}")]
    public async Task<IActionResult> DeleteUser(int id)
    {
        var user = await _context.Users.FindAsync(id);
        if (user == null)
        {
            return NotFound("Usuario no encontrado.");
        }

        if (user.Role == "Admin")
        {
            return BadRequest("No se puede eliminar a un Administrador.");
        }

        _context.Users.Remove(user);
        await _context.SaveChangesAsync();

        return NoContent();
    }
}

public class CreateUserRequest
{
    public string Username { get; set; } = string.Empty;
    public string Password { get; set; } = string.Empty;
    public string Role { get; set; } = string.Empty;
}

public class UpdateUserRequest
{
    public string Username { get; set; } = string.Empty;
    public string Password { get; set; } = string.Empty;
    public string Role { get; set; } = string.Empty;
}
