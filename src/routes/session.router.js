const { Router } = require('express')
const User = require('../dao/models/user.model');
const { hashPassword, isValidPassword } = require('../utils/hashing');
const passport = require('passport');

const router = Router();

router.post('/login', passport.authenticate('login', {failureRedirect: '/api/session/faillogin'}), async (req, res) => {
    console.log(req.body);

    // crear nueva session
    req.session.user = { email: req.user.email, _id: req.user._id };
    res.redirect('/');
    
});

router.get('/faillogin', (req,res) => {
    res.send('Error logging in user!')
})

router.post('/resetPassword', async (req, res) =>{
    const {email, password} = req.body
    if(!email || !password){
        return res.status(400).json({error: 'Invalid credentials'})
    }
    const user = await User.findOne({ email });
    if (!user) {
        return res.status(400).json({ error: 'User not found' });
    }

    await User.updateOne({email}, {$set: {password: hashPassword(password)}})

    res.redirect('/')
})

router.get('/logout', (req, res) => {
    req.session.destroy(err => {
        res.redirect('/')
    })
})

router.post('/register', passport.authenticate('register', {failureRedirect: '/api/session/failregister'}), async (req, res) => {
    console.log('usuario: ', req.user);
    res.redirect('/')
})

router.get('/failregister', (req,res) => {
    res.send('Error registering user!')
})

router.get('/github', passport.authenticate('github', {scope: ['user:email']}), (req, res) => {})

router.get('/githubcallback', passport.authenticate('github', {failureRedirect: '/'}), (req,res) => {
    req.session.user = {_id: req.user._id}
    res.redirect('/')
})

module.exports = router