/*
 * These functions below are for various webpage functionalities. 
 * Each function serves to process data on the frontend:
 *      - Before sending requests to the backend.
 *      - After receiving responses from the backend.
 * 
 * To tailor them to your specific needs,
 * adjust or expand these functions to match both your 
 *   backend endpoints 
 * and 
 *   HTML structure.
 * 
 */


// This function checks the database connection and updates its status on the frontend.
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

// Fetches data from the demotable and displays it.
async function fetchAndDisplayUserstable() {
    const tableElement = document.getElementById('Userstable');
    const tableBody = tableElement.querySelector('tbody');

    const response = await fetch('/Userstable', {
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

async function fetchViewerProfile() {
    const email = sessionStorage.getItem('Email');
    console.log("Email frontend ", email);
    if(!email) {
        alert('Error getting email!')
        return
    }

    const response = await fetch(`/viewerprofile?email=${encodeURIComponent(email)}`, {
        method: 'GET'
    });
    const responseData = await response.json();

    if(responseData.data.length > 0) {
        const profile = responseData.data[0]
        document.getElementById('profile').innerHTML = `Name: ${profile.Name}<br>Email: ${profile.Email}<br>Address: ${profile.Address}<br>PostalCode: ${profile.PostalCode}, <br>City: ${profile.City}`;
    }
}

async function Login(userType) {
    const emailValue = document.getElementById('checkEmail').value;
    const passwordValue = document.getElementById('checkPassword').value;

    const response = await fetch('/login', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            email: emailValue,
            password: passwordValue,
            userType: userType
        })
    });
    
    const responseData = await response.json();
    const messageElement = document.getElementById('insertResultMsgLogin');
    
    sessionStorage.setItem('Email', emailValue)

    if (responseData.success) {
        messageElement.textContent = "Login successful as " + userType + "!";
        if (responseData.userType === 'Viewer') {
            window.location.href = '/viewer.html';
        } else if (responseData.userType === 'Employee') {
            window.location.href = '/employee.html';
        } else if (responseData.userType === 'Player') {
            window.location.href = '/Player.html';
        }
    } else {
        messageElement.textContent = "Login failed!";
    }
}

async function Reset() {
    const response = await fetch("/initialization", {
        method: 'POST'
    });
    const responseData = await response.json();

    if (responseData.success) {
        const messageElement = document.getElementById('resetResultMsgAll');
        messageElement.textContent = "initialization successfully!";
        fetchTableData();
    } else {
        alert("Error initiating table!");
    }
}

// ---------------------------------------------------------------
// Initializes the webpage functionalities.
// Add or remove event listeners based on the desired functionalities.
window.onload = function() {
    checkDbConnection();
    fetchTableData();
    document.getElementById('loginAsViewer').addEventListener('click', () => Login('Viewer'));
    document.getElementById('loginAsEmployee').addEventListener('click', () => Login('Employee'));
    document.getElementById('loginAsPlayer').addEventListener('click', () => Login('Player'));
    document.getElementById("reset").addEventListener("click", Reset);
};

// General function to refresh the displayed table data. 
// You can invoke this after any table-modifying operation to keep consistency.
function fetchTableData() {
    fetchAndDisplayUserstable();
}
