async function displayAddedEscapeRoom(){
    select = document.getElementById('roomSelect');

    const response = await fetch('/escapeRoomList', {
        method: 'GET'
    });

    const responseData = await response.json();
    const escapeRoomContent = responseData.data;

    const dropdown = document.getElementById('roomSelect');
    escapeRoomContent.forEach(user => {
        var opt = document.createElement('option');
        opt.value = user;
        opt.textContent = user;
        dropdown.appendChild(opt);
    });
}

//
async function insertRating(event){
    event.preventDefault();
    const thisRoomSelect = document.getElementById('roomSelect').value;
    const thisRateScore = document.getElementById('rateScore').value;
    const thisRatingComment = document.getElementById('ratingComment').value;
 //   const thisDate = newDate.TO_DATE('2003/05/03 21:02:44', 'Mon mmm dd yyyy hh24:mi:ss GMT-0700 (Pacific Daylight Saving Time)');
    const thisID = Math.floor(Math.random() * (99999-10000) + 10000);

    console.log(thisRoomSelect);

    const response = await fetch('/insert-rating', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            ID: thisID,
            RoomName: thisRoomSelect,
            Score: thisRateScore,
            RateComment: thisRatingComment
        })
    });

    const responseData = await response.json();
    const messageElement = document.getElementById('insertRatingResultMsg');

    if (responseData.success) {
        messageElement.textContent = "Rating added successfully!";
        displayPastRating();
    } else {
        messageElement.textContent = "Error detected";
    }
}

//
async function displayPastRating(){

    const tableElement = document.getElementById('ratingList');
    const tableBody = tableElement.querySelector('tbody');

    const response = await fetch('/ratingList', {
        method: 'GET'
    });

    const responseData = await response.json();
    const escapeRoomContent = responseData.data;

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


async function escapeRoomRatingGreatherThan(event){
    event.preventDefault();
    const scoreAbove = document.getElementById('roomRating').value;

    const tableElement = document.getElementById('highRatingList');
    const tableBody = tableElement.querySelector('tbody');
    console.log("frontend: ");

    const response = await fetch(`/highRatingList?score=${encodeURIComponent(scoreAbove)}`,{
        method: 'GET'
    });

    const responseData = await response.json();
    const escapeRoomContent = responseData.data;

    if (tableBody) {
        tableBody.innerHTML = '';
    }
    console.log("frontend: ");
    escapeRoomContent.forEach(user => {
        const row = tableBody.insertRow();
        user.forEach((field, index) => {
            const cell = row.insertCell(index);
            cell.textContent = field;
        });
    });
}


//
window.onload = function() {
    displayPastRating();
    document.getElementById("getEscapeRoomList").addEventListener("click",displayAddedEscapeRoom);
    document.getElementById("rating").addEventListener("submit", insertRating);
    document.getElementById("highRating").addEventListener("submit", escapeRoomRatingGreatherThan);
 };

