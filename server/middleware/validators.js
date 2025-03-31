import { body } from 'express-validator';

export const registerValidation = [
    body('username')
        .trim()
        .isLength({ min: 3 })
        .withMessage('Username must be at least 3 characters long')
        .matches(/^[a-zA-Z0-9_]+$/)
        .withMessage('Username can only contain letters, numbers, and underscores'),
    
    body('email')
        .trim()
        .isEmail()
        .withMessage('Please enter a valid email'),
    
    body('password')
        .isLength({ min: 6 })
        .withMessage('Password must be at least 6 characters long')
        .matches(/\d/)
        .withMessage('Password must contain at least one number')
        .matches(/[a-zA-Z]/)
        .withMessage('Password must contain at least one letter')
];

export const loginValidation = [
    body('email')
        .trim()
        .isEmail()
        .withMessage('Please enter a valid email'),
    
    body('password')
        .notEmpty()
        .withMessage('Password is required')
];

export const resetPasswordValidation = [
    body('email')
        .trim()
        .isEmail()
        .withMessage('Please enter a valid email')
];

export const updatePasswordValidation = [
    body('token')
        .notEmpty()
        .withMessage('Reset token is required'),
    
    body('password')
        .isLength({ min: 6 })
        .withMessage('Password must be at least 6 characters long')
        .matches(/\d/)
        .withMessage('Password must contain at least one number')
        .matches(/[a-zA-Z]/)
        .withMessage('Password must contain at least one letter')
]; 