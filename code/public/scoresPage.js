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

async function fetchAndDisplayScores() {
    const tableElement = document.getElementById('scoreTable');
    const tableBody = tableElement.querySelector('tbody');

    const response = await fetch('/scoreTable', {
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


async function insertScores(event) {
    event.preventDefault();

    const teamName = document.getElementById('teamName').value;
    const score = document.getElementById('score').value;
    const puzzleId = document.getElementById('spuzzleId').value;


    const response = await fetch('/insert-score', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            teamName: teamName,
            points: score,
            pId: puzzleId
        })
    });

    const responseData = await response.json();
    const messageElement = document.getElementById('insertScoreResultMsg');

    if (responseData.success) {
        messageElement.textContent = "Data inserted successfully!";
        fetchTableData();
    } else {
        messageElement.textContent = "Error inserting data!";
    }
}

async function fetchAndDisplayGroupedScores() {
    const filterValue = document.getElementById('filterValue').value;
    console.log("Function called");
    if(filterValue === "Minimum"){
        await fetchAndDisplayTeamNMaxScores();
    } else if(filterValue === "Maximum"){
        await fetchAndDisplayTeamNMinScores();
    } else {
        await fetchAndDisplayTeamNAvgScores();
    }

}

async function fetchAndDisplayTeamNMaxScores() {
    console.log("Max Function called");
    const tableElement = document.getElementById('scoreNTeamsTable');
    const tableBody = tableElement.querySelector('tbody');

    const response = await fetch('/teamNMaxScore', {
        method: 'GET'
    });

    const responseData = await response.json();
    const maxScoreTableContent = responseData.data;

    // Always clear old, already fetched data before new fetching process.
    if (tableBody) {
        tableBody.innerHTML = '';
    }

    maxScoreTableContent.forEach(user => {
        const row = tableBody.insertRow();
        user.forEach((field, index) => {
            const cell = row.insertCell(index);
            cell.textContent = field;
        });
    });
}

async function fetchAndDisplayTeamNMinScores() {
    console.log("Min Function called");
    const tableElement = document.getElementById('scoreNTeamsTable');
    const tableBody = tableElement.querySelector('tbody');

    const response = await fetch('/teamNMinScore', {
        method: 'GET'
    });

    const responseData = await response.json();
    const minScoreTableContent = responseData.data;

    // Always clear old, already fetched data before new fetching process.
    if (tableBody) {
        tableBody.innerHTML = '';
    }

    minScoreTableContent.forEach(user => {
        const row = tableBody.insertRow();
        user.forEach((field, index) => {
            const cell = row.insertCell(index);
            cell.textContent = field;
        });
    });
}

async function fetchAndDisplayTeamNAvgScores() {
    console.log("Avg Function called");
    const tableElement = document.getElementById('scoreNTeamsTable');
    const tableBody = tableElement.querySelector('tbody');

    const response = await fetch('/teamNAvgScore', {
        method: 'GET'
    });

    const responseData = await response.json();
    const avgScoreTableContent = responseData.data;

    // Always clear old, already fetched data before new fetching process.
    if (tableBody) {
        tableBody.innerHTML = '';
    }

    avgScoreTableContent.forEach(user => {
        const row = tableBody.insertRow();
        user.forEach((field, index) => {
            const cell = row.insertCell(index);
            cell.textContent = field;
        });
    });
}

window.onload = function() {
    checkDbConnection();
    fetchTableData()
    document.getElementById("insertScore").addEventListener("submit", insertScores);
    document.getElementById("GroupedScores").addEventListener("submit", fetchAndDisplayGroupedScores);
}

function fetchTableData() {
    fetchAndDisplayScores();
}