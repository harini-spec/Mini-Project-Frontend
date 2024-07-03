// Set the navigation bar details based on the user role - For common pages
function setNavDetails(){
    var token = localStorage.getItem("token");
    if(token){
        var decoded = parseJwt(token);
        var role = decoded['http://schemas.microsoft.com/ws/2008/06/identity/claims/role'];
        if(role == "Admin")
            {
                console.log("Admin")
                setNavDetailsForAdmin();
            }
        else
            setNavDetailsForCustomer();
    }
    else{
        setNavDetailsForCustomer();
    }
}


// Set the navigation bar details based on the user role - For common pages
function setNavDetailsForAdminAuthPages(){
    var token = localStorage.getItem("token");
    if(token){
        var decoded = parseJwt(token);
        var role = decoded['http://schemas.microsoft.com/ws/2008/06/identity/claims/role'];
        if(role == "Admin")
            {
                console.log("Admin")
                setNavDetailsForAdmin();
            }
        else
            setNavDetailsForCustomer();
    }
    else{
        setNavDetailsForAdmin();
    }
}


// Set the navigation bar details for the customer pages
function setNavDetailsForCustomer(){
    var profileName = localStorage.getItem("email");
    if(profileName){
        profileName = profileName.split("@")[0];
        document.getElementById("account").innerHTML = profileName;
    }

    document.getElementById("admin").remove();

    if(localStorage.getItem("token")){
        var login_element = document.getElementById("login");
        var register_element = document.getElementById("register");
        if(login_element)
            login_element.remove();
        if(register_element)
            register_element.remove();
    }
    else{
        var logout_element = document.getElementById("logout");
        var ticket_element = document.getElementById("ticket");
        if(logout_element)
            logout_element.remove();
        if(ticket_element)
            ticket_element.remove();
    }
}


// Set the navigation bar details for the admin pages
function setNavDetailsForAdmin(){
        var profileName = localStorage.getItem("email");
        if(profileName){
            profileName = profileName.split("@")[0];
            document.getElementById("account").innerHTML = profileName;
        }

        document.getElementById("register").href = "AdminRegister.html";
        document.getElementById("login").href = "AdminLogin.html";
    
        if(localStorage.getItem("token")){
            var login_element = document.getElementById("login");
            var register_element = document.getElementById("register");
            var ticket_element = document.getElementById("ticket");
            var book_element = document.getElementById("bookbuses");

            if(ticket_element)
                ticket_element.remove();
            if(login_element)
                login_element.remove();
            if(register_element)
                register_element.remove();
            if(book_element)
                book_element.remove();
        }
        else{
            var admin_element = document.getElementById("admin");
            var logout_element = document.getElementById("logout");
            var ticket_element = document.getElementById("ticket");
            var book_element = document.getElementById("bookbuses");
            if(admin_element)
                admin_element.remove();
            if(logout_element)
                logout_element.remove();
            if(ticket_element)
                ticket_element.remove();
            if(book_element)
                book_element.remove();
        }
}


// Add event listener for logout
document.getElementById("logout").addEventListener("click", function(){
    if(!localStorage.getItem("email") || !localStorage.getItem("token")){
        Swal.fire("You are not logged in!");
        return;
    }
    localStorage.removeItem("email");
    localStorage.removeItem("token");
    Swal.fire({
        title: "You've been successfully logged out!",
        confirmButtonText: "OK"
        }).then((result) => {
        if (result.isConfirmed) {
          location.reload();
        }
      });
});