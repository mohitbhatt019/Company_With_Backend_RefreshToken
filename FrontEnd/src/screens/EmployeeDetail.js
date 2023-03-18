import { useEffect, useState } from "react";
import axios from 'axios';
import { useLocation } from 'react-router-dom';

function EmployeeDetail(){
       const location = useLocation();
       const initData={
        employeeId:"",
        username:"",
        email:"",
        password:"",
        role:"",
        employeeName:"",//
        employeeAddress:"",//
        employee_Pancard_Number:"",//
        employee_Account_Number:"",//
        employee_PF_Number:"",//
        companyId:"",
        leaveId:""
      };
    const [employeeList, setEmployeeList] = useState([]);
    const[employeeForm,setEmployeeForm]=useState({});
    const companyId = location.state?.companyId;
  const[leaveForm,setleaveForm]=useState({});
  let [specificLeaveList, setSpecificLeaveList] = useState([]);

 let employeeId=localStorage.getItem("employeeIdOfCurrentUser")


      const leavechangeHandler=(event)=>{
        setleaveForm({
          ...leaveForm,[event.target.name]:event.target.value,
        })
      }

    useEffect(() => {
        let name=localStorage.getItem("usernameByLS")
        getAll(name);
        //alert(employeeList)
   }, []);

   const changeHandler=(event)=>{
    setEmployeeForm({
      ...employeeForm,[event.target.name]:event.target.value,
    });
  };

   function getAll(name) {
        const token = localStorage.getItem('currentUser');
        //console.log(employeeForm)

        //console.log(employeeList)
        axios
          .get(`https://localhost:44363/api/Company/GetEmployeeForSpecificUsers?username=${name}`, {
            headers: { Authorization: `Bearer ${token}` },
          })
          .then((response) => {
            debugger
            //console.log(response.data);
            setEmployeeList(response.data.employees);
            console.log(response.data)
            localStorage.setItem("employeeIdOfCurrentUser",response.data.employeeId)

           // console.log(response.data)
          })
          .catch((error) => {
            console.error(error);
          });
      }

      function editClick(data){
        setEmployeeForm(data)
      }


      function updateClick(){
       // console.log(employeeForm)
        let name=localStorage.getItem("usernameByLS")

        debugger

        let token=localStorage.getItem("currentUser");
      //console.log(employeeForm)
        axios.put("https://localhost:44363/api/Employee",employeeForm,{headers:{Authorization:`Bearer ${token}`}}).then((d)=>{
          if(d.data){
            alert("Details updated sucessfully")
            getAll(name);
      
          }
        }).catch((e)=>{
          alert("Error in api")
        })
      }

      function leaveClick(){
        debugger
        leaveForm.leaveStatus=2
        //console.log(leaveForm)
        let token=localStorage.getItem("currentUser")
        axios.post("https://localhost:44363/api/Leave/AddLeave",leaveForm,{headers:{Authorization: `Bearer ${token}`}}).then((d)=>{
          if(d.data.status==1){
            setleaveForm(d.data.leaveIdInDb)
           alert("Leave created sucessfully")
          }
          else{
            alert(d.data.message)
          }
        }).catch((e)=>{
          alert(e)
        })
    }
      
    function getSpecificEmployeeLeaves(employeeId) {
        const token = localStorage.getItem('currentUser');
        axios
          .get(`https://localhost:44363/api/Leave/SpecificEmployeeLeaves?employeeId=${employeeId}`, {
            headers: { Authorization: `Bearer ${token}` },
          })
          .then((response) => {
            
           //console.log(response.data);

          
            setSpecificLeaveList(response.data);
            
            
        })
        .catch((error) => {
            //console.error(error);
        });
        //console.log(specificLeaveList);
      }
      


    return(
        <div>
           <div className='row'>  
            <div className='col-4 offset-4'>
                <h2 className='text-info'>Employee Details</h2>
            </div>
            
          
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
            { <th>Actions</th> }
          </tr>
        </thead>
        <tbody>
          {employeeList?.map((employee, index) => (
            <tr key={index}>
              <td>{employee.employeeId}</td>
              <td>{employee.employeeName}</td>
              <td>{employee.employeeAddress}</td>
              <td>{employee.employee_Pancard_Number}</td>
              <td>{employee.employee_Account_Number}</td>
              <td>{employee.employee_PF_Number}</td>
              <td>{employee.role}</td>
              { <td>
              <button onClick={()=>editClick(employee)} /*onChange={SpecificchangeHandler}*/ className='btn btn-info m-2' data-toggle='modal'data-target="#editModal">Edit</button>
              
              <button className='btn btn-primary m-2' value={employeeForm.employeeId} data-target="#leaveModal" data-toggle="modal">Leave</button>    

               <button className='btn btn-secondary m-2' onClick={()=>getSpecificEmployeeLeaves(employee.employeeId)} value={employee.employeeId} data-target="#specificleaveModal" data-toggle="modal">Leave status</button> 
              
            </td>  }
            </tr>
          ))}
        </tbody>
      </table>

      {/*Employee Leave Aply */}
      <form>
          <div className='modal' id="leaveModal" role="dialog">
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
              <label for="txtname" className='col-sm-4'>
                Employee Id
              </label>
              <div className='col-sm-8'>
                <input type="text" id="txtname" name="employeeId" placeholder="Employee Id"
                className="form-control" disabled value={employeeId} onChange={leavechangeHandler}
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

          
                {/* Footer */}
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
        </form>




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

            <div className='form-group row'>
             
              <div className='col-sm-8'>
                <input type="text" hidden id="employee_PF_Number" name="employee_PF_Number" placeholder="Enter Employee PF Number"
                className="form-control" value={employeeForm.applicationUserId}
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

             
    {/* Specific Leave List */}

    <div class="modal" tabindex="-1" id="specificleaveModal" role="dialog">
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
    {specificLeaveList?.map((leave, index) => (
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
</div>
   

        </div>
        
    );
}

export default EmployeeDetail