
class UserController {
    
    constructor(userService,productService,cartService){
        this.userService = userService
        this.productService = productService
        this.cartService = cartService
    }

    async getUsers(req, res){
        try {
            const userId = req.params.uid
            const users = await this.userService.getUsers()
            res.json(users)
        } catch (error) {
            console.log(res);
        }
    }

    async register(req, res){
        console.log('usuario: ', req.user);
        res.redirect('/')
    }

    async resetPassword(req, res) {
        const { token, password } = req.body;
    
        if (!token || !password) {
            return res.status(400).json({ error: 'Invalid credentials' });
        }
    
        try {
            await this.userService.resetPassword(token, password);
            const resetLink = `${process.env.BASE_URL}`;
            res.send(`
                <html>
                <head>
                    <title>Password Reset Successful</title>
                </head>
                <body>
                    <h1>Password reset successfully!</h1>
                    <p>You will be redirected shortly...</p>
                    <script>
                        setTimeout(function() {
                            window.location.href = '${resetLink}';
                        }, 3000); // Redirige después de 3 segundos
                    </script>
                </body>
                </html>
            `);
        } catch (error) {
            console.error('Error resetting password:', error);
            // Obtén la URL de la página anterior usando document.referrer en JavaScript
            const referer = req.headers.referer || '/';
            res.status(400).send(`
                <html>
                <head>
                    <title>Error Resetting Password</title>
                </head>
                <body>
                    <h1>Error resetting password</h1>
                    <p>${error.message || 'Failed to reset password'}</p>
                    <p><a href="${referer}">Go back and try again</a></p>
                </body>
                </html>
            `);
        }
    }

    async sendEmailToResetPassword(req, res) {
        const { email } = req.body;
    
        try {
            await this.userService.sendEmailToResetPassword(email);
            res.send('Se ha enviado un mail para reestablecer la contraseña');
        } catch (error) {
            if (error.message === 'not found') {
                res.send(`El usuario con el email "${email}" no está registrado`);
            } else {
                res.status(500).send('Ocurrió un error al enviar el correo electrónico');
            }
        }
    }

    async changeRol(req, res){
        try {
            const userId = req.params.uid
            await this.userService.changeRol(userId)
            res.redirect('/profile')
        } catch (error) {
            console.log(res);
        }
    }

    async addImage(req, res) {
        try {
            const userId = req.params.uid;
            const file = req.file;
            await this.userService.addImage(userId, file);
            res.redirect('/profile')
        } catch (error) {
            console.log(error);
            res.status(500).send({ error: 'Error al cargar la imagen' });
        }
    }

    async deleteInactiveUsers(req, res) {
        try {
            await this.userService.deleteInactiveUsers();
            if (req.session?.user) {
                // Si hay una sesión activa, redirigir
                res.redirect(302, '/usersManager');
            } else {
                // Si no hay sesión activa, devolver una respuesta JSON
                res.status(201).json({ success: true, message: 'Usuario eliminado correctamente' });
            }
        } catch (error) {
            console.log(error);
            res.status(500).send({ error: 'Error al eliminar usuarios inactivos' });
        }
    }

    async deleteUserById(req, res) {
        try {
            const userId = req.params.uid;
            const user = await this.userService.getById(userId);
    
            if (!user) {
                res.status(400).json({ error: 'Usuario no encontrado.' });
                return;
            }
    
            const email = user.email;
            const cartId = user.cart;
    
            // Limpiar el carrito si tiene productos y luego eliminar el carrito
            if (cartId) {
                await this.cartService.deleteById(cartId)
            }
    
            // Obtener todos los productos del usuario
            const userProducts = await this.productService.getByOwner(email);
    
            // Iterar sobre los productos del usuario y eliminarlos
            for (const product of userProducts) {
                await this.productService.deleteById(product._id,email);
            }
    
            // Eliminar el usuario
            await this.userService.deleteById(userId);
    
            // Enviar correo al usuario eliminado
            await this.userService.sendEmailToUserDeleted(email);
    
            if (req.session?.user) {
                // Si hay una sesión activa, redirigir
                res.redirect(302, '/usersManager');
            } else {
                // Si no hay sesión activa, devolver una respuesta JSON
                res.status(201).json({ success: true, message: 'Usuario eliminado correctamente' });
            }
        } catch (error) {
            console.log(error);
            res.status(500).send({ error: 'Error al eliminar el usuario' });
        }
    }
}


module.exports = UserController