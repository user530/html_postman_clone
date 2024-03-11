import 'bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import axios from 'axios';

// Select UI elements
const form = document.querySelector('[data-form]');
const queryParamsContainer = document.querySelector('[data-query-params]');
const requestHeadersContainer = document.querySelector('[data-request-headers]');
const keyValueTemplate = document.querySelector('[data-key-value-template]');

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

    axios({
        method: document.querySelector('[data-method]')?.value,
        url: document.querySelector('[data-url]')?.value,
        params: keyValuePairsToObject(queryParamsContainer),
        headers: keyValuePairsToObject(requestHeadersContainer),
    })
    .then(
        response => console.log(response)
    )
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