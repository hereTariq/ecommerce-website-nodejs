const router = require('express').Router();
const customerController = require('../controllers/customer');

router.get('/', customerController.getProducts);
router.get('/info', customerController.getInfo);
router.get('/products/:prodId', customerController.getProduct);
module.exports = router;
