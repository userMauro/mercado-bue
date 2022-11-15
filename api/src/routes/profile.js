const profileRouter = require('express').Router()

const { editData } = require('../controllers/profile.controller')

profileRouter.put('/edit/:type', editData)

module.exports = profileRouter