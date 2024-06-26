const getScheduleByScheduleId = (scheduleId) => {
    var token = sessionStorage.getItem('token');
    return fetch('http://localhost:5251/api/Schedule/GetAllSchedules', {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + token
        }
    })
    .then(res => res.json())
    .then(data => {
        return data.find(schedule => schedule.scheduleId == scheduleId);
    })
    .catch(error => {
        console.error(error);
    });
}