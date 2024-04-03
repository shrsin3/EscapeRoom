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
    const thisTeamName = document.getElementById('teamName').value;
   // const thisEmail = document.getElementById('bookingEmail').value;
    const thisID = Math.floor(Math.random() * (99999-10000) + 10000);
    const email = sessionStorage.getItem('Email');
  //  console.log("Email frontend ", email);

    const now = new Date();
    const messageElement = document.getElementById('addReservationResultMsg');

    if(new Date(thisBookingTime) <= now){
        messageElement.textContent = "Can't select a day in the past."
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
            team: thisTeamName,
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
    const demotableContent = responseData.data;

    // Always clear old, already fetched data before new fetching process.
    if (tableBody) {
        tableBody.innerHTML = '';
    }

    demotableContent.forEach(user => {
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
};