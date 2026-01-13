'use client';

import React, { useState } from 'react';
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
  useTheme
} from '@mui/material';
import { Visibility, VisibilityOff, Person, Lock } from '@mui/icons-material';

export default function LoginPage() {
  const theme = useTheme(); // เรียกใช้ Theme เพื่อดึงค่าสีมาทำ Gradient
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [username, setUsername] = useState<string>('');
  const [password, setPassword] = useState<string>('');

  const handleClickShowPassword = () => setShowPassword((show) => !show);

  const handleLogin = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    // TODO: ใส่ Logic เชื่อมต่อ API ตรงนี้
    console.log("Login with:", { username, password });
  };

  return (
    <Box
      sx={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        // ใช้สีจาก Theme (background.default)
        backgroundColor: 'background.default',
        // Gradient สวยๆ โดยดึงสี Primary มาผสมจางๆ
        backgroundImage: `radial-gradient(circle at 50% 10%, #fff 0%, ${theme.palette.background.default} 100%)`,
      }}
    >
      <Container maxWidth="xs"> {/* ปรับความกว้างให้กระชับ (xs = extra small) */}
        <Card 
          elevation={0} // เอาเงา Default ออก แล้วใส่เงาเองให้ดูนุ่มนวล
          sx={{ 
            borderRadius: 4, 
            p: 3,
            border: '1px solid',
            borderColor: 'divider',
            boxShadow: '0 4px 24px rgba(0,0,0,0.05)' 
          }}
        >
          <CardContent sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
            
            {/* --- Logo Section (CSS Pure) --- */}
            <Box sx={{ textAlign: 'center', mb: 1 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 1.5, mb: 2 }}>
                {/* ตัว P ใหญ่ */}
                <Box
                  sx={{
                    width: 56,
                    height: 56,
                    borderRadius: '50%',
                    bgcolor: 'primary.main', // ใช้สีกลาง
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: 'white',
                    fontWeight: 'bold',
                    fontSize: '2rem',
                    boxShadow: `0 8px 16px ${theme.palette.primary.main}40` // เงาสีส้มแดงจางๆ
                  }}
                >
                  P
                </Box>
                {/* จุด 3 สี */}
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

            {/* --- Form Section --- */}
            <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
              
              {/* Username Input */}
              <TextField
                fullWidth
                label="Username / Email"
                variant="outlined"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <Person sx={{ color: 'text.secondary' }} />
                    </InputAdornment>
                  ),
                }}
              />

              {/* Password Input */}
              <Box>
                <TextField
                    fullWidth
                    label="Password"
                    type={showPassword ? 'text' : 'password'}
                    variant="outlined"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
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

              {/* Submit Button */}
              <Button 
                type="submit" 
                fullWidth 
                variant="contained" 
                color="primary" // MUI จะใช้สี #FF5A5F ให้อัตโนมัติ
                size="large"
                sx={{ 
                  height: 48,
                  fontSize: '1rem',
                  boxShadow: `0 8px 20px ${theme.palette.primary.main}40`,
                }}
              >
                Sign In
              </Button>

            </form>
          </CardContent>
        </Card>
        
        {/* Footer Text */}
        <Typography variant="caption" display="block" align="center" color="text.secondary" sx={{ mt: 4 }}>
            © 2026 Preselect Co., Ltd. All rights reserved.
        </Typography>

      </Container>
    </Box>
  );
}