import Post from '../models/post.js';
import cloudinary from '../config/cloudinary.js';

// Create a new post
export const createPost = async (req, res) => {
    try {
        const { caption } = req.body;
        const userId = req.user.id;

        if (!req.file) {
            return res.status(400).json({ message: 'Please upload an image' });
        }

        // Convert buffer to base64
        const b64 = Buffer.from(req.file.buffer).toString('base64');
        const dataURI = `data:${req.file.mimetype};base64,${b64}`;

        // Upload to Cloudinary
        const uploadResponse = await cloudinary.uploader.upload(dataURI, {
            folder: 'posts',
            transformation: [
                { width: 1200, height: 1200, crop: 'limit' },
                { quality: 'auto' }
            ]
        });

        // Create new post
        const post = await Post.create({
            user: userId,
            image: uploadResponse.secure_url,
            caption
        });

        // Populate user information
        await post.populate('user', 'username profilePicture');

        res.status(201).json(post);
    } catch (error) {
        console.error('Error creating post:', error);
        res.status(500).json({ message: 'Error creating post' });
    }
};

// Get all posts
export const getPosts = async (req, res) => {
    try {
        const posts = await Post.find()
            .sort({ createdAt: -1 })
            .populate({
                path: 'user',
                select: 'username profilePicture'
            })
            .populate({
                path: 'comments.user',
                select: 'username profilePicture'
            });

        if (!posts) {
            return res.status(404).json({ message: 'No posts found' });
        }

        res.json(posts);
    } catch (error) {
        console.error('Error fetching posts:', error);
        res.status(500).json({ message: 'Error fetching posts' });
    }
};

// Get a single post
export const getPost = async (req, res) => {
    try {
        const post = await Post.findById(req.params.id)
            .populate({
                path: 'user',
                select: 'username profilePicture'
            })
            .populate({
                path: 'comments.user',
                select: 'username profilePicture'
            });

        if (!post) {
            return res.status(404).json({ message: 'Post not found' });
        }

        res.json(post);
    } catch (error) {
        console.error('Error fetching post:', error);
        res.status(500).json({ message: 'Error fetching post' });
    }
};

// Get user's posts
export const getUserPosts = async (req, res) => {
    try {
        const posts = await Post.find({ user: req.params.userId })
            .sort({ createdAt: -1 })
            .populate({
                path: 'user',
                select: 'username profilePicture'
            })
            .populate({
                path: 'comments.user',
                select: 'username profilePicture'
            });
        res.json(posts);
    } catch (error) {
        console.error('Error fetching user posts:', error);
        res.status(500).json({ message: 'Error fetching user posts' });
    }
};

// Delete a post
export const deletePost = async (req, res) => {
    try {
        const post = await Post.findById(req.params.id);

        if (!post) {
            return res.status(404).json({ message: 'Post not found' });
        }

        // Check if user owns the post
        if (post.user.toString() !== req.user.id) {
            return res.status(401).json({ message: 'Not authorized to delete this post' });
        }

        // Delete image from Cloudinary
        const publicId = post.image.split('/').pop().split('.')[0];
        await cloudinary.uploader.destroy(`posts/${publicId}`);

        await post.deleteOne();
        res.json({ message: 'Post deleted successfully' });
    } catch (error) {
        console.error('Error deleting post:', error);
        res.status(500).json({ message: 'Error deleting post' });
    }
};

// Like/Unlike a post
export const toggleLike = async (req, res) => {
    try {
        const post = await Post.findById(req.params.id);

        if (!post) {
            return res.status(404).json({ message: 'Post not found' });
        }

        const userId = req.user.id;
        const likeIndex = post.likes.indexOf(userId);

        if (likeIndex === -1) {
            // Add like
            post.likes.push(userId);
        } else {
            // Remove like
            post.likes.splice(likeIndex, 1);
        }

        await post.save();
        res.json(post);
    } catch (error) {
        console.error('Error toggling like:', error);
        res.status(500).json({ message: 'Error toggling like' });
    }
}; 