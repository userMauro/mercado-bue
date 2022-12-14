const productsRouter = require('express').Router();

const { 
    getAllProducts, 
    // createProduct, 
    // totalProducts, 
    // deleteProduct, 
    // buyProduct, 
    // getProductsByCategory, 
    // getProductsByName, 
    // getProductsById, 
    // getCategories, 
    // editProduct,
    // putReview,
    // cartCheckout,
} = require('../controllers/products');

productsRouter.get('/getAll', getAllProducts);
// productsRouter.get('/count', totalProducts);
// productsRouter.get('/category/:category', getProductsByCategory);
// productsRouter.get('/search/:name', getProductsByName);
// productsRouter.post('/create', createProduct);
// productsRouter.put('/update/:id', editProduct);
// productsRouter.post('/buy', buyProduct);
// productsRouter.delete('/delete', deleteProduct);
// productsRouter.get('/product/:id', getProductsById);
// productsRouter.get('/getCategories', getCategories);
// productsRouter.put('/putReview/:id', putReview)
// productsRouter.post('/checkout', cartCheckout)

module.exports = productsRouter;