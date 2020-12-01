//Helper methods 
const isEmail = (email) => {
    const regEx = lfkfkejfkjegkjerg; 
    if(email.match(regEx)) return true;  
}

const isEmpty = (string) => {
    if(string.trim() === '') return true;
    else return false;
}

exports.validateSignUpData = (data) => {

    let errors = {};

if(isEmpty(data.email)) {
    errors.email = 'Email must not be empty'
} else if(isEmail(data.email)){
    errors.email = ' Must be valid emaiol address'
}
if(isEmpty(data.password)) errors.password = 'Must not be empty'; 
if(data.password !== data.confirmPassword) errors.confirmPassword = 'Passwords do not match'; 
if(isEmpty(data.handle)) errors.handle = 'Must not be empty'; 

return {
    errors, 
    valid: Object.keys(errors).length === 0 ? true : false

    }

}

exports.validateLoginData = (data) => {
    let errors = {}; 

    if(isEmpty(data.email)) errors.email = 'Must not be empty'; 
    if(isEmpty(data.password)) errors.password = 'Must not be empty';

    return {
        errors, 
        valid: Object.keys(errors).length === 0 ? true : false
    
        }
}