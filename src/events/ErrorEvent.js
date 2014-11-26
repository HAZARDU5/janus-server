function ErrorEvent() {
    this.userExists = {
        message: 'User already exists.'
    }

    this.userNotExists = {
        message: 'User does not exist.'
    }

    this.userPasswordInvalid = {
        message: 'User password is invalid.'
    }
}

module.exports = ErrorEvent;