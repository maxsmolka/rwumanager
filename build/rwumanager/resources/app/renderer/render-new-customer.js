'use strict';

const {
    remote
} = require('electron')
const {
    ipcRenderer
} = require('electron')


document.getElementById('new-customer-form').addEventListener('submit', (e) => {
    // prevent default refresh functionality of forms
    e.preventDefault()

    // get input values
    const customer = {
        lastname: e.target[0].value,
        firstname: e.target[1].value,
        age: e.target[2].value,
    }

    // emit signal with new customer data to main process
    ipcRenderer.send('new-customer-added', customer)

    // reset input
    e.target[0].value = ''
    e.target[1].value = ''
    e.target[2].value = ''
})