import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import './style.css';
import toast, { Toaster } from 'react-hot-toast';

function Login() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const navigate = useNavigate();
    const [phone_number, setPhoneNumber] = useState("");
  
    const [isSubscribed,setIsSubscribed]=useState(JSON.parse(localStorage.getItem("isSubscribedtobiovet"))||false)
   const [access_token, setAccess_token] = useState(localStorage.getItem("jwtToken"));
 useEffect(()=>{
    if(access_token){
        window.location.href="/"
         }
 },[access_token])
    const handleSubscription = async()=>{
        try {
            const response = await fetch(`${process.env.REACT_APP_API_ENDPOINT}/subscribe`,{
                method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ phone_number }),
                });
                if (response.status === 202) {
                    localStorage.setItem("isSubscribedtobiovet", JSON.stringify(true));
                    setIsSubscribed(true)
                }
                 else {
                
            }
        } catch (error) {
            console.error(error)
        }

    }
    const handleSubmit = async (e) => {
        e.preventDefault();
        const notify=toast.loading("login...")
        // process.env.REACT_APP_API_ENDPOINT
        try {
            const response = await fetch(`${process.env.REACT_APP_API_ENDPOINT}/login`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email, password }),
            });
            
            if (!response.ok) {
                toast.error(response.text,{
                    id:notify
                })
                throw new Error(`HTTP error! Status: ${response.status}`);
            }
            console.log(response);
            const data = await response.json();
            // console.log(data)
            

            if (response.ok) {
                console.log(data)
                // Store token in localStorage or sessionStorage
                localStorage.setItem("jwtToken", data.access_token);localStorage.setItem("vetId", data.vetId);
                toast.success("Logged in successfuly",{
            id:notify
                })

                console.log("JWT Token stored successfully!");
             
           window.location.href="/"
            } else {
                toast.error("Unauthorized",{
                    id:notify
                })
                console.error("No token received!");
            }

            // if (data.subscribed) {
            //     alert("Login successful!...");
            //     navigate('/Home'); // Redirect to Home if subscribed
            // } else {
            //     alert("Please Subscribe First...");
            //     navigate('/subscribe'); // Redirect to subscription page
            // }
            //  {
            //     alert("Please Subscribe First...");
            //     navigate('/subscribe'); // Redirect to subscription page
            //     // navigate('/Home');
            // }
        } catch (error) {
            toast.error("Internal server error",{
                id:notify
            })
            console.error("Error:", error);
        }finally{
            // toast.dismiss(notify)
        }
    };

    return (
        <div className="container-fluid vh-100 d-flex justify-content-center align-items-center">
            <Toaster/>
            <div className="row shadow-lg rounded overflow-hidden w-100">
                
                {/* Left Side - Illustration */}
                <div className="col-md-6 d-flex align-items-center justify-content-center bg-white text-white p-4" id='login'>
                    <img src="/img/logo.png" alt="Illustration" className="img-logo" />
                    <img src="/img/home2.png" alt="Illustration" className="home2" />
                </div>

                {/* Right Side - Form */}
                <div className="col-md-6 bg-white p-5" id='whole'>
                    <h2 className="text-primary fw-bold mb-4">Welcome Back!</h2>
                    {isSubscribed?<form onSubmit={handleSubmit}>
                        <div className="mb-3">
                            <label className="form-label"><strong>Email</strong></label>
                            <input 
                                type="email" 
                                className="form-control" 
                                placeholder="Enter Your Email" 
                                required
                                onChange={(e) => setEmail(e.target.value)} 
                            />
                        </div>
                        <div className="mb-3">
                            <label className="form-label"><strong>Enter Password</strong></label>
                            <input 
                                type="password" 
                                className="form-control" 
                                placeholder="Enter password" 
                                required 
                                onChange={(e) => setPassword(e.target.value)}
                            />
                        </div>

                     

                        {/* Buttons */}
                        <div className="d-flex justify-content-between mt-4">
                            <button type="submit" className="btn btn-success">Sign In</button>
                            <Link to="/signup">
                                <button className="btn btn-secondary text-white">Don't Have An Account?</button>
                            </Link>
                        </div>
                    </form>:<>
                    <h2>Subscribe First To Login</h2>
                       {/* Subscription Redirect */}
                       <div className="mb-3 flex-col" id='subs'>
                            <input 
                                type="tel" 
                                className="form-control" 
                                placeholder="Enter Phone Number" 
                                required 
                                onChange={(e) => setPhoneNumber(e.target.value)}
                            />
                            <label className="form-label"></label>
                                <button type="button" id='subscribe' onClick={handleSubscription} className="btn btn-warning"><strong>Subscribe</strong></button>
                        </div>
                    </>}
                </div>
            </div>
        </div>
    );
}

export default Login;
