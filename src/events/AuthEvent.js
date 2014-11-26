function AuthEvent() {
    this.userAdded = {
        message: 'User added.'
    }

    this.userRemoved = {
        message: 'User removed.'
    }

    this.userAuthenticated = {
        message: 'User successfully authenticated.'
    }

    this.userAddedGroup = {
        message: 'User added to group.'
    }

    this.groupAddedPermission = {
        message: 'Permission added to group.'
    }

    this.groupAddedPermissions = {
        message: 'Permissions added to group.'
    }

    this.userRemovedAllGroups = {
        message: 'Removed user from all groups.'
    }
}

module.exports = AuthEvent;