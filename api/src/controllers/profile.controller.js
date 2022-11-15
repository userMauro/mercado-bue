const User = require('../models/User');
const { validate } = require("./authentication/config/regex.config")

const editData = async (req, res, next) => {
    try {
        const { value, email } = req.body           // value & email
        const { type } = req.params         // type: username, name, dni, cel, etc

        // regex
        // if (!validate(value, type))  {
        //     return res.status(401).json({status: false, msg: `invalid ${type}`})
        // }

        const user = await User.findOneAndUpdate({"email": email}, {
            $set: {
                [type]: value
            }
        })

        await user.save()
        return res.status(200).json({status: true, msg: value})
    } catch (error) {
        next(error)
    }
}

module.exports = { editData }