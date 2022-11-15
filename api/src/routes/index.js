const router = require('express').Router()

// middleware
const { authOK } = require('../controllers/authentication/auth')

// routes
const auth = require('./auth')
const profile = require('./profile')
const notFound = require('../utils/notFoundHandler')

// endpoints
router.use('/auth', auth)
router.use('/profile', profile)
router.use('*', notFound)

module.exports = router