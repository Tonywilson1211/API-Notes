const API_KEY = "gO6wLC37dKJ2VZm88zZalWcGdbY"; //key provided by api
const API_URL = "https://ci-jshint.herokuapp.com/api"; 
const resultsModal = new bootstrap.Modal(document.getElementById("resultsModal"))

//GET STATEMENT 
/*
* Needs to access API - Make a GET request to the API URL with the API key
* Need to return the information - Pass the data to a display function
*/

document.getElementById("status").addEventListener("click", e => getStatus(e)); //e = event handler
document.getElementById("submit").addEventListener("click", e => postForm(e)); //e = event handler

function processOptions(form) {
    let optArray = [];
    for (let entry of form.entries()) {
        if (entry[0] === "options") {
            optArray.push(entry[1]);
        }
    }
    form.delete("options");
    form.append("options", optArray.join());

    return form;
}


async function postForm() {
    const form = processOptions (new FormData(document.getElementById("checksform")));

    const response = await fetch(API_URL, {
                        method: "POST",
                        headers: {
                                    "Authorization": API_KEY,
                                 },
                                 body: form,
                        })
    const data = await response.json();

    if (response.ok) {
        displayErrors(data);
    } else {
        throw new Error(data.error)
    }
}

function displayException(data) {

    let heading = `<div class="error-heading">An Exception Occurred</div>`;

    results = `<div>The API returned status code ${data.status_code}</div>`;
    results += `<div>Error number: <strong>${data.error_no}</strong></div>`;
    results += `<div>Error text: <strong>${data.error}</strong></div>`;

    document.getElementById("resultsModalTitle").innerText = heading;
    document.getElementById("results-content").innerHTML = results;
    resultsModal.show();
}

function displayErrors(data) {

    let results = "";

    let heading = `JSHint Results for ${data.file}`;
    if (data.total_errors === 0) {
        results = `<div class="no_errors">No errors reported!</div>`;
    } else {
        results = `<div>Total Errors: <span class="error_count">${data.total_errors}</span></div>`;
        for (let error of data.error_list) {
            results += `<div>At line <span class="line">${error.line}</span>, `;
            results += `column <span class="column">${error.col}:</span></div>`;
            results += `<div class="error">${error.error}</div>`;
        }
    }

    document.getElementById("resultsModalTitle").innerText = heading;
    document.getElementById("results-content").innerHTML = results;
    resultsModal.show();
}

async function getStatus(e) { //wrap the promise in an async promise
    const queryString = `${API_URL}?api_key=${API_KEY}`;
    const response = await fetch(queryString);
    const data = await response.json();
    if (response.ok) {
        displayStatus(data);//shows only expiry now but could remove expiry to show all available info
    } else {
        throw new Error(data.error);
    }
}

function displayStatus(data) { //create function for modal
    let heading = "API Key Status"; // header
    let results = `Your key is valid until ` //body text
    results += `${data.expiry}` //takes text in results and adds data.expiry (using the const data and pulling .expiry from the api)

    document.getElementById("resultsModalTitle").innerText = heading;
    document.getElementById("results-content").innerText = results;
    resultsModal.show();
}

// POST FORM

