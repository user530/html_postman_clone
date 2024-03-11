import 'bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import axios from 'axios';

// Select UI elements
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