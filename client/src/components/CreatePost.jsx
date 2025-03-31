import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    Container,
    Paper,
    TextField,
    Button,
    Typography,
    Box,
    Alert,
    CircularProgress
} from '@mui/material';
import { useAuth } from '../context/AuthContext';

const CreatePost = () => {
    const [image, setImage] = useState(null);
    const [preview, setPreview] = useState('');
    const [caption, setCaption] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const navigate = useNavigate();
    const { user } = useAuth();
    const apiURL = import.meta.env.VITE_BASE_API_URL;

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setImage(file);
            // Create preview URL
            const reader = new FileReader();
            reader.onloadend = () => {
                setPreview(reader.result);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        if (!image) {
            setError('Please select an image');
            setLoading(false);
            return;
        }

        try {
            const formData = new FormData();
            formData.append('image', image);
            formData.append('caption', caption);

            const response = await fetch(`${apiURL}/posts`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                },
                body: formData
            });

            const data = await response.json();

            if (response.ok) {
                navigate('/'); // Redirect to home page after successful post
            } else {
                setError(data.message || 'Error creating post');
            }
        } catch (error) {
            setError('Error creating post');
        } finally {
            setLoading(false);
        }
    };

    return (
        <Container maxWidth="sm">
            <Paper elevation={3} sx={{ p: 4, mt: 8 }}>
                <Typography variant="h4" component="h1" gutterBottom align="center">
                    Create New Post
                </Typography>
                {error && (
                    <Alert severity="error" sx={{ mb: 2 }}>
                        {error}
                    </Alert>
                )}
                <form onSubmit={handleSubmit}>
                    <Box sx={{ mb: 3 }}>
                        <input
                            accept="image/*"
                            type="file"
                            onChange={handleImageChange}
                            style={{ display: 'none' }}
                            id="image-upload"
                        />
                        <label htmlFor="image-upload">
                            <Button
                                variant="outlined"
                                component="span"
                                fullWidth
                                sx={{ mb: 2 }}
                            >
                                Select Image
                            </Button>
                        </label>
                        {preview && (
                            <Box sx={{ mt: 2, textAlign: 'center' }}>
                                <img
                                    src={preview}
                                    alt="Preview"
                                    style={{
                                        maxWidth: '100%',
                                        maxHeight: '300px',
                                        objectFit: 'contain'
                                    }}
                                />
                            </Box>
                        )}
                    </Box>
                    <TextField
                        fullWidth
                        label="Caption"
                        multiline
                        rows={4}
                        value={caption}
                        onChange={(e) => setCaption(e.target.value)}
                        margin="normal"
                        disabled={loading}
                    />
                    <Button
                        type="submit"
                        fullWidth
                        variant="contained"
                        color="primary"
                        sx={{ mt: 3 }}
                        disabled={loading || !image}
                    >
                        {loading ? (
                            <CircularProgress size={24} color="inherit" />
                        ) : (
                            'Create Post'
                        )}
                    </Button>
                </form>
            </Paper>
        </Container>
    );
};

export default CreatePost; 