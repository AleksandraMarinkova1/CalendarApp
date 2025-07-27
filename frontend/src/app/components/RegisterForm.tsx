import React, { useState } from 'react';
// eslint-disable-next-line @nx/enforce-module-boundaries
import { TextField, Button, Box, Typography, Alert } from '@mui/material';

export default function RegisterForm() {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [msg, setMsg] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  async function handleRegister(e: React.FormEvent) {
    e.preventDefault();
    setMsg(null);
    setError(null);

    if (!firstName.trim() || !lastName.trim()) {
      setError('Please enter first and last name.');
      return;
    }

    try {
      const res = await fetch('/api/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ firstName, lastName, email, password }),
      });

      if (res.ok) {
        setMsg('Successfully registered!');
        setFirstName('');
        setLastName('');
        setEmail('');
        setPassword('');
      } else {
        const d = await res.json();
        setError(d?.message || 'Registration error');
      }
    } catch {
      setError('Server error');
    }
  }

  return (
    <Box
      component="form"
      onSubmit={handleRegister}
      sx={{ mt: 4, width: 300, mx: 'auto' }}
    >
      <Typography variant="h5" mb={2}>
        Sign up
      </Typography>
      <TextField
        fullWidth
        required
        label="First name"
        margin="normal"
        value={firstName}
        onChange={(e) => setFirstName(e.target.value)}
      />
      <TextField
        fullWidth
        required
        label="Last name"
        margin="normal"
        value={lastName}
        onChange={(e) => setLastName(e.target.value)}
      />
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
        Sign up
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
