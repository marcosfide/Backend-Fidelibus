
class UserController {
    
    constructor(service){
        this.service = service
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
            await this.service.resetPassword(token, password);
            const resetLink = 'http://localhost:8080/';
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
            await this.service.sendEmailToResetPassword(email);
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
            await this.service.changeRol(userId)
            res.redirect('/profile')
        } catch (error) {
            console.log(res);
        }
    }
    
}


module.exports = UserController