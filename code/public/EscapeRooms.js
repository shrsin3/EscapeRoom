
async function fetchAndDisplayEscapeRooms() {
    const tableElement = document.getElementById('escapeRoomTable');
    const tableBody = tableElement.querySelector('tbody');

    const response = await fetch('/escapeRoomTable', {
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

async function insertNewRoom(event) {
    event.preventDefault();

    const thisName = document.getElementById('roomName').value;
    const thieGenre = document.getElementById('roomGenre').value;
    const thisTimeLimit = document.getElementById('timeLimit').value;

    const messageElement = document.getElementById('addRoomResultMsg');

    if(thisTimeLimit < 45 || thisTimeLimit > 150){
        if(thisTimeLimit < 45) messageElement.textContent = "Time limit is too short";
        if(thisTimeLimit > 150) messageElement.textContent = "Time limit is too long";
        return ;
    }

    const response = await fetch('/insert-escapeRoom', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            name: thisName,
            genre: thieGenre,
            timeLimit: thisTimeLimit
        })
    });

    const responseData = await response.json();

    if (responseData.success) {
        messageElement.textContent = "Room added successfully!";
        fetchAndDisplayEscapeRooms();
    } else {
        messageElement.textContent = "Error detected";
    }
}

async function resetAllTables() {
    const response = await fetch('/reset-escape-room', {
        method: 'POST'
    });
    const responseData = await response.json();

    if (responseData.success) {
        const messageElement = document.getElementById('resetResultMsg');
        messageElement.textContent = "All table reseted successfully!";
        fetchAndDisplayEscapeRooms();
    } else {
        alert("Error reseting table!");
    }
}

async function displayHighRatingRoom(){
    const tableElement = document.getElementById('highRatingRoom');
    const tableBody = tableElement.querySelector('tbody');

    const response = await fetch('/highRatingList', {
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

window.onload = function() {
    fetchRoomTableData();
    document.getElementById("addEscapeRoom").addEventListener("submit", insertNewRoom);
    document.getElementById("resetAllTable").addEventListener("click", resetAllTables);
};

function fetchRoomTableData() {
    fetchAndDisplayEscapeRooms();
}