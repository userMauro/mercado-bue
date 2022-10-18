const authRouter = require('express').Router()

const { register, login, resetPassword, preRegister } = require('../controllers/authentication/auth')

authRouter.get('/preRegister', preRegister)
authRouter.post('/login', login)
authRouter.post('/register', register)
authRouter.put('/resetPassword', resetPassword)

module.exports = authRouter