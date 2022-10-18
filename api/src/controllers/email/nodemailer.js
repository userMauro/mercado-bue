const nodemailer = require("nodemailer");

const { NODEMAILER_USER, AUTH_ID_CLIENT, AUTH_SECRET_CLIENT } = process.env
const token = require('../email/token.json')
const { getGoogleAuth } = require('./oauth')

const message = {
    verifyEmail: {
        subject: 'Verificación de email Mercado Bue!',
        text: 'Hola, te contactamos de Mercado Bue! para que verifiques tu email y puedas registrarte, visita el siguiente link: '
    },
}

const sendEmail = async (req, res, next) => {
    try {
        const { email, type } = req;

        await getGoogleAuth()
        // setTimeout(() => console.log(token.accessToken), 5000)
        // console.log('token json:', token.accessToken)

        // espero 3 segundos para obtener de forma segura el accessToken de OAuth2
        setTimeout(() => {
            const transporter = nodemailer.createTransport({
                service: 'gmail',
                auth: {
                    type: 'OAuth2',
                    user: NODEMAILER_USER,
                    clientId: AUTH_ID_CLIENT,
                    clientSecret: AUTH_SECRET_CLIENT,
                    refreshToken: token.accessToken
                }
            })
    
            let emailDetail = {
                from: NODEMAILER_USER,
                to: email,
                subject: message[type].subject,
                text: message[type].text,
                // html: ''
            }
    
            transporter.sendMail(emailDetail, (error) => {
                if (error) {
                    return res.status(404).json({status: 'failed', msg: error.message})
                } else {
                    return res.status(200).json({status: 'success', msg: `email sent successfully to ${email}, check it for more information`})
                }
            })
        }, 3000)
    } catch (error) {
        next(error)
    }
}

module.exports = { sendEmail }