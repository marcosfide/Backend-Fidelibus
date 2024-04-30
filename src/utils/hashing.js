const bcrypt = require('bcrypt');

module.exports = {
    hashPassword: value => {
        return bcrypt.hashSync(value, bcrypt.genSaltSync(10))
    },

    isValidPassword: (password, hashedPassword) => {
        return bcrypt.compareSync(password, hashedPassword)
    }
   }
