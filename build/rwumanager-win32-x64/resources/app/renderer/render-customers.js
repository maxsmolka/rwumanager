'use strict'

const {
    ipcRenderer,
    dialog,
    remote
} = require('electron')

// Seperated script file to use for 'customers.html'

// get the list element
let ul_customers = document.getElementById('customers-list')

// On received signal from main-process, reload the content of the list
ipcRenderer.on('updated-customers', (event, updated_customers) => {

    // create html string

    // lastname
    // firstname
    // age
    let list = updated_customers.reduce((html, customer, index) => {
        html += `
        <li id="${index}">
            <span class="id">${index}</span>
            <span class="name">
                ${customer.lastname}, ${customer.firstname}
            </span>
            <span class="btn btn-delete" job='delete'>
                <i id="delete" class="fa fa-trash" aria-hidden="true"></i>
            </span>
        </li>
        `
        return html
    }, '')

    // add update customer to the list in html 
    ul_customers.innerHTML = list
});

// Implement search functionality
let input_search = document.getElementById('search-by-name')
input_search.addEventListener('keyup', function (event) {
    event.preventDefault()
    searchByName()
})

function searchByName() {
    // Declare variables
    let searchString, li, item, i, txtValue;

    searchString = input_search.value.toUpperCase();
    li = ul_customers.getElementsByTagName('li')

    // Loop through all list items, and hide those who don't match the search query
    for (i = 0; i < li.length; i++) {
        item = li[i].getElementsByTagName("span")[1];
        txtValue = item.innerText || item.innerHTML;
        if (txtValue.toUpperCase().indexOf(searchString) > -1) {
            li[i].style.display = "";
        } else {
            li[i].style.display = "none";
        }
    }

}

// handle delete event for each list item on click
// list items are access and deleted by its id value set during creation
ul_customers.addEventListener('click', (event) => {

    if (event.target.id == 'delete') {
        // let selectedId = event.target.parentNode.parentNode.attributes.id.value
        let element = event.target.parentNode;

        // // TODO: check attributes to disable and catch error
        let elementJob = element.attributes.job.value;

        if (elementJob == "delete") {
            removeSelectedCustomerById(element.parentNode.id)
        }
    }
})

function removeSelectedCustomerById(customerId) {
    ipcRenderer.send('delete-selected-customer', customerId)
}