const displayTicketDetails = async (ticket) => {
    var seats = [];
    if(ticket.status != "Booked")
        {
            Swal.fire({
                title: "Ticket is already cancelled",
                confirmButtonText: "OK",
                }).then((result) => {
                if (result.isConfirmed) {
                    location.href="TicketsList.html";
                }
            });
        }
    getScheduleByScheduleId(ticket.scheduleId).then(schedule => {
        ticket.addedTicketDetailDTOs.forEach(detail => {seats.push(detail.seatNumber)});
        document.getElementById("from").innerHTML = schedule.source;
        document.getElementById("to").innerHTML = schedule.destination;
        document.getElementById("busNumber").innerHTML = schedule.busNumber;
        document.getElementById("seats").innerHTML = seats.join(', ');
        document.getElementById("departure").innerHTML = schedule.dateTimeOfDeparture.split("T")[1] + ", " + schedule.dateTimeOfDeparture.split("T")[0];
        document.getElementById("arrival").innerHTML = schedule.dateTimeOfArrival.split("T")[1] + ", " + schedule.dateTimeOfArrival.split("T")[0];
        displayPassengerDetails(ticket);
    });
}


const displayPassengerDetails = async (ticket) => {
    var passengerDetails = "";
    document.querySelector(".Cost-Details").id = ticket.ticketId;
    var passenger_container = document.querySelector(".passenger-form-row");

    const detailPromises = ticket.addedTicketDetailDTOs.map(async detail => {
        var gender = detail.passengerGender;
        var female = gender === "Female";
        var refundAmount = await getSeatBySeatId(detail.seatId);
        refundAmount = refundAmount.seatPrice/2;
        if(detail.status == "Booked")
            return `
                <div class="row single-passenger-row" id=${detail.seatId}>
                    <div class="col">
                        <label for="seat"> Seat </label>
                        <p class="seat"> ${detail.seatNumber} </p> 
                    </div>
                    <div class="col">
                        <label for="name"> Name </label><br>
                        <p class="name"> ${detail.passengerName} </p> 
                    </div>
                    <div class="col age-container">
                        <label for="age"> Age </label><br>
                        <p class="age"> ${detail.passengerAge} </p> 
                    </div>
                    <div class="col gender">
                        <label for="gender"> Gender </label><br>
                        <div class="gender-input">
                        <div id="Male" class=${female ? null : "selected"}><i class="fa-solid fa-person"></i>Male</div>
                        <div id="Female" class=${female ? "selected" : null}><i class="fa-solid fa-person-dress"></i>Female</div>
                        </div>  
                    </div>
                    <div class="col">
                        <label for="phone"> Phone </label><br>
                        <p class="phone"> ${detail.passengerPhone ? detail.passengerPhone : "-"} </p> 
                    </div>
                    <div class="col">
                        <label for="Refund"> Refund </label><br>
                        <p class="Refund"> ₹${refundAmount} </p> 
                    </div>
                    <div class="col button-row">
                        <button class="btn btn-danger remove-button" onclick="cancelTicketItem(${ticket.ticketId}, ${detail.seatId})">Cancel Seat</button>
                    </div>
                </div>
                `;
    });

    const passengerDetailsArray = await Promise.all(detailPromises);
    passenger_container.innerHTML = passengerDetailsArray.join('');
    passenger_container.innerHTML +=                 
                `<div class="cancel-ticket-container">
                    <div class="row">
                        <div class="col">
                            <p> Cancel Ticket:  </p>
                        </div>
                        <div class="col">
                            <p> Refund Amount: ₹${ticket.total_Cost/2} </p>
                        </div>
                        <div class="col">
                            <button class="btn btn-danger" onclick="cancelTicket(${ticket.ticketId})">Cancel Ticket</button>
                        </div>
                    </div>
                </div>`;
    return;
};

const cancelTicketItem = (ticketId, seatId) => {
    var token = sessionStorage.getItem('token');
    var seats = [];
    seats.push(seatId);

    return fetch('http://localhost:5251/api/Transaction/CancelSeat', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + token
        },
        body: JSON.stringify({
                "ticketId": ticketId,
                "seatIds": seats
        })
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
                return res.json();
         })
        .then(data => {
            Swal.fire({
                title: "Seat cancelled successfully! Refund will be processed soon. Amount = ₹" + data.refundAmount,
                confirmButtonText: "OK",
                icon: 'success',
                }).then((result) => {
                if (result.isConfirmed) {
                    location.href="CancelTicket.html";
                }
            });
            return true;
        });
}

const cancelTicket = (ticketId) => {
    var token = sessionStorage.getItem('token');

    return fetch('http://localhost:5251/api/Transaction/CancelTicket?TicketId='+ticketId, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + token
        },
        }).then(res => {
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
                return res.json();
         })
        .then(data => {
            console.log(data);
            Swal.fire({
                title: "Ticket cancelled successfully! Refund will be processed soon. Amount = ₹" + data.refundAmount,
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