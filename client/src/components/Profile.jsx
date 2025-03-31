import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { 
    Box, 
    Container, 
    Typography, 
    Avatar, 
    Button, 
    TextField,
    Paper,
    Grid
} from '@mui/material';

const Profile = () => {
    const { user, logout } = useAuth();
    const [isEditing, setIsEditing] = useState(false);
    const [bio, setBio] = useState(user?.bio || '');
    const apiURL= import.meta.env.VITE_BASE_API_URL;

    const handleBioUpdate = async () => {
        try {
            const response = await fetch(`${apiURL}/auth/profile`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                },
                body: JSON.stringify({ bio })
            });

            if (response.ok) {
                setIsEditing(false);
                // Update user context with new bio
                user.bio = bio;
            }
        } catch (error) {
            console.error('Error updating profile:', error);
        }
    };

    if (!user) {
        return (
            <Container>
                <Typography variant="h5">Please log in to view your profile</Typography>
            </Container>
        );
    }

    return (
        <Container maxWidth="md">
            <Paper elevation={3} sx={{ p: 4, mt: 4 }}>
                <Grid container spacing={3}>
                    <Grid item xs={12} md={4} sx={{ textAlign: 'center' }}>
                        <Avatar
                            src={user.profilePicture}
                            sx={{ width: 150, height: 150, mx: 'auto', mb: 2 }}
                        />
                        <Typography variant="h5">{user.username}</Typography>
                        <Typography color="textSecondary">{user.email}</Typography>
                    </Grid>
                    <Grid item xs={12} md={8}>
                        <Box sx={{ mb: 3 }}>
                            <Typography variant="h6" gutterBottom>
                                Bio
                            </Typography>
                            {isEditing ? (
                                <Box>
                                    <TextField
                                        fullWidth
                                        multiline
                                        rows={4}
                                        value={bio}
                                        onChange={(e) => setBio(e.target.value)}
                                        sx={{ mb: 2 }}
                                    />
                                    <Button 
                                        variant="contained" 
                                        onClick={handleBioUpdate}
                                        sx={{ mr: 1 }}
                                    >
                                        Save
                                    </Button>
                                    <Button 
                                        variant="outlined" 
                                        onClick={() => setIsEditing(false)}
                                    >
                                        Cancel
                                    </Button>
                                </Box>
                            ) : (
                                <Box>
                                    <Typography paragraph>
                                        {user.bio || 'No bio yet. Click edit to add one!'}
                                    </Typography>
                                    <Button 
                                        variant="outlined" 
                                        onClick={() => setIsEditing(true)}
                                    >
                                        Edit Bio
                                    </Button>
                                </Box>
                            )}
                        </Box>
                        <Box sx={{ mb: 3 }}>
                            <Typography variant="h6" gutterBottom>
                                Stats
                            </Typography>
                            <Grid container spacing={2}>
                                <Grid item xs={4}>
                                    <Typography variant="h6">{user.followers?.length || 0}</Typography>
                                    <Typography color="textSecondary">Followers</Typography>
                                </Grid>
                                <Grid item xs={4}>
                                    <Typography variant="h6">{user.following?.length || 0}</Typography>
                                    <Typography color="textSecondary">Following</Typography>
                                </Grid>
                            </Grid>
                        </Box>
                        <Button 
                            variant="contained" 
                            color="error" 
                            onClick={logout}
                        >
                            Logout
                        </Button>
                    </Grid>
                </Grid>
            </Paper>
        </Container>
    );
};

export default Profile; 