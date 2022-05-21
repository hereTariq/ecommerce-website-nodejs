exports.ensureAuthenticated = (req, res, next) => {
    if (req.session.isLoggedIn) {
        return next();
    }
    res.redirect('/auth/login');
};

exports.ensureNotAuthenticated = (req, res, next) => {
    if (req.session.isLoggedIn) {
        return res.redirect('back');
    }
    next();
};
