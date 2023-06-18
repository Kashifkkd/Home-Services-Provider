const Router = require('express');
const router = Router();
const userControllers = require('../controllers/userControllers.js');

router.get('/:id/profile', userControllers.userProfile_get);
router.post('/:id/profile', userControllers.userProfile_post);
router.post('/:id/profile/send-otp', userControllers.sendOTP);
router.post('/:id/profile/verify-otp', userControllers.verifyOTP);
router.post('/:id/profile/send-verification-email', userControllers.sendVerificationEmail);
router.post('/:id/profile/verify-email', userControllers.verifyEmail);
router.get('/verify-email/:id/:token', userControllers.verifyEmail_get);
router.get('/:id/service-order', userControllers.serviceOrder);

module.exports = router;