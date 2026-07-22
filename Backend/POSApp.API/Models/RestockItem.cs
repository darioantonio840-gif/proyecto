namespace POSApp.API.Models;

public class RestockItem
{
    public int Id { get; set; }
    public string ProductName { get; set; } = string.Empty;
    public int UserId { get; set; }
    public User User { get; set; } = null!;
    public DateTime ReportedAt { get; set; }
    public bool IsCompleted { get; set; }
}
