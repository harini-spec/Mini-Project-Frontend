const getRouteData = () => {
    var token = localStorage.getItem('token');
    return fetch('http://localhost:5251/api/Route/GetAllRoutes', {
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

const displayRouteData = (data) => {

    var route_container = document.getElementById("route-list");
    var route_list = "";

    data.forEach(element => {
        console.log(element);
        route_list += `
        <div class="card route-card">
            <div class="card-header">
                <div class="row">
                    <div class="col-4 route-no-div">
                        <p>Route No: &nbsp; </p><h4 style="margin:0px"> ${element.routeId}</h4>
                    </div>
                    <div class="col-4 col2">
                        <p>${element.source}</p>
                    </div>
                    <div class="col-4 col3">
                        <p>${element.destination}</p>
                    </div>
                </div>
            </div>

            <div class="route-card-body route-header">
                <div class="row">
                    <div class="col-4">
                        <h5>Stop Number</h5>
                    </div>
                    <div class="col-4 col2">
                        <h5>From</h5>
                    </div>
                    <div class="col-4 col3">
                        <h5>To</h5>
                    </div>
                </div>
            </div>
            <hr>
        `;
        element.routeStops.forEach(stop => {
            route_list += `
            <div class="route-card-body stops-div">
                <div class="row">
                    <div class="col-4">
                        <p>${stop.stopNumber}</p>
                    </div>
                    <div class="col-4 col2">
                        <p>${stop.from_Location}</p>
                    </div>
                    <div class="col-4 col3">
                        <p>${stop.to_Location}</p>
                    </div>
                </div>
        </div>`;
    });
    route_list +='</div>';});

    route_container.innerHTML = route_list;

}

const addStopFormContainer = () => {
    var stops_form_container = document.createElement("div");
    stops_form_container.innerHTML = `<div class="row stop-single-container">
                                        <div class="col-4">
                                            <input type="number" class="form-control" placeholder="Stop No." onblur="validateStopNumber()" name="stopNumber">
                                            </div>
                                        <div class="col-4">
                                            <input type="text" class="form-control" placeholder="From" onblur="validateFromLocation()" name="from">
                                            </div>
                                        <div class="col-4">
                                            <input type="text" class="form-control" placeholder="To" onblur="validationToLocation()" name="to">
                                        </div>
                                    </div>`;
    document.querySelector('.stop-container').appendChild(stops_form_container);
}

const addRoute = () => {
    if(validateForm()){
        var token = localStorage.getItem('token');
        var source = document.getElementById('source').value;
        var destination = document.getElementById('destination').value;
        var stops = [];
        var stopNumber = document.getElementsByName('stopNumber');
        var from = document.getElementsByName('from');
        var to = document.getElementsByName('to');
        for(var i=0; i<stopNumber.length; i++){
            stops.push({
                stopNumber: stopNumber[i].value,
                from_Location: from[i].value,
                to_Location: to[i].value
            });
        }
        var routeData = {
            source: source,
            destination: destination,
            routeStops: stops
        }
        console.log(routeData);
        fetch('http://localhost:5251/api/Route/AddRouteAndStops', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + token
            },
            body: JSON.stringify(routeData)
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
                        document.getElementById('add_route_error').innerHTML = "Sorry, an error occured! Please try again!";
                    else if(error.message.includes("Unauthorized"))
                        document.getElementById('add_route_error').innerHTML = "Unauthorized";
                    else
                        document.getElementById('add_route_error').innerHTML = error.message;   
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
                title: "Route added successfully",
                icon : "success",
                confirmButtonText: "OK"
                }).then((result) => {
                if (result.isConfirmed) {
                  location.href="AdminViewRoute.html";
                }
              });
        });
    }
}

const validateForm = () => {
    validateSource();
    validateDestination();
    validateStopNumber();
    validateFromLocation();
    validationToLocation();
    console.log(validateSource(), validateDestination(), validateStopNumber(), validateFromLocation(), validationToLocation());
    if(validateSource() && validateDestination() && validateStopNumber() && validateFromLocation() && validationToLocation()){
        return true;
    }
    return false;
}

const validateSource = () => {
    var source = document.getElementById('source');
    if(!source.value){
        source.classList.remove('success');
        source.classList.add('error');
        document.getElementById('source_error').innerHTML = "Source is required";
        return false;
    }
    else{
        source.classList.remove('error');
        source.classList.add('success');
        document.getElementById('source_error').innerHTML = "";
        return true;
    }
}

const validateDestination = () => {
    var destination = document.getElementById('destination');
    if(!destination.value){
        destination.classList.remove('success');
        destination.classList.add('error');
        document.getElementById('destination_error').innerHTML = "Destination is required";
        return false;
    }
    else{
        destination.classList.remove('error');
        destination.classList.add('success');
        document.getElementById('destination_error').innerHTML = "";
        return true;
    }
}

const validateStopNumber = () => {
    var stopNumber = document.getElementsByName('stopNumber');
    var status = true;
    stopNumber.forEach(element => {
        if(!element.value){
            element.classList.remove('success');
            element.classList.add('error');
            status = false;
        }
        else{
            element.classList.remove('error');
            element.classList.add('success');
        }
    });
    return status;
}

const validateFromLocation = () => {
    var from = document.getElementsByName('from');
    var status = true;
    from.forEach(element => {
        if(!element.value){
            element.classList.remove('success');
            element.classList.add('error');
            status = false;
        }
        else{
            element.classList.remove('error');
            element.classList.add('success');
        }
    });
    return status;
}

const validationToLocation = () => {
    var to = document.getElementsByName('to');
    var status = true;
    to.forEach(element => {
        if(!element.value){
            element.classList.remove('success');
            element.classList.add('error');
            status = false;
        }
        else{
            element.classList.remove('error');
            element.classList.add('success');
        }
    });
    return status;
}
 

const validateAndSearchSource = async () => {
    const data = await getRouteData();
    if (validateSource()) {
        const source = document.getElementById('source').value;
        const filteredData = data.filter(element => element.source.toLowerCase() == source.toLowerCase());
        console.log("filter")
        console.log(filteredData);
        return filteredData;
    } else {
        displayRouteData(data);
        return [];
    }
}

const validateAndSearchDestination = (filteredData) => {
    getRouteData().then(data => {
        if (validateDestination()) {
            if (filteredData.length === 0) {
                document.getElementById('route-list').innerHTML = "<h3>No routes found</h3>";
            }
            const destination = document.getElementById('destination').value;
            const filteredRouteData = filteredData.filter(element => element.destination.toLowerCase() == (destination.toLowerCase()));
            displayRouteData(filteredRouteData);
        } else {
            displayRouteData(data);
        }
    });
}

const searchRoute = async () => {
    const data = await validateAndSearchSource();
    console.log("IN")
    console.log(data);
    validateAndSearchDestination(data);
}
