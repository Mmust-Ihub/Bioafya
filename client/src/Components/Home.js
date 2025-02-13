import React, { useState, useEffect } from "react";
import { db, collection, query, where, onSnapshot } from "./firebase"; // Import onSnapshot
import "bootstrap/dist/css/bootstrap.min.css";
import toast, { Toaster } from 'react-hot-toast';

import Login from "./Login";

function Home() {
  const [access_token] = useState(localStorage.getItem("jwtToken"));
  const vetId = localStorage.getItem("vetId");
  const [requests, setRequests] = useState([]);

  useEffect(() => {
    if (!vetId) return;

    // Firestore query with real-time listener
    const q = query(collection(db, "vet_requests"), where("vetId", "==", vetId));

    // Real-time listener using onSnapshot
    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      const data = querySnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
      setRequests(data); // Update state instantly
    });

    // Cleanup the listener when component unmounts
    return () => unsubscribe();
  }, [vetId]);
  const handlelogout = async()=>{
    const notify=toast.loading("Logging Out...")
    localStorage.removeItem("jwtToken")
    // localStorage.removeItem("jwtToken")
    window.location.href = "/"
  }

  return (
    <>
      {access_token ? (
        <div className="container-fluid vh-100 d-flex justify-content-center align-items-center bg-light">
          <div className="row shadow-lg rounded overflow-hidden w-100 vh-100">
            <div className="p-5" id="farmers">
              <div className="logout">
              <button type="submit" className="btn btn-success" onClick={handlelogout}>Logout</button>
              </div>
              <h2 className="text-primary fw-bold mb-4" id="farmer">
                Farmers Requests
              </h2>
              <table className="table table-striped table-responsive">
                <thead>
                  <tr>
                    <th>Id</th>
                    <th>Animal</th>
                    <th>Disease</th>
                    <th>Phone</th>
                    <th>Username</th>
                  </tr>
                </thead>
                <tbody>
                  {requests.map((request, index) => (
                    <tr key={request.id}>
                      <td>{index + 1}</td>
                      <td>{request.animal}</td>
                      <td>{request.disease}</td>
                      <td>{request.phone_number}</td>
                      <td>{request.username}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      ) : (
        <Login />
      )}
    </>
  );
}

export default Home;
