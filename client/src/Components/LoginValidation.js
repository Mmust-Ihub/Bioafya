// set a validation function
function validation(values){
    let error = {}
    const email_pattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    const password_pattern = /^(?=.*\d)(?=.*[a-z])[a-zA-Z0-9]{8,}$/
    
    if (values.email === "") {
        error.email = 'Name should not be empty'
    }
    else if (!email_pattern.test(values.email)) {
        error.email = "Email didn't match"
    }
    else {
        error.email = ""
    }

    if (values.password === '') {
        error.password = 'Password should not be empty'
    } 
    else if (!password_pattern.test(values.password)) {
        error.password = "Password didn't match"
        // error.password = (error.message)
    } 
    else {
        error.password = ""
    }
    return error;
}

export default validation;