const nodemailer = require("nodemailer");

const { NODEMAILER_USER, AUTH_ID_CLIENT, AUTH_SECRET_CLIENT } = process.env
const { URL } = require('../../../../URL')
const { getGoogleAuth } = require('./auth2.config')
const token = require('./token.json')


const sendEmail = async(req, res, next) => {
    try {
        const { email, type, data } = req

        await getGoogleAuth()

        const { subject, text, html} = message(type, data)

        // espero 3 segundos para obtener con seguridad el token de OAuth2
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
                subject,
                text,
                html
            }

            transporter.sendMail(emailDetail, (error) => {
                if (error) {
                    return res.status(404).json({status: 'failed', msg: error.message})
                } else {
                    return res.status(200).json({status: 'success', msg: `email sent successfully to ${emailDetail.to}, check it for more information`})
                }
            })
        }, 3000)
    } catch (error) {
        next(error)
    }
}

const message = (type, data) => {
    switch(type) {
        case "verify":
            return mail = {
                subject: "Confirmar email Mercado Bue!",
                text: "",
                html: `<button href="${URL}/auth/register/confirm/${data}">Confirmar email</button>`, 
            }
        case "welcome":
            return mail = {
                subject: "Bienvenida/o a la comunidad de Mercado Bue!",
                text: "",
                html: "<p>Hola! Antes de empezar a comprar o vender, te aconsejamos que leas nuestros tips: TIPS</p>"
            }
        case "requestPassForgot":
            return mail = {
                subject: "Recuperar contraseña Mercado Bue!",
                text: "",
                html: `<button href="${URL}/auth/register/confirm/${data}">Confirmar email</button>`, 
            }
        case "temporaryPass":
            return mail = {
                subject: "Contraseña provisoria Mercado Bue!",
                text: "",
                html: `<p>Esta es tu contraseña provisoria, vence en 1 hora, ingresa a tu cuenta para cambiarla.</p><h1>${data}</h1>`, 
            }
        default:
            break
    }
}

module.exports = { sendEmail }