const userRouter = require('express').Router();

const { 
    getAllUsers, 
    totalUsers, 
    PutPrivileges, 
    PutBanned, 
    getPurchasedProducts, 
    getProductsHistory, 
    getUsersFull,
    getPurchasedProductsAllUsers,
    putpurchasedProducts,
    putUser,
    addItemInWishList, 
    wishListComming 
} = require('../controllers/users');

userRouter.get('/getAll', getAllUsers);
userRouter.get('/count', totalUsers);
userRouter.put('/privileges/:name', PutPrivileges);
userRouter.put('/banned/:name', PutBanned);
userRouter.get('/productsHistory/:name', getProductsHistory);
userRouter.get('/purchasedProducts/:name', getPurchasedProducts);
userRouter.get('/getUserFull/:email', getUsersFull);
userRouter.get('/getpurchasedProductsAllUsers', getPurchasedProductsAllUsers);
userRouter.put('/putpurchasedProducts/:order', putpurchasedProducts);
userRouter.put('/update/:username', putUser);
userRouter.post('/addItemWishList', addItemInWishList);
userRouter.get('/wishListComming/:user', wishListComming);


module.exports = userRouter;