import React, { useEffect, useState } from "react";
import axios from "axios";
import DataTable from "react-data-table-component";
import { useNavigate } from "react-router-dom";

function Company() {
  const initData = {
    // companyId:"",
    companyName: "",
    companyAddress: "",
    companyGST: "",
  };
  const navigate = new useNavigate();
  const [company, setCompany] = useState(null);
  const [companyForm, setcompanyForm] = useState({});

  useEffect(() => {
    debugger;
    let name = localStorage.getItem("usernameByLS");
    specificComp(name);
    //console.log(company);
  }, []);

  const changeHandler = (event) => {
    setcompanyForm({
      ...companyForm,
      [event.target.name]: event.target.value,
    });
  };

  let userRole = localStorage.getItem("userIsInRole");

  function saveClick() {
    debugger;
    //jwt
    let token = localStorage.getItem("currentUser");
    //alert(companyForm.companyAddress)
    axios
      .post("https://localhost:44363/api/Company/AddCompany", companyForm, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((d) => {
        if (d.data) {
          //companyForm(initData)
          alert("Company Added Sucessfully");
          getAll();
          setcompanyForm(initData);
        } else {
          alert("Company not saved");
        }
      })
      .catch((e) => {
        alert("wrong with api");
      });
  }

  function specificComp(name) {
    debugger;
    let token = JSON.parse(localStorage.getItem('currentUser')).token;
    axios
      .get(
        "https://localhost:44363/api/Company/GetCompanyForSpecificUsers?username=" +
          name,
        { headers: { Authorization: `Bearer ${token}` } }
      )
      .then((d) => {
        if (d.data) {
          //console.log(d.data)
          setCompany(d.data);

          //alert("Api call secessfull")
        } else {
          alert("Api not called secessfully");
        }
      })
      .catch((e) => {
        alert(JSON.stringify(e));
      });
  }

  function getAll() {
    debugger;
    let token = localStorage.getItem("currentUser");
    axios
      .get("https://localhost:44363/api/Company/GetCompany", {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((d) => {
        if (d.data) {
          console.log(d.data);
          setCompany(d.data);
          //alert("Api call secessfull")
        } else {
          alert("Api not called secessfully");
        }
      })
      .catch((e) => {
        alert("Wrong with api");
      });
  }

  function employeeRoleClick(companyId) {
    // alert(companyId)
    console.log(companyId);
    navigate("/EmployeeDetail", { state: { companyId: companyId } });
  }

  function renderCompany() {
    let companyRows = [];
    company?.map((item) => {
      companyRows.push(
        <tr>
          <td>{item.companyId}</td>
          <td>{item.companyName}</td>
          <td>{item.companyAddress}</td>
          <td>{item.companyGST}</td>
          {userRole == "Admin" || userRole == "Company" ? (
            <td>
              <button
                onClick={() => editClick(item)}
                className="bg-info m-2"
                data-toggle="modal"
                data-target="#editModal">
                Edit Company
              </button>
              <button
                onClick={() => deleteClick(item.companyId)}
                className="bg-danger m-2">
                Delete Company{" "}
              </button>
              <button
                onClick={() => employeeList(item.companyId)}
                className="bg-info m-2">
                Employees List
              </button>
            </td>
          ) : (
            <td>
              <button
                onClick={() => employeeRoleClick(item.companyId)}
                className="bg-info m-2">
                My Details
              </button>
            </td>
          )}
        </tr>
      );
    });
    return companyRows;
  }

  function employeeList(companyId) {
    console.log(companyId);
    navigate("/employeeList", { state: { companyId: companyId } });
  }

  function editClick(data) {
    setcompanyForm(data);
  }

  function updateClick() {
    // debugger
    let token = localStorage.getItem("currentUser");
    //alert(employeeForm.employeeName)
    axios
      .put("https://localhost:44363/api/Company/UpdateCompany", companyForm, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((d) => {
        if (d.data) {
          getAll();
          alert("Company Updated Sucessfully");
          console.log(d.data);
          setCompany(d.data);
        } else {
          alert("Issue in api");
        }
      })
      .catch((e) => {
        alert("error with api");
      });
  }

  function deleteClick(companyId) {
    debugger;
    var token = localStorage.getItem("currentUser");
    //alert(id)
    let ans = window.confirm("Want to delete data???");
    if (!ans) return;

    axios
      .delete(
        "https://localhost:44363/api/Company/DeleteCompany?companyId=" +
          companyId,
        { headers: { Authorization: `Bearer ${token}` } }
      )
      .then((d) => {
        if (d) {
          //alert(companyId)
          alert("Company deleted successfully");
          getAll();
        } else {
          alert(d.data.message);
        }
      })
      .catch((e) => {
        alert(JSON.stringify(e));
      });
  }

  //DataTable
  const columns = [
    {
      name: <h5 className="text-success">Company ID</h5>,
      selector: "companyId",
      sortable: true,
      style: {
        fontSize: "20px",
        fontWeight: "bold",
      },
    },
    {
      name: <h5 className="text-success">Company Name</h5>,
      selector: "companyName",
      sortable: true,
      style: {
        fontSize: "20px",
        fontWeight: "bold",
      },
    },
    {
      //name: "Company Address",
      name: <h5 className="text-success">Company Address</h5>,
      selector: "companyAddress",
      sortable: true,
      style: {
        fontSize: "20px",
        fontWeight: "bold",
      },
    },
    {
      name: <h5 className="text-success">Company GST</h5>,
      selector: "companyGST",
      sortable: true,
      style: {
        fontSize: "20px",
        fontWeight: "bold",
      },
    },
    {
      name: <h5 className="text-success">Actions</h5>,
      cell: (row) => (
        <div className="col-12">
          {userRole === "Company" || userRole === "Admin" ? (
            <button
              onClick={() => editClick(row)}
              className="bg-info m-1"
              data-toggle="modal"
              data-target="#editModal"
              style={{
                fontSize: "15px",
                padding: "10px 10px",
                fontWeight: "bold",
              }}>
              Edit
            </button>
          ) : null}

          {userRole === "Admin" ? (
            <button
              onClick={() => deleteClick(row.companyId)}
              className="bg-danger m-1"
              style={{
                fontSize: "15px",
                padding: "10px 10px",
                fontWeight: "bold",
              }}>
              Delete
            </button>
          ) : null}

          {userRole === "Company" || userRole === "Admin" ? (
            <button
              onClick={() => employeeList(row.companyId)}
              className="bg-info m-1"
              style={{
                fontSize: "15px",
                padding: "10px 10px",
                fontWeight: "bold",
              }}>
              Emp List
            </button>
          ) : (
            <button
              onClick={() => employeeRoleClick(row.companyId)}
              className="bg-info m-2"
              style={{
                fontSize: "20px",
                padding: "10px 10px",
                fontWeight: "bold",
              }}>
              My Details
            </button>
          )}
        </div>
      ),
    },
  ];
  const data = company ? company.map((item) => ({ ...item })) : [];
  return (
    <div>
      <h2 className="text-success">Company Page</h2>
      <div className="row">
        <div className="col-9">
          <h2 className="text-info"></h2>
        </div>
        {userRole == "Admin" ? (
          <div className="col-3">
            <button
              className="btn btn-info"
              data-toggle="modal"
              data-target="#newModal">
              New Company
            </button>
          </div>
        ) : null}
      </div>

      <DataTable
        className="table table-responsive table-active"
        columns={columns}
        data={data}
        pagination={true}
        paginationPerPage={10}
        paginationRowsPerPageOptions={[10, 20, 30]}
        highlightOnHover={true}
      />

      {/* Save */}
      <form>
        <div className="modal" id="newModal" role="dialog">
          <div className="modal-dialog">
            <div className="modal-content">
              {/* header */}
              <div className="modal-dialog ">
                <div className="modal-content"></div>
              </div>
              {/* Body */}
              <div className="modal-body">
                <div className="form-group row">
                  <label for="txtcompanyName" className="col-sm-4">
                    Company Name
                  </label>
                  <div className="col-sm-8">
                    <input
                      type="text"
                      id="txtcompanyName"
                      name="companyName"
                      placeholder="Enter Company Name"
                      className="form-control"
                      value={companyForm.companyName}
                      onChange={changeHandler}
                    />
                  </div>
                </div>
                <div className="form-group row">
                  <label for="txtcompanyAddress" className="col-sm-4">
                    Company Address
                  </label>
                  <div className="col-sm-8">
                    <input
                      type="text"
                      id="txtcompanyAddress"
                      name="companyAddress"
                      placeholder="Enter Company Address"
                      className="form-control"
                      value={companyForm.companyAddress}
                      onChange={changeHandler}
                    />
                  </div>
                </div>
                <div className="form-group row">
                  <label for="txtcompanyGST" className="col-sm-4">
                    Company GST
                  </label>
                  <div className="col-sm-8">
                    <input
                      type="text"
                      id="txtcompanyGST"
                      name="companyGST"
                      placeholder="Enter Company GST"
                      className="form-control"
                      value={companyForm.companyGST}
                      onChange={changeHandler}
                    />
                  </div>
                </div>
              </div>
              {/* Footer */}
              <div className="modal-footer bg-info">
                <button
                  onClick={saveClick}
                  className="btn btn-success"
                  data-dismiss="modal">
                  Save
                </button>
                <button className="btn btn-danger" data-dismiss="modal">
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      </form>

      {/* Edit */}
      <form>
        <div className="modal" id="editModal" role="dialog">
          <div className="modal-dialog">
            <div className="modal-content">
              {/* header */}
              <div className="modal-dialog ">
                <div className="modal-content"></div>
              </div>
              {/* Body */}
              <div className="modal-body">
                <div className="form-group row">
                  <label for="txtcompanyName" className="col-sm-4">
                    Company Name
                  </label>
                  <div className="col-sm-8">
                    <input
                      type="text"
                      id="txtcompanyName"
                      name="companyName"
                      placeholder="Enter Company Name"
                      className="form-control"
                      value={companyForm.companyName}
                      onChange={changeHandler}
                    />
                  </div>
                </div>
                <div className="form-group row">
                  <label for="txtcompanyAddress" className="col-sm-4">
                    Company Address
                  </label>
                  <div className="col-sm-8">
                    <input
                      type="text"
                      id="txtcompanyAddress"
                      name="companyAddress"
                      placeholder="Enter Company Address"
                      className="form-control"
                      value={companyForm.companyAddress}
                      onChange={changeHandler}
                    />
                  </div>
                </div>

                <div className="form-group row">
                  <label for="txtcompanyGST" className="col-sm-4">
                    companyGST
                  </label>
                  <div className="col-sm-8">
                    <input
                      type="text"
                      id="txtcompanyGST"
                      name="companyGST"
                      placeholder="Enter Company GST"
                      className="form-control"
                      value={companyForm.companyGST}
                      onChange={changeHandler}
                    />
                  </div>
                </div>
              </div>
              {/* Footer */}
              <div className="modal-footer bg-info">
                <button
                  onClick={updateClick}
                  className="btn btn-success"
                  data-dismiss="modal">
                  Update
                </button>
                <button className="btn btn-danger" data-dismiss="modal">
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
}

export default Company;
