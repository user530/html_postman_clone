import 'bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import axios from 'axios';

// Select UI elements
const form = document.querySelector('[data-form]');
const queryParamsContainer = document.querySelector('[data-query-params]');
const requestHeadersContainer = document.querySelector('[data-request-headers]');
const keyValueTemplate = document.querySelector('[data-key-value-template]');
const responseHeadersContainer = document.querySelector('[data-response-headers]');
const responseBodyContainer = document.querySelector('[data-json-response-body]');

// Create new query param slot
document
.querySelector('[data-add-query-param-btn]')
?.addEventListener('click', () => {
    queryParamsContainer.append(createKeyValuePair());
});

// Create new request header slot
document.querySelector('[data-add-request-header-btn]')
?.addEventListener('click', () => {
    requestHeadersContainer.append(createKeyValuePair());
});

// Initial slot for both query params and request headers
queryParamsContainer.append(createKeyValuePair());
requestHeadersContainer.append(createKeyValuePair());

// Set up form functionality
form.addEventListener('submit', (e) => {
    e.preventDefault();

    // Fetch data
    axios({
        method: document.querySelector('[data-method]')?.value,
        url: document.querySelector('[data-url]')?.value,
        params: keyValuePairsToObject(queryParamsContainer),
        headers: keyValuePairsToObject(requestHeadersContainer),
    })
    // Pass error response as it comes
    .catch(err => err)
    // Handle response
    .then((response) => {
        // Make response section visible
        const section = document.querySelector('[data-response-section]');
        section.classList.remove('d-none');
        
        // Visualize response data
        updateResponseDetails(response);
        updateResponseBody(response.data);
        updateResponseHeaders(response.headers);
    })
})


// Create slot using prepared template
function createKeyValuePair() {
    // Copy template
    const element = keyValueTemplate.content.cloneNode(true);
   
    // Add remove btn functionality
    element
    .querySelector('[data-remove-btn]')
    ?.addEventListener('click', (e) => {
        e.target.closest('[data-key-value-pair')?.remove();
    });

    return element;
}

// Create an object from the container of key-val pairs
function keyValuePairsToObject(container) {
    const pairs = container.querySelectorAll('[data-key-value-pair]');
    return [...pairs].reduce(
        (data, pair) => {
            const key = pair.querySelector('[data-key]')?.value;
            const value = pair.querySelector('[data-value]')?.value;

            if(!key) return data;

            return {...data, [key]: value}
        }
    ,{})
}

// 
function updateResponseDetails(response) {
    console.log(response);
    const {status} = response;
    const resStatusEl = document.querySelector('[data-status]');
    const resTimeEl = document.querySelector('[data-time]');
    const resSizeEl = document.querySelector('[data-size]');

    resStatusEl.textContent = response.status;
}

function updateResponseBody(responseData) {
    console.log(responseData);
}

function updateResponseHeaders(responseHeaders) {
    Object.entries(responseHeaders)
    .forEach(([key, val]) => {
        const keyElement = document.createElement('div');
        keyElement.textContent = key;

        const valElement = document.createElement('div');
        valElement.textContent = val;

        responseHeadersContainer.append(keyElement, valElement);
    })
}
