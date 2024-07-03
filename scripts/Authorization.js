function checkCustomerAuthorization() {
    var token = localStorage.getItem('token');
    if (token == null) {
        Swal.fire({
            title: "Please login first!",
            confirmButtonText: "OK"
            }).then((result) => {
            if (result.isConfirmed) {
              location.href="CustomerLogin.html";
            }
          });
    }
    else{
        var decoded = parseJwt(token);
        var role = decoded['http://schemas.microsoft.com/ws/2008/06/identity/claims/role'];
        var exp = decoded['exp'] * 1000;
        var expiry_date = new Date(exp);
        var current_date = new Date();
        if((role == "Customer") && current_date <= expiry_date){
            return;
        }
        else if(current_date > expiry_date){
            Swal.fire({
                title: "Session timed out. Please login again.",
                confirmButtonText: "OK"
                }).then((result) => {
                if (result.isConfirmed) {
                  location.href="CustomerLogin.html";
                }
              });
        }
        else{
          Swal.fire({
            title: "Unauthorized User. You cannot access this page.",
            confirmButtonText: "OK"
            }).then((result) => {
            if (result.isConfirmed) {
              location.href="CustomerLogin.html";
            }
          });
        }
    }
}

function checkAdminAuthorization(){
    var token = localStorage.getItem('token');
    if (token == null) {
        Swal.fire({
            title: "Please login first!",
            confirmButtonText: "OK"
            }).then((result) => {
            if (result.isConfirmed) {
              location.href="AdminLogin.html";
            }
          });
    }
    else{
        var decoded = parseJwt(token);
        var role = decoded['http://schemas.microsoft.com/ws/2008/06/identity/claims/role'];
        var exp = decoded['exp'] * 1000;
        var expiry_date = new Date(exp);
        var current_date = new Date();

        if((role == "Admin") && current_date <= expiry_date){
            return;
        }
        else if(current_date > expiry_date){
            Swal.fire({
                title: "Session timed out. Please login again.",
                confirmButtonText: "OK"
                }).then((result) => {
                if (result.isConfirmed) {
                  location.href="AdminLogin.html";
                }
              });
        }
        else{
          Swal.fire({
            title: "Unauthorized User. Please login if you are an Admin.",
            confirmButtonText: "OK"
            }).then((result) => {
            if (result.isConfirmed) {
              location.href="AdminLogin.html";
            }
          });
        }
    }
}

function parseJwt (token) {
    var base64Url = token.split('.')[1];
    var base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    var jsonPayload = decodeURIComponent(window.atob(base64).split('').map(function(c) {
        return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
    }).join(''));

    return JSON.parse(jsonPayload);
}