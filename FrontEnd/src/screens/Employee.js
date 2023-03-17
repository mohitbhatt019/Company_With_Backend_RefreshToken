import React from 'react'
import  { useEffect, useState } from 'react'
import axios from 'axios';

function Employee() {
  const initData={
    username:"",
    email:"",
    password:"",
    role:"",
    employeeName:"",//
    employeeAddress:"",//
    employee_Pancard_Number:"",//
    employee_Account_Number:"",//
    employee_PF_Number:"",//
    companyId:""//
  };
  const[employees,setEmployees]=useState(null);
  const[employeeForm,setEmployeeForm]=useState({});

  const [companies, setCompanies] = useState([]);
  const [selectedCompany, setSelectedCompany] = useState('');

  const [selectedRole, setSelectedRole] = useState('');
  const roles = [ 'Admin','Company', 'Employee'];

  useEffect(()=>{
    getAll();
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
    //console.log(employees);
  },[]);

  const changeHandler=(event)=>{
    setEmployeeForm({
      ...employeeForm,[event.target.name]:event.target.value,
    });
  };
 
     function renderEmployee(){
      let employeeRows=[];
      employees?.map((item)=>{
        employeeRows.push(
          <tr>
            <td>{item.employeeId}</td>
            <td>{item.employeeName}</td>
            <td>{item.employeeAddress}</td>
            <td>{item.employee_Pancard_Number}</td>
            <td>{item.employee_Account_Number}</td>
            <td>{item.employee_PF_Number}</td>
            <td>{item.companyId}</td>
             <td>
              <button onClick={()=>editClick(item)} className='btn btn-info m-1' data-toggle='modal'data-target="#editModel">Edit</button>
              <button onClick={()=>deleteClick(item.employeeId)} className='btn btn-danger'>Delete</button>
              
            </td> 
          </tr>
        )
      })
      return employeeRows
     }

     function editClick(data){
      setEmployeeForm(data)
     } 

     function deleteClick(employeeId){
      debugger
      var token=localStorage.getItem("currentUser")
      //alert(id)
      let ans=window.confirm('Want to delete data???')
      if(!ans) return;
      
      axios.delete("https://localhost:44363/api/Employee?employeeId="+employeeId,{data:{ employeeId:Number(employeeId) },
      headers:{Authorization:`Bearer ${token}`},
    }).then((d)=>{
      
        if(d){
          alert(employeeId)
          alert("Data deleted successfully");
          getAll();
        }
        else{
          alert(d.data.message)
        }
      }).catch((e)=>{
        alert(JSON.stringify(e));

      })
     }

     function saveClick(){
      debugger
            //jwt
            let token=localStorage.getItem("currentUser");
                //alert(employeeForm.employeeName)
                employeeForm.companyId=selectedCompany
                employeeForm.role=selectedRole
                console.log(employeeForm)
                console.log(employeeForm)
                console.log(employeeForm)

            axios.post("https://localhost:44363/api/Employee",employeeForm,
            
            {headers:{Authorization:`Bearer ${token}`}},
            ).then((d)=>{
             if(d.data){
              getAll();
               alert("Data saved")
             }
             else{
               alert("Data not save")
             }
            }).catch((e)=>{
             alert("wrong with api")
       
            })
     }
  
     
     

     function updateClick(){
      // debugger
      let token=localStorage.getItem("currentUser");
      //alert(employeeForm.employeeName)
      axios.put("https://localhost:44363/api/Employee",employeeForm,{headers:{Authorization:`Bearer ${token}`}}).then((d)=>{
        if(d.data){ 
          getAll()
          alert("Api call sucessfull")
          console.log(d.data);
         setEmployees(d.data);
       }
       else{
         alert("Issue in api")
       }
      }).catch((e)=>{
       alert("error with api")
 
      })
     }
  
   function getAll(){
    debugger
    //JWT
     let token=localStorage.getItem("currentUser");
     console.log(token)
     axios.get("https://localhost:44363/api/Employee",{headers:{Authorization:`Bearer ${token}`},}).then((d)=>{
       if(d.data){
         //alert("Api call sucessfull")
         console.log(d.data);
        setEmployees(d.data);
      }
      else{
        alert("Issue in api")
      }
     }).catch((e)=>{
      alert("error with api")

     })
     
   }
    return (
        <div>
        <h2 className='text-primary text-center'>Employee Page</h2>
        <div className='row'>
          <div className='col-9'>
          <h2 className='text-info text-left'>Employee List</h2>
          </div>
          <div className='col-3'>
            <button className='btn btn-info'data-toggle="modal" data-target="#newModal">New Employee</button>
          </div>
        </div>
  
        <table className='table table-bordered  table-active'>
          <thead> 
            <tr>
              <th>Employee Id</th>
              <th>Employee Name</th>
              <th>Employee Address</th>
              <th>Employee Pancard Number</th>
              <th>Employee Account Number</th>
              <th>Employee PF Number</th>
              <th>Company ID</th>
              <th>Actions</th>
            </tr>
          </thead>
          { <tbody>{renderEmployee()}</tbody> }
        </table>
  
  {/* Save */}
  <form>
    <div className='modal' id="newModal" role="dialog">
      <div className="modal-dialog">
        <div className='modal-content'>
          {/* header */}
          <div className='modal-dialog '>
            <div className='modal-content'>

            </div>

          </div>
          {/* Body */}
          <div className='modal-body'>

          <div className='form-group row'>
      <label className='col-lg-4' for="txtusername" >Username</label>
      <div className='col-lg-8'>
        <input type="text" id="txtusername"  onChange={changeHandler} value={employeeForm.username}  placeholder='Enter Username' className='Form-control' 
        name='Username'/>
        {/* { <p className='text-danger'>{registerFormError.Username}</p> } */}
      </div>
    </div>

    <div className='form-group row'>
      <label className='col-lg-4' for="txtconfirmpassword">Email</label>
      <div className='col-lg-8'>
        <input type="text" onChange={changeHandler} value={employeeForm.email} id="txtconfirmpassword"  placeholder='Enter Email' className='Form-control' name='Email'/>
        {/* { <p className='text-danger'>{registerFormError.Email}</p> } */}
      </div>
    </div>

    
    <div className='form-group row'>
      <label className='col-lg-4' for="txtpassword">Password</label>
      <div className='col-lg-8'>
        <input type="password"  onChange={changeHandler} id="txtpassword" value={employeeForm.password}  placeholder='Enter Password' className='Form-control' name='Password'/>
        {/* { <p className='text-danger'>{registerFormError.Password}</p> } */}

      </div>
    </div>


            <div className='form-group row'>
              <label for="txtname" className='col-sm-4'>
                Employee Name
              </label>
              <div className='col-sm-8'>
                <input type="text" id="txtname" name="employeeName" placeholder="Enter Employee Name"
                className="form-control" value={employeeForm.employeeName} onChange={changeHandler}
                />
              </div>
            </div>
            <div className='form-group row'>
              <label for="employeeAddress" className='col-sm-4'>
                Employee Address
              </label>
              <div className='col-sm-8'>
                <input type="text" id="employeeAddress" name="employeeAddress" placeholder="Enter Address"
                className="form-control" value={employeeForm.employeeAddress} onChange={changeHandler}
                />
              </div>
            </div>
            <div className='form-group row'>
              <label for="txtsalary" className='col-sm-4'>
                employee Pancard Number
              </label>
              <div className='col-sm-8'>
                <input type="text" id="txtsalary" name="employee_Pancard_Number" placeholder="Enter Pancard Number"
                className="form-control" value={employeeForm.employee_Pancard_Number}
                onChange={changeHandler} />
              </div>
            </div>

            <div className='form-group row'>
              <label for="employee_Account_Numberrr" className='col-sm-4'>
                Employee Account Number
              </label>
              <div className='col-sm-8'>
                <input type="number" id="employee_Account_Numberrr" name="employee_Account_Number"
                placeholder="Enter  Account Number" className="form-control" value={employeeForm.employee_Account_Number}
                onChange={changeHandler} />
              </div>
            </div>


            <div className='form-group row'>
              <label for="employee_PF_Number" className='col-sm-4'>
                Employee PF Number
              </label>
              <div className='col-sm-8'>
                <input type="number" id="employee_PF_Number" name="employee_PF_Number" placeholder="Enter Employee PF Number"
                className="form-control" value={employeeForm.employee_PF_Number}
                onChange={changeHandler} />
              </div>
            </div>
            {/*
            <div className='form-group row'>
              <label for="EmployeeCompanyId" className='col-sm-4'>
                Employee Company Id
              </label>
              <div className='col-sm-8'>
                <input type="number" id="EmployeeCompanyId" name="companyId" placeholder="Enter Company Id"
                className="form-control" value={employeeForm.companyId} onChange={changeHandler}
                />
              </div>
            </div> */}
            <div className='form-group row'>
              <label for="EmployeeCompanyId" className='col-sm-4'>
                Employee Company Name
              </label>
              <div className='col-lg-8'>

              <select value={selectedCompany} onChange={(e)=> setSelectedCompany(e.target.value)}>
                  <label for="EmployeeCompanyId"
                  className='col-sm-4'>
                    Employee Company Id
                  </label>
                  <option value="">Select a company</option>
                  {companies.map((company) => (
                  <option key={company.companyName} value={company.companyId}>
                    {company.companyName}
                  </option>
                  ))}
                </select>
              </div>
            </div>
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

          {/* Footer */}
          <div className='modal-footer bg-info'>
            <button onClick={saveClick} className="btn btn-success" data-dismiss="modal">
              Save
            </button>
            <button className='btn btn-danger' data-dismiss="modal">
              Cancel
            </button>
          </div>
        </div>
      </div>
    </div>
    </div>
  </form>
  
        {/* Edit */}
        <form>
          <div className='modal' id="editModel" role="dialog">
            <div className="modal-dialog">
              <div className='modal-content'>
                {/* header */}
                <div className='modal-header bg-info'>
                  <div className='modal-title text-white'>Edit Employee</div>
                  <button className='close' data-dismiss="modal">
                    <span>&times;</span>
                  </button>
                </div>
                   {/* Body */}
                    <div className='modal-body'>
                  <div className='form-group row'>
                    <label for="txtename" className='col-sm-4'>
                    Employee Name
                    </label>
                    <div className='col-sm-8'>
                      <input type="text" id='txtename' name="employeeName" placeholder="Enter Employee Name" className="form-control"
                        value={employeeForm.employeeName} 
                       onChange={changeHandler}
                      />
                    </div>
                  </div>
                  <div className='form-group row'>
                   <label for="employeeAddres" className='col-sm-4'>
                   Employee Address
                    </label>
                    <div className='col-sm-8'>
                      <input type="text" id="employeeAddres" name="employeeAddress" placeholder="Enter Address" className="form-control"
                        value={employeeForm.employeeAddress} 
                      onChange={changeHandler}
                      />
                    </div>
                  </div>
                  <div className='form-group row'>
                    <label for="txtpanc" className='col-sm-4'>
                    employee Pancard Number
                    </label>
                    <div className='col-sm-8'>
                      <input type="text" id="txtpanc" name="employee_Pancard_Number" placeholder="Enter Pancard Number" className="form-control"
                        value={employeeForm.employee_Pancard_Number}
                        onChange={changeHandler}
                      />
                    </div>
                  </div>

                  <div className='form-group row'>
                    <label for="employee_Account_Num" className='col-sm-4'>
                    Employee Account Number
                    </label>
                    <div className='col-sm-8'>
                      <input type="number" id="employee_Account_Num" name="employee_Account_Number" placeholder="Enter  Account Number" className="form-control"
                        value={employeeForm.employee_Account_Number}
                        onChange={changeHandler}
                      />
                    </div>
                  </div>

                  <div className='form-group row'>
                    <label for="employee_PF_Num" className='col-sm-4'>
                    Employee PF Number
                    </label>
                    <div className='col-sm-8'>
                      <input type="number" id="employee_PF_Num" name="employee_PF_Number" placeholder="Enter Employee PF Number" className="form-control"
                        value={employeeForm.employee_PF_Number}
                        onChange={changeHandler}
                      />
                    </div>
                  </div>


                </div>
                {/* Footer */}
                <div className='modal-footer bg-info'>
                  <button
                      onClick={updateClick} 
                    className="btn btn-success" data-dismiss="modal">
                      Update 
                  </button>
                  <button className='btn btn-danger' data-dismiss="modal">
                    Cancel
                  </button>
                </div>
              </div>
            </div>
          </div>
        </form>
        </div>    )
}

export default Employee