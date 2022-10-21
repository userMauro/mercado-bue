const authRouter = require('express').Router()

const { login, confirmPassForgot, preRegister, requestPassForgot, confirmEmail, register, authOK } = require('../controllers/authentication/auth')

authRouter.get('/authorize', authOK)
authRouter.get('/register/:email', preRegister)
authRouter.get('/register/confirm/:token', confirmEmail)
authRouter.post('/register/create', register)
authRouter.post('/login', login)
authRouter.get('/resetPass/:email', requestPassForgot)
authRouter.put('/resetPass/confirm', confirmPassForgot)

module.exports = authRouter