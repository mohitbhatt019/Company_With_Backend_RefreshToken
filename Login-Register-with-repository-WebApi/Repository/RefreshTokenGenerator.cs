using Company_Project.Models;
using Company_Project.Repository.IRepository;
using Microsoft.Extensions.Options;
using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Security.Cryptography;
using System.Text;

namespace Company_Project.Repository
{
    public class RefreshTokenGenerator : IRefreshTokenGenerator
    {
        private readonly JWTSetting _appSettingJWT;
        public RefreshTokenGenerator(IOptions<JWTSetting> appSettingJwt)
        {
            _appSettingJWT = appSettingJwt.Value;
        }
        #region Here we call the function to Genereate the JWT token
        public ApplicationUser GenerateToken(ApplicationUser user, bool isGenerateRefreshToken)
        {
            return GenerateJWTToken(user, isGenerateRefreshToken);

        }
        #endregion

        #region Here we write the function to generate the jwt token.
        public ApplicationUser GenerateJWTToken(ApplicationUser user, bool generateRefreshToken)
        {
            var tokenHandler = new JwtSecurityTokenHandler();
            var key = Encoding.ASCII.GetBytes(_appSettingJWT.SecretKey);
            var tokenDescritor = new SecurityTokenDescriptor
            {
                Subject = new ClaimsIdentity(new Claim[]
                {
                        new Claim(ClaimTypes.Name, user.Id.ToString()),
                        // here if role not passed then by default role will be Employee.
                        new Claim(ClaimTypes.Role, user.Role??"Employee")
                }),
                Expires = DateTime.UtcNow.AddSeconds(_appSettingJWT.TokenValidityInMinutes),
                SigningCredentials = new SigningCredentials(new SymmetricSecurityKey(key), SecurityAlgorithms.HmacSha256Signature)
            };
            var token = tokenHandler.CreateToken(tokenDescritor);
            user.Token = tokenHandler.WriteToken(token);
            if (generateRefreshToken)
            {
                user.RefreshToken = GenerateRefreshToken();
            }

            return user;
        }
        #endregion

        #region function that generate the refresh token
        public string GenerateRefreshToken()
        {
            var randomeNumber = new byte[32];
            using (var rNG = RandomNumberGenerator.Create())
            {
                rNG.GetBytes(randomeNumber);
                return Convert.ToBase64String(randomeNumber);
            }

        }
        #endregion


        #region here we get user claims from expired token

        public ClaimsPrincipal? GetClaimsFromExpiredToken(string token)
        {
            var tokenHandler = new JwtSecurityTokenHandler();
            var key = Encoding.ASCII.GetBytes(_appSettingJWT.SecretKey);

            TokenValidationParameters tokenValidationParameters = new TokenValidationParameters
            {
                ValidateIssuer = false,
                ValidateAudience = false,
                ValidateLifetime = false,
                ValidateIssuerSigningKey = true,
                IssuerSigningKey = new SymmetricSecurityKey(key),
                ClockSkew = TimeSpan.Zero
            };
            try
            {
                // here we get the claims from expired token.
                var claimUserValue = tokenHandler.ValidateToken(token, tokenValidationParameters, out SecurityToken validatedToken);

                /* here we check token is not expire then we return null and not return the claims from token. and if expire then return
               the claims from expired token*/
                if (validatedToken.ValidTo > DateTime.UtcNow)
                    return null;
                return claimUserValue;

            }
            catch
            {
                return null;
            }
                #endregion
        }
    }
}
