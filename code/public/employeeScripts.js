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
        document.getElementById('eprofile').innerHTML = `<br>Name: ${profile[0]}<br>Email: ${profile[1]}<br>Address: ${profile[2]}<br>PostalCode: ${profile[3]} <br>City: ${profile[4]} <br>Position: ${profile[5]} <br>Salary: ${profile[6]}`;
    }
}

async function fetchPositionSalary() {
    const response = await fetch('/PositionSalaryDrop', {
        method: 'GET'
    });
    const responseData = await response.json();
    const positions = responseData.data;

    console.log(positions)
    const dropdown = document.getElementById('position');
    positions.forEach(position => {
        const option = document.createElement('option');
        option.value = position;
        option.textContent = position;
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
    console.log("table: ", tableElement)

}

async function fetchAllTables() {
    const response = await fetch('/alltablenames', {
        method: 'GET'
    });
    const responseData = await response.json();
    const tableNames = responseData.data;

    console.log(tableNames)
    const dropdown = document.getElementById('tableName');
    tableNames.forEach(tableName => {
        const option = document.createElement('option');
        option.value = tableName;
        option.textContent = tableName;
        dropdown.appendChild(option);
    });
    fetchAllAttributes();

    dropdown.addEventListener('change', () => {
        fetchAllAttributes();
    })
}

async function fetchAllAttributes() {
    const tableValue = document.getElementById('tableName').value;
    const response = await fetch(`/allattributes?table=${encodeURIComponent(tableValue)}`, {
        method: 'GET'
    });
    const responseData = await response.json();
    const attributes = responseData.data;

    const attributeContent = document.getElementById('attributes')
    attributeContent.innerHTML = '';

    attributes.forEach(attribute => {
        if (attribute[0] === 'PASSWORD') {
            return;
        }

        const div = document.createElement('div');
        const input = document.createElement('input');

        input.type = 'checkbox';
        input.id = attribute;
        input.value = attribute;
        input.name = 'attributes'

        const label = document.createElement('label');
        label.htmlFor = attribute;
        label.textContent = attribute;

        div.appendChild(input);
        div.appendChild(label);
        attributeContent.appendChild(div);
    })
}

async function fetchTuples() {
    const tableValue = document.getElementById('tableName').value;
    const attributesValue = document.querySelectorAll('#attributes input[type=checkbox]:checked');
    const selectedAttributesValue = Array.from(attributesValue).map(checkbox => checkbox.value);

    if (selectedAttributesValue.length === 0) {
        alert("Please select at least one attribute.");
        return;
    }

    const response = await fetch(`/tuples?tableName=${encodeURIComponent(tableValue)}&attributes=${encodeURIComponent(selectedAttributesValue.join(','))}`, {
        method: 'GET'
    });

    const responseData = await response.json();
    const tuples = responseData.data;
    const tableElement = document.getElementById('tuples');
    
    tableElement.innerHTML = '';

    const thead = tableElement.createTHead();
    const headerRow = thead.insertRow();
    selectedAttributesValue.forEach(attribute => {
        const headerCell = document.createElement('th');
        headerCell.innerText = attribute;
        headerRow.appendChild(headerCell);
    })

    const tbody = document.createElement('tbody');
    tuples.forEach(tuple => {
        const row = tbody.insertRow();
        tuple.forEach((field, index) => {
            const cell = row.insertCell(index);
            cell.textContent = field;
        });
    });
    tableElement.appendChild(tbody);
}

async function updatePositionSalary() {
    var positionValue = document.getElementById('position').value;
    var salaryValue = document.getElementById('salary').value;
    var positionNameValue = document.getElementById('positionName').value;

    if (salaryValue.length === 0) {
        const tableElement = document.getElementById('PositionSalary');
        const tableBody = tableElement.querySelector('tbody');
        console.log("table length: ", tableBody.rows.length)
        for (let i = 0; i < tableBody.rows.length; i++) {
            if(tableBody.rows[i].cells[0].textContent === positionValue) {
                salaryValue = tableBody.rows[i].cells[2].textContent;
                break;
            }
        }
    }
    console.log("Empty salary: ",salaryValue)

    if (positionNameValue.length === 0) {
        const tableElement = document.getElementById('PositionSalary');
        const tableBody = tableElement.querySelector('tbody');
        console.log("table length: ", tableBody.rows.length)
        for (let i = 0; i < tableBody.rows.length; i++) {
            if(tableBody.rows[i].cells[0].textContent === positionValue) {
                positionNameValue = tableBody.rows[i].cells[1].textContent;
                break;
            }
        }
    }
    const salary = Number(salaryValue)

    if (!salary || !Number.isInteger(salary)) {
        alert("Please enter a valid salary amount.");
        return;
    }

    if (!positionNameValue || positionNameValue.trim().length === 0) {
        alert("Please enter a valid position name.");
        return;
    }

    const response = await fetch('/update-positionsalary', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            position: positionValue, 
            salary: salaryValue,
            positionName: positionNameValue
        })
    });

    const responseData = await response.json();
    const messageElement = document.getElementById('updatePositionSalaryResult');

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
    fetchAllTables();
    document.getElementById('employeeProfile').addEventListener('click', fetchEmployeeProfile);
    document.getElementById('updatePositionSalary').addEventListener('click', updatePositionSalary);
    document.getElementById('selectAttributes').addEventListener('click', fetchTuples);
};