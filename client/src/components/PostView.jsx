import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
    Container,
    Paper,
    Typography,
    Box,
    Avatar,
    IconButton,
    CircularProgress,
    Alert,
    Divider
} from '@mui/material';
import FavoriteIcon from '@mui/icons-material/Favorite';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import CommentIcon from '@mui/icons-material/Comment';
import DeleteIcon from '@mui/icons-material/Delete';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { useAuth } from '../context/AuthContext';

const PostView = () => {
    const { postId } = useParams();
    const navigate = useNavigate();
    const { user } = useAuth();
    const [post, setPost] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const apiURL = import.meta.env.VITE_BASE_API_URL;

    useEffect(() => {
        fetchPost();
    }, [postId]);

    const fetchPost = async () => {
        try {
            const response = await fetch(`${apiURL}/posts/${postId}`);
            const data = await response.json();

            if (response.ok) {
                setPost(data);
            } else {
                setError(data.message || 'Error fetching post');
            }
        } catch (error) {
            setError('Error fetching post');
        } finally {
            setLoading(false);
        }
    };

    const handleLike = async () => {
        try {
            const response = await fetch(`${apiURL}/posts/${postId}/like`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                }
            });

            if (response.ok) {
                const updatedPost = await response.json();
                setPost(updatedPost);
            }
        } catch (error) {
            console.error('Error liking post:', error);
        }
    };

    const handleDelete = async () => {
        if (!window.confirm('Are you sure you want to delete this post?')) {
            return;
        }

        try {
            const response = await fetch(`${apiURL}/posts/${postId}`, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                }
            });

            if (response.ok) {
                navigate('/');
            }
        } catch (error) {
            console.error('Error deleting post:', error);
        }
    };

    if (loading) {
        return (
            <Box display="flex" justifyContent="center" alignItems="center" minHeight="60vh">
                <CircularProgress />
            </Box>
        );
    }

    if (error) {
        return (
            <Container>
                <Alert severity="error" sx={{ mt: 4 }}>
                    {error}
                </Alert>
            </Container>
        );
    }

    if (!post) {
        return (
            <Container>
                <Alert severity="error" sx={{ mt: 4 }}>
                    Post not found
                </Alert>
            </Container>
        );
    }

    return (
        <Container maxWidth="md" sx={{ mt: 4, mb: 4 }}>
            <Box sx={{ mb: 3 }}>
                <IconButton onClick={() => navigate(-1)}>
                    <ArrowBackIcon />
                </IconButton>
            </Box>
            <Paper>
                <Box sx={{ p: 2, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        <Avatar
                            src={post.user.profilePicture}
                            alt={post.user.username}
                            sx={{ mr: 2 }}
                        />
                        <Box>
                            <Typography variant="subtitle1" fontWeight="bold">
                                {post.user.username}
                            </Typography>
                            <Typography variant="caption" color="text.secondary">
                                {new Date(post.createdAt).toLocaleDateString()}
                            </Typography>
                        </Box>
                    </Box>
                    {post.user._id === user._id && (
                        <IconButton onClick={handleDelete} color="error">
                            <DeleteIcon />
                        </IconButton>
                    )}
                </Box>
                <Box
                    component="img"
                    src={post.image}
                    alt={post.caption}
                    sx={{
                        width: '100%',
                        height: 'auto',
                        maxHeight: 600,
                        objectFit: 'contain'
                    }}
                />
                <Box sx={{ p: 2 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                        <IconButton
                            onClick={handleLike}
                            color={post.likes.includes(user._id) ? 'error' : 'default'}
                        >
                            {post.likes.includes(user._id) ? (
                                <FavoriteIcon />
                            ) : (
                                <FavoriteBorderIcon />
                            )}
                        </IconButton>
                        <Typography variant="body2" color="text.secondary" sx={{ mr: 2 }}>
                            {post.likes.length} likes
                        </Typography>
                        <IconButton>
                            <CommentIcon />
                        </IconButton>
                        <Typography variant="body2" color="text.secondary">
                            {post.comments.length} comments
                        </Typography>
                    </Box>
                    <Divider sx={{ my: 1 }} />
                    <Typography variant="body1" sx={{ mt: 2 }}>
                        {post.caption}
                    </Typography>
                </Box>
            </Paper>
        </Container>
    );
};

export default PostView; 