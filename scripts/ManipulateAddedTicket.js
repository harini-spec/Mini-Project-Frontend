// Delete unbooked ticket
const deleteAddedTicket = (ticketId) => {
    var token = localStorage.getItem('token');

    return fetch('http://localhost:5251/api/Ticket/RemoveTicket?TicketId='+ticketId, {
        method: 'DELETE',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + token
        }
        })
        .then(res => {
            if (!res.ok) {
                res.json().then(data => {
                    if(res.status === 404 || res.status === 400)
                        throw new Error('Ticket not found!');
                    else if(res.status === 401)
                        throw new Error('Unauthorized User');
                    else
                        throw new Error('Server error! Please try again later!');
                })
                .catch(error => {
                    Swal.fire(error.message, '', 'error');  
                    return false;
                });
            }
            else
                return res;
         })
        .then(data => {
            Swal.fire({
                title: "Ticket successfully removed!",
                confirmButtonText: "OK",
                icon: 'success',
                }).then((result) => {
                if (result.isConfirmed) {
                    location.href="TicketsList.html";
                }
            });
            return true;
        });
}


// Delete unbooked seat
const removeTicketItem = (ticketId, seatId) => {
    var token = localStorage.getItem('token');

    return fetch('http://localhost:5251/api/Ticket/RemoveTicketItem?TicketId='+ticketId+'&SeatId='+seatId, {
        method: 'DELETE',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + token
        }
        })
        .then(res => {
            if (!res.ok) {
                res.json().then(data => {
                    if(res.status === 404 || res.status === 400)
                        throw new Error('Ticket Item not found!');
                    else if(res.status === 401)
                        throw new Error('Unauthorized User');
                    else
                        throw new Error('Server error! Please try again later!');
                })
                .catch(error => {
                    Swal.fire(error.message, '', 'error');  
                    return false;
                });
            }
            else
                return res;
         })
        .then(data => {
            Swal.fire({
                title: "Passenger successfully removed!",
                confirmButtonText: "OK",
                icon: 'success',
                }).then((result) => {
                if (result.isConfirmed) {
                    location.href="BookAddedTicket.html";
                }
            });
            return true;
        });
}