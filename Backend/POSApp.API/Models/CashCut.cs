namespace POSApp.API.Models;

public class CashCut
{
    public int Id { get; set; }
    public decimal Amount { get; set; }
    public int UserId { get; set; }
    public User User { get; set; } = null!;
    public DateTime Date { get; set; }
}
