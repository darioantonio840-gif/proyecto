using System;
using BCrypt.Net;
class Program {
    static void Main() {
        Console.WriteLine(BCrypt.Net.BCrypt.HashPassword("admin123"));
        Console.WriteLine(BCrypt.Net.BCrypt.HashPassword("emp123"));
        Console.WriteLine(BCrypt.Net.BCrypt.HashPassword("superadmin"));
    }
}
