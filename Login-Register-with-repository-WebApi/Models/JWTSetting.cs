namespace Company_Project.Models
{
    public class JWTSetting
    {
        public string SecretKey { get; set; }
        public int TokenValidityInMinutes { get; set; }
        public int RefreshTokenExpireDays { get; set; }
    }
}
