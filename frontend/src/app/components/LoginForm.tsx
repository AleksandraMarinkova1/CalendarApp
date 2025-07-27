import React, { useState } from 'react';
// eslint-disable-next-line @nx/enforce-module-boundaries
import { TextField, Button, Box, Typography, Alert } from '@mui/material';

interface LoginFormProps {
  onLoginSuccess: () => void;
}

export default function LoginForm({ onLoginSuccess }: LoginFormProps) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [msg, setMsg] = useState<string | null>(null);

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setMsg(null);
    try {
      const res = await fetch('/api/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });
      const data = await res.json();

      if (res.ok && data.token) {
        localStorage.setItem('token', data.token);
        setMsg('Login successful!');
        onLoginSuccess();
      } else {
        setError(data?.message || 'Login failed');
      }
    } catch {
      setError('Server error');
    }
  }

  return (
    <Box
      component="form"
      onSubmit={handleLogin}
      sx={{ mt: 4, width: 300, mx: 'auto' }}
    >
      <Typography variant="h5" mb={2}>
        Log in
      </Typography>
      <TextField
        fullWidth
        required
        label="E-mail"
        margin="normal"
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />
      <TextField
        fullWidth
        required
        label="Password"
        margin="normal"
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />
      <Button fullWidth variant="contained" type="submit" sx={{ mt: 2 }}>
        Log in
      </Button>
      {msg && (
        <Alert severity="success" sx={{ mt: 2 }}>
          {msg}
        </Alert>
      )}
      {error && (
        <Alert severity="error" sx={{ mt: 2 }}>
          {error}
        </Alert>
      )}
    </Box>
  );
}
