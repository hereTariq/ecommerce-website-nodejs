const router = require('express').Router();
const adminController = require('../controllers/admin');
const { productInputValidation } = require('../middlewares/validation');
const { ensureAuthenticated } = require('../middlewares/isAuth');

router.get('/add-product', ensureAuthenticated, adminController.getAddProduct);
router.post(
    '/add-product',
    ensureAuthenticated,
    productInputValidation,
    adminController.postAddProduct
);
router.get('/products', ensureAuthenticated, adminController.getAdminProducts);
router.post(
    '/delete-product',
    ensureAuthenticated,
    adminController.deleteProduct
);
router.get(
    '/edit-product/:prodId',
    ensureAuthenticated,
    adminController.getEditProduct
);
router.post(
    '/edit-product',
    ensureAuthenticated,
    productInputValidation,
    adminController.updateProduct
);
module.exports = router;
