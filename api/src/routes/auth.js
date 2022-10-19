const authRouter = require('express').Router()

const { register, login, resetPassword, preRegister, confirmPasswordReset } = require('../controllers/authentication/auth')

authRouter.get('/register', preRegister)
authRouter.post('/register/confirm', register)
authRouter.post('/login', login)
authRouter.get('/resetPass', confirmPasswordReset)
authRouter.put('/resetPass/confirm', resetPassword)

module.exports = authRouter