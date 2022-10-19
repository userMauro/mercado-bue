const User = require('../../models/User')

const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const { v4: uuidv4 } = require('uuid')

const { validate } = require('./regex')
const { sendEmail, sendEmailNewPassword } = require('../email/nodemailer')

const authOK = async (req, res, next) => {
    // agregar esta funcion a rutas donde solo quiero que ingresen solo usuarios logueados
    
    try {
        const auth = req.get('authorization');     // recupera la cabecera http 'authorization' (es de express)

        let token = null;

        // la cabecera sería algo asi: 'Bearer kjgalksdkglahsdalk'
        if (auth && auth.toLowerCase().startsWith('bearer')) {
            token = auth.substring(7);
        };

        let decodedToken = {};
        try {
            decodedToken = jwt.verify(token, process.env.SECRET);
        } catch {};

        if (!token || !decodedToken.id) {
            return res.status(401).json({status: 'failed', msg: 'token missing or invalid'});
        };

        next();
    } catch (error) {
        return next(error);
    };
}

const preRegister = async (req, res, next) => {
    try {
        const { email } = req.body

        // regex para email
        if (!validate(email, 'email')) {
            return res.status(401).json({status: 'failed', msg: 'invalid characters in email'})
        }

        // chequeo no repetir email
        const exists = await User.findOne({email})
        if (!exists) return res.status(400).json({status: 'failed', msg: 'email already exists'})

        const mail = {email, type: 'verifyEmail'}
        await sendEmail(mail, res, next)
    } catch (error) {
        return next(error)
    }
}

const register = async (req, res, next) => {
    try {
        const { username, password, email } = req.body

        // regex para email/username
        if (!validate(email, 'email') || (!validate(username, 'username')))  {
            return res.status(401).json({status: 'failed', msg: 'invalid characters in email/username'})
        }

        // chequeo no repetir email
        const exists = await User.findOne({email})
        if (!exists) return res.status(401).json({status: 'failed', msg: 'email already in use'})


        // hash passwd
            const saltRounds = 10
            const passwordHash = await bcrypt.hash(password, saltRounds)

        const user = new User({
            username,
            email,
            passwordHash,
            role: 'user',
            products: [],
            favorites: [],
            reports: [],
        })

        await user.save()

        const mail = {email, type: 'welcomeEmail'}
        await sendEmail(mail, res, next) 
    } catch (error) {
        return next(error)
    };
}

const login = async (req, res, next) => {
    try {
        let { email, password } = req.body;

        // regex para email
        if (!validate(email, 'email')) {
            return res.status(401).json({status: 'failed', msg: 'invalid characters in email'})
        }

        // reviso si ya está logueado
        const logged = req.get('authorization');
        if (logged && logged.toLowerCase().startsWith('bearer')) {
            return res.status(401).json({status: 'failed', msg: 'there is an account already logged in'})
        }

        const user = await User.findOne({ email });
    
        const passwordCorrect = (user === null) 
            ? false
            : await bcrypt.compare(password, user.passwordHash)
        
        if (!passwordCorrect) return res.status(401).json({status: 'failed', msg: 'invalid email/password'})

        // si logueo bien, agrego la data que va a ir en el token codificado
        const data = {
            id: user.id,
            username: user.username,
            email: user.email,
            role: user.role,
        };

        // creo el token modificado con la data y lo encripto con la palabra secreta
        const token = jwt.sign(data, process.env.SECRET, {
            expiresIn: 60 * 60 * 24 * 7     // expira cada 7 días (segs, mins, horas, dias)
        });

        return res.send({status: 'success', msg: token})
    } catch (error) {
        return next(error);
    };
}

const confirmPasswordReset = async(req, res, next) => {
    try {
        const { email } = req.body

        // regex para email
        if (!validate(email, 'email')) {
            return res.status(401).json({status: 'failed', msg: 'invalid characters in email'})
        }

        // chequeo encontrar mail
        const exists = await User.findOne({email})
        if (!exists) return res.status(401).json({status: 'failed', msg: 'email not founded in database'})

        const mail = {email, type: 'confirmPasswordReset'}
        await sendEmail(mail, res, next)
    } catch (error) {
        next(error)
    }
}

const resetPassword = async(req, res, next) => {
    try {
        const { email } = req.body

        // regex para email
        if (!validate(email, 'email')) {
            return res.status(401).json({status: 'failed', msg: 'invalid characters in email'})
        }

        // chequeo encontrar mail
        const user = await User.findOne({email})
        if (!user) return res.status(401).json({status: 'failed', msg: 'email not founded in database'})

        const password = uuidv4().slice(0, 13)

        // hash passwd
            const saltRounds = 10
            const passwordHash = await bcrypt.hash(password, saltRounds)

        user.passwordHash = passwordHash
        user.save()

        const mail = {email, type: 'resetPassword', password}
        await sendEmailNewPassword(mail, res, next)
    } catch (error) {
        return next(error);
    }
}

module.exports = { preRegister, register, login, authOK, confirmPasswordReset, resetPassword };