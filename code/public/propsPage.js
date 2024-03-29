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

async function fetchAndDisplayProps() {
    const tableElement = document.getElementById('propTable');
    const tableBody = tableElement.querySelector('tbody');

    const response = await fetch('/propTable', {
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

async function insertProps(event) {
    event.preventDefault();

    const propID = document.getElementById('propID').value;
    const propName = document.getElementById('propName').value;
    const propStatus = document.getElementById('propStatus').value;
    const prPuzzleId = document.getElementById('prPuzzleId').value;


    const response = await fetch('/insert-prop', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            propId: propID,
            name: propName,
            status: propStatus,
            puzzleID: prPuzzleId
        })
    });

    const responseData = await response.json();
    const messageElement = document.getElementById('insertPropResultMsg');

    if (responseData.success) {
        messageElement.textContent = "Data inserted successfully!";
        fetchTableData();
    } else {
        messageElement.textContent = "Error inserting data!";
    }
}

async function updatePropStatus(event) {
    event.preventDefault();

    const propID = document.getElementById('uPropID').value;
    const propStatus = document.getElementById('uPropStatus').value;

    const response = await fetch('/updatePropStatus', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            propId: propID,
            updatedStatus: propStatus
        })
    });

    const responseData = await response.json();
    const messageElement = document.getElementById('updatePropStatusResultMsg');

    if (responseData.success) {
        messageElement.textContent = "Status updated successfully!";
        fetchAndDisplayProps();
    } else {
        messageElement.textContent = "Error updating status!";
    }
}

async function deleteProp(event) {
    event.preventDefault();

    const propID = document.getElementById('dPropID').value;

    const response = await fetch('/deleteProp', {
        method: 'DELETE',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            propId: propID
        })
    });

    const responseData = await response.json();
    const messageElement = document.getElementById('updatePropDeleteResultMsg');

    if (responseData.success) {
        messageElement.textContent = "Delete successfully!";
        fetchAndDisplayProps();
    } else {
        messageElement.textContent = "Error deleting prop!";
    }
}

// ---------------------------------------------------------------
// Initializes the webpage functionalities.
// Add or remove event listeners based on the desired functionalities.
window.onload = function() {
    checkDbConnection();
    fetchTableData();
    document.getElementById("insertProp").addEventListener("submit", insertProps);
    document.getElementById("updatePropStatus").addEventListener("submit", updatePropStatus);
    document.getElementById("deleteProp").addEventListener("submit", deleteProp);
};

// General function to refresh the displayed table data.
// You can invoke this after any table-modifying operation to keep consistency.
function fetchTableData() {
    fetchAndDisplayProps();
}
