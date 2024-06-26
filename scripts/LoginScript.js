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

function LoginCustomer(){
    if(!validateLogin()){
        return false;
    }
    
    var txtEmail = document.getElementById("email").value;
    var txtPass = document.getElementById("password").value;

    fetch('http://localhost:5251/api/Customer/LoginCustomer', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
                "email": txtEmail,
                "password": txtPass
        })
    })
    .then(res => {
        if (!res.ok) {
            res.json().then(data => {
                console.log(data);
                if(data.errorMessage === "Your account is not activated")
                    throw new Error('Your account is not activated!');
                if(res.status === 404 || res.status === 400 || res.status === 401)
                    throw new Error('Invalid Username or password!');
                else
                    throw new Error('Network response was not ok');
            })
            .catch(error => {
                if(error.message === 'Invalid Username or password!')
                    document.getElementById('loginError').innerHTML = "Invalid Username or password!";
                else if(error.message === 'Your account is not activated!')
                    document.getElementById('loginError').innerHTML = "Your account is not activated!";
                else
                    document.getElementById('loginError').innerHTML = "Network response was not ok!";   
                return false;
            });
        }
        return res.json();
     })
    .then(data => {
        sessionStorage.setItem('token', data.token);
        sessionStorage.setItem('email', txtEmail);
        document.getElementById('loginError').innerHTML = "";
        document.getElementById('loginSuccess').innerHTML = "logged in successfully!";
        document.getElementById("account").innerHTML = txtEmail;
        window.location.href = "home.html";
        return true;
    });

}

// himu@gmail.com
// himuPASS1@