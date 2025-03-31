import express from 'express';
import { auth } from '../middleware/auth.js';
import {
    register,
    login,
    getProfile,
    forgotPassword,
    resetPassword
} from '../controllers/auth.js';
import {
    registerValidation,
    loginValidation,
    resetPasswordValidation,
    updatePasswordValidation
} from '../middleware/validators.js';
import { validate } from '../middleware/validate.js';

const router = express.Router();

// Register route with validation
router.post('/register', registerValidation, validate, register);

// Login route with validation
router.post('/login', loginValidation, validate, login);

// Get user profile (protected route)
router.get('/profile', auth, getProfile);

// Forgot password route with validation
router.post('/forgot-password', resetPasswordValidation, validate, forgotPassword);

// Reset password route with validation
router.post('/reset-password', updatePasswordValidation, validate, resetPassword);

export default router; 