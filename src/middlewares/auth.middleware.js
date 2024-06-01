const { emailAdmin, emailSuperAdmin } = require ('../env-config/adminConfig');

module.exports = {

    userIsLoggedIn: (req, res, next) => {
        const isLoggedIn = ![null, undefined].includes(req.session.user)
        if(!isLoggedIn){
            return res.status(401).json({error: 'User should be logged in'})
        }
        next()
    },

    userIsNotLoggedId: (req, res, next) => {
        const isLoggedIn = ![null, undefined].includes(req.session.user)
        if(isLoggedIn){
            return res.status(401).json({error: 'User should be not logged in'})
        }
        next()
    },

    userIsAdmin: (req, res, next) => {
        const isLoggedIn = ![null, undefined].includes(req.session.user)
        if(!isLoggedIn){
            return res.status(401).send('User should be logged in')
        }
        console.log(req.session.user);
        if(req.session.user.email !== emailAdmin && req.session.user.email !== emailSuperAdmin){
            return res.status(401).send('Unautorized')
        }
        next()
    },

    userIsNotAdmin: (req, res, next) => {
        const isLoggedIn = ![null, undefined].includes(req.session.user)
        if(!isLoggedIn){
            return res.status(401).send('User should be logged in')
        }
        if(req.session.user.email === emailAdmin || req.session.user.email === emailSuperAdmin){
            return res.status(401).send('User admin can not add products to cart')
        }
        next()
    }
}