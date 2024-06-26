function RegisterAdmin(){
    if(!validateForm()){
        return false;
    }
    
    var txtName = document.getElementById("name").value;
    var txtAge = document.getElementById("age").value;
    var txtPass = document.getElementById("password").value;
    var txtEmail = document.getElementById("email").value;
    var txtPhone = document.getElementById("phone").value;

    fetch('http://localhost:5251/api/Admin/RegisterAdmin', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
                "name": txtName,
                "age": txtAge,
                "email": txtEmail,
                "phone": txtPhone,
                "password": txtPass
        })
    })
    .then(res => {
        if (!res.ok) {
           if (res.status === 409) {
              throw new Error('Conflict: User already exists');
           } else {
              throw new Error('Network response was not ok');
           }
        }
        return res.json();
     })
    .then(data => {
        console.log(data);
        document.getElementById('registerError').innerHTML = "";
        document.getElementById('registerSuccess').innerHTML = "Your account has been registered successfully!";
        window.location.href = "LoginAdmin.html";
        return true;
    })
    .catch(error => {
        document.getElementById('registerSuccess').innerHTML = "";

        if(error.message === 'Conflict: User already exists'){
            document.getElementById('registerError').innerHTML = "User already exists with this email!";
            return false;
        }
        document.getElementById('registerError').innerHTML = "Sorry, an error occurred while registering your account. Please try again later.";
        return false;
    });
}

function LoginAdmin(){
    if(!validateLogin()){
        return false;
    }
    
    var txtEmail = document.getElementById("email").value;
    var txtPass = document.getElementById("password").value;

    fetch('http://localhost:5251/api/Admin/LoginAdmin', {
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
        window.location.href = "AdminAddBus.html";
        return true;
    });

} 