const express = require('express');
const passport = require('passport');
const router = express.Router();
const { 
    registerUser, 
    loginUser, 
    logoutUser,
    refreshToken,
    getUserProfile, 
    updateUserProfile, 
    forgotPassword, 
    resetPassword, 
    googleAuthCallback,
    saveFcmToken,
    sendOTP,
    verifyOTP
} = require('../controllers/authController');
const { loginSchema, registerSchema, forgotPasswordSchema, resetPasswordSchema } = require('../validations/authValidation');
const validate = require('../middleware/validate');
const { protect } = require('../middleware/auth');

router.post('/register', validate(registerSchema), registerUser);
router.post('/login', validate(loginSchema), loginUser);
router.post('/send-otp', sendOTP);
router.post('/verify-otp', verifyOTP);
router.post('/logout', protect, logoutUser);
router.post('/refresh-token', refreshToken);
router.post('/fcm-token', protect, saveFcmToken);
router.route('/profile').get(protect, getUserProfile).put(protect, updateUserProfile);

// Google OAuth
router.get('/google', passport.authenticate('google', { scope: ['profile', 'email'] }));
router.get('/google/callback', passport.authenticate('google', { failureRedirect: '/login' }), googleAuthCallback);

// Password Reset
router.post('/forgotpassword', validate(forgotPasswordSchema), forgotPassword);
router.put('/resetpassword/:resettoken', validate(resetPasswordSchema), resetPassword);

module.exports = router;
