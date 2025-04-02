import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    Container,
    Paper,
    TextField,
    Button,
    Typography,
    Box,
    Link,
    Alert,
    List,
    ListItem,
    ListItemIcon,
    ListItemText
} from '@mui/material';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import ErrorIcon from '@mui/icons-material/Error';
import { useAuth } from '../context/AuthContext';

const Register = () => {
    const [formData, setFormData] = useState({
        username: '',
        email: '',
        password: '',
        confirmPassword: ''
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const navigate = useNavigate();
    const { register } = useAuth();
    const apiURL = import.meta.env.VITE_BASE_API_URL;

    const [passwordValidation, setPasswordValidation] = useState({
        length: false,
        number: false,
        letter: false
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));

        // Password validation
        if (name === 'password') {
            setPasswordValidation({
                length: value.length >= 6,
                number: /\d/.test(value),
                letter: /[a-zA-Z]/.test(value)
            });
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        // Validate passwords match
        if (formData.password !== formData.confirmPassword) {
            setError('Passwords do not match');
            return;
        }

        // Validate password requirements
        if (!passwordValidation.length || !passwordValidation.number || !passwordValidation.letter) {
            setError('Password does not meet requirements');
            return;
        }

        setLoading(true);

        try {
            const response = await fetch(`${apiURL}/auth/register`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    username: formData.username,
                    email: formData.email,
                    password: formData.password
                })
            });

            const data = await response.json();

            if (response.ok) {
                navigate('/login');
            } else {
                setError(data.message || 'Registration failed');
            }
        } catch (error) {
            setError('An error occurred during registration');
        } finally {
            setLoading(false);
        }
    };

    return (
        <Container maxWidth="sm">
            <Paper elevation={3} sx={{ p: 4, mt: 8 }}>
                <Typography variant="h4" component="h1" gutterBottom align="center">
                    Register
                </Typography>
                {error && (
                    <Alert severity="error" sx={{ mb: 2 }}>
                        {error}
                    </Alert>
                )}
                <form onSubmit={handleSubmit}>
                    <TextField
                        fullWidth
                        label="Username"
                        name="username"
                        value={formData.username}
                        onChange={handleChange}
                        margin="normal"
                        required
                        helperText="Username must be at least 3 characters long and can only contain letters, numbers, and underscores"
                    />
                    <TextField
                        fullWidth
                        label="Email"
                        name="email"
                        type="email"
                        value={formData.email}
                        onChange={handleChange}
                        margin="normal"
                        required
                    />
                    <TextField
                        fullWidth
                        label="Password"
                        name="password"
                        type="password"
                        value={formData.password}
                        onChange={handleChange}
                        margin="normal"
                        required
                    />
                    <TextField
                        fullWidth
                        label="Confirm Password"
                        name="confirmPassword"
                        type="password"
                        value={formData.confirmPassword}
                        onChange={handleChange}
                        margin="normal"
                        required
                    />
                    <Box sx={{ mt: 2, mb: 2 }}>
                        <Typography variant="subtitle2" gutterBottom>
                            Password Requirements:
                        </Typography>
                        <List dense>
                            <ListItem>
                                <ListItemIcon>
                                    {passwordValidation.length ? 
                                        <CheckCircleIcon color="success" /> : 
                                        <ErrorIcon color="error" />
                                    }
                                </ListItemIcon>
                                <ListItemText 
                                    primary="At least 6 characters long"
                                    sx={{ color: passwordValidation.length ? 'success.main' : 'error.main' }}
                                />
                            </ListItem>
                            <ListItem>
                                <ListItemIcon>
                                    {passwordValidation.number ? 
                                        <CheckCircleIcon color="success" /> : 
                                        <ErrorIcon color="error" />
                                    }
                                </ListItemIcon>
                                <ListItemText 
                                    primary="Contains at least one number"
                                    sx={{ color: passwordValidation.number ? 'success.main' : 'error.main' }}
                                />
                            </ListItem>
                            <ListItem>
                                <ListItemIcon>
                                    {passwordValidation.letter ? 
                                        <CheckCircleIcon color="success" /> : 
                                        <ErrorIcon color="error" />
                                    }
                                </ListItemIcon>
                                <ListItemText 
                                    primary="Contains at least one letter"
                                    sx={{ color: passwordValidation.letter ? 'success.main' : 'error.main' }}
                                />
                            </ListItem>
                        </List>
                    </Box>
                    <Button
                        type="submit"
                        fullWidth
                        variant="contained"
                        color="primary"
                        sx={{ mt: 3 }}
                        disabled={loading}
                    >
                        {loading ? 'Registering...' : 'Register'}
                    </Button>
                </form>
                <Box sx={{ mt: 2, textAlign: 'center' }}>
                    <Typography variant="body2">
                        Already have an account?{' '}
                        <Link 
                            component="button" 
                            variant="body2" 
                            onClick={() => navigate('/login')}
                        >
                            Login here
                        </Link>
                    </Typography>
                </Box>
            </Paper>
        </Container>
    );
};

export default Register; 