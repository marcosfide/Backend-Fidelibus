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
        if(req.session.user.email !== 'adminCoder@coder.com'){
            return res.status(401).send('Unautorized')
        }
        next()
    }
}