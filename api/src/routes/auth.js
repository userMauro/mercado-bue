const authRouter = require('express').Router()

const { login, confirmPassForgot, preRegister, requestPassForgot, confirmEmail, register } = require('../controllers/authentication/auth')

authRouter.get('/register', preRegister)
authRouter.get('/register/confirm/:token', confirmEmail)
authRouter.post('/register/create', register)
authRouter.post('/login', login)
authRouter.get('/resetPass', requestPassForgot)
authRouter.put('/resetPass/confirm', confirmPassForgot)

module.exports = authRouter