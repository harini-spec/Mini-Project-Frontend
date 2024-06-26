function validateName(){
    var name = document.getElementById("name");
    var name_error = document.getElementById("nameError");
    if(!name.value)
    {
        name_error.innerHTML = "Name is required!";
        name.classList.add("error");
        name.classList.remove("success");
        return false;
    }
    else if(name.value.length < 3){
        name_error.innerHTML = "Name should be atleast 3 characters long!";
        name.classList.add("error");
        name.classList.remove("success");
        return false;
    }
    else{
        name_error.innerHTML = "";
        name.classList.remove("error");
        name.classList.add("success");
        return true;
    }
}

function validatePhone(){
    var phone = document.getElementById("phone");
    var phone_error = document.getElementById("phoneError");
    var phone_regex = /^\d{10}$/; //starts with /^, ends with $/, \d is for digit, {10} is for 10 digits
    if(!phone.value)
    {
        phone_error.innerHTML = "Phone Number is required!";
        phone.classList.add("error");
        phone.classList.remove("success");
        return false;
    }
    else if(!phone_regex.test(phone.value)){
        phone_error.innerHTML = "Phone number should be 10 digits long and should only be digits!";
        phone.classList.add("error");
        phone.classList.remove("success");
        return false;
    }
    else{
        phone_error.innerHTML = "";
        phone.classList.remove("error");
        phone.classList.add("success");
        return true;
    }
}

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

function validateAge(){
    var age = document.getElementById("age");
    var age_error = document.getElementById("ageError");
    if(!age.value)
    {
        age_error.innerHTML = "Age is required!";
        age.classList.add("error");
        age.classList.remove("success");
        return false;
    }
    else if(age.value < 18){
        age_error.innerHTML = "Age should be atleast 18!";
        age.classList.add("error");
        age.classList.remove("success");
        return false;
    }
    else{
        age_error.innerHTML = "";
        age.classList.remove("error");
        age.classList.add("success");
        return true;
    }
}

function validatePassword(){
    var password = document.getElementById("password");
    var password_error = document.getElementById("passwordError");
    var password_regex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/; //starts with /^, ends with $/, (?=.*[a-z]) is for atleast 1 lowercase, (?=.*[A-Z]) is for atleast 1 uppercase, (?=.*\d) is for atleast 1 digit, (?=.*[@$!%*?&]) is for atleast 1 special character, [A-Za-z\d@$!%*?&]{8,} is for 8 or more characters
    var password_icon = document.getElementById("password-icon");

    if(!password.value)
    {
        password_error.innerHTML = "Password is required!";
        password.classList.add("error");
        password.classList.remove("success");
        password_icon.classList.remove("PasswordError-icon-pos-formatError");
        return false;
    }
    else if(!password_regex.test(password.value)){
        password_error.innerHTML = "Password should be atleast 8 characters long, <br/> Should have atleast 1 lowercase character, <br/> Should have atleast 1 uppercase character, <br/> Should have atleast 1 special character!";
        password_icon.classList.add("PasswordError-icon-pos-formatError");
        password.classList.add("error");
        password.classList.remove("success");
        return false;
    }
    else{
        password_error.innerHTML = "";
        password_icon.classList.remove("PasswordError-icon-pos-formatError");
        password.classList.remove("error");
        password.classList.add("success");
        return true;
    }
}

function validateRepeatPassword(){
    var password = document.getElementById("password");
    var repeat_password = document.getElementById("repeatpassword");
    var repeat_password_error = document.getElementById("repeatpasswordError");
    if(!repeat_password.value)
    {
        repeat_password_error.innerHTML = "Repeat Password is required!";
        repeat_password.classList.add("error");
        repeat_password.classList.remove("success");
        return false;
    }
    else if(repeat_password.value != password.value){
        repeat_password_error.innerHTML = "Passwords do not match!";
        repeat_password.classList.add("error");
        repeat_password.classList.remove("success");
        return false;
    }
    else{
        repeat_password_error.innerHTML = "";
        repeat_password.classList.remove("error");
        repeat_password.classList.add("success");
        return true;
    }
}

function validateTerms(){
    var terms = document.getElementById("terms");
    var terms_error = document.getElementById("termsError");
    if(!terms.checked)
    {
        terms_error.innerHTML = "You must agree to the terms!";
        terms.classList.add("error");
        terms.classList.remove("success");
        return false;
    }
    else{
        terms_error.innerHTML = "";
        terms.classList.remove("error");
        terms.classList.add("success");
        return true;
    }

}

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
        console.log(data);
        document.getElementById('registerError').innerHTML = "";
        document.getElementById('registerSuccess').innerHTML = "Your account has been registered successfully!";
        window.location.href = "Login.html";
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

function validateForm(){
    validateName();
    validatePhone();
    validateEmail();
    validateAge();
    validatePassword();
    validateRepeatPassword();
    validateTerms();

    if(validateName() && validatePhone() && validateEmail() && validateAge() && validatePassword() && validateRepeatPassword() && validateTerms()){
        return true;
    }
    return false;
}