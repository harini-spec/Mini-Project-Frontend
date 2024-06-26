function setNavDetails(){
    var profileName = sessionStorage.getItem("email");
    if(profileName){
        profileName = profileName.split("@")[0];
        document.getElementById("account").innerHTML = profileName;
    }

    var admin_element = document.getElementById("admin");
    if(admin_element)
        admin_element.remove();
    if(sessionStorage.getItem("token")){
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


function setNavDetailsForAdmin(){
        var profileName = sessionStorage.getItem("email");
        if(profileName){
            profileName = profileName.split("@")[0];
            document.getElementById("account").innerHTML = profileName;
        }

        document.getElementById("register").href = "AdminRegister.html";
        document.getElementById("login").href = "AdminLogin.html";
    
        if(sessionStorage.getItem("token")){
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
            var logout_element = document.getElementById("logout");
            var ticket_element = document.getElementById("ticket");
            var book_element = document.getElementById("bookbuses");
            var admin_element = document.getElementById("admin");
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


document.getElementById("logout").addEventListener("click", function(){
    if(!sessionStorage.getItem("email") || !sessionStorage.getItem("token")){
        Swal.fire("You are not logged in!");
        return;
    }
    sessionStorage.removeItem("email");
    sessionStorage.removeItem("token");
    Swal.fire({
        title: "You've been successfully logged out!",
        confirmButtonText: "OK"
        }).then((result) => {
        if (result.isConfirmed) {
          location.reload();
        }
      });
});