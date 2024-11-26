class SaveUserResponse {

    constructor(user){
        this.id = user._id
        this.name = user.firstName
        this.lastName = user.lastName
        this.age = user.age
        this.email = user.email
        this.rol = user.rol
    }
}

module.exports = { SaveUserResponse }