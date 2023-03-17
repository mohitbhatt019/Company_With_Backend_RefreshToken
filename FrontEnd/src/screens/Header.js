import React, { useEffect,useState } from 'react'
import { BrowserRouter, Route, Routes,Link,useNavigate } from 'react-router-dom';
let userRole=localStorage.getItem("userIsInRole")
function Header() {
  const navigate=useNavigate();
  const[user,setUser]=useState(null);
  useEffect(()=>{
    let usr=localStorage.getItem("currentUser");
    //alert(usr)
    setUser(usr)
  });

  const logOut=()=>{
    localStorage.clear();
    navigate("/login");
  }
  return (
    <div><nav class="navbar navbar-expand-lg navbar-light bg-light">
        <button class="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
          <span class="navbar-toggler-icon"></span>
        </button>
      
        <div class="collapse navbar-collapse" id="navbarSupportedContent">
          <ul class="navbar-nav mr-auto">
            <li class="nav-item active">
            <Link to="/home" class="nav-link " href="#">Home</Link>
            </li>
    
            {/* <li class="nav-item">
              <Link to="/about" class="nav-link " href="#">About US</Link>
            </li> */}
             {/* {userRole == "Admin"  ? (
            <li class="nav-item">
              <Link to="/employee" class="nav-link " href="#">Employee</Link>
            </li>
             ):null} */}
            <li class="nav-item">
              <Link to="/company" class="nav-link " href="#">Company</Link>
            </li>
        
            {/* <li class="nav-item">
              <Link to="/employeeList" class="nav-link " href="#">EmployeesList</Link>
            </li> */}
          </ul>
          {/* {user?(
            <div/>
          ):(
            <li class="nav-item">
            
            <Link to="register" class="nav-link btn btn-outline-success my-2 my-sm-0 m-2" href="#">Register</Link>
            </li>
            )} */}
            {user?(
            <a onClick={logOut} class="btn btn-outline-success my-2 my-sm-0" type="submit">Logout</a>
            ):(
    
            <li class="nav-item">
            <Link to="login" class="nav-link btn btn-outline-success my-2 my-sm-0 m-2" href="#">Login</Link>
            </li>
            )}
        </div>
      </nav></div>
      )
}

export default Header


