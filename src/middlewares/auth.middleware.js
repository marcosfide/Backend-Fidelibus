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
    }
}