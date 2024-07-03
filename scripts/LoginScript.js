function validateEmail(){
    var email = document.getElementById("email");
    var email_error = document.getElementById("emailError");
    var email_regex = /^\w+@[a-zA-Z_]+?\.[a-zA-Z]{2,3}$/; //starts with /^, ends with $/, \w is for word character, + is for one or more, ? is for optional, \. is for dot
    if(!email.value)
    {
        email_error.innerHTML = "Email is required!";
        email.classList.add("error");
        email.classList.remove("success");
        return false;
    }
    else if(!email_regex.test(email.value)){
        email_error.innerHTML = "Email should be of the correct format";
        email.classList.add("error");
        email.classList.remove("success");
        return false;
    }
    else{
        email_error.innerHTML = "";
        email.classList.remove("error");
        email.classList.add("success");
        return true;
    }
}

function validatePassword(){
    var password = document.getElementById("password");
    var password_error = document.getElementById("passwordError");
    if(!password.value)
    {
        password_error.innerHTML = "Password is required!";
        password.classList.add("error");
        password.classList.remove("success");
        return false;
    }
    else{
        password_error.innerHTML = "";
        password.classList.remove("error");
        password.classList.add("success");
        return true;
    }
}

function validateLogin(){
    validateEmail();
    validatePassword();
    if(validateEmail() && validatePassword()){
        return true;
    }
    else{
        return false;
    }
}

// himu@gmail.com
// himuPASS1@