const removeBookSeatsButtonAndDisplaySeats = (busnumber, seatId) => {
    displaySeats(busnumber, seatId);
    setTimeout(function(){
        const bookSeatsButton = document.querySelectorAll('.button-addTicket');
        bookSeatsButton.forEach(button => {
            button.style.display = 'none';
        });
    }, 100);
}

const HandleBookSeatsButton = () => {
    const buttons = document.getElementsByClassName('btn-primary');
    for (let i = 0; i < buttons.length; i++) {
        var busnumber = buttons[i].href.slice(25, -1).split(',')[0].replace(/'/g, '');
        var seatId = buttons[i].href.slice(25, -1).split(',')[1];
        buttons[i].href = "javascript:removeBookSeatsButtonAndDisplaySeats('"+busnumber+"','"+seatId+"')";
    }
}

const AddSchdeduleButton = () => {
    var header = document.querySelector('.header-row');
    header.querySelector('.col3').innerHTML += `<button type="button" class="btn add-schedule" onclick="location.href = 'AdminAddSchedule.html';"> + Add Schedule</a>`;
}

const validateBus = () => {
    var busNumber = document.getElementById('bus-list');
    var busNumberError = document.getElementById('bus_error');
    if (busNumber.value == "") {
        busNumberError.innerHTML = "Bus number cannot be empty";
        busNumber.classList.remove('success');
        busNumber.classList.add('error');
        return false;
    }
    busNumberError.innerHTML = "";
    busNumber.classList.remove('error');
    busNumber.classList.add('success');
    return true;
}

const validateRoute = () => {
    var route = document.getElementById('route');
    var routeError = document.getElementById('route_error');
    if (route.value == "") {
        routeError.innerHTML = "Route cannot be empty";
        route.classList.remove('success');
        route.classList.add('error');
        return false;
    }
    routeError.innerHTML = "";
    route.classList.remove('error');
    route.classList.add('success');
    return true;
}

const validateDriver = () => {
    var driver = document.getElementById('driver');
    var driverError = document.getElementById('driver_error');
    if (driver.value == "") {
        driverError.innerHTML = "Driver ID cannot be empty";
        driver.classList.remove('success');
        driver.classList.add('error');
        return false;
    }
    driverError.innerHTML = "";
    driver.classList.remove('error');
    driver.classList.add('success');
    return true;
}

const validateDeparture = () => {
    var departure = document.getElementById('departure');
    var departureError = document.getElementById('dod_error');
    if (!departure.value) {
        departureError.innerHTML = "Departure date cannot be empty";
        departure.classList.remove('success');
        departure.classList.add('error');
        return false;
    }
    else if(new Date(departure.value) < new Date()) {
        departureError.innerHTML = "Departure date cannot be in the past";
        departure.classList.remove('success');
        departure.classList.add('error');
        return false;
    }
    departureError.innerHTML = "";
    departure.classList.remove('error');
    departure.classList.add('success');
    return true;
}

const validateArrival = () => {
    var arrival = document.getElementById('arrival');
    var arrivalError = document.getElementById('doa_error');
    if (!arrival.value) {
        arrivalError.innerHTML = "Arrival date cannot be empty";
        arrival.classList.remove('success');
        arrival.classList.add('error');
        return false;
    }
    else if(new Date(arrival.value) < new Date()) {
        arrivalError.innerHTML = "Arrival date cannot be in the past";
        arrival.classList.remove('success');
        arrival.classList.add('error');
        return false;
    }
    arrivalError.innerHTML = "";
    arrival.classList.remove('error');
    arrival.classList.add('success');
    return true;
}

function convertToIST(datetimeInput) {
    if (datetimeInput) {
        const localDate = new Date(datetimeInput);
        const istOffset = 5.5 * 60 * 60 * 1000; // 5.5 hours in milliseconds

        // Convert the local date to IST
        const istDate = new Date(localDate.getTime() + istOffset);

        // Adjusting to ensure it retains the local date and time correctly
        const istDateTimeLocal = istDate.toISOString().slice(0, 16);
        return istDateTimeLocal;
    }
}

const addSchedule = () => {
    if (!validateBus() || !validateDeparture() || !validateArrival() || !validateRoute() || !validateDriver()) {
        return;
    }
    var busNumber = document.getElementById('bus-list').value;
    var departure = document.getElementById('departure').value;
    var arrival = document.getElementById('arrival').value;
    var route = document.getElementById('route').value;
    var driver = document.getElementById('driver').value;
    var schedule = {
        "busNumber": busNumber,
        "dateTimeOfDeparture": convertToIST(departure),
        "dateTimeOfArrival": convertToIST(arrival),
        "routeId": route,
        "driverId": driver
    }
    console.log(schedule);
    

    fetch('http://localhost:5251/api/Schedule/AddSchedule', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + sessionStorage.getItem('token')
        },
        body: JSON.stringify(schedule)
    }).then(res => {
        if (!res.ok) {
            res.json().then(data => {
                if(data.errorCode === 409)
                    throw new Error(data.errorMessage);
                else if(res.status === 401)
                    throw new Error("Unauthorized");
                else
                    throw new Error("Network response was not ok");
            })
            .catch(error => {
                if(error.message.includes("Network response was not ok"))
                    document.getElementById('schedule_add_error').innerHTML = "Sorry, an error occured! Please try again!";
                else if(error.message.includes("Unauthorized"))
                    document.getElementById('schedule_add_error').innerHTML = "Unauthorized";
                else
                    document.getElementById('schedule_add_error').innerHTML = error.message;   
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
            title: "Schedule added successfully",
            confirmButtonText: "OK"
            }).then((result) => {
            if (result.isConfirmed) {
              location.href="AdminViewSchedule.html";
            }
          });
    });
}

