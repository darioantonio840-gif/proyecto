using Microsoft.EntityFrameworkCore;
using POSApp.API.Models;

namespace POSApp.API.Data;

public class AppDbContext : DbContext
{
    public AppDbContext(DbContextOptions<AppDbContext> options) : base(options) { }

    public DbSet<User> Users { get; set; }
    public DbSet<CashCut> CashCuts { get; set; }
    public DbSet<RestockItem> RestockItems { get; set; }

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        base.OnModelCreating(modelBuilder);
        
        // Ensure decimal precision for money
        modelBuilder.Entity<CashCut>()
            .Property(c => c.Amount)
            .HasPrecision(18, 2);

        // Seed initial users
        modelBuilder.Entity<User>().HasData(
            new User { Id = 1, Username = "antonio", PasswordHash = "$2a$11$GhFj8y77sS0i1PvO70.ECuCLHB5GR8irnaMcrPf2qS80W2XgA6no6", Role = "Owner" },
            new User { Id = 2, Username = "juan", PasswordHash = "$2a$11$x8QYmEktwnLjMSblrJ4lCercWJ.KajTnuTBLfetkc6uADVbtbWYom", Role = "Employee" },
            new User { Id = 3, Username = "admin", PasswordHash = "$2a$11$8ZvMmAwvYtC2CQT5J.g4veuwT/zskfNrqwEz8ghQ9Ddu4WQ02Grm2", Role = "Admin" }
        );
    }
}
