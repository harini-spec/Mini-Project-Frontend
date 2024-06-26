const getTickets = () => {
    var token = sessionStorage.getItem("token");
    return fetch('http://localhost:5251/api/Ticket/GetAllTicketsOfCustomer', {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + token
        }
    })
    .then(res => res.json())
    .then(data => {
        return data;
    })
    .catch(error => {
        console.error(error);
    });
}

const displayTickets = async (tickets) => {

    var ticket_container = document.querySelector(".ticket-container");
    var tickets_data = "";

    if(tickets.length == 0) {
        ticket_container.innerHTML = '<div class="error-container"><h3> 404 NOT FOUND </h3><p> No tickets available </p><h4/></div>';
        return;
    }

    // Create an array of promises for fetching schedules
    const schedulePromises = tickets.map(async element => {
        var seats = [];
        element.addedTicketDetailDTOs.forEach(detail => {seats.push(detail.seatId)});
        var seatNos = [];
        for (var i = 0; i < seats.length; i++) {
            var seat = await getSeatBySeatId(seats[i]).then(data => {return data});
            seatNos.push(seat.seatNumber);
        }
        
        const schedule = await getScheduleByScheduleId(element.scheduleId);
        return `
            <div class="card ticket-card">
                <div class="card-body" id=${element.ticketId}>
                    <div class="row">
                        <div class="col-6">
                            <h5 class="card-title"> BusNumber: ${schedule.busNumber} </h5>
                        </div>
                        <div class="col-6 col3">
                            <h5 class="card-title"> SeatNumber: ${seatNos.join(', ')} </h5>
                        </div>
                    </div>
                    <div class="row">
                        <div class="col-4">
                            <p class="card-text"> ${schedule.source} </p>
                        </div>
                        <div class="col-4 col2">
                            <p class="card-text"> <i class="fa-solid fa-arrow-right"></i> </p>
                        </div>
                        <div class="col-4 col3">
                            <p class="card-text"> ${schedule.destination} </p>
                        </div>
                    </div>
                    <div class="row">
                        <div class="col-6">
                            <p class="card-text"> ${schedule.dateTimeOfDeparture.split("T")[1]}, ${schedule.dateTimeOfDeparture.split("T")[0]} </p>
                        </div>
                        <div class="col-6 col3">
                            <p class="card-text"> ${schedule.dateTimeOfArrival.split("T")[1]}, ${schedule.dateTimeOfArrival.split("T")[0]} </p>
                        </div>
                    </div>
                    <div class="row status_row">
                        <div class="col-6">
                            <p class="card-text ticket-status" id=${element.status}> ${element.status} </p>
                        </div>
                        <div class="col-6 col3">
                            <p class="card-text ticket-button">  </p>
                        </div>
                    </div>
                </div>
            </div>`;
    });

    // Waiting for all promises to resolve and then join the resulting strings
    tickets_data = (await Promise.all(schedulePromises)).join('');

    ticket_container.innerHTML = tickets_data;

    displayStatusAndButton();
}

const displayStatusAndButton = () => {
    var ticket_cards = document.querySelectorAll(".ticket-card");
    ticket_cards.forEach(card => {
        var status = card.querySelector(".ticket-status");
        var button = card.querySelector(".ticket-button");
        var ticketId = card.querySelector(".card-body").id;

        if (status.id == "Not") {
            button.innerHTML = `<button class="btn btn-success" onclick="displayBookTicketPage('${ticketId}')"> Book </button>
            <button class="btn btn-danger" onclick="deleteAddedTicket('${ticketId}')"> Delete </button>`;
            status.classList.add("not-booked");
        } else if(status.id == "Booked") {
            button.innerHTML = `<button class="btn btn-danger" onclick="displayCancelTicketPage('${ticketId}')"> Cancel </button>`;
            status.classList.add("booked");
        }
        else{
            status.classList.add("cancelled");
        }
    });
}

const displayBookTicketPage = (ticketId) => {
    sessionStorage.setItem("ticketId", ticketId);
    window.location.href = "BookAddedTicket.html";
}

const displayCancelTicketPage = (ticketId) => {
    sessionStorage.setItem("ticketId", ticketId);
    window.location.href = "CancelTicket.html";
}

const filterTickets = async() => {
    var tickets = await getTickets().then(data => {return data});
    var filter = document.querySelector("#filter").value;

    if(filter == "Booked")
        tickets = tickets.filter(ticket => ticket.status == "Booked");
    else if(filter == "Not_Booked")
        tickets = tickets.filter(ticket => ticket.status == "Not Booked");
    else if(filter == "Cancelled")
        tickets = tickets.filter(ticket => ticket.status == "Cancelled");
    else if(filter == "All")
        tickets = tickets;

    displayTickets(tickets);
}

const sortTickets = async() => {
    var tickets = await getTickets().then(data => {return data});
    var sort = document.querySelector("#sort").value;
    console.log(tickets);
    if(sort == "booking_recent")
        tickets = tickets.sort((a, b) => b.ticketId - a.ticketId);
    else if(sort == "booking_oldest")
        tickets = tickets.sort((a, b) => a.ticketId - b.ticketId);
    else if (sort === "dod_asc" || sort === "dod_desc") {

        // Creates a Promise that is resolved with an array of results when all of the provided Promises resolve, 
        // or rejected when any Promise is rejected.
        // Waits for all the values to be returned and then assigns them to the tickets array
        await Promise.all(tickets.map(async ticket => {
            const schedule = await getScheduleByScheduleId(ticket.scheduleId);
            ticket["schedule"] = schedule;
        }));

        tickets = tickets.sort((a, b) => {
            let dateA = new Date(a.schedule.dateTimeOfDeparture);
            let dateB = new Date(b.schedule.dateTimeOfDeparture);
            return sort === "dod_asc" ? dateA - dateB : dateB - dateA;
        });
    }

    displayTickets(tickets);
}
