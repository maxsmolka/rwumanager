'use strict';

const {
    app,
    BrowserWindow,
    dialog,
    ipcMain
} = require('electron');
const path = require('path');

const debug = /--debug/.test(process.argv[2])

// Initialize database
const JsonStore = require('./assets/db')
// create a new customer json file db named "RWU-Customers"
const customersData = new JsonStore({
    name: 'RWU-Customers'
})

let mainWindow = null

function initializeApp() {
    makeSingleInstance()

    function createWindow() {
        const windowOptions = {
            width: 1080,
            // minWidth: 680,
            height: 840,
            minHeight: 840,
            title: app.name,
            show: false,
            webPreferences: {
                nodeIntegration: true
            }
        }

        //   if (process.platform === 'linux') {
        //     windowOptions.icon = path.join(__dirname, '/assets/app-icon/png/512.png')
        //   }

        mainWindow = new BrowserWindow(windowOptions)
        mainWindow.loadURL(path.join('file://', __dirname, 'index.html'))
        mainWindow.setMenu(null)
        // initialize with data stored
        mainWindow.once('ready-to-show', () => {
            mainWindow.webContents.send('updated-customers', customersData.customers)
            mainWindow.show()
        })

        // Launch fullscreen with DevTools open, usage: npm run debug
        if (debug) {
            mainWindow.webContents.openDevTools()
            mainWindow.maximize()
            require('devtron').install()
        }

        mainWindow.on('closed', () => {
            mainWindow = null
        })

        // Add new windows as children to the main window
        let newCustomerWin

        ipcMain.on('open-add-modal', (event) => {
            if (!newCustomerWin) {
                // const modalPath = path.join('file://', __dirname, './views/newCustomerModal.html')
                newCustomerWin = new BrowserWindow({
                    width: 540,
                    height: 640,
                    resizable: false,
                    // close with the main window
                    parent: mainWindow,
                    // modal blocks main window as long as child is active
                    modal: true, 
                    webPreferences: {
                        nodeIntegration: true
                    }
                })
                newCustomerWin.setMenu(null)
                // cleanup
                newCustomerWin.on('close', () => {
                    newCustomerWin = null
                })
                newCustomerWin.loadFile(path.join(__dirname, './modals/newCustomerModal.html'));
                newCustomerWin.show()
            }

        });

        // new-customer signal from new-customer-window
        ipcMain.on('new-customer-added', (event, customer) => {
            console.log("-----------------------NEW: " + customer)
            // store new customer locally
            const updatedCustomers = customersData.addCustomer(customer).customers
            // inform renderer process about updated entries
            mainWindow.webContents.send('updated-customers', updatedCustomers)
        })

        // delete customer from list
        ipcMain.on('delete-selected-customer', (event, customerId) => {

            let options = {
                type: 'question',
                buttons: ['Yes', 'No'],
                title: 'Confirm',
                message: 'Customer will be deleted. Are you sure?'
            }
            let responseCode = dialog.showMessageBoxSync(mainWindow, options)

            if (responseCode === 0) {
                const entry = customersData.customers[customerId]

                const updatedCustomers = customersData.deleteCustomer(entry).customers

                mainWindow.webContents.send('updated-customers', updatedCustomers)
            }


        })

    }

    app.on('ready', () => {
        createWindow()
    })

    app.on('window-all-closed', () => {
        if (process.platform !== 'darwin') {
            app.quit()
        }
    })

    app.on('activate', () => {
        if (mainWindow === null) {
            createWindow()
        }
    })
}


// Make this app a single instance app.
//
// The main window will be restored and focused instead of a second window
// opened when a person attempts to launch a second instance.
//
// Returns true if the current version of the app should quit instead of
// launching.
function makeSingleInstance() {
    if (process.mas) return

    app.requestSingleInstanceLock()

    app.on('second-instance', () => {
        if (mainWindow) {
            if (mainWindow.isMinimized()) mainWindow.restore()
            mainWindow.focus()
        }
    })
}


initializeApp()