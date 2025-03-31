import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    Container,
    Grid,
    Paper,
    Typography,
    Box,
    Avatar,
    Button,
    Divider,
    List,
    ListItem,
    ListItemText,
    ListItemAvatar,
    CircularProgress,
    Alert
} from '@mui/material';
import { useAuth } from '../context/AuthContext';
import PostFeed from './PostFeed';

const Dashboard = () => {
    const { user, token } = useAuth();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [recentActivity, setRecentActivity] = useState([]);
    const apiURL = import.meta.env.VITE_BASE_API_URL;

    useEffect(() => {
        const fetchUserData = async () => {
            try {
                const response = await fetch(`${apiURL}/api/users/profile`, {
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                });

                if (!response.ok) {
                    throw new Error('Failed to fetch user data');
                }

                const data = await response.json();
                // You can store additional user data here if needed
            } catch (err) {
                setError('Failed to load dashboard data');
            } finally {
                setLoading(false);
            }
        };

        if (token) {
            fetchUserData();
        }
    }, [token, apiURL]);

    if (loading) {
        return (
            <div>
            <Box display="flex" justifyContent="center" alignItems="center" minHeight="80vh">
                <CircularProgress />
                <p> Welcome to Squad Yangu</p>
            </Box>
            </div>
        );
    }

    if (error) {
        return (
            <Container maxWidth="md">
                <Alert severity="error" sx={{ mt: 4 }}>
                    {error}
                </Alert>
            </Container>
        );
    }

    return (
        <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
            <Grid container spacing={3}>
                {/* User Profile Card */}
                <Grid item xs={12} md={4}>
                    <Paper sx={{ p: 3, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                        <Avatar
                            sx={{ width: 100, height: 100, mb: 2 }}
                            src={user?.profilePicture}
                            alt={user?.username}
                        />
                        <Typography variant="h5" gutterBottom>
                            {user?.username}
                        </Typography>
                        <Typography color="textSecondary" gutterBottom>
                            {user?.email}
                        </Typography>
                        <Typography variant="body2" color="textSecondary" paragraph>
                            Member since {new Date(user?.createdAt).toLocaleDateString()}
                        </Typography>
                        <Button
                            variant="outlined"
                            color="primary"
                            onClick={() => navigate('/profile')}
                            sx={{ mt: 2 }}
                        >
                            Edit Profile
                        </Button>
                    </Paper>
                </Grid>

                {/* Posts Feed */}
                <Grid item xs={12} md={8}>
                    <Box sx={{ mb: 3 }}>
                        <Button
                            variant="contained"
                            color="primary"
                            onClick={() => navigate('/create-post')}
                            fullWidth
                        >
                            Create New Post
                        </Button>
                    </Box>
                    <PostFeed />
                </Grid>

                {/* Recent Activity */}
                <Grid item xs={12} md={8}>
                    <Paper sx={{ p: 3 }}>
                        <Typography variant="h6" gutterBottom>
                            Recent Activity
                        </Typography>
                        <Divider sx={{ mb: 2 }} />
                        {recentActivity.length > 0 ? (
                            <List>
                                {recentActivity.map((activity, index) => (
                                    <ListItem key={index}>
                                        <ListItemAvatar>
                                            <Avatar>{activity.type[0]}</Avatar>
                                        </ListItemAvatar>
                                        <ListItemText
                                            primary={activity.title}
                                            secondary={new Date(activity.date).toLocaleString()}
                                        />
                                    </ListItem>
                                ))}
                            </List>
                        ) : (
                            <Typography color="textSecondary" align="center">
                                No recent activity to display
                            </Typography>
                        )}
                    </Paper>
                </Grid>

                {/* Quick Actions */}
                <Grid item xs={12}>
                    <Paper sx={{ p: 3 }}>
                        <Typography variant="h6" gutterBottom>
                            Quick Actions
                        </Typography>
                        <Grid container spacing={2}>
                            <Grid item xs={12} sm={6} md={3}>
                                <Button
                                    fullWidth
                                    variant="contained"
                                    color="primary"
                                    onClick={() => navigate('/create-post')}
                                >
                                    Create Post
                                </Button>
                            </Grid>
                            <Grid item xs={12} sm={6} md={3}>
                                <Button
                                    fullWidth
                                    variant="contained"
                                    color="secondary"
                                    onClick={() => navigate('/messages')}
                                >
                                    Messages
                                </Button>
                            </Grid>
                            <Grid item xs={12} sm={6} md={3}>
                                <Button
                                    fullWidth
                                    variant="contained"
                                    color="info"
                                    onClick={() => navigate('/notifications')}
                                >
                                    Notifications
                                </Button>
                            </Grid>
                            <Grid item xs={12} sm={6} md={3}>
                                <Button
                                    fullWidth
                                    variant="contained"
                                    color="success"
                                    onClick={() => navigate('/friends')}
                                >
                                    Friends
                                </Button>
                            </Grid>
                        </Grid>
                    </Paper>
                </Grid>
            </Grid>
        </Container>
    );
};

export default Dashboard; 