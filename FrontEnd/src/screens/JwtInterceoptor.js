import axios from "axios";
 
const jwtInterceoptor = axios.create({});
 
jwtInterceoptor.interceptors.request.use((config) => {
  let tokensData = JSON.parse(localStorage.getItem("currentUser"));
  config.headers.common["Authorization"] = `bearer ${tokensData.token}`;
  return config;
});
 
jwtInterceoptor.interceptors.response.use(
    
  (response) => {
    return response;
  },
  
  async (error) => {
    debugger
    if (error.response.status === 401) {
      debugger
      const authData = JSON.parse(localStorage.getItem("currentUser"));
      const payload = {
        access_token: authData.access_token,
        refresh_token: authData.refreshToken,
      };
 
      let apiResponse = await axios.post(
        "https://localhost:44363/api/Authenticate/RefreshToken",
        payload
      );
      localStorage.setItem("currentUser", JSON.stringify(apiResponse.data));
      error.config.headers[
        "Authorization"
      ] = `bearer ${apiResponse.data.access_token}`;
      return axios(error.config);
    } else {
      return Promise.reject(error);
    }
  }
);

export default JwtInterceoptor