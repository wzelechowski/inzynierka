import * as React from 'react';
import { useState } from 'react';
import { useLogin, useNotify, Notification } from 'react-admin';
import { Button, Card, CardActions, CircularProgress, TextField, Typography, Box, Avatar } from '@mui/material';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';

const LoginPage = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    
    const login = useLogin();
    const notify = useNotify();

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        login({ username: email, password })
            .catch(() => {
                setLoading(false);
                notify('Nieprawidłowy login lub hasło (albo brak roli Admin)', { type: 'warning' });
            });
    };

    return (
        <Box
            sx={{
                display: 'flex',
                flexDirection: 'column',
                minHeight: '100vh',
                alignItems: 'center',
                justifyContent: 'center',
                background: 'linear-gradient(120deg, #fdfbfb 0%, #ebedee 100%)',
                backgroundSize: 'cover',
            }}
        >
            <Card sx={{ 
                minWidth: 350, 
                maxWidth: 400, 
                padding: '20px', 
                borderRadius: '16px',
                boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
                backgroundColor: '#ffffff'
            }}>
                <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginBottom: 2 }}>
                    <Avatar sx={{ m: 1, bgcolor: '#1976d2', width: 50, height: 50 }}>
                        <LockOutlinedIcon fontSize="medium" />
                    </Avatar>
                    <Typography component="h1" variant="h5" sx={{ color: '#2c3e50', fontWeight: 700, marginTop: 1 }}>
                        Panel Admina
                    </Typography>
                    <Typography variant="body2" sx={{ color: '#7f8c8d', marginTop: 0.5 }}>
                        Zaloguj się, aby kontynuować
                    </Typography>
                </Box>
                
                <form onSubmit={handleSubmit}>
                    <Box sx={{ padding: '0 1em 1em 1em' }}>
                        <TextField
                            margin="normal"
                            required
                            fullWidth
                            id="email"
                            label="Adres Email"
                            name="email"
                            autoComplete="email"
                            autoFocus
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            sx={{
                                '& .MuiOutlinedInput-root': {
                                    '&.Mui-focused fieldset': {
                                        borderColor: '#1976d2',
                                    },
                                },
                                '& .MuiInputLabel-root.Mui-focused': {
                                    color: '#1976d2',
                                },
                            }}
                        />
                        <TextField
                            margin="normal"
                            required
                            fullWidth
                            name="password"
                            label="Hasło"
                            type="password"
                            id="password"
                            autoComplete="current-password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            sx={{
                                '& .MuiOutlinedInput-root': {
                                    '&.Mui-focused fieldset': {
                                        borderColor: '#1976d2',
                                    },
                                },
                                '& .MuiInputLabel-root.Mui-focused': {
                                    color: '#1976d2',
                                },
                            }}
                        />
                    </Box>
                    <CardActions sx={{ padding: '0 1em 2em 1em' }}>
                        <Button
                            variant="contained"
                            type="submit"
                            fullWidth
                            disabled={loading}
                            sx={{
                                background: '#1976d2',
                                padding: '12px',
                                fontSize: '16px',
                                fontWeight: 'bold',
                                borderRadius: '8px',
                                textTransform: 'none',
                                boxShadow: '0 4px 6px rgba(25, 118, 210, 0.2)',
                                '&:hover': {
                                    background: '#1565c0',
                                    boxShadow: '0 6px 10px rgba(25, 118, 210, 0.3)',
                                },
                            }}
                        >
                            {loading ? <CircularProgress size={24} color="inherit" /> : 'Zaloguj się'}
                        </Button>
                    </CardActions>
                </form>
            </Card>
            <Notification />
        </Box>
    );
};

export default LoginPage;