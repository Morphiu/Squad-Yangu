import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    Container,
    Grid,
    Card,
    CardHeader,
    CardMedia,
    CardContent,
    CardActions,
    Avatar,
    Typography,
    IconButton,
    Box,
    CircularProgress,
    Alert
} from '@mui/material';
import FavoriteIcon from '@mui/icons-material/Favorite';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import CommentIcon from '@mui/icons-material/Comment';
import DeleteIcon from '@mui/icons-material/Delete';
import { useAuth } from '../context/AuthContext';

const PostFeed = () => {
    const [posts, setPosts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const { user } = useAuth();
    const navigate = useNavigate();
    const apiURL = import.meta.env.VITE_BASE_API_URL;

    useEffect(() => {
        fetchPosts();
    }, []);

    const fetchPosts = async () => {
        try {
            const response = await fetch(`${apiURL}/posts`);
            const data = await response.json();

            if (response.ok) {
                setPosts(data);
            } else {
                setError(data.message || 'Error fetching posts');
            }
        } catch (error) {
            setError('Error fetching posts');
        } finally {
            setLoading(false);
        }
    };

    const handleLike = async (postId, event) => {
        event.stopPropagation(); // Prevent navigation when clicking like button
        try {
            const response = await fetch(`${apiURL}/posts/${postId}/like`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                }
            });

            if (response.ok) {
                // Update posts state to reflect the new like
                setPosts(posts.map(post => {
                    if (post._id === postId) {
                        const isLiked = post.likes.includes(user._id);
                        return {
                            ...post,
                            likes: isLiked
                                ? post.likes.filter(id => id !== user._id)
                                : [...post.likes, user._id]
                        };
                    }
                    return post;
                }));
            }
        } catch (error) {
            console.error('Error liking post:', error);
        }
    };

    const handleDelete = async (postId, event) => {
        event.stopPropagation(); // Prevent navigation when clicking delete button
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
                setPosts(posts.filter(post => post._id !== postId));
            }
        } catch (error) {
            console.error('Error deleting post:', error);
        }
    };

    const handlePostClick = (postId) => {
        navigate(`/posts/${postId}`);
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

    return (
        <Container maxWidth="md" sx={{ mt: 4, mb: 4 }}>
            <Grid container spacing={3}>
                {posts.map((post) => (
                    <Grid item xs={12} key={post._id}>
                        <Card 
                            sx={{ 
                                cursor: 'pointer',
                                '&:hover': {
                                    boxShadow: 6
                                }
                            }}
                            onClick={() => handlePostClick(post._id)}
                        >
                            <CardHeader
                                avatar={
                                    <Avatar
                                        src={post.user?.profilePicture || ''}
                                        alt={post.user?.username || 'User'}
                                    />
                                }
                                action={
                                    post.user?._id === user._id && (
                                        <IconButton onClick={(e) => handleDelete(post._id, e)}>
                                            <DeleteIcon />
                                        </IconButton>
                                    )
                                }
                                title={post.user?.username || 'Unknown User'}
                                subheader={new Date(post.createdAt).toLocaleDateString()}
                            />
                            <CardMedia
                                component="img"
                                image={post.image}
                                alt={post.caption}
                                sx={{ height: 'auto', maxHeight: 600, objectFit: 'contain' }}
                            />
                            <CardContent>
                                <Typography variant="body2" color="text.secondary">
                                    {post.caption}
                                </Typography>
                            </CardContent>
                            <CardActions disableSpacing>
                                <IconButton
                                    onClick={(e) => handleLike(post._id, e)}
                                    color={post.likes?.includes(user._id) ? 'error' : 'default'}
                                >
                                    {post.likes?.includes(user._id) ? (
                                        <FavoriteIcon />
                                    ) : (
                                        <FavoriteBorderIcon />
                                    )}
                                </IconButton>
                                <Typography variant="body2" color="text.secondary">
                                    {post.likes?.length || 0} likes
                                </Typography>
                                <IconButton>
                                    <CommentIcon />
                                </IconButton>
                                <Typography variant="body2" color="text.secondary">
                                    {post.comments?.length || 0} comments
                                </Typography>
                            </CardActions>
                        </Card>
                    </Grid>
                ))}
            </Grid>
        </Container>
    );
};

export default PostFeed; 