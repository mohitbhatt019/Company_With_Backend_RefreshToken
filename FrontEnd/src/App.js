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

function App() {
  return (
    <div className="App">
      
      <BrowserRouter>
       <Header/> 
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
