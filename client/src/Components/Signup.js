import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import "bootstrap/dist/css/bootstrap.min.css";
import SignupValidation from "./SignupValidation";
import toast, { Toaster } from 'react-hot-toast';
import "./style.css";

function Signup() {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [phone_number, setPhoneNumber] = useState("");
  const [location, setLocation] = useState({
    coordinates: [34.75229, 0.28422]
  });
  
  // setLocation({
  //   coordinates: [] // New coordinates
  // });
  

  const [errors, setErrors] = useState({});
  // location
  const navigate = useNavigate();

  const handleSubmit = (event) => {
    event.preventDefault();
    const notify=toast.loading("Signing Up...")
    const validationErrors = SignupValidation(username, email, password, phone_number, location);
    
    setErrors(validationErrors);

    if (!validationErrors.name && !validationErrors.email && !validationErrors.password) {
      axios
        .post(`${process.env.REACT_APP_API_ENDPOINT}/register`, { username, email, password, phone_number, location})
        .then((res) => {
          toast.success("Signed Up successfully",{
            id:notify
          })
          alert("Signup successful! Please log in.");
          navigate("/login");
        })
        .catch((err) => console.log(err));
         toast.error("failed...",{
          id:notify
         })
        // console.log("singup up")
    }
  };

  return (
    <div className="container-fluid vh-100 d-flex justify-content-center align-items-center bg-light">
      <div className="row shadow-lg rounded overflow-hidden w-100 vh-100">
        {/* Left Side - Illustration */}
        <div className="col-md-6 d-flex align-items-center justify-content-center  text-white p-4">
          <img src="/img/home2.png" alt="Illustration" className="img-home3" />
          <img src="/img/logo.png" alt="Illustration" className="img-fluid" />
        </div>

        {/* Right Side - Form */}
        <div className="col-md-6 bg-white p-5" id="sign">
          <h2 className="text-primary fw-bold mb-4">Welcome!</h2>
          <form onSubmit={handleSubmit}>
            <div className="mb-3">
              <label className="form-label">Your UserName</label>
              <input type="text" className="form-control" placeholder="Enter your UserName" required 
                onChange={(e) => setUsername(e.target.value)} />
              {errors.username && <small className="text-danger">{errors.username}</small>}
            </div>
            
            <div className="mb-3">
              <label className="form-label"><strong>Email</strong></label>
              <input type="email" className="form-control" placeholder="Enter Your Email" required
                onChange={(e) => setEmail(e.target.value)} />
              {errors.email && <small className="text-danger">{errors.email}</small>}
            </div>

            <div className="mb-3">
              <label className="form-label"><strong> Enter Password</strong></label>
              <input type="password" className="form-control" placeholder="Enter password" required 
                onChange={(e) => setPassword(e.target.value)} />
              {errors.password && <small className="text-danger">{errors.password}</small>}
            </div>

            <div className="mb-3">
              <label className="form-label"><strong> Enter Phone NO.</strong></label>
              <input type="tel" className="form-control" placeholder="Enter Phone Number" required 
                onChange={(e) => setPhoneNumber(e.target.value)} />
            </div>
            {/* <div className="mb-3">
              <label className="form-label"><strong>Location</strong></label>
              <input type="text" className="form-control" placeholder="Enter Your Location" required
                onChange={(e) => setLocation(e.target.value)} />
              {errors.location && <small className="text-danger">{errors.location}</small>}
            </div> */}

            {/* Buttons */}
            <div className="d-flex justify-content-between mt-4">
              <button type="submit" className="btn btn-success">Create An Account</button>
              <Link to="/login" className="btn btn-success text-white">
                Already Have An Account
              </Link>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default Signup;
