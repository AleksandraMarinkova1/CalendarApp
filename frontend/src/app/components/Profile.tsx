import React, { useEffect, useState, useRef } from 'react';
import axios from 'axios';
// eslint-disable-next-line @nx/enforce-module-boundaries
import {
  Box,
  Typography,
  Avatar,
  IconButton,
  Button,
  TextField,
  Alert,
  Switch,
  Stack,
  Divider,
} from '@mui/material';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import EditIcon from '@mui/icons-material/Edit';
// eslint-disable-next-line @nx/enforce-module-boundaries
import { jwtDecode } from 'jwt-decode';

interface UserProfile {
  id?: number;
  email: string;
  firstName?: string;
  lastName?: string;
  avatarUrl?: string;
}

export default function Profile() {
  const [profile, setProfile] = useState<UserProfile>({ email: '' });
  const [msg, setMsg] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const [resetEmail, setResetEmail] = useState('');
  const [resetOldPassword, setResetOldPassword] = useState('');
  const [resetNewPassword, setResetNewPassword] = useState('');
  const [resetMsg, setResetMsg] = useState<string | null>(null);
  const [resetError, setResetError] = useState<string | null>(null);
  const [userId, setUserId] = useState('');

  const [avatarUrl, setAvatarUrl] = useState<string | undefined>(undefined);
  const [darkMode, setDarkMode] = useState(() => {
    return localStorage.getItem('darkMode') === 'true';
  });
  const fileRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      const decoded: any = jwtDecode(token);
      console.log('decoded', decoded);

      if (decoded?.userId) {
        setUserId(decoded?.userId);
      }
    }
  }, []);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) throw new Error('No auth token');
        const res = await axios.get('/api/profile', {
          headers: { Authorization: `Bearer ${token}` },
        });

        setProfile(res.data);
        setAvatarUrl(localStorage.getItem('avatarUrl') || undefined);
      } catch (e) {
        setError('Error loading profile');
      }
    };
    fetchProfile();
  }, []);

  useEffect(() => {
    document.body.classList.toggle('dark-mode', darkMode);
    localStorage.setItem('darkMode', darkMode.toString());
  }, [darkMode]);

  const handleAvatarClick = () => {
    if (fileRef.current) fileRef.current.click();
  };

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (ev) => {
        const url = ev.target?.result as string;
        setAvatarUrl(url);
        localStorage.setItem('avatarUrl', url);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setMsg(null);
    setError(null);

    if (!profile.firstName?.trim() || !profile.lastName?.trim()) {
      setError('First name and Last name are required');
      return;
    }

    try {
      const token = localStorage.getItem('token');
      if (!token) throw new Error('No auth token');
      await axios.put(
        '/api/profile',
        { ...profile },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setMsg('Changes have been saved successfully');
    } catch (err) {
      setError('Error saving data');
    }
  };

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setResetMsg(null);
    setResetError(null);

    if (!resetEmail || !resetOldPassword || !resetNewPassword) {
      setResetError('All fields are required');
      return;
    }
    console.log('profile', profile);

    try {
      await axios.post('/api/reset-password', {
        email: resetEmail,
        oldPassword: resetOldPassword,
        newPassword: resetNewPassword,
      });

      setResetMsg('Password reset successfully');
      setResetEmail('');
      setResetOldPassword('');
      setResetNewPassword('');
    } catch (err) {
      setResetError('Failed to reset password');
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('userEmail');
    localStorage.removeItem('avatarUrl');
    window.location.href = '/login';
  };

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) throw new Error('No auth token');

        const decoded: any = jwtDecode(token);
        const userId = decoded.userId;

        if (!userId) throw new Error('No userId in token');
        console.log('PRAKAM USER ID', userId);

        const res = await axios.get('/api/profile', {
          headers: { Authorization: `Bearer ${token}` },
          params: { userId },
        });
        console.log('PRAKAM USER res', res);
        setProfile({
          id: res.data.id,
          email: res.data.email,
          firstName: res.data.firstName,
          lastName: res.data.lastName,
        });
        setAvatarUrl(localStorage.getItem('avatarUrl') || undefined);
        setError(null);
      } catch (error) {
        console.error('Failed to load profile:', error);
        setError('Error loading profile');
      }
    };

    fetchProfile();
  }, []);

  return (
    <Box
      sx={{
        maxWidth: 500,
        mx: 'auto',
        mt: 4,
        p: 3,
        borderRadius: 3,
        boxShadow: 3,
        bgcolor: 'background.paper',
      }}
    >
      <Stack
        direction="row"
        alignItems="center"
        spacing={2}
        sx={{ mb: 3, position: 'relative' }}
      >
        <input
          type="file"
          accept="image/*"
          style={{ display: 'none' }}
          ref={fileRef}
          onChange={handleAvatarChange}
        />
        <IconButton
          size="large"
          color="primary"
          aria-label="account"
          onClick={handleAvatarClick}
        >
          {avatarUrl ? (
            <Avatar src={avatarUrl} sx={{ width: 64, height: 64 }} />
          ) : (
            <Avatar sx={{ width: 64, height: 64 }}>
              <AccountCircleIcon fontSize="large" />
            </Avatar>
          )}
          <EditIcon
            sx={{
              position: 'absolute',
              bottom: 4,
              right: 4,
              bgcolor: 'background.paper',
              borderRadius: '50%',
              fontSize: 18,
              color: 'text.secondary',
            }}
          />
        </IconButton>
        <Box>
          <Typography variant="h6">{`${profile.firstName || ''} ${
            profile.lastName || ''
          }`}</Typography>
          <Typography variant="body2" color="text.secondary">
            {profile.email}
          </Typography>
        </Box>
        <Box flex={1} />
        <Stack alignItems="center">
          <Typography variant="body2" sx={{ fontSize: 13 }}>
            Dark&nbsp;
            <Switch
              checked={darkMode}
              onChange={() => setDarkMode((d) => !d)}
              size="small"
              inputProps={{ 'aria-label': 'Dark Mode Toggle' }}
            />
          </Typography>
        </Stack>
      </Stack>

      <form onSubmit={handleSaveProfile}>
        <TextField
          label="First Name"
          value={profile.firstName || ''}
          onChange={(e) =>
            setProfile({ ...profile, firstName: e.target.value })
          }
          fullWidth
          required
          margin="normal"
        />
        <TextField
          label="Last Name"
          value={profile.lastName || ''}
          onChange={(e) => setProfile({ ...profile, lastName: e.target.value })}
          fullWidth
          required
          margin="normal"
        />
        {msg && (
          <Alert severity="success" sx={{ mt: 2 }}>
            {msg}
          </Alert>
        )}
      </form>

      <Typography variant="h6" mb={2}>
        Reset Password with Email
      </Typography>
      <form onSubmit={handleResetPassword}>
        <TextField
          label="Email"
          value={resetEmail}
          onChange={(e) => setResetEmail(e.target.value)}
          fullWidth
          margin="normal"
        />
        <TextField
          label="Old Password"
          value={resetOldPassword}
          onChange={(e) => setResetOldPassword(e.target.value)}
          fullWidth
          margin="normal"
          type="password"
        />
        <TextField
          label="New Password"
          value={resetNewPassword}
          onChange={(e) => setResetNewPassword(e.target.value)}
          fullWidth
          margin="normal"
          type="password"
        />
        {resetMsg && (
          <Alert severity="success" sx={{ mt: 2 }}>
            {resetMsg}
          </Alert>
        )}
        {resetError && (
          <Alert severity="error" sx={{ mt: 2 }}>
            {resetError}
          </Alert>
        )}
        <Button type="submit" variant="contained" fullWidth sx={{ mt: 3 }}>
          Reset Password
        </Button>
      </form>

      <Button
        variant="outlined"
        fullWidth
        color="error"
        sx={{ mt: 2 }}
        onClick={handleLogout}
      >
        Log out
      </Button>
    </Box>
  );
}
