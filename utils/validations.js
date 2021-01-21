//validate user's input
module.exports.validateRegisterInput = (
    //takes in these fields
    username,
    email,
    password,
    confirmPassword
) => {
    const errors = {};
    if (username.trim() === '') {
        errors.username = 'Username must not be empty';
    }
    if (email.trim() === '') {
        errors.email = 'Email must not be empty';
    } else {
        //check if valid email
        const regEx = /^([0-9a-zA-Z]([-.\w]*[0-9a-zA-Z])*@([0-9a-zA-Z][-\w]*[0-9a-zA-Z]\.)+[a-zA-Z]{2,9})$/;
        if (!email.match(regEx)) {
            errors.email = 'Email must be a valid email address';
        }
    }
    if (password === '') {
        //white spaces in password is fine, just can't be empty
        errors.password = 'Password must not be empty';
    } else if (password !== confirmPassword) {
        //make sure password equals confirmPassword
        errors.confirmPassword = 'Passwords must match';
    }

    return {
        //return the errors
        errors,
        //if error length is less than 1, it is valid
        valid: Object.keys(errors).length < 1
    }
};

//validations for logging in
module.exports.validateLoginInput = (username, password) => {
    const errors = {};
    if (username.trim() === '') {
        errors.username = 'Username must not be empty';
    }
    if (password === '') {
        //white spaces in password is fine, just can't be empty
        errors.password = 'Password must not be empty';
    }
    return {
        //return the errors
        errors,
        //if error length is less than 1, it is valid
        valid: Object.keys(errors).length < 1
    }
}