// Display the details of the ticket that has been added to the cart
const displayTicketDetails = async (ticket) => {
    var seats = [];
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


// Display the passenger details of the ticket
const displayPassengerDetails = (ticket) => {
    var passengerDetails = "";
    document.querySelector(".Cost-Details").id = ticket.ticketId;
    var passenger_container = document.querySelector(".passenger-form-row");

    ticket.addedTicketDetailDTOs.forEach(detail => {
        var gender = detail.passengerGender;
        var female = true ? gender === "Female" : false;

        passengerDetails += 
                    `<div class="row single-passenger-row" id=${detail.seatId}>
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
                            <div id="Male" class=${female? null : "selected"}><i class="fa-solid fa-person"></i>Male</div>
                            <div id="Female" class=${female? "selected" : null}><i class="fa-solid fa-person-dress"></i>Female</div>
                            </div>  
                        </div>
                        <div class="col">
                            <label for="phone"> Phone </label><br>
                            <p class="phone"> ${detail.passengerPhone ? detail.passengerPhone : "-"} </p> 
                        </div>
                        <div class="col">
                            <button class="btn btn-danger remove-button" onclick="removeTicketItem(${ticket.ticketId}, ${detail.seatId})"><i class="fa-solid fa-xmark"></i></button>
                        </div>
                    </div>`;
    });
    passenger_container.innerHTML = passengerDetails;
    return;
}
// For Edit form: <input value=${detail.passengerName} readonly="readonly" class="name form-group" />


// Display the cost details of the ticket
const displayCostDetails = (ticket) => {
    var gst = ticket.total_Cost * ticket.gstPercentage / 100;
    var discount = ticket.total_Cost * ticket.discountPercentage / 100;
    document.querySelector(".base").innerHTML = "₹"+ ticket.total_Cost;
    document.querySelector(".gst").innerHTML = "+ ₹" + gst;
    document.querySelector(".discount").innerHTML = "- ₹" + discount;
    document.querySelector(".final_fare").innerHTML = "₹" + ticket.final_Amount;
}


// Book Ticket
const bookTicket = (Method) => {
    var token = localStorage.getItem('token');
    var ticketId = document.querySelector('.Cost-Details').id;

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