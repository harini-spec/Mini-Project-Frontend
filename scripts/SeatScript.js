const getSeatsFromSeatIds = () => {
    var token = sessionStorage.getItem('token');
    var selectedSeats = sessionStorage.getItem('selectedSeats');
    var seatIds = selectedSeats.split(',').map(seat => seat.split("\"")[1]);

    // Create an array of fetch promises
    var fetchPromises = seatIds.map(seatId => 
        fetch('http://localhost:5251/GetSeatsBySeatId?SeatId=' + seatId, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + token
            }
        }).then(res => res.json())
    );

    // Return a promise that resolves when all fetch calls are complete
    return Promise.all(fetchPromises)
        .then(results => {
            return results; // Array of seat data
        })
        .catch(error => {
            console.error('Error fetching seats:', error);
            throw error;
        });
}

const getSeatBySeatId = async(seatId) => {
    var token = sessionStorage.getItem('token');

    return fetch('http://localhost:5251/GetSeatsBySeatId?SeatId=' + seatId, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + token
            }
        }).then(res => res.json())
        .then(data => {
            // console.log("hllo"+data);
            return data;
        })
        .catch(error => {
            console.error('Error fetching seats:', error);
            throw error;
        });;
}