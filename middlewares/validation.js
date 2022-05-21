const { body } = require('express-validator');
const User = require('../models/user');

exports.signupValidation = [
    body('name')
        .not()
        .isEmpty()
        .withMessage('All fileds are required!')
        .isAlpha()
        .isLength({ min: 4 })
        .withMessage(
            'Name should be combination of characters and at least 4 characters.'
        ),
    body('email')
        .not()
        .isEmpty()
        .withMessage('Email is required!')
        .trim()
        .isEmail()
        .withMessage('Email must be a valid email')
        .normalizeEmail()
        .toLowerCase()
        .custom((value) => {
            return User.findOne({ email: value }).then((user) => {
                if (user) {
                    return Promise.reject('Email already in use');
                }
            });
        }),
    body('password')
        .not()
        .isEmpty()
        .withMessage('Password field is required!')
        .trim()
        .isLength({ min: 5 })
        .withMessage('Password should be at least 5 characters')
        .matches('[a-zA-Z]')
        .matches('[0-9]')
        .withMessage('Password must contain number and character'),
    body('password2').custom((value, { req }) => {
        if (value !== req.body.password) {
            throw new Error('Passwords do not match');
        }
        return true;
    }),
];

exports.loginValidation = [
    body('email')
        .not()
        .isEmpty()
        .withMessage('Email is required')
        .trim()
        .isEmail()
        .withMessage('Please enter a valid email address')
        .normalizeEmail()
        .toLowerCase(),
    body('password').not().isEmpty().withMessage('Password field is required!'),
];

exports.productInputValidation = [
    body('title')
        .not()
        .isEmpty()
        .withMessage('All fields are required!')
        .isString()
        .isLength({ min: 3 })
        .withMessage(
            'Title should contain only characters and at least 5 characters long'
        )
        .trim(),
    body('price')
        .not()
        .isEmpty()
        .withMessage('Price is required!')
        .isNumeric()
        .withMessage('Price should be number'),
    body('description')
        .not()
        .isEmpty()
        .withMessage('Description is required!')
        .isLength({ min: 5 })
        .trim()
        .withMessage('Description should be at least 5 characters'),
];
