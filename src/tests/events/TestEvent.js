function TestEvent() {
    this.userAdded = {
        message: 'Test user added.'
    }

    this.userRemoved = {
        message: 'Test user removed.'
    }

    this.userSelected = {
        message: 'Test user selected.',
        data: {}
    }

    this.userLoggedIn = {
        message: 'Test user logged in.'
    }
}

module.exports = TestEvent;