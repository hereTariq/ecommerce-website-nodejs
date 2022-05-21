const router = require('express').Router();
const authController = require('../controllers/auth');
const {
    signupValidation,
    loginValidation,
} = require('../middlewares/validation');

const {
    ensureAuthenticated,
    ensureNotAuthenticated,
} = require('../middlewares/isAuth');

router.get('/signup', ensureNotAuthenticated, authController.getRegister);
router.get('/login', ensureNotAuthenticated, authController.getLogin);
router.post('/signup', signupValidation, authController.postSignup);
router.post('/login', loginValidation, authController.postLogin);
router.post('/logout', ensureAuthenticated, authController.postLogout);
module.exports = router;
