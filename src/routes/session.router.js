const { Router } = require('express')
const User = require('../dao/models/user.model')

const router = Router();

router.post('/login', async (req, res) => {
    const { email, password } = req.body;

    // Verificar si las credenciales coinciden con el usuario administrador predeterminado
    if (email === 'adminCoder@coder.com' && password === 'adminCod3r123') {
        req.session.user = { email, _id: 'admin1234' }; // Puedes establecer un _id ficticio para el administrador
        return res.redirect('/');
    }

    // Buscar en la base de datos si el usuario está registrado
    try {
        const user = await User.findOne({ email, password });
        if (!user) {
            return res.status(400).json({ error: 'User not found' });
        }
        req.session.user = { email, _id: user._id.toString() };
        res.redirect('/');
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});


router.get('/logout', (req, res) => {
    req.session.destroy(err => {
        res.redirect('/')
    })
})

router.post('/register', async (req, res) => {
    console.log(req.body);
    
    try {
        const {firstName, lastName, age, email, password} = req.body

        const user = await User.create({
            firstName,
            lastName,
            age: +age,
            email,
            password
        })

        req.session.user = {email, _id: user._id.toString()}

        res.redirect('/')
        
    } catch (error) {
        return res.status(500).json({error: err})
    }
})


module.exports = router