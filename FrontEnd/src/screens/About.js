import React, { Fragment, useEffect, useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import Button from "react-bootstrap/Button";
import axios from "axios";
import Header from "./Header";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const About = () => {
  const [show, setShow] = useState(false);

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  const [companyName, setCompanyName] = useState("");
  const [companyAddress, setCompanyAddress] = useState("");
  const [country, setCountry] = useState("");
  const [gst, setGst] = useState(0);
  const [designation, setDesignation] = useState("");
  const [leave, setLeave] = useState(0);

  const [editId, setEditId] = useState("");
  const [editcompanyname, setEditCompanyName] = useState("");
  const [editcompanyaddress, setEditCompanyAddress] = useState("");
  const [editcountry, setEditCountry] = useState("");
  const [editgst, setEditGst] = useState(0);
  const [editdesignation, setEditDesignation] = useState("");
  const [editleave, setEditLeave] = useState(0);

  const [data, setData] = useState([]);

  useEffect(() => {
    getData();
  }, []);

  const getData = () => {
    //let token = JSON.parse(localStorage.getItem("currentUser")).token;
    axios
      .get("https://localhost:7228/api/company/get")
      .then((result) => {
        setData(result.data);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const handleSave = () => {
    const url = "https://localhost:7228/api/company/post";
    const data = {
      "companyName": companyName,
      "companyAddress": companyAddress,
      "country": country,
      "gst": gst,
      "designation": designation,
      "leave": leave
    };
    axios
      .post(url, data)
      .then((result) => {
        getData();
        clear();
        toast.success("Company has been added");
      })
      .catch((error) => {
        toast.error(error);
      });
  };

  const clear = () => {
    setCompanyName("");
    setCompanyAddress("");
    setCountry("");
    setGst(0);
    setDesignation("")
    setLeave(0);
    setEditCompanyName("");
    setEditCompanyAddress("");
    setEditCountry("");
    setEditGst(0);
    setEditDesignation("");
    setEditLeave(0);
    setEditId("");
  };

  const handleActiveChange = (e) => {
    if (e.target.checked) {
      setLeave(1);
    } else {
      setLeave(0);
    }
  };

  const handleEditActiveChange = (e) => {
    if (e.target.checked) {
      setEditLeave(1);
    } else {
      setEditLeave(0);
    }
  };

  const handleEdit = (id) => {
   // alert(id);
     handleShow();
    axios
      .get(`https://localhost:7228/api/company/getbyid/${id}`)
      .then((result) => {
        setEditCompanyName(result.data.companyName);
        setEditCompanyAddress(result.data.companyAddress);
        setEditCountry(result.data.country);
        setEditGst(result.data.gst);
        setEditDesignation(result.data.designation)
        setEditLeave(result.data.leave);
        setEditId(id);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const handleDelete = (id) => {
    if (window.confirm("Are you sure to delete this data") == true) {
      axios
        .delete(`https://localhost:7228/api/company/delete/${id}`)
        .then((result) => {
          if (result.status === 200) {
            toast.success("Company has been deleted");
            getData();
          }
        })
        .catch((error) => {
          toast.error(error);
        });
    }
  };

  const handleUpdate = () => {
    const uRl = `https://localhost:7228/api/company/update/${editId}`;
    const data = {
        id:editId,
        companyName: editcompanyname,
        companyAddress: editcompanyaddress,
        country: editcountry,
        gst: editgst,
        designation: editdesignation,
        leave: editleave
    };
    axios
      .put(uRl, data)
      .then((result) => {
        handleClose();
        getData();
        clear();
        toast.success("data has been updated");
      })
      .catch((error) => {
        toast.error(error);
      });
  };
  return (
    <Fragment>
      <div>
        <ToastContainer />
        <div className="row">
          <div className="col-8 text-left m-2">
            <h2 className="text-primary">Company List</h2>
          </div>
          <br />
          <div className="col-3">
            <br />
            <button
              className="btn btn-info form-control"
              data-toggle="modal"
              data-target="#newModal"
            >
              New Employee
            </button>
          </div>
        </div>
        <div className="col-9 m-2 p-2">
          <table className="table table-bordered table-striped table-active">
            <thead>
              <tr>
                <th>#</th>
                <th>Name</th>
                <th>Address</th>
                <th>Country</th>
                <th>GST</th>
                <th>Designation</th>
                <th>Leave</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {data && data.length > 0
                ? data.map((item, index) => {
                    return (
                      <tr key={index}>
                        <td>{index + 1}</td>
                        <td>{item.companyName}</td>
                        <td>{item.companyAddress}</td>
                        <td>{item.country}</td>
                        <td>{item.gst}</td>
                        <td>{item.designation}</td>
                        <td>{item.leave}</td>
                        <td colSpan={2}>
                          <button
                            className="btn btn-info"
                            onClick={() => handleEdit(item.id)}
                            data-target="#editModal"
                            data-toggle="modal"
                          >
                            Edit
                          </button>{" "}
                          &nbsp;
                          <button
                            className="btn btn-danger"
                            onClick={() => handleDelete(item.id)}
                          >
                            Delete
                          </button>
                        </td>
                      </tr>
                    );
                  })
                : "Loading..."}
            </tbody>
          </table>
        </div>
        {/* Save */}
        <form>
          <div class="modal" id="newModal" role="dialog">
            <div class="modal-dialog">
              <div class="modal-content">
                {/* <!-- Header --> */}
                <div class="modal-header">
                  <div class="modal-tittle text-primary">New Employee</div>
                  <button class="close" data-dismiss="modal">
                    <span>&times;</span>
                  </button>
                </div>
                {/* <!-- Body --> */}
                <div class="modal-body">
                  <div class="form-group row">
                    <label for="txtcompanyname" class=" text-success col-sm-4">
                      Name
                    </label>
                    <div class="col-8">
                      <input
                        type="text"
                        className="form-control"
                        placeholder="Enter Name"
                        value={companyName}
                        onChange={(e) => setCompanyName(e.target.value)}
                      />
                    </div>
                  </div>
                  <div class="form-group row">
                    <label for="txtcompanyaddress" class="text-success col-sm-4">
                      Address
                    </label>
                    <div class="col-8">
                      <input
                        type="text"
                        className="form-control"
                        placeholder="Enter Address"
                        value={companyAddress}
                        onChange={(e) => setCompanyAddress(e.target.value)}
                      />
                    </div>
                  </div>
                  <div class="form-group row">
                    <label for="txtcountry" class="text-success col-sm-4">
                      Country
                    </label>
                    <div class="col-8">
                      <input
                        type="text"
                        className="form-control"
                        placeholder="Enter Country"
                        value={country}
                        onChange={(e) => setCountry(e.target.value)}
                      />
                    </div>
                  </div>
                  <div class="form-group row">
                    <label
                      for="txtgst"
                      class="text-success col-sm-4"
                    >
                      GST
                    </label>
                    <div class="col-8">
                      <input
                        type="number"
                        className="form-control"
                        placeholder="Enter GST"
                        value={gst}
                        onChange={(e) => setGst(e.target.value)}
                      />
                    </div>
                  </div>
                  <div class="form-group row">
                    <label
                      for="txtdesignation"
                      class="text-success col-sm-4"
                    >
                      Designation
                    </label>
                    <div class="col-8">
                      <input
                        type="text"
                        className="form-control"
                        placeholder="Enter Designation"
                        value={designation}
                        onChange={(e) => setDesignation(e.target.value)}
                      />
                    </div>
                  </div>
                  <div class="form-group row">
                    <label for="txtleave" class="text-success col-sm-4">
                      Approve Leave
                    </label>
                    <div class="col-4">
                      <input
                        type="checkbox"
                        checked={leave === 1 ? true : false}
                        onChange={(e) => handleActiveChange(e)}
                        value={leave}
                      />
                    </div>
                  </div>
                </div>
                {/* <!-- Footer --> */}
                <div class="modal-footer">
                  <button
                    className="btn btn-info"
                    onClick={() => handleSave()}
                    data-dismiss="modal"
                  >
                    Submit
                  </button>
                  <button class="btn btn-info" data-dismiss="modal">
                    Cancel
                  </button>
                </div>
              </div>
            </div>
          </div>
        </form>
        {/* <!-- Edit --> */}
        <form>
          <div class="modal" id="editModal" role="dialog">
            <div class="modal-dialog">
              <div class="modal-content" show={show} onHide={handleClose}>
                {/* <!-- Header --> */}
                <div class="modal-header">
                  <div class="modal-tittle text-primary">Edit Company</div>
                  <button class="close" data-dismiss="modal">
                    <span>&times;</span>
                  </button>
                </div>
                {/* <!-- Body --> */}
                <div class="modal-body">
                  <div class="form-group row">
                    <label for="txtcountryname" class=" text-success col-sm-4">
                      Name
                    </label>
                    <div class="col-8">
                      <input
                        type="text"
                        className="form-control"
                        placeholder="Enter Name"
                        value={editcompanyname}
                        onChange={(e) => setEditCompanyName(e.target.value)}
                      />
                    </div>
                  </div>
                  <div class="form-group row">
                    <label for="txtcompanyaddress" class="text-success col-sm-4">
                      Address
                    </label>
                    <div class="col-8">
                      <input
                        type="text"
                        className="form-control"
                        placeholder="Enter Address"
                        value={editcompanyaddress}
                        onChange={(e) => setEditCompanyAddress(e.target.value)}
                      />
                    </div>
                  </div>
                  <div class="form-group row">
                    <label for="txtcountry" class="text-success col-sm-4">
                      Country
                    </label>
                    <div class="col-8">
                      <input
                        type="text"
                        className="form-control"
                        placeholder="Enter Country"
                        value={editcountry}
                        onChange={(e) => setEditCountry(e.target.value)}
                      />
                    </div>
                  </div>
                  <div class="form-group row">
                    <label
                      for="txtgst"
                      class="text-success col-sm-4"
                    >
                      GST
                    </label>
                    <div class="col-8">
                      <input
                        type="number"
                        className="form-control"
                        placeholder="Enter GSt"
                        value={editgst}
                        onChange={(e) => setEditGst(e.target.value)}
                      />
                    </div>
                  </div>
                  <div class="form-group row">
                    <label for="txtdesignation" class="text-success col-sm-4">
                      Country
                    </label>
                    <div class="col-8">
                      <input
                        type="text"
                        className="form-control"
                        placeholder="Enter Designation"
                        value={editdesignation}
                        onChange={(e) => setEditDesignation(e.target.value)}
                      />
                    </div>
                  </div>
                  <div class="form-group row">
                    <label for="txtleave" class="text-success col-sm-4">
                      Approve Leave
                    </label>
                    <div class="col-4">
                      <input
                        type="checkbox"
                        checked={editleave === 1 ? true : false}
                        onChange={(e) => handleEditActiveChange(e)}
                        value={editleave}
                      />
                    </div>
                  </div>
                </div>
                {/* <!-- Footer --> */}
                <div class="modal-footer">
                  <Button
                    variant="secondary"
                    onClick={handleClose}
                    data-target=""
                    data-dismiss="modal"
                    data-toggle="modal"
                  >
                    Close
                  </Button>
                  <Button
                    variant="primary"
                    onClick={handleUpdate}
                    data-dismiss="modal"
                  >
                    Save changes
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </form>
      </div>
    </Fragment>
  );
};

export default About;
