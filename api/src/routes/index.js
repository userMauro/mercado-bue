const router = require('express').Router();

// const { login } = require('../controllers/login');

// routes
const auth = require('./auth');
// const users = require('./users');
// const products = require('./products');
const notFound = require('../utils/notFoundHandler');

router.use('/auth', auth);
// router.use('/users', users);
// router.use('/products', products);
router.use('*', notFound);

module.exports = router;