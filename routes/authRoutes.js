const { Router } = require('express');
const router = Router();
const authControllers = require('../controllers/authControllers.js');
const { requireAuth, checkUser } = require('../middleware/authMiddleware');

router.get('/signup', authControllers.signup_get);
router.post('/signup', authControllers.signup_post);
router.get('/login', authControllers.login_get);
router.post('/login', authControllers.login_post);
router.get('/logout', authControllers.logout);
router.get('/forgot-password', authControllers.forgotPassword_get);
router.post('/forgot-password', authControllers.forgotPassword_post);
router.get('/reset-password/:id/:token', requireAuth,authControllers.resetPassword_get);
router.post('/reset-password/:id/:token', requireAuth, authControllers.resetPassword_post);

module.exports = router;