namespace Company_Project.Models
{
    public class TokenInfo
    {
        public int ID { get; set; }
        public string Username { get; set; }
        public string RefreshToken { get; set; }
        public DateTime RefreshTokenExpiry { get; set; }
    }
}
