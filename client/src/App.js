import React from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Login from './Components/Login'
import Signup from './Components/Signup'
import Home from './Components/Home'
import 'bootstrap/dist/css/bootstrap.min.css';

function App() {
  return (
    <BrowserRouter>
        <Routes>
        <Route path='/Signup' element={<Signup />} ></Route>
          <Route path='/Login' element={<Login />}></Route>
          <Route path='/' element={<Home />} ></Route>
        </Routes>
    </BrowserRouter>
  )
}

export default App

// import React from 'react'
// // import Signup from './Signup';
// import { BrowserRouter, Routes, Route } from 'react-router-dom';
// import Login from './Login';
// import 'bootstrap/dist/css/bootstrap.min.css';
// import Signup from './Signup';


// function App() {
//   return (
//     <BrowserRouter>
//       <Routes>
//         <Route path='/Signup' element={<Signup />}></Route>
//         <Route path='/Login' element={<Login />}></Route>
//       </Routes>
//     </BrowserRouter> 
//   );
// }

// export default App
