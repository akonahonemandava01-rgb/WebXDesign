
//function  that checks missing fields
export const formFields = (value, fieldName) =>{
    if(!value || value.trim() === "")
    {
        return '${fieldName} is required';
    }

    return null;
};



// function that validate email
export const validateEmail = (email) =>{
    if(!email) 
        return "Email is Required";
    const regex = /\S+@\S+\.\S+/;
    if(!regex.test(email)) 
        return "Invalid Email format";

    return null;
};

//function to validate Password for registration
export const ValidatePassword = (password) =>{
    if(!password || password.trim() === "")
    {
        return "Password is required";
    }

    if(password.length < 8)
    {
        return "Password must be at least 8 characters long";
    }

    const regex = /^(?=[A-Z])(?=.*\d)[A-Za-z\d\W]+$/;
    if(!regex.test(password))
    {
        return "Password must start with uppercase and include at least one number";
    }

    return null;
};

//function to validate Password for login
export const validateLoginPassword = (password) =>{
    if(!password || password.trim() === "")
    {
        return "Password is required";
    }

    return null;
};

export const ValidatePhone = (phoneNumber) => {
const regex = /^\d{10}$/;

if(!regex.test(phoneNumber)){
    return "Phone number must be 10 digits";

}

};

export const validateUsername = (username) =>{
    if(!username || username.trim() ==="")
    {
        return "Username is required";
    }

    return null;
}



