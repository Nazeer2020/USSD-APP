// fetching language from MTX

function fetchingLanuage(msisdn) {
    const baseUrl = 'http://10.10.49.38:9004/app_engine/production/71da4160-af56-11ec-badc-e546eda56afe?'; // Replace with your API endpoint

// Define the query parameters
const params = {
    MSISDN: msisdn,
    
};

// Construct the full URL with query parameters
const queryString = new URLSearchParams(params).toString();
const url = `${baseUrl}${queryString}`;

// Define headers
const headers = {
    'Content-Type': 'application/json',
    
};

// Make a GET request using fetch
return fetch(url, {
    method: 'GET',
    headers: headers
})
.then(response => {
    if (!response.ok) {
        throw new Error('Network response was not ok ' + response.statusText);
    }
    return response.json(); // Parse JSON data from response
})
.then(data => {
 // Handle the data from the response
 
    return data; 
})
.catch(error => {
    console.error('There was a problem with the fetch operation:', error);
});
}



export {fetchingLanuage};