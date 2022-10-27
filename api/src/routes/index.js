const router = require('express').Router();

// routes
// const { authOK } = require('../controllers/authentication/auth')
const auth = require('./auth');
// const users = require('./users');
// const products = require('./products');
const notFound = require('../utils/notFoundHandler');


router.use('/auth', auth);
// router.use('/users', authOk, users);
// router.use('/products', authOK, products);
router.use('*', notFound);

module.exports = router;