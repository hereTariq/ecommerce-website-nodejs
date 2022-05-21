const Product = require('../models/product');

exports.getProducts = async (req, res, next) => {
    try {
        const products = await Product.find();
        res.render('customer/products', {
            title: 'Products',
            path: '/',
            products,
        });
    } catch (err) {
        next(err);
    }
};

exports.getProduct = async (req, res, next) => {
    const prodId = req.params.prodId;
    const product = await Product.findById(prodId);
    if (!product) {
        return res.redirect('/');
    }
    res.render('customer/product-details', {
        title: 'Product Details',
        path: '',
        product,
    });
};

exports.getInfo = (req, res, next) => {
    res.render('info', {
        title: 'Info',
        path: '',
    });
};
