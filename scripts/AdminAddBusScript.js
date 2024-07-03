// Get all buses from the database
const getBusData = () => {
    var token = localStorage.getItem('token');
    return fetch('http://localhost:5251/api/Bus/GetAllBuses', {
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


// Display all buses in the database
const displayBusData = (data) => {
    var bus_list_container = document.querySelector(".bus-list-container");
    var bus_data = "";
    data.forEach(element => {
        bus_data += `<div class="card bus-card">
        <div class="card-header row">
            <h4 class="col">Bus Number</h4>
            <h4 class="col end-col">Total Seats</h4>
        </div>

        <div class="card-body row">
            <p class="col">${element.busNumber}</p>
            <p class="col end-col">${element.totalSeats}</p>
        </div>
        </div>`
    });
    bus_list_container.innerHTML = bus_data;
}


// Displays the seat inputs based on the number of seats entered
const displaySeatInputs = () => {
    var seats_input_container = document.querySelector(".seats-input-container");
    if(seats_input_container.childElementCount > 0){
        return;
    }
    var seats = document.getElementById("seatsCount").value;
    var seats_input = "";
    for(var i = 1; i <= seats; i++){
        seats_input += `
        <div class="row">
            <div class="col col1">
                <h5>Seat ${i}</h5>
            </div>
            <div class="col">
                <input type="text" class="form-control seat-number" id="seat${i}-number" onblur="validateSeatNumber('seat${i}-number')" placeholder="Number">
            </div>
            <div class="col">
                <input type="text" class="form-control seat-type" id="seat${i}-type" onblur="validateSeatType('seat${i}-type')" placeholder="Type">
            </div>
            <div class="col">
                <input type="number" class="form-control seat-price" id="seat${i}-price" onblur="validatePrice('seat${i}-price')" placeholder="Price">
            </div>
        </div>`

    }
    seats_div = document.createElement("div");
    seats_div.innerHTML = seats_input;
    seats_input_container.appendChild(seats_div);
}


// Create bus object to send to the API
const createBusObject = () => {
    var seat_numbers = document.querySelectorAll(".seat-number");
    var seat_types = document.getElementsByClassName("seat-type");
    var seat_prices = document.getElementsByClassName("seat-price");
    var seat_data = []
    for(var i=0;i<seat_numbers.length;i++){
        seat_data.push({
            "seatNumber": seat_numbers[i].value,
            "seatType": seat_types[i].value,
            "seatPrice": seat_prices[i].value
        })
    }
    return seat_data;
}


// Add bus and seats to the database
const addBus = () => {
    bus_status = validateBus();
    seats_status = validateSeatsCount();
    seats_input_status = validateSeats();
    if(bus_status && seats_status && seats_input_status){
        var bus = document.getElementById("busNumber").value;
        var seats = document.getElementById("seatsCount").value;
        seat_data = createBusObject();
        var data = {
            "busNumber": bus,
            "totalSeats": seats,
            "seatsInBus": seat_data
        }
        var token = localStorage.getItem('token');
        fetch('http://localhost:5251/api/Bus/AddBusAndSeats', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + token
            },
            body: JSON.stringify(data)
        }).then(res => {
            if (!res.ok) {
                res.json().then(data => {
                    if(data.errorCode == 422)
                        throw new Error("Seats count don't match with the number of seats added! Please try again!");
                    else if(data.errorCode === 409)
                        throw new Error(data.errorMessage);
                    else if(res.status === 401)
                        throw new Error("Unauthorized");
                    else
                        throw new Error("Network response was not ok");
                })
                .catch(error => {
                    if(error.message.includes("Seats count don't match with the number of seats added! Please try again!"))
                        document.getElementById('bus_add_error').innerHTML = error.message;
                    if(error.message.includes("Network response was not ok"))
                        document.getElementById('bus_add_error').innerHTML = "Sorry, an error occured! Please try again!";
                    else if(error.message.includes("Unauthorized"))
                        document.getElementById('bus_add_error').innerHTML = "Unauthorized";
                    else
                        document.getElementById('bus_add_error').innerHTML = error.message;   
                    return false;
                });
            }
            else
                return res.json();
         })
        .then(data => {
            if(!data)
                return;
            Swal.fire({
                title: "Bus added successfully",
                icon: "success",
                confirmButtonText: "OK"
                }).then((result) => {
                if (result.isConfirmed) {
                  location.href="AdminViewBus.html";
                }
              });
        })
        .catch(error => {
            console.error(error);
        });
    }
}


// Start of validation for Add Bus form
const validateBus = () => {
    var bus = document.getElementById("busNumber");
    let regex = /^[a-zA-Z]+$/;

    if(bus.value == "" || !regex.test(bus.value.slice(0, 2)) || !regex.test(bus.value.slice(4, 6)) || bus.value.length != 10) {
        document.getElementById("bus_error").innerHTML = "Please enter a valid bus number";
        bus.classList.remove("success");
        bus.classList.add("error");
        return false;
    }
    else{
        document.getElementById("bus_error").innerHTML = "";
        bus.classList.remove("error");
        bus.classList.add("success");
        return true;
    }
}


const validateSeatsCount = () => {
    var seats = document.getElementById("seatsCount");

    if(!seats.value || seats.value < 0 || seats.value > 100){
        document.getElementById("seats_error").innerHTML = "Please enter valid number of seats";
        seats.classList.remove("success");
        seats.classList.add("error");
        return false;
    }
    else{
        displaySeatInputs();
        document.getElementById("seats_error").innerHTML = "";
        seats.classList.remove("error");
        seats.classList.add("success");
        return true;
    }
}


const validateSeatNumber = (id) => {
    var seat_element = document.getElementById(id);
    if(!seat_element.value || !seat_element.value || !seat_element.value){
        seat_element.classList.remove("success")
        seat_element.classList.add("error")
        return false 
    }
    else{
        seat_element.classList.remove("error")
        seat_element.classList.add("success")
        return true 
    }
}


const validateSeatType = (id) => {
    var seat_element = document.getElementById(id);
    if(!seat_element.value || !seat_element.value){
        seat_element.classList.remove("success")
        seat_element.classList.add("error")
        return false 
    }
    else{
        seat_element.classList.remove("error")
        seat_element.classList.add("success")
        return true 
    }
}


const validatePrice = (id) => {
    var seat_element = document.getElementById(id);
    if(!seat_element.value || !seat_element.value){
        seat_element.classList.remove("success")
        seat_element.classList.add("error")
        return false 
    }
    else{
        seat_element.classList.remove("error")
        seat_element.classList.add("success")
        return true 
    }
}


const validateSeats = () => {
    var seat_numbers = document.querySelectorAll(".seat-number");
    var seat_types = document.getElementsByClassName("seat-type");
    var seat_prices = document.getElementsByClassName("seat-price");
    var seat_status = true

    for(var i=0;i<seat_numbers.length;i++){
        if(!validateSeatNumber(seat_numbers[i].id))
            seat_status = false
    }

    for(var i=0;i<seat_types.length;i++){
        if(!validateSeatType(seat_types[i].id))
            seat_status = false
    }

    for(var i=0;i<seat_prices.length;i++){
        if(!validatePrice(seat_prices[i].id))
            seat_status = false
    }

    return seat_status
}
// End of validation for Add Bus form