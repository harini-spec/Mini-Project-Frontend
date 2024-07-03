function RegisterCustomer(){
    if(!validateForm()){
        return false;
    }
    
    var txtName = document.getElementById("name").value;
    var txtAge = document.getElementById("age").value;
    var txtPass = document.getElementById("password").value;
    var txtEmail = document.getElementById("email").value;
    var txtPhone = document.getElementById("phone").value;

    fetch('http://localhost:5251/api/Customer/RegisterCustomer', {
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
        document.getElementById('registerError').innerHTML = "";
        document.getElementById('registerSuccess').innerHTML = "Your account has been registered successfully!";
        window.location.href = "CustomerLogin.html";
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