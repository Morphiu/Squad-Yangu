import express from 'express';
import { auth } from '../middleware/auth.js';
import upload from '../middleware/upload.js';
import {
    getProfile,
    updateProfile,
    updateProfilePicture
} from '../controllers/user.js';

const router = express.Router();

// Get user profile
router.get('/profile', auth, getProfile);

// Update user profile
router.put('/profile', auth, updateProfile);

// Update profile picture
router.put('/profile/picture', auth, upload.single('image'), updateProfilePicture);

export default router; 