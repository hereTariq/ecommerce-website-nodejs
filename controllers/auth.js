const bcrypt = require('bcryptjs');
const User = require('../models/user');
const { validationResult } = require('express-validator');

exports.getRegister = (req, res, next) => {
    res.render('auth/register', {
        title: 'Register',
        path: '/auth/signup',
        oldInput: {
            name: '',
            email: '',
            password: '',
            password2: '',
        },
    });
};

exports.getLogin = (req, res, next) => {
    res.render('auth/login', {
        title: 'Login',
        path: '/auth/login',
        oldInput: {
            email: '',
            password: '',
        },
    });
};

exports.postSignup = async (req, res, next) => {
    const { name, email, password, password2 } = req.body;
    // if(!name && !email && !password && !password2){
    //     req.flash('error','All fields are required!!!');
    //     return res.redirect('/auth/signup')
    // }
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        const error = errors.array()[0].msg;
        req.flash('error', error);

        return res.render('auth/register', {
            title: 'Register',
            path: '/auth/signup',
            oldInput: {
                name,
                email,
                password,
                password2,
            },
            error: req.flash('error'),
        });
    }
    try {
        const hashedPassword = await bcrypt.hash(password, 12);
        const user = new User({ name, email, password: hashedPassword });
        const savedUser = await user.save();
        req.flash('success', 'Registration successfull.');
        res.redirect('/auth/login');
    } catch (err) {
        next(err);
    }
};

exports.postLogin = async (req, res, next) => {
    const { email, password } = req.body;

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        const error = errors.array()[0].msg;
        req.flash('error', error);

        return res.render('auth/login', {
            title: 'Login',
            path: '/auth/login',
            oldInput: {
                email,
                password,
            },
            error: req.flash('error'),
        });
    }
    try {
        const user = await User.findOne({ email });
        if (!user) {
            req.flash(
                'error',
                'No Account Found! Please Register first before you Login.'
            );
            return res.status(422).render('auth/login', {
                title: 'Login',
                path: '/auth/login',
                oldInput: {
                    email,
                    password,
                },
                error: req.flash('error'),
            });
        }
        const doesMatchPassword = await bcrypt.compare(password, user.password);
        if (!doesMatchPassword) {
            req.flash('error', 'Invalid Email or Password');
            return res.status(422).render('auth/login', {
                title: 'Login',
                path: '/auth/login',
                oldInput: {
                    email,
                    password,
                },
                error: req.flash('error'),
            });
        }
        req.session.isLoggedIn = true;
        req.session.user = user;
        req.session.save((err) => {
            if (err) throw new Error(err);
            res.redirect('/');
        });
    } catch (err) {
        next(err);
    }
};

exports.postLogout = (req, res, next) => {
    req.session.destroy((err) => {
        if (err) throw new Error(err);
        res.redirect('/');
    });
};
