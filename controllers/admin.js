const Product = require('../models/product');
const mongoose = require('mongoose');
const { unlink } = require('fs');
const { validationResult } = require('express-validator');

exports.getAddProduct = (req, res, next) => {
    res.render('admin/edit-product', {
        title: 'Add Product',
        path: '/admin/add-product',
        editing: false,
        hasError: false,
    });
};

exports.postAddProduct = async (req, res, next) => {
    const { title, price, description } = req.body;
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        const error = errors.array()[0].msg;
        req.flash('error', error);
        return res.render('admin/edit-product', {
            title: 'Add Product',
            path: '/admin/add-product',
            product: {
                title,
                price,
                description,
            },
            error: req.flash('error'),
            hasError: true,
            editing: false,
        });
    }
    if (!req.file) {
        req.flash('error', 'Image is required!');
        return res.render('admin/edit-product', {
            title: 'Add Product',
            path: '/admin/add-product',
            product: {
                title,
                price,
                description,
            },
            editing: false,
            error: req.flash('error'),
            hasError: true,
        });
    }
    const image = req.file.path;
    try {
        const product = new Product({
            title,
            image,
            price,
            description,
            userId: req.user,
        });
        const savedProduct = await product.save();
        res.redirect('/admin/products');
    } catch (err) {
        next(err);
    }
};

exports.getAdminProducts = async (req, res, next) => {
    // console.log(req.user.email);
    // console.log(process.env.ADMIN);
    try {
        if (process.env.ADMIN === req.user.email) {
            const products = await Product.find();
            return res.render('admin/products', {
                title: 'Admin Products',
                path: '/admin/products',
                products,
            });
        }
        const products = await Product.find({ userId: req.user._id });
        res.render('admin/products', {
            title: 'Admin Products',
            path: '/admin/products',
            products,
        });
    } catch (err) {
        next(err);
    }
};

exports.deleteProduct = async (req, res, next) => {
    const prodId = req.body.prodId.trim();
    if (!mongoose.Types.ObjectId.isValid(prodId)) {
        return res.redirect('/admin/products');
    }
    try {
        const product = await Product.findById(prodId);
        if (
            product.userId.toString() !== req.user._id.toString() &&
            process.env.ADMIN !== req.user.email
        ) {
            return res.redirect('/');
        }
        if (!product) {
            return res.redirect('/admin/products');
        }

        unlink(product.image, (err) => {
            if (err) return next(err);
        });
        const deletedProduct = await Product.deleteOne({ _id: prodId });
        return res.redirect('/admin/products');
    } catch (err) {
        next(err);
    }
};

exports.getEditProduct = async (req, res, next) => {
    const editMode = req.query.edit;
    const prodId = req.params.prodId;
    if (!editMode) {
        return res.redirect('/');
    }

    try {
        const product = await Product.findById(prodId);
        if (
            product.userId.toString() !== req.user._id.toString() &&
            process.env.ADMIN !== req.user.email
        ) {
            return res.redirect('/');
        }
        res.render('admin/edit-product', {
            path: '',
            editing: editMode,
            title: 'Edit Product',
            product,
        });
    } catch (err) {
        console.log(err);
        next(err);
    }
};

exports.updateProduct = async (req, res, next) => {
    const { prodId, title, price, description } = req.body;
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        const error = errors.array()[0].msg;
        req.flash('error', error);
        return res.render('admin/edit-product', {
            title: 'Edit Product',
            path: '',
            product: {
                title,
                price,
                description,
            },
            error: req.flash('error'),
            hasError: true,
        });
    }
    const product = await Product.findById(prodId);
    if (!product) {
        return res.redirect('/');
    }
    if (
        product.userId.toString() !== req.user._id.toString() &&
        process.env.ADMIN.toString() !== req.user.email.toString()
    ) {
        return res.redirect('/');
    }
    try {
        product.title = title;
        if (req.file) {
            unlink(product.image, (err) => {
                if (err) throw err;
            });
            product.image = req.file.path;
        }
        product.price = price;
        product.description = description;
        const updatedProduct = await product.save();
        res.redirect('/admin/products');
    } catch (err) {
        next(err);
    }
};
