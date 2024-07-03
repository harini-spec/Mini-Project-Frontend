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
        else
            return res.json();
     })
    .then(data => {
        if(data){
            localStorage.setItem('token', data.token);
            localStorage.setItem('email', txtEmail);
            document.getElementById('loginError').innerHTML = "";
            document.getElementById('loginSuccess').innerHTML = "logged in successfully!";
            document.getElementById("account").innerHTML = txtEmail;
            window.location.href = "home.html";
            return true;
        }
    });

}