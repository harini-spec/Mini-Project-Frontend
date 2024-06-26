const bookTicket = (Method) => {
    var token = sessionStorage.getItem('token');
    var ticketId = document.querySelector('.Cost-Details').id;

    console.log(ticketId);

    fetch('http://localhost:5251/api/Transaction/BookTicket?TicketId='+ticketId+'&PaymentMethod='+Method, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + token
        }})
        .then(res => {
            if (!res.ok) {
                res.json().then(data => {
                    if(res.status === 500)
                        throw new Error('Error in booking ticket! Try again later!');
                    else
                        throw new Error(data.errorMessage);
                })
                .catch(error => {
                    Swal.fire("Error in Booking Ticket!", error.message, "error")
                    return false;
                });
            }
            else
                return res.json();
         })
        .then(data => {
            if(data == undefined)
                return;
            Swal.fire({
                title: "Ticket Booked Successfully!",
                confirmButtonText: "OK",
                icon: 'success',
                }).then((result) => {
                if (result.isConfirmed) {
                    location.href="TicketsList.html";
                }
            });
            return true;
        })
        .catch(error => {
            console.error(error);
    });
}