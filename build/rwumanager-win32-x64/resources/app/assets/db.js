'use strict'

const ElectronStore = require('electron-store')

class LocalJsonDB extends ElectronStore {

    constructor(settings) {
        super(settings)

        // initialize with existing customers, 
        // or return empty array
        this.customers = this.get('customers') || []
    }

    saveCustomers() {
        // save customers to JSON file
        this.set('customers', this.customers)

        // returning 'this' allows method chaining
        return this
    }

    getCustomers() {
        // set object's customers to customers in JSON file
        this.customers = this.get('customers') || []

        return this
    }

    addCustomer(customer) {
        // merge the existing customers with the new customer
        this.customers = [...this.customers, customer]

        return this.saveCustomers()
    }

    deleteCustomer(customer) {

        // filter out the target customer
        this.customers = this.customers.filter(t => t !== customer)

        return this.saveCustomers()
    }

    // update customer based on id/ index in array
    updateCustomer(customer, id) {
        this.customers[id] = customer

        return this.saveCustomers()
    }
}

module.exports = LocalJsonDB