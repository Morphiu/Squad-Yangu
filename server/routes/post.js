import express from 'express';
import { auth } from '../middleware/auth.js';
import upload from '../middleware/upload.js';
import {
    createPost,
    getPosts,
    getUserPosts,
    deletePost,
    toggleLike,
    getPost
} from '../controllers/post.js';

const router = express.Router();

// Create a new post (protected route with file upload)
router.post('/', auth, upload.single('image'), createPost);

// Get all posts
router.get('/', getPosts);

// Get a single post
router.get('/:id', getPost);

// Get user's posts
router.get('/user/:userId', getUserPosts);

// Like/Unlike a post (protected route)
router.post('/:id/like', auth, toggleLike);

// Delete a post (protected route)
router.delete('/:id', auth, deletePost);

export default router; 