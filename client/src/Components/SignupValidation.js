// function validation(values) {
//     let errors = {};
//     const email_pattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
//     const phoneRegex = /^\+2547\d{8}$/;
//     // const password_pattern = /^(?=.*\d)(?=.*[a-z])[a-zA-Z0-9]{8,}$/

//     if (!values.name) {
//       errors.name = "Name is required";
//     }
//     if (!values.email) {
//       errors.email = "Email is required";
//     } else if (!email_pattern.test(values.email)) {
//       errors.email = "Email address is invalid";
//     }

//     if (!values.password ==='') {
//       errors.password = "Password is required";
//     } else if (values.password.length < 8) {
//       errors.password = "Password must be at least 8 characters";
//     }
//     if (!values.phoneNumber === '') {
//         errors.email = "PhoneNumber is required";
//     }else if(!phoneRegex.test(values.phoneNumber)) {
//         errors.phoneNumber = "Invalid phone number";
//     }
//     return errors;
//   }
  
//   export default validation;

 function SignupValidation(name = "", email = "", password = "", phoneNumber = "") {
    let errors = {};
    const email_pattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    const phoneRegex = /^\+2547\d{8}$/;
    // const password_pattern = /^(?=.*\d)(?=.*[a-z])[a-zA-Z0-9]{8,}$/

    // Validate Name
    if (!name || name.trim().length < 3) {
      errors.name = "Name must be at least 3 characters long";
    } else {
      errors.name = "";
    }
  
    // Validate Email
    if (!email) {
      errors.email = "Email is required";
    } else if (!email_pattern.test(email)) {
      errors.email = "Email address is invalid";
    } else {
      errors.email = "";
    }
  
    // Validate Password
    if (!password || password.length < 8) {
      errors.password = "Password must be at least 8 characters long";
    } else {
      errors.password = "";
    }
  
    // Validate Phone Number (optional)
    if (phoneNumber && !phoneRegex.test(phoneNumber)) {
      errors.phoneNumber = "Phone number must be 10 digits long";
    } else {
      errors.phoneNumber = "";
    }
  
    return errors;
  }
  
  export default SignupValidation;
