import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom';
import axios from 'axios';


function Register() {
  const initData={
    Username:"",
    Email:"",
    Password:"",
    Role:""
  };
  const[registerForm,setRegisterForm]=useState(initData);
  const[registerFormError,setregisterFormError]=useState(initData);
  const [selectedRole, setSelectedRole] = useState('');
   const roles = [ 'Admin','Company', 'Employee'];

   const [companies, setCompanies] = useState([]);
   const [selectedCompany, setSelectedCompany] = useState('');

  const navigate=useNavigate();

  const ChangeHandler=(event)=>{
    setRegisterForm({
      ...registerForm,[event.target.name]:event.target.value,
    });
  }

  const registerClick=()=>{
    debugger
    //alert(registerForm.Username)

    //Validation Check
    let hasError=false;
    let messages=initData;

     if(registerForm.Username.trim().length==0)
     {
       hasError=true;
       messages={...messages,Username:"Username is empty!!!"};
     }
     if(registerForm.Password.trim().length==0){
       messages={...messages,Password:"Password is empty"}
     }
     if(registerFormError.Email.trim().length==0){
       messages={...messages,Email:"Email is empty"}
     }
     if(setSelectedRole.Role==null){
      messages={...messages,Role:"Role is empty"}
    }
    if(hasError){
       setregisterFormError(messages);
    }
    else{
      setregisterFormError(initData);
      registerForm.Role = selectedRole;
   console.log(registerForm)
    //alert(registerForm.Username)
    axios.post("https://localhost:44363/api/Authenticate/Register",registerForm).then((d)=>{
      if(d){
        alert("User Registered Successfully")
        navigate("/login")
      }
      else{
        alert("User Not Registeres/ Retry")
      }
    }).catch((e)=>{
        //alert("Wrong with api")
        alert(JSON.stringify(e));
    })
  }
  }

  useEffect(() => {
    let token=localStorage.getItem("currentUser");
    axios.get("https://localhost:44363/api/Company/GetCompany", {
      headers: { Authorization: `Bearer ${token}` },
    })
    .then((response) => {
      setCompanies(response.data);
    })
    .catch((error) => {
      console.error(error);
    });
  }, []);

  


 
 
  return (
    
    <div className='row col-lg-6 mx-auto m-2 p-2'>
      
<div class="card text-center">
  <div class="card-header text-info">Register</div>
  <div class="card-body">


    <div className='form-group row'>
      <label className='col-lg-4' for="txtusername" >Username</label>
      <div className='col-lg-8'>
        <input type="text" id="txtusername"  onChange={ChangeHandler}  placeholder='Enter Username' className='Form-control' 
        name='Username'/>
        { <p className='text-danger'>{registerFormError.Username}</p> }
      </div>
    </div>

    <div className='form-group row'>
      <label className='col-lg-4' for="txtconfirmpassword">Email</label>
      <div className='col-lg-8'>
        <input type="text" onChange={ChangeHandler} id="txtconfirmpassword"  placeholder='Enter Email' className='Form-control' name='Email'/>
        { <p className='text-danger'>{registerFormError.Email}</p> }
      </div>
    </div>

    
    <div className='form-group row'>
      <label className='col-lg-4' for="txtpassword">Password</label>
      <div className='col-lg-8'>
        <input type="password"  onChange={ChangeHandler} id="txtpassword"  placeholder='Enter Password' className='Form-control' name='Password'/>
        { <p className='text-danger'>{registerFormError.Password}</p> }

      </div>
    </div>

    {registerFormError.Role && <p className='text-danger'>{registerFormError.Role}</p>}

<div className='form-group row'>
  <label className='col-lg-4' htmlFor="role">User Role</label>
  <div className='col-lg-8'>
    <select value={selectedRole} onChange={(e) => setSelectedRole(e.target.value)} id="role">
      <option value="">Select a role</option>
      {roles.map((role) => (
        <option key={role} value={role}>
          {role}
        </option>
      ))}
    </select>
  </div>
</div>



<select value={selectedCompany} onChange={(e) => setSelectedCompany(e.target.value)}>
  <option value="">Select a company</option>
  {companies.map((company) => (
    <option key={company.companyId} value={company.companyName}>
      {company.companyName}
    </option>
  ))}
</select>



    
{/* <p>You selected {selectedRole}.</p> */}

  
  </div>
  <div className='card-footer text-muted'>
    <button onClick={registerClick} className='btn btn-info'>Register</button>
  </div>
</div>
    </div>  )
}

export default Register