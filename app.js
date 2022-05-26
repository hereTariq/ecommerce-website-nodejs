const express = require('express');
const { join } = require('path');
const mongoose = require('mongoose');
const multer = require('multer');
const flash = require('connect-flash');
const session = require('express-session');
const MogoDBStore = require('connect-mongodb-session')(session);
const compression = require('compression');
const helmet = require('helmet');
const morgan = require('morgan');
const User = require('./models/user');
require('dotenv').config();

const fileStorage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, './public/images/productImages');
    },
    filename: (req, file, cb) => {
        cb(
            null,
            new Date().toISOString().replace(/:/g, '-') +
                '-' +
                file.originalname
        );
    },
});

const fileFilter = (req, file, cb) => {
    if (
        file.mimetype === 'image/png' ||
        file.mimetype === 'image/jpg' ||
        file.mimetype === 'image/jpeg'
    ) {
        cb(null, true);
    } else {
        cb(null, false);
    }
};

const PORT = process.env.PORT || 3200;

const app = express();
app.set('view engine', 'ejs');

app.use(helmet());
app.use(compression());

app.use(express.urlencoded({ extended: false }));
app.use(multer({ storage: fileStorage, fileFilter }).single('image'));
app.use(express.json());
app.use(express.static(join(__dirname, 'public')));
app.use('/public', express.static(join(__dirname, 'public')));

const store = new MogoDBStore(
    {
        uri: process.env.MONGO_URI,
        collection: 'sessions',
    },
    (err) => {
        if (err) console.log(err.message);
    }
);

app.use(
    session({
        secret: process.env.SESSION_SECRET,
        resave: false,
        saveUninitialized: false,
        cookie: {
            httpOnly: true,
            maxAge: 1000 * 60 * 60 * 24,
        },
        store: store,
    })
);

app.use(flash());
// app.use(morgan('common'));
app.use((req, res, next) => {
    if (!req.session.user) {
        return next();
    }
    User.findById(req.session.user._id)
        .then((user) => {
            if (!user) {
                return next();
            }
            req.user = user;
            next();
        })
        .catch((err) => {
            next(new Error(err));
        });
});

app.use((req, res, next) => {
    res.locals.error = req.flash('error');
    res.locals.success = req.flash('success');
    res.locals.isAuthenticated = req.session.isLoggedIn;
    next();
});

// page routes
app.use(require('./routes/customer'));
app.use('/auth', require('./routes/auth'));
app.use('/admin', require('./routes/admin'));

mongoose
    .connect(process.env.MONGO_URI)
    .then((result) => {
        // console.log('mongodb connected');
        app.listen(PORT);
    })
    .catch((err) => {
        console.log(err);
    });

// Error handling for 404
app.use((req, res, next) => {
    res.status(404).render('404', { title: '404', path: '' });
});

app.use((err, req, res, next) => {
    res.status(500).render('500', {
        title: 'Error',
        path: '',
    });
});
