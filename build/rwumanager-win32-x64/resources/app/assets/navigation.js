'use strict';

const settings = require('electron-settings')
const links = document.getElementsByClassName('nav-link');

// Get elements with class 'nav-link' to add listeners for app navigation
Array.prototype.forEach.call(links, function(link) {
    if(link.id !== "exit" && link.id !== "user-add") {
        link.addEventListener('click', (event) => {
            resetSections()
            const sectionId = `${event.target.dataset.section}-section`
            document.getElementById(sectionId).classList.toggle("is-shown");
    
            // save active section id
            const actionId = event.target.getAttribute('id')
            settings.set('activeSectionId', actionId)
        })
    } 
});

// reset section: remove class 'is-shown' from all sections
function resetSections() {
    const sections = document.querySelectorAll('.section.is-shown')
    Array.prototype.forEach.call(sections, (section) => {
        section.classList.remove('is-shown')
    })
}

const adduserBtn = document.getElementById('user-add')
adduserBtn.onclick = showNewCustomerWindow;

const {ipcRenderer} = require('electron')
// Emit event signal to the main process to open a modal window
function showNewCustomerWindow () {
    ipcRenderer.send('open-add-modal')
}

// Default to the view that was active the last time the app was open
const actionId = settings.get('activeSectionId')
if (actionId) {
    const section = document.getElementById(actionId)
    if(section) section.click()
}


