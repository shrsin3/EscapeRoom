async function displayAddedEscapeRoom(){
    select = document.getElementById('roomSelect');

    const response = await fetch('/escapeRoomList', {
        method: 'GET'
    });

    const responseData = await response.json();
    const escapeRoomContent = responseData.data;

    const dropdown = document.getElementById('roomReserve');
    escapeRoomContent.forEach(user => {
        var opt = document.createElement('option');
        opt.value = user;
        opt.textContent = user;
        dropdown.appendChild(opt);
    });
}

async function insertBooking(event){
    event.preventDefault();
    const thisRoomReserve = document.getElementById('roomReserve').value;
    const thisBookingTime = document.getElementById('bookingTime').value;
    var thisID = Math.floor(Math.random() * (99999-10000) + 10000);
    const email = sessionStorage.getItem('Email');
  //  const teamName = sessionStorage.getItem('')

    const now = new Date();
    const messageElement = document.getElementById('addReservationResultMsg');

    if(new Date(thisBookingTime) <= now){
        messageElement.textContent = "Can't select a day in the past."
        return ;
    }

    while(1) {    //Check if the assigned ID is duplicated in a loop
        const responseID = await fetch(`/check-reservation-id?id=${encodeURIComponent(thisID)}`, {
            method: 'GET'
        });
         const responseIDData = await responseID.json();
         const IDContent = responseIDData.data;
        if(IDContent.length == 0) break;
        thisID = Math.floor(Math.random() * (99999-10000) + 10000);
    }

    //Check whether there is already a session booked on the same day at the same room
    const responseDate = await fetch(`/check-reservation-conflict?time=${encodeURIComponent(thisBookingTime)}&room=${encodeURIComponent(thisRoomReserve)}`, {
        method: 'GET'
    });
    const responseDateData = await responseDate.json();
    const DateContent = responseDateData.data;
    if(DateContent.length > 0){
        messageElement.textContent = "Conflicted with another existing reservation, please choose another day."
        return ;
    }

    const response = await fetch('/insert-reservation', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            id: thisID,
            date: thisBookingTime,
            email: email,
            room: thisRoomReserve
        })
    });

    const responseData = await response.json();

    if (responseData.success) {
        messageElement.textContent = "Reservation added successfully!";
        DisplayAllBookings();
    } else {
        messageElement.textContent = "Error detected";
    }
}

async function DisplayAllBookings(){
    const tableElement = document.getElementById('reservationList');
    const tableBody = tableElement.querySelector('tbody');

    const response = await fetch('/display-all-bookings', {
        method: 'GET'
    });

    const responseData = await response.json();
    var reservationContent = responseData.data;

    for (let i = 0; i < reservationContent.length; i++) {
        reservationContent[i][1] = reservationContent[i][1].substring(0,10);
    }

    // Always clear old, already fetched data before new fetching process.
    if (tableBody) {
        tableBody.innerHTML = '';
    }

    reservationContent.forEach(user => {
        const row = tableBody.insertRow();
        user.forEach((field, index) => {
            const cell = row.insertCell(index);
            cell.textContent = field;
        });
    });
}

async function SelectionQuery(event){
    event.preventDefault();
    const withDate = document.getElementById('yesDate').checked;
    const bookingTime = document.getElementById('bookingTimeQuery').value;
    const bookingRoom = document.getElementById('bookingRoomQuery').value;
    const userEmail = sessionStorage.getItem('Email');
    const signForQuery = document.getElementById('andOr').value;

    const tableElement = document.getElementById('reservationQueryList');
    const tableBody = tableElement.querySelector('tbody');

    const response = await fetch(`/display-all-matched-reservation?withDate=${encodeURIComponent(withDate)}&time=${encodeURIComponent(bookingTime)}&room=${encodeURIComponent(bookingRoom)}&sign=${encodeURIComponent(signForQuery)}&email=${encodeURIComponent(userEmail)}`, {
        method: 'GET'
    });

    const responseData = await response.json();
    const escapeRoomContent = responseData.data;

    for (let i = 0; i < escapeRoomContent.length; i++) {
        escapeRoomContent[i][1] = escapeRoomContent[i][1].substring(0,10);
    }

    if (tableBody) {
        tableBody.innerHTML = '';
    }

    escapeRoomContent.forEach(user => {
        const row = tableBody.insertRow();
        user.forEach((field, index) => {
            const cell = row.insertCell(index);
            cell.textContent = field;
        });
    });

}


window.onload = function() {
    DisplayAllBookings();
    document.getElementById("getEscapeRoomList").addEventListener("click",displayAddedEscapeRoom);
    document.getElementById("reserve").addEventListener("submit", insertBooking);
    document.getElementById("querySelection").addEventListener("submit", SelectionQuery);
};