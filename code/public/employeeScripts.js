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

async function fetchEmployeeProfile() {
    const email = sessionStorage.getItem('Email');
    console.log("Email frontend ", email);
    if(!email) {
        alert('Error getting email')
        return
    }

    const response = await fetch(`/employeeprofile?email=${encodeURIComponent(email)}`, {
        method: 'GET'
    });
    const responseData = await response.json();

    if(responseData.data.length > 0) {
        const profile = responseData.data[0]
        console.log(profile)
        document.getElementById('eprofile').innerHTML = `<br>Name: ${profile[0]}<br>Email: ${profile[1]}<br>Address: ${profile[2]}<br>PostalCode: ${profile[3]} <br>City: ${profile[7]} <br>Position: ${profile[5]} <br>Salary: ${profile[6]}`;
    }
}

async function fetchPositionSalary() {
    const response = await fetch('/PositionSalary', {
        method: 'GET'
    });
    const responseData = await response.json();
    const positions = responseData.data;

    console.log(positions)
    const dropdown = document.getElementById('position');
    positions.forEach(position => {
        const option = document.createElement('option');
        option.value = position[0];
        option.textContent = position[0];
        dropdown.appendChild(option);
    });
}

async function fetchPositionSalaryRow() {
    const response = await fetch('/PositionSalary', {
        method: 'GET'
    });
    const responseData = await response.json();
    const demotableContent = responseData.data;

    const tableElement = document.getElementById('PositionSalary');
    const tableBody = tableElement.querySelector('tbody');

    if (tableBody) {
        tableBody.innerHTML = '';
    }

    demotableContent.forEach(position => {
        const row = tableBody.insertRow();
        position.forEach((field, index) => {
            const cell = row.insertCell(index);
            cell.textContent = field;
        });
    });

}

async function updateSalary() {
    const positionValue = document.getElementById('position').value;
    const salaryValue = document.getElementById('salary').value;
    const salary = Number(salaryValue)

    if (!salary || !Number.isInteger(salary)) {
        alert("Please enter a valid salary amount.");
        return;
    }

    const response = await fetch('/update-salary', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            position: positionValue, 
            salary: salaryValue
        })
    });

    const responseData = await response.json();
    const messageElement = document.getElementById('updateSalaryResult');

    messageElement.textContent = responseData.message;
    console.log(document.getElementById('eprofile').innerHTML.trim().length)
    fetchPositionSalaryRow();
    if(!(document.getElementById('eprofile').innerHTML.trim().length === 0)){
        fetchEmployeeProfile();
    }
}

async function updatePositionName() {
    const positionValue = document.getElementById('position').value;
    const positionNameValue = document.getElementById('positionName').value;

    if (!positionNameValue) {
        alert("Please enter a valid position name.");
        return;
    }

    const response = await fetch('/update-positionname', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            position: positionValue, 
            positionName: positionNameValue
        })
    });

    const responseData = await response.json();
    const messageElement = document.getElementById('updatePositionNameResult');

    messageElement.textContent = responseData.message;
    console.log(document.getElementById('eprofile').innerHTML.trim().length)
    fetchPositionSalaryRow();
    if(!(document.getElementById('eprofile').innerHTML.trim().length === 0)){
        fetchEmployeeProfile();
    }
}


// ---------------------------------------------------------------
// Initializes the webpage functionalities.
// Add or remove event listeners based on the desired functionalities.
window.onload = function() {
    checkDbConnection();
    fetchPositionSalary();
    fetchPositionSalaryRow();
    document.getElementById('employeeProfile').addEventListener('click', fetchEmployeeProfile);
    document.getElementById('updateSalary').addEventListener('click', updateSalary); 
    document.getElementById('updatePositionName').addEventListener('click', updatePositionName);
    // document.getElementById('ManagePuzzle').addEventListener('click', )
    // document.getElementById('ManageProp').addEventListener('click', )
};