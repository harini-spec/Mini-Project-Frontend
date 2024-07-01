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

const displaySeatInputs = () => {
    var seats_input_container = document.querySelector(".seats-input-container");
    var seats = document.getElementById("seatsCount").value;
    var seats_input = "";
    for(var i = 1; i <= seats; i++){
        seats_input += `
        <div class="row">
            <div class="col col1">
                <h5>Seat ${i}</h5>
            </div>
            <div class="col">
                <input type="text" class="form-control" id="seat${i}-number" placeholder="Number">
            </div>
            <div class="col">
                <input type="text" class="form-control" id="seat${i}-type" placeholder="Type">
            </div>
            <div class="col">
                <input type="number" class="form-control" id="seat${i}-price" placeholder="Price">
            </div>
        </div>`

    }
    seats_input_container.innerHTML = seats_input;
}