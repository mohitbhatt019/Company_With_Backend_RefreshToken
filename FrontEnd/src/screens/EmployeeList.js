import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import axios from 'axios';

function EmployeeList() {
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
    companyId:"",//
    leaveStatus:""
  };



 
  const location = useLocation();
  const companyId = location.state?.companyId;
  const [employeeList, setEmployeeList] = useState([]);
  const[employeeForm,setEmployeeForm]=useState({});
  const[designationForm,setDesignationForm]=useState({})
  const[assignDesignationForm,setassignDesignationForm]=useState({})
  const [selectedRole, setSelectedRole] = useState('');
  const roles = [ 'Company', 'Employee'];
  let userRole=localStorage.getItem("userIsInRole")

  const[designatioEmployee,setDesignatioEmployee]=useState([]);
  const [date, setDate] = useState(new Date());

  const[leaveList,setleaveList]=useState([]);
  const[leaveForm,setleaveForm]=useState({});
  const[specificCompanyLeaveee,setspecificCompanyLeaveee]=useState([]);

  // const [specificLeaveList, setSpecificLeaveList] = useState([]);

 
  const statusDropdown = document.getElementById("status");
const leavechangeHandler=(event)=>{
  setleaveForm({
    ...leaveForm,[event.target.name]:event.target.value,
  })
}

  



  useEffect(() => {
    getAll(companyId);
  }, [companyId]);

  const changeHandler=(event)=>{
    setEmployeeForm({
      ...employeeForm,[event.target.name]:event.target.value,
    });
  };
  
  const changeHand=(event)=>{
    setDesignationForm({
    ...designationForm,[event.target.name]:event.target.value
    })
  }

  const changeAssignDesignation=(event)=>{
    setassignDesignationForm({
      ...assignDesignationForm,[event.target.name]:event.target.value
    })
  }


  function getAll(companyId) {
    const token = localStorage.getItem('currentUser');
    //console.log(employeeList)
    axios
      .get(`https://localhost:44363/api/Company/EmployeesInTheCompany?companyId=${companyId}`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((response) => {
        //debugger
        //console.log(response.data);
        setEmployeeList(response.data.empInDb);
      })
      .catch((error) => {
        console.error(error);
      });
  }


  function saveClick(){
    debugger
    let token=localStorage.getItem("currentUser");
    employeeForm.role=selectedRole
    employeeForm.companyId=companyId
    //console.log(employeeForm)
    axios.post("https://localhost:44363/api/Employee",employeeForm,{headers:{Authorization:`Bearer ${token}`}}).then((d)=>{
      if(d){
         setEmployeeForm({ companyId: companyId }); // Clear form fields except companyId
        getAll(companyId)
        alert("Employee Save Sucessfully")

      }
      else{
        alert("Employee not saved")
      }
    }).catch((e)=>{
      alert("Employee Already registered")

    })
  }

  function handleNewEmployeeClick() {
    // setEmployeeForm(initData);

     document.getElementById('txtId').value = companyId;
     document.getElementById('txtId').disabled = true;
  }

  function saveDesignation(){
    debugger
    let token=localStorage.getItem("currentUser")
  console.log(designationForm)
    axios.post("https://localhost:44363/api/Company/AddDesignation",designationForm,{headers:{Authorization:`Bearer ${token}`}}).then((d)=>{
      if(d.data.status==2){
        
        alert(d.data.message)
        getAll();

      }
      else{
        alert(d.data.message)

      }
    }).catch((e)=>{
      alert("Issue in api")
    })
  }

  function saveAssignDesignation(){
    debugger
    let token=localStorage.getItem("currentUser")
    console.log(assignDesignationForm)
    axios.post("https://localhost:44363/api/Company/AddEmployeeDesignation",assignDesignationForm,{headers:{Authorization:`Bearer ${token}`}}).then((d)=>{
      if(d){
        alert("Designation Assigned sucessfully")
        setassignDesignationForm({})
      }
      else{
        alert("Designation not Assigned")

      }
    }).catch((e)=>{
      alert("Issue in api")
    })
  }

function designationsList(){
  debugger
  let token=localStorage.getItem('currentUser')
  console.log(companyId)
  axios.get("https://localhost:44363/api/Company/EmployeesWithDesignationsInCompany/"+companyId,{headers:{Authorization:`Bearer ${token}`},
}).then((d)=>{
    if(d.data){
      //console.log(d.data)
      setDesignatioEmployee(d.data)
      //alert("api Run")

    }
  }).catch((e)=>{
    alert("No designation is assigned in the company")

  })
}

function deleteEmployeeDesignation(employeeId){
  debugger
  let token=localStorage.getItem('currentUser')
  let ans=window.confirm('Want to delete data???')
      if(!ans) return;  
      console.log(employeeId)
      axios.delete("https://localhost:44363/api/Company/DeleteEmployeesWithDesignationsInCompany?employeeId="+employeeId,{
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

function editClick(data){
setEmployeeForm(data)
}

function updateClick(){
  debugger
  let token=localStorage.getItem("currentUser");
console.log(employeeForm)
  axios.put("https://localhost:44363/api/Employee",employeeForm,{headers:{Authorization:`Bearer ${token}`}}).then((d)=>{
    if(d.data){
      alert("Employee Details updated sucessfully")
      getAll(companyId);

    }
  }).catch((e)=>{
    alert("Error in api")
  })
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

          alert("Data deleted successfully");
          getAll(companyId);
        }
        else{
          alert(d.data.message)
        }
      }).catch((e)=>{
        alert(JSON.stringify(e));

      })
}

function leaveClick(){
  debugger
  leaveForm.leaveStatus=2
  console.log(leaveForm)

  let token=localStorage.getItem("currentUser")
  axios.post("https://localhost:44363/api/Leave/AddLeave",leaveForm,{headers:{Authorization: `Bearer ${token}`}}).then((d)=>{
    if(d.status==1){
      setleaveForm(d.data.leaveIdInDb)
     alert(d.message)
    }
    else{
      alert("Leave already applied, first delete it then apply new leave")
    }
  }).catch((e)=>{
    alert(e)
  })

}

function leavesList(){
  debugger
  let token=localStorage.getItem("currentUser")
  axios.get("https://localhost:44363/api/Leave/AllLeaves",{headers:{Authorization:`Bearer ${token}`}}).then((response)=>{
    if(response.data){
      setleaveList(response.data)
      console.log(leaveForm)
      //alert("Api running")

    }
    else{
      alert("Something went wrong")
    }
  }).catch((error)=>{
    alert("Something went wrong with API")
  })
}
// statusDropdown.addEventListener("change", function() {
//   const selectedValue = statusDropdown.value;
//   ApproveLeave( selectedValue);
// });


function ApproveLeave(leaveId, value) {
  debugger
  let token = localStorage.getItem("currentUser");
  
  axios.put(`https://localhost:44363/api/Leave/UpdateLeaveStatus?leaveId=${leaveId}&leaveStatus=${value}`,{headers:{Authorization:`Bearer ${token}`}}).then((response)=>{
      if (response) {
        alert("Leave status changed successfully");
        specificCompanyLeave(companyId)
        leavesList()
      } else {
        alert("Leave status not changed");
      }
    })
    .catch((error) => {
      alert("Something went wrong with the API");
      console.log(error);
    });
}

function specificCompanyLeave(companyId){
  debugger
  let token=localStorage.getItem('currentUser')
  axios.get("https://localhost:44363/api/Leave/GetLeavesByCompanyId?companyId="+companyId,{headers:{Authorization:`Bearer ${token}`},
}).then((d)=>{
    if(d){
      //console.log(d.data)
      setspecificCompanyLeaveee(d.data)
      //alert("api Run")

    }
    console.log(specificCompanyLeaveee)
  }).catch((e)=>{
    alert("Error in specifice CompanyLeave")

  })
 }



  return (
    <div>
      <div className='row'>  
             <div className='col-2'>
                <button className=' bg-info m-2 p-2' data-toggle="modal" data-target="#dsgModal" >ADD DESIGNATION</button>
            </div> 
            <div className='col-2'>
                <button className=' bg-info m-2 p-2' data-toggle="modal" data-target="#assModal" >Assign DESIGNATION</button>
            </div>
            <div className='col-2'>
                <button className='bg-info m-2 p-2' data-toggle="modal"  data-target="#dsgListModal" onClick={designationsList} > Designation List</button>
            </div>
            { userRole=="Admin" ?(
            <div className='col-2'>
                <button className='bg-info m-2 p-2' data-toggle="modal"  data-target="#leaveListModal" onClick={leavesList} > Leave List</button>
            </div>
            ):null}
            <div className='col-2'>
                <h2 className='text-info'>Employee List</h2>
            </div>
            <div className='col-2'>
                <button className=' bg-info m-2 p-2' data-toggle="modal" data-target="#newModal" onClick={handleNewEmployeeClick}>Add Employee</button>
            </div>
          
        </div>
        <div class="row">
        {userRole=="Company" || userRole=="Admin" ?(
              <div class="form-control">
                <button className='form-control btn btn-info'onClick={()=>specificCompanyLeave(companyId)} data-toggle='modal'data-target="#specificCompanyLeave" >Company Leave Details</button>
              </div>
            ):null}
        </div>
      <table className="table table-bordered">
        <thead className="bg-info">
          <tr className="text-black">
            <th>Employee ID</th>
            <th>Employee Name</th>
            <th>Employee Address</th>
            <th>Employee Pancard Number</th>
            <th>Employee Account Number</th>
            <th>Employee PF Number</th>
            <th>Role</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {employeeList.map((employee, index) => (
            <tr key={index}>
              <td>{employee.employeeId}</td>
              <td>{employee.employeeName}</td>
              <td>{employee.employeeAddress}</td>
              <td>{employee.employee_Pancard_Number}</td>
              <td>{employee.employee_Account_Number}</td>
              <td>{employee.employee_PF_Number}</td>
              <td>{employee.role}</td>
              <td>
              <button onClick={()=>editClick(employee)} className='btn btn-info m-2' data-toggle='modal'data-target="#editModal">Edit</button>
              <button onClick={()=>deleteClick(employee.employeeId)} className='btn btn-danger m-2'>Delete</button>
              {/* <button className='btn btn-primary m-2' value={employeeForm.employeeId} data-target="#leaveModal" data-toggle="modal">Leave</button>
              <button className='btn btn-secondary m-2' onClick={()=>setSpecificLeaveList(employee.employeeId)} value={employee.employeeId} data-target="#specificleaveModal" data-toggle="modal">Leave status</button> */}
              
            </td> 
            </tr>
          ))}
        </tbody>
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
                    <label for="txtId" className='col-sm-4'>
                    Employee Company ID
                    </label>
                    <div className='col-sm-8'>
                      <input type="text" id="txtId" name="employeeId" className="form-control"
                        value={companyId} 
                      />
                    </div>
                  </div>

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
                </div>
                {/* Footer */}
                <div className='modal-footer bg-info'>
                  <button id='saveButton'
                      onClick={saveClick} 
                    className="btn btn-success" data-dismiss="modal">
                      Save 
                  </button>
                  <button className='btn btn-danger' data-dismiss="modal">
                    Cancel
                  </button>
                </div>
              </div>
            </div>
          </div>
        </form>
 
              {/* Designation */}

        <div class="modal" tabindex="-1" id="dsgModal" role="dialog">
  <div class="modal-dialog" role="document">
    <div class="modal-content">
      <div class="modal-header">
        <h5 class="modal-title">Add Designation</h5>
        <button type="button" class="close" data-dismiss="modal" aria-label="Close">
          <span aria-hidden="true">&times;</span>
        </button>
      </div>
      <div class="modal-body">
                <div className='form-group row'>
                    <label for="txtdesignations" className='col-sm-4'>
                    Designation
                    </label>
                    <div className='col-sm-8'>
                      <input type="text" id="txtdesignations" name="name" placeholder="Enter DESIGNATION name" className="form-control"
                        onChange={changeHand}
                      />
                    </div>
                  </div>  

             


                  </div>
      <div class="modal-footer">
        <button type="button" onClick={saveDesignation} data-dismiss="modal" class="btn btn-primary">Save</button>
        <button type="button" class="btn btn-secondary" data-dismiss="modal">Close</button>
      </div>
    </div>
  </div>
</div>


 {/*Assign Designation */}

 <div class="modal" tabindex="-1" id="assModal" role="dialog">
  <div class="modal-dialog" role="document">
    <div class="modal-content">
      <div class="modal-header">
        <h5 class="modal-title">Assign Designation</h5>
        <button type="button" class="close" data-dismiss="modal" aria-label="Close">
          <span aria-hidden="true">&times;</span>
        </button>
      </div>
      <div class="modal-body">
                <div className='form-group row'>
                    <label for="txtdesignation" className='col-sm-4'>
                    Designation
                    </label>
                    <div className='col-sm-8'>
                      <input type="text" id="txtdesignation" name="designationName" placeholder="Enter DESIGNATION Name" className="form-control"
                        //value={designationForm.name}
                        onChange={changeAssignDesignation}
                      />
                    </div>
                  </div>  

                  <div className='form-group row'>
                    <label for="txtempid" className='col-sm-4'>
                    Employee ID
                    </label>
                    <div className='col-sm-8'>
                      <input type="number" id="txtempid" name="employeeId" placeholder="Enter Employee ID" className="form-control"
                        //value={designationForm.name}
                        onChange={changeAssignDesignation}
                      />
                    </div>
                  </div>  
                  </div>  
 
                  
      <div class="modal-footer">
        <button type="button" onClick={saveAssignDesignation} class="btn btn-primary" data-dismiss="modal">Save</button>
        <button type="button" class="btn btn-secondary" data-dismiss="modal">Close</button>
      </div>
    </div>
  </div>
</div>

{/* Designation List dsgListModal */}

<div class="modal" tabindex="-1" id="dsgListModal" role="dialog">
  <div class="modal-dialog" role="document">
    <div class="modal-content">
      <div class="modal-header">
        <h5 class="modal-title">Designations in CompanyId={companyId}</h5>
        <button type="button" class="close" data-dismiss="modal" aria-label="Close">
          <span aria-hidden="true">&times;</span>
        </button>
      </div>
      <div class="modal-body">

           <table class='table table-bodred table-hover'>
              <thead>
                <tr>
                  <th>Employee Id</th>
                  <th>Employee Name</th>
                  <th>Designation Name</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
              {designatioEmployee.map((employee, index) => (
            <tr key={index}>
              <td>{employee.employeeId}</td>
              <td>{employee.employeeName}</td>
              <td>{employee.designations}</td>
              <td>
              <button type="button" onClick={()=>deleteEmployeeDesignation(employee.employeeId)} class="btn btn-primary">Delete</button>
              </td>
            </tr>
          ))}
              </tbody>
            </table>     

        </div>
      <div class="modal-footer">
        <button type="button" class="btn btn-secondary" data-dismiss="modal">Close</button>
      </div>
    </div>
  </div>
</div>

 {/*  Edit */}
 <form>
          <div className='modal' id="editModal" role="dialog">
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
                    <label for="txtId" className='col-sm-4'>
                    Employee Company ID
                    </label>
                    <div className='col-sm-8'>
                      <input type="text" id="txtId" disabled name="employeeId" className="form-control"
                        value={companyId} 
                      />
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
              {userRole=="Company" || userRole=="Admin" ?(
                <input type="text" disabled  id="txtsalary" name="employee_Pancard_Number" placeholder="Enter Pancard Number"
                className="form-control" value={employeeForm.employee_Pancard_Number}
                onChange={changeHandler} />
              ):
              <input type="text" disabled  id="txtsalary" name="employee_Pancard_Number" placeholder="Enter Pancard Number"
                className="form-control" value={employeeForm.employee_Pancard_Number}
                onChange={changeHandler} />}
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

            
                </div>
                {/* Footer */}
                <div className='modal-footer bg-info'>
                  <button id='saveButton'
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


        {/* Employee Leave Aply
      <form>
          <div className='modal' id="leaveModal" role="dialog">
            <div className="modal-dialog">
              <div className='modal-content'>
                { header }
                <div className='modal-dialog '>
                  <div className='modal-content'>
  
                  </div>
                  
                </div>
                // { Body }
                <div className='modal-body'>



            <div className='form-group row'>
              <label for="txtname" className='col-sm-4'>
                Employee Id
              </label>
              <div className='col-sm-8'>
                <input type="text" id="txtname" name="employeeId" placeholder="Employee Id"
                className="form-control"  value={leaveForm.employeeId} onChange={leavechangeHandler}
                />
              </div>
            </div>
            <div className='form-group row'>
              <label for="employeeAddress" className='col-sm-4'>
                Start date
              </label>
              <div className='col-sm-8'>
              <input type="date" data-date-inline-picker="true" name="startDate" className="form-control" value={leaveForm.startDate} onChange={leavechangeHandler}
                />
              </div>
            </div>

            <div className='form-group row'>
              <label for="txtname" className='col-sm-4'>
                End Date
              </label>
              <div className='col-sm-8'>
                <input type="date" data-date-inline-picker="true" id="txtname" name="endDate" placeholder="Enter Employee Name"
                className="form-control" value={leaveForm.endDate} onChange={leavechangeHandler}
                />
              </div>
            </div>

            <div className='form-group row'>
              <label for="Reason" className='col-sm-4'>
                Leave Reason
              </label>
              <div className='col-sm-8'>
                <input type="text" id="Reason" name="reason" placeholder="Enter Reason"
                className="form-control" value={leaveForm.leaveReason} onChange={leavechangeHandler}
                />
              </div>
            </div>


          </div>

          
                //{ Footer }
                <div className='modal-footer bg-info'>
                  <button id='saveButton'
                      onClick={leaveClick} 
                    className="btn btn-success" data-dismiss="modal">
                      Save 
                  </button>
                  <button className='btn btn-danger' data-dismiss="modal">
                    Cancel
                  </button>
                </div>
              </div>
            </div>
          </div>
        </form> */}

        {/*Admin Leave List */}
      
      <div class="modal" tabindex="-1" id="leaveListModal" role="dialog">
  <div class="modal-dialog-sm" role="document">
    <div class="modal-content">
      <div class="modal-header">
        <h5 class="modal-title">Designations in CompanyId={companyId}</h5>
        <button type="button" class="close" data-dismiss="modal" aria-label="Close">
          <span aria-hidden="true">&times;</span>
        </button>
      </div>
      <div class="modal-body">

      <table class='table table-bodred table-hover'>
  <thead>
    <tr>
      <th>Employee Id</th>
      <th>Leave Id</th>
      <th>Start Date</th>
      <th>End Date</th>
      <th>Reason</th>
      <th>Status</th>
      <th>Action</th>
    </tr>
  </thead>
  <tbody>
    {leaveList.map((employee, index) => (
      <tr key={index}>
        <td>{employee.employeeId}</td>
        <td>{employee.leaveId}</td>
        <td>{employee.startDate}</td>
        <td>{employee.endDate}</td>
        <td>{employee.reason}</td>
        <td>
          {/* <select id={`status-${employee.employeeId}`} name={`status-${employee.employeeId}`}>
            <option value="null">Select Status</option>
            <option value="1">Approve</option>
            <option value="2">Pending</option>
            <option value="3">Cancelled</option>
          </select> */}
          {employee.leaveStatus === 1 && 'Approve'}
    {employee.leaveStatus === 2 && 'Pending'}
    {employee.leaveStatus === 3 && 'Cancelled'}
      
        </td>
        <td>
        <button className='btn btn-success m-1' onClick={() => ApproveLeave(employee.leaveId, 1)}>Approve</button>
          <button className='btn btn-danger'onClick={() => ApproveLeave(employee.leaveId, 3)}>Reject</button>
        </td>
      </tr>
    ))}
  </tbody>
</table>


        </div>
      <div class="modal-footer">
        <button type="button" class="btn btn-secondary" data-dismiss="modal">Close</button>
      </div>
    </div>
  </div>
</div>



    {/* Specific Leave List */}

    {/* <div class="modal" tabindex="-1" id="specificleaveModal" role="dialog">
  <div class="modal-dialog-sm" role="document">
    <div class="modal-content">
      <div class="modal-header">
        <h5 class="modal-title">Designations in CompanyId={companyId}</h5>
        <button type="button" class="close" data-dismiss="modal" aria-label="Close">
          <span aria-hidden="true">&times;</span>
        </button>
      </div>
      <div class="modal-body">

      <table class='table table-bodred table-hover'>
  <thead>
    <tr>
      <th>Employee Id</th>
      <th>Start Date</th>
      <th>End Date</th>
      <th>Reason</th>
      <th>Status</th>
    </tr>
  </thead>
  <tbody>
    {leaveList.map((leave, index) => (
      <tr key={index}>
        <td>{leave.employeeId}</td>
        <td>{leave.startDate}</td>
        <td>{leave.endDate}</td>
        <td>{leave.reason}</td>
        <td>
          {leave.leaveStatus === 1 && 'Approved'}
          {leave.leaveStatus === 2 && 'Pending'}
          {leave.leaveStatus === 3 && 'Cancelled'}
        </td>
      </tr>
    ))}
  </tbody>
</table>


        </div>
      <div class="modal-footer">
        <button type="button" class="btn btn-secondary" data-dismiss="modal">Close</button>
      </div>
    </div>
  </div>
</div> */}


{/* Company Leave List */}
 {/*Admin Leave List */}
      
 <div class="modal" tabindex="-1" id="specificCompanyLeave" role="dialog">
  <div class="modal-dialog-sm" role="document">
    <div class="modal-content">
      <div class="modal-header">
        <h5 class="modal-title">Designations in CompanyId={companyId}</h5>
        <button type="button" class="close" data-dismiss="modal" aria-label="Close">
          <span aria-hidden="true">&times;</span>
        </button>
      </div>
      <div class="modal-body">

      <table class='table table-bodred table-hover'>
  <thead>
    <tr>
      <th>Employee Id</th>
      <th>Leave Id</th>
      <th>Start Date</th>
      <th>End Date</th>
      <th>Reason</th>
      <th>Status</th>
      <th>Action</th>
    </tr>
  </thead>
  <tbody>
    {specificCompanyLeaveee.map((employee, index) => (
      <tr key={index}>
        <td>{employee.employeeId}</td>
        <td>{employee.leaveId}</td>
        <td>{employee.startDate}</td>
        <td>{employee.endDate}</td>
        <td>{employee.reason}</td>
        <td>
          {/* <select id={`status-${employee.employeeId}`} name={`status-${employee.employeeId}`}>
            <option value="null">Select Status</option>
            <option value="1">Approve</option>
            <option value="2">Pending</option>
            <option value="3">Cancelled</option>
          </select> */}
          {employee.leaveStatus === 1 && 'Approve'}
    {employee.leaveStatus === 2 && 'Pending'}
    {employee.leaveStatus === 3 && 'Cancelled'}
      
        </td>
        <td>
        <button className='btn btn-success m-1' onClick={() => ApproveLeave(employee.leaveId, 1)}>Approve</button>
          <button className='btn btn-danger'onClick={() => ApproveLeave(employee.leaveId, 3)}>Reject</button>
        </td>
      </tr>
    ))}
  </tbody>
</table>


        </div>
      <div class="modal-footer">
        <button type="button" class="btn btn-secondary" data-dismiss="modal">Close</button>
      </div>
    </div>
  </div>
</div>


    </div>
  );
}

export default EmployeeList;