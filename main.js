import 'bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import axios from 'axios';
import prettyBytes from 'pretty-bytes';
import setupEditors from './editorSetup';

// Select UI elements
const form = document.querySelector('[data-form]');
const queryParamsContainer = document.querySelector('[data-query-params]');
const requestHeadersContainer = document.querySelector('[data-request-headers]');
const keyValueTemplate = document.querySelector('[data-key-value-template]');
const responseHeadersContainer = document.querySelector('[data-response-headers]');

// Set some overhead data to calculate request time
axios.interceptors.request.use(
    request => {
        request.customData = request.customData || {};
        request.customData.startTime = new Date().getTime();
        
        return request;
    }
)

// Set up response time
axios.interceptors.response.use(
    calculateResTime,
    (err) => {
        return Promise.reject(calculateResTime(err.response));
    } 
)

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

// Destructure code editor data
const { reqEditor, updateResEditor } = setupEditors();

// Set up form functionality
form.addEventListener('submit', (e) => {
    e.preventDefault();

    // Request JSON
    const reqBody = getReqJson(reqEditor);

    // Catch JSON error
    if(reqBody === undefined) return;

    // Fetch data
    axios({
        method: document.querySelector('[data-method]')?.value,
        url: document.querySelector('[data-url]')?.value,
        params: keyValuePairsToObject(queryParamsContainer),
        headers: keyValuePairsToObject(requestHeadersContainer),
        data: reqBody,
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

// Visualize response meta data
function updateResponseDetails(response) {
    const {status, customData: {time}} = response;
    const resStatusEl = document.querySelector('[data-status]');
    const resTimeEl = document.querySelector('[data-time]');
    const resSizeEl = document.querySelector('[data-size]');

    resStatusEl.textContent = status;
    resTimeEl.textContent = time;
    // length of the char is a byte, and we preatify the value using prettyBytes
    resSizeEl.textContent = prettyBytes(
        JSON.stringify(response.data).length + JSON.stringify(response.headers).length
    );
}

// Visualize response body
function updateResponseBody(responseData) {
    updateResEditor(responseData);
}

// Visualize response headers into lines
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

// Calculate the time of the response
function calculateResTime(response) {
    response.customData = response.customData || {};

    const {customData: {startTime}} = response.config;
    
    response.customData.time = new Date().getTime() - startTime;

    return response;
}

// Get JSON data from the codemirror editor
function getReqJson(editor) {
    try {
        const {state: { doc }} = editor; 
        const editorData = JSON.parse(doc.toString() || null);

        return editorData;
    } catch (error) {
        alert('Can\'t parse request body! Check your JSON form!');
        return undefined;
    }
}