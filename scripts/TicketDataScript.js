const getTicketFromTicketId = (ticketId) => {
    const token = sessionStorage.getItem('token');

    return fetch('http://localhost:5251/api/Ticket/GetAllTicketsOfCustomer', {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + token
        }
        })
        .then(res => res.json())
        .then(data => {
            for(var i=0;i<data.length;i++) {
                if(data[i].ticketId == ticketId) {
                    return data[i];
                }
            }
        })
        .catch(error => {
            console.error(error);
        });
}