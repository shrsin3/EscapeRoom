async function checkDbConnection() {
    const statusElem = document.getElementById('dbStatus');
    const loadingGifElem = document.getElementById('loadingGif');

    const response = await fetch('/check-db-connection', {
        method: "GET"
    });

    // Hide the loading GIF once the response is received.
    loadingGifElem.style.display = 'none';
    // Display the statusElem's text in the placeholder.
    statusElem.style.display = 'inline';

    response.text()
        .then((text) => {
            statusElem.textContent = text;
        })
        .catch((error) => {
            statusElem.textContent = 'connection timed out';  // Adjust error handling if required.
        });
}

async function fetchAndDisplayPuzzles() {
    const tableElement = document.getElementById('puzzleTable');
    const tableBody = tableElement.querySelector('tbody');

    const response = await fetch('/puzzleTable', {
        method: 'GET'
    });

    const responseData = await response.json();
    const puzzleTableContent = responseData.data;

    // Always clear old, already fetched data before new fetching process.
    if (tableBody) {
        tableBody.innerHTML = '';
    }

    puzzleTableContent.forEach(user => {
        const row = tableBody.insertRow();
        user.forEach((field, index) => {
            const cell = row.insertCell(index);
            cell.textContent = field;
        });
    });
}

async function insertPuzzle(event) {
    event.preventDefault();

    const idValue = document.getElementById('puzzleId').value;
    const PuzzleNameValue = document.getElementById('puzzleName').value;
    const eRoomNameValue = document.getElementById('EscapeRoomName').value;
    const puzzleDifficulty = document.getElementById('puzzleDifficulty').value;


    const response = await fetch('/insert-puzzleHas', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            id: idValue,
            pName: PuzzleNameValue,
            eName: eRoomNameValue,
            pDiff: puzzleDifficulty
        })
    });

    const responseData = await response.json();
    const messageElement = document.getElementById('insertPuzzleResultMsg');

    if (responseData.success) {
        messageElement.textContent = "Data inserted successfully!";
        fetchTableData();
    } else {
        messageElement.textContent = "Error inserting data!";
    }
}

async function deletePuzzle(event) {
    event.preventDefault();

    const pID = document.getElementById('dPuzzleID').value;

    const response = await fetch('/deletePuzzle', {
        method: 'DELETE',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            pId: pID
        })
    });

    const responseData = await response.json();
    const messageElement = document.getElementById('puzzleDeleteResultMsg');

    if (responseData.success) {
        messageElement.textContent = "Delete successfully!";
        fetchAndDisplayPuzzles();
        fetchAndDisplayScores();
    } else {
        messageElement.textContent = "Error deleting prop!";
    }
}

window.onload = function() {
    checkDbConnection();
    fetchTableData();
    document.getElementById("insertPuzzle").addEventListener("submit", insertPuzzle);
    document.getElementById("deletePuzzle").addEventListener("submit", deletePuzzle);

}

function fetchTableData() {
    fetchAndDisplayPuzzles();
}