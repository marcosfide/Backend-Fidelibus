const { Router } = require('express')

const router = Router();

router.get('/', (req, res) => {
    const name = req.query.name ? req.query.name : ''
    if (req.session.counter) {
        req.session.counter++;
        res.send(`${name} visitaste el sitio ${req.session.counter} veces`);
    } else {
        req.session.counter = 1;
        res.send(`Bienvenido ${name}`);
    }
});


router.get('/logout', (req, res) => {
    req.session.destroy(err => {
        if (!err) {
            return res.send('¡Sesión eliminada!');
        }
        res.send({ status: 'error', error: err });
    });
});



router.get('/login',(req, res) => {
    const { username, password } = req.query

    if(username !== 'peter' || password !== 'parker'){
        return res.send('login failed!')
    }

    req.session.user = username
    req.session.admin = true
    res.send('login succeeded!')
})


module.exports = router