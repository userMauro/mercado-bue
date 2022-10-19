const nodemailer = require("nodemailer");

const { NODEMAILER_USER, AUTH_ID_CLIENT, AUTH_SECRET_CLIENT } = process.env
const { getGoogleAuth } = require('./oauth')

const token = require('./token.json')
const { message } = require('./messages.json')

const callTransporter = async(data, res, next) => {
    try {
        const { email, html, type } = data

        await getGoogleAuth()

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

const sendEmail = async (req, res, next) => {
    try {
        req.html = message[req.type].html
        await callTransporter(req, res, next)
    } catch (error) {
        next(error)
    }
}

const sendEmailNewPassword = async (req, res, next) => {
    try {
        const { type, password } = req;

        req.html = `${message[type].html} <h1>${password}</h1>`
        await callTransporter(req, res, next)
    } catch (error) {
        next(error)
    }
}

module.exports = { sendEmail, sendEmailNewPassword }