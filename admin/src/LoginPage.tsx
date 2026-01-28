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
        // Wywołuje authProvider.login z danymi
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
                // Twój gradient z przykładu:
                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                backgroundSize: 'cover',
            }}
        >
            <Card sx={{ minWidth: 350, maxWidth: 400, padding: '20px', borderRadius: '12px', boxShadow: '0 10px 25px rgba(0,0,0,0.2)' }}>
                <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginBottom: 2 }}>
                    <Avatar sx={{ m: 1, bgcolor: '#764ba2' }}>
                        <LockOutlinedIcon />
                    </Avatar>
                    <Typography component="h1" variant="h5" sx={{ color: '#333', fontWeight: 600 }}>
                        Panel Admina
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
                        />
                    </Box>
                    <CardActions sx={{ padding: '0 1em 1em 1em' }}>
                        <Button
                            variant="contained"
                            type="submit"
                            fullWidth
                            disabled={loading}
                            sx={{
                                background: '#764ba2',
                                padding: '10px',
                                fontSize: '16px',
                                fontWeight: 'bold',
                                '&:hover': {
                                    background: '#5b3a7d',
                                },
                            }}
                        >
                            {loading ? <CircularProgress size={24} color="inherit" /> : 'Zaloguj się'}
                        </Button>
                    </CardActions>
                </form>
            </Card>
            {/* Komponent do wyświetlania powiadomień o błędach */}
            <Notification />
        </Box>
    );
};

export default LoginPage;