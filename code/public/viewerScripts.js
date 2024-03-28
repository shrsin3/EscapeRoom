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

async function fetchViewerProfile() {
    const email = sessionStorage.getItem('Email');
    console.log("Email frontend ", email);
    if(!email) {
        alert('Error getting email')
        return
    }

    const response = await fetch(`/viewerprofile?email=${encodeURIComponent(email)}`, {
        method: 'GET'
    });
    const responseData = await response.json();

    if(responseData.data.length > 0) {
        const profile = responseData.data[0]
        console.log(profile)
        document.getElementById('vprofile').innerHTML = `<br>Name: ${profile[0]}<br>Email: ${profile[1]}<br>Address: ${profile[2]}<br>PostalCode: ${profile[3]} <br>City: ${profile[6]} <br>Age: ${profile[5]}`;
    }
}

// ---------------------------------------------------------------
// Initializes the webpage functionalities.
// Add or remove event listeners based on the desired functionalities.
window.onload = function() {
    checkDbConnection();
    document.getElementById('viewProfile').addEventListener('click', fetchViewerProfile);    
};