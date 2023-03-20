import logo from './logo.svg';
import './App.css';
import Header from './screens/Header';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import Register from './screens/Register';
import Login from './screens/Login';
import Home from './screens/Home';
import About from './screens/About';
import Employee from './screens/Employee';
import Company from './screens/Company';
import EmployeeList from './screens/EmployeeList';
import EmployeeDetail from './screens/EmployeeDetail';
import axios from 'axios';

const jwtInterceptor = axios.create({});
debugger

jwtInterceptor.interceptors.request.use((config) => {
  debugger
  let tokensData = JSON.parse(localStorage.getItem("currentUser"));
  config.headers.common["Authorization"] = `Bearer ${tokensData.token}`;
  return config;
});

jwtInterceptor.interceptors.response.use(
  (response) => {
    return response;
  },
  async (error) => {
    if (error.response.status === 401) {
      const authData = JSON.parse(localStorage.getItem("currentUser"));
      const payload = {
        access_token: authData.token,
        refresh_token: authData.refreshToken,
      };

      let apiResponse = await axios.post(
        "https://localhost:44363/api/Authenticate/RefreshToken",
        payload
      );
      localStorage.setItem("currentUser", JSON.stringify(apiResponse.data));
      error.config.headers[
        "Authorization"
      ] = `Bearer ${apiResponse.data.access_token}`;
      return axios(error.config);
    } else {
      return Promise.reject(error);
    }
  }
);

const securedApi = jwtInterceptor.create({
  baseURL: "https://your-api.com",
});

function App() {
  return (
    <div className="App">
      <BrowserRouter>
        <Header />
        <Routes>
          <Route path='register' element={<Register/>}/>
          <Route path='login' element={<Login/>}/>   
          <Route path='home' element={<Home/>}/>   
          <Route path='about' element={<About/>}/>   
          <Route path='employee' element={<Employee/>}/>   
          <Route path='company' element={<Company/>}/> 
          <Route path='/employeeList' element={<EmployeeList/>}/>   
          <Route path='/employeeDetail' element={<EmployeeDetail/>}/>   
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
