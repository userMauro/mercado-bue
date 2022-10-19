const nodemailer = require("nodemailer");

const { NODEMAILER_USER, AUTH_ID_CLIENT, AUTH_SECRET_CLIENT } = process.env
const token = require('../email/token.json')
const { getGoogleAuth } = require('./oauth')

const message = {
    verifyEmail: {
        subject: 'Confirmar email en Mercado Bue!',
        text: '',
        html: '<p>Hola, somos Mercado Bue! Visita el siguiente link para confirmar tu email:</p><button>Confirmar email</button>'
    },
    welcomeEmail: {
        subject: 'Bienvenida/o a la comunidad de Mercado Bue!',
        text: '',
        html: '<p>Hola! Antes de empezar a comprar o vender, te aconsejamos que leas nuestros tips: TIPS</p>'
    },
    confirmPasswordReset: {
        subject: 'Recuperar contraseña Mercado Bue!',
        text: '',
        html: '<p>Iniciaste un pedido para recuperar tu contraseña, presiona confirmar si deseas restablecerla.</p><button>Confirmar</button>'
    },
    resetPassword: {
        subject: 'Contraseña provisoria Mercado Bue!',
        text: '',
        html: '<p>Esta es tu contraseña provisoria, vence en 30 minutos, ingresa a tu cuenta para cambiarla</p>'
    },
}

const sendEmail = async (req, res, next) => {
    try {
        const { email, type } = req;

        await getGoogleAuth()

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
                html: message[type].html
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

const sendEmailNewPassword = async (req, res, next) => {
    try {
        const { email, type, password } = req;

        await getGoogleAuth()

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
                html: `${message[type].html} <h1>${password}</h1>`
            }
    
            transporter.sendMail(emailDetail, (error) => {
                if (error) {
                    return res.status(404).json({status: 'failed', msg: error.message})
                } else {
                    return res.status(200).json({status: 'success', msg: `we send the temporary password to ${email}`})
                }
            })
        }, 3000)
    } catch (error) {
        next(error)
    }
}

module.exports = { sendEmail, sendEmailNewPassword }