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


//
//
// async function changeARating(thisRoomSelect, thisRateScore, thisRatingComment){
//
//     const response = await fetch('/change-rating', {
//         method: 'POST',
//         headers: {
//             'Content-Type': 'application/json'
//         },
//         body: JSON.stringify({
//             roomSelect: thisRoomSelect,
//             rateScore: thisRateScore,
//             ratingComment: thisRatingComment
//         })
//     });
//
//     const responseData = await response.json();
//     const messageElement = document.getElementById('insertResultMsg');
//
//     if (responseData.success) {
//         messageElement.textContent = "Rating changed successfully!";
//         fetchTableData();
//         return 1;
//     } else {
//         messageElement.textContent = "Error updating name!";
//         return 0;
//     }
// }
//
//
window.onload = function() {
    displayPastRating();
    document.getElementById("getEscapeRoomList").addEventListener("click",displayAddedEscapeRoom);
    document.getElementById("rating").addEventListener("submit", insertRating);
 };

