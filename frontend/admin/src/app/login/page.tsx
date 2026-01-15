'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Cookies from 'js-cookie';
import { 
  Box, 
  Button, 
  Container, 
  TextField, 
  Typography, 
  InputAdornment, 
  IconButton,
  Card,
  CardContent,
  useTheme,
  Alert,
  CircularProgress
} from '@mui/material';
import { Visibility, VisibilityOff, Person, Lock } from '@mui/icons-material';
import { useSnackbar } from '@/contexts/SnackbarContext';

export default function LoginPage() {
  const theme = useTheme();
  const router = useRouter();
  const { showSnackbar } = useSnackbar();

  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [username, setUsername] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [error, setError] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);

  const handleClickShowPassword = () => setShowPassword((show) => !show);

  const handleLogin = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError('');
    setLoading(true);

    try {
      // 1. เรียกไปที่ Internal API Route (/api/login)
      // เราส่ง username ไปตามปกติ เดี๋ยว route.ts จะแปลงเป็น email ให้เอง
      const res = await fetch('/api/login', {  
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          username: username, // ส่ง username (API Route จะ map เป็น email)
          password: password,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        // รับ Error message ที่ส่งมาจาก API Route (ซึ่ง API Route รับมาจาก Backend อีกที)
        // Backend อาจส่งมาเป็น { message: "..." } หรือ { detail: "..." }
        throw new Error(data.message || data.detail || 'Login failed');
      }

      // 2. Login สำเร็จ -> เก็บ Token
      if (data.access_token) {
        Cookies.set('token', data.access_token, { expires: 1 });

        showSnackbar('Login Successful! Welcome back.', 'success');
        // ย้ายหน้าไป Dashboard
        router.push('/');
      } else {
        throw new Error('Token not found in response');
      }

    } catch (err: any) {
      showSnackbar(err.message || 'Login failed', 'error'); 
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box
      sx={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: 'background.default',
        backgroundImage: `radial-gradient(circle at 50% 10%, #fff 0%, ${theme.palette.background.default} 100%)`,
      }}
    >
      <Container maxWidth="xs">
        <Card 
          elevation={0} 
          sx={{ 
            borderRadius: 4, 
            p: 3,
            border: '1px solid',
            borderColor: 'divider',
            boxShadow: '0 4px 24px rgba(0,0,0,0.05)' 
          }}
        >
          <CardContent sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
            
            {/* Logo Section */}
            <Box sx={{ textAlign: 'center', mb: 1 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 1.5, mb: 2 }}>
                <Box
                  sx={{
                    width: 56, height: 56, borderRadius: '50%',
                    bgcolor: 'primary.main', display: 'flex', alignItems: 'center',
                    justifyContent: 'center', color: 'white', fontWeight: 'bold', fontSize: '2rem',
                    boxShadow: `0 8px 16px ${theme.palette.primary.main}40`
                  }}
                >
                  P
                </Box>
                {/* 3 Dots */}
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
                   <Box sx={{ width: 10, height: 10, borderRadius: '50%', bgcolor: 'secondary.main' }} />
                   <Box sx={{ width: 10, height: 10, borderRadius: '50%', bgcolor: 'success.main' }} />
                   <Box sx={{ width: 10, height: 10, borderRadius: '50%', bgcolor: 'warning.main' }} />
                </Box>
              </Box>
              
              <Typography variant="h5" component="h1" sx={{ fontWeight: 700, letterSpacing: 1 }}>
                Welcome Back
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Sign in to Preselect Dashboard
              </Typography>
            </Box>

            {/* Error Message */}
            {error && (
                <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>
            )}

            {/* Form Section */}
            <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
              
              <TextField
                fullWidth
                label="Username / Email" // เปลี่ยน Label ให้ชัดเจนขึ้นว่าใส่ Email ก็ได้
                variant="outlined"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                disabled={loading}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <Person sx={{ color: 'text.secondary' }} />
                    </InputAdornment>
                  ),
                }}
              />

              <Box>
                <TextField
                    fullWidth
                    label="Password"
                    type={showPassword ? 'text' : 'password'}
                    variant="outlined"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    disabled={loading}
                    InputProps={{
                    startAdornment: (
                        <InputAdornment position="start">
                        <Lock sx={{ color: 'text.secondary' }} />
                        </InputAdornment>
                    ),
                    endAdornment: (
                        <InputAdornment position="end">
                        <IconButton
                            aria-label="toggle password visibility"
                            onClick={handleClickShowPassword}
                            edge="end"
                        >
                            {showPassword ? <VisibilityOff /> : <Visibility />}
                        </IconButton>
                        </InputAdornment>
                    ),
                    }}
                />
              </Box>

              <Button 
                type="submit" 
                fullWidth 
                variant="contained" 
                color="primary"
                size="large"
                disabled={loading || !username || !password}
                sx={{ 
                  height: 48,
                  fontSize: '1rem',
                  boxShadow: `0 8px 20px ${theme.palette.primary.main}40`,
                }}
              >
                {loading ? <CircularProgress size={24} color="inherit" /> : 'Sign In'}
              </Button>

            </form>
          </CardContent>
        </Card>
      </Container>
    </Box>
  );
}