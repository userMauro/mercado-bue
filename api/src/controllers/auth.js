const User = require('../models/User')

const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')

const preRegister = async (req, res, next) => {
    try {
        const { email } = req.body

        if (!email) return res.status(400).json({status: 'failed', msg: 'email input is empty'})

        // regex para email
        if (!validate(email, 'email')) {
            return res.status(401).json({status: 'failed', msg: 'invalid characters in email'})
        }

        // chequeo no repetir email
        const emails = await User.find({email})
        if (emails.length > 0) return res.status(400).json({status: 'failed', msg: 'email already exists'})

        return res.status(200).json({status: 'success', msg: `we send an email to ${email} to continue the registration`})

        // > > > enviar email de confirmacion
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

        // chequeo no repetir username/email
        const users = await User.find({username})
        if (users.length > 0) return res.status(400).json({status: 'failed', msg: 'username already exists'})
        const emails = await User.find({email})
        if (emails.length > 0) return res.status(400).json({status: 'failed', msg: 'email already in use'})

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

        let userSaved = await user.save()
        
        if (userSaved) {
            console.log(`\u2705 user "${username}" registered and saved OK`)
            return res.json({status: 'success', msg: userSaved})
        } else {
            console.log(`\u274C user "${username}" cannot be saved, ERROR`)
            return res.status(400).json({status: 'failed', msg: 'error while saving user'})
        }
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

const resetPassword = async(req, res, next) => {
    try {
        const { email } = req.body;
        const user = await User.findOne({email});

        if (!user) return res.status(401).json({status: 'failed', msg: 'email invalid'});

        // enviar email y lo de abajo hacer en la confirmacion
        // ###################################################

        const newPassword = uuidv4();

        // hash passwd
            const saltRounds = 10;
            const passwordHash = await bcrypt.hash(newPassword, saltRounds);

        user.passwordHash = passwordHash;
        user.save();

        // const message = `For security policies we reset your Astronet password. You can change to the password you want in the modify user section of our app. Greetings from Astronet! The new password is " ${newPassword} "`;
        // const payload = { body: { userMail, message }};

        // await sendEmail(payload);

        return res.json({status: 'success', msg: 'password reset'})
    } catch (error) {
        return next(error);
    }
}

const validate = (data, type) => {
    // (/^[A-Za-z0-9_!#$%&'*+\/=?`{|}~^.-]+@[A-Za-z0-9.-]+$/, "gm")
    try {
        if (type === 'email') {
            const emailRegex = new RegExp(/^[A-Za-z0-9_.-]+@[A-Za-z0-9.-]+$/, "gm")
            return emailRegex.test(data)
        } else if (type === 'username') {
            const usernameRegex = new RegExp(/^[A-Za-z0-9_!#$%&.-]+$/, "gm")
            return usernameRegex.test(data)
        }
    } catch (error) {
        return next(error)
    }
}

// login con Google
// const getUser = async (req, res, next) => {
//     const { email } = req.params;
//     try {
//       let user = await User.find({ email: email });
//       if (user.length === 0) {
//         return res.json({ message: "Not register user" });
//       }
//       if (user) {
//         const { _id, username, email, role } = user[0]
//         const dataToken = {
//           id: _id,
//           username: username,
//           email: email,
//         };
//         const token = jwt.sign(dataToken, process.env.SECRET, {
//           expiresIn: 60 * 60 * 1 * 1, // expira cada 7 días (segs, mins, horas, dias)
//         });
         
//         const userData = {
//           username: username,
//           email: email,
//           role: role,
//           token,
//         };
//         return res.send({
//           status: "SUCCESS",
//           message: "Signup successfully",
//           data: userData,
//         });
//       }
//     } catch (e) {
//       res.status(404).send(e.message);
//     }
// };


module.exports = { preRegister, register, login, authOK, resetPassword };