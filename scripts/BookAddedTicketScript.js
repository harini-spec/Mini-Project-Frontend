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

const displayPassengerDetails = (ticket) => {
    var passengerDetails = "";
    document.querySelector(".Cost-Details").id = ticket.ticketId;
    var passenger_container = document.querySelector(".passenger-form-row");

    console.log(ticket.addedTicketDetailDTOs);

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


const displayCostDetails = (ticket) => {
    var gst = ticket.total_Cost * ticket.gstPercentage / 100;
    var discount = ticket.total_Cost * ticket.discountPercentage / 100;
    document.querySelector(".base").innerHTML = "₹"+ ticket.total_Cost;
    document.querySelector(".gst").innerHTML = "+ ₹" + gst;
    document.querySelector(".discount").innerHTML = "- ₹" + discount;
    document.querySelector(".final_fare").innerHTML = "₹" + ticket.final_Amount;
}