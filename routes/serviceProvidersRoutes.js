const { Router } = require('express');
const router = Router();
const serviceProvidersController = require('../controllers/serviceProvidersController.js');
const { requireAuth, checkUser, checkUserBusiness} = require('../middleware/authMiddleware');

router.get('/business/signup', serviceProvidersController.signup_get);
router.post('/business/signup', serviceProvidersController.signup_post);
router.get('/business/login', serviceProvidersController.login_get);
router.post('/business/login', serviceProvidersController.login_post);
router.get('/business/logout', serviceProvidersController.logout);
router.get('/business/dashboard',serviceProvidersController.dashboard);
router.post('/business/dashboard',serviceProvidersController.dashboard_post);
router.get('/business/dashboard/:id/orders',serviceProvidersController.orders);

// router.get('/forgot-password', authControllers.forgotPassword_get);
// router.post('/forgot-password', authControllers.forgotPassword_post);
// router.get('/reset-password/:id/:token', requireAuth,authControllers.resetPassword_get);
// router.post('/reset-password/:id/:token', requireAuth, authControllers.resetPassword_post);

module.exports = router;