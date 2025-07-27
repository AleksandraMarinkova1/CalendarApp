import React, { useState, useEffect } from 'react';
import { Routes, Route, Link, Navigate, useNavigate } from 'react-router-dom';
import RegisterForm from './components/RegisterForm';
import LoginForm from './components/LoginForm';
import CalendarPage from './components/CalendarPage';
import Profile from './components/Profile'; // Еве тука го импортируваш
import {
  AppBar,
  Toolbar,
  Button,
  Container,
  Typography,
  Menu,
  MenuItem,
  IconButton,
  Avatar,
  Switch,
  Box,
} from '@mui/material';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';

interface User {
  email: string;
  avatarUrl?: string;
}

export function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [darkMode, setDarkMode] = useState(
    () => localStorage.getItem('darkMode') === 'true'
  );

  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      setIsAuthenticated(true);
      loadUser();
    }
    document.body.classList.toggle('dark-mode', darkMode);
  }, []);

  useEffect(() => {
    document.body.classList.toggle('dark-mode', darkMode);
    localStorage.setItem('darkMode', darkMode.toString());
  }, [darkMode]);

  const loadUser = () => {
    const storedEmail = localStorage.getItem('userEmail');
    const avatarUrl = localStorage.getItem('avatarUrl');
    if (storedEmail) {
      setUser({ email: storedEmail, avatarUrl: avatarUrl || undefined });
    } else {
      setUser(null);
    }
  };

  const handleLoginSuccess = (email: string) => {
    setIsAuthenticated(true);
    setUser({ email });
    localStorage.setItem('userEmail', email);
    navigate('/calendar', { replace: true });
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    setUser(null);
    localStorage.removeItem('token');
    localStorage.removeItem('userEmail');
    localStorage.removeItem('avatarUrl');
    handleMenuClose();
    navigate('/login', { replace: true });
  };

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (ev) => {
        const url = ev.target?.result as string;
        setUser((u) => (u ? { ...u, avatarUrl: url } : null));
        localStorage.setItem('avatarUrl', url);
      };
      reader.readAsDataURL(file);
    }
    handleMenuClose();
  };

  const handleMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };
  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  return (
    <>
      <AppBar position="static">
        <Toolbar>
          <Button color="inherit" component={Link} to="/">
            Home
          </Button>
          {!isAuthenticated && (
            <>
              <Button color="inherit" component={Link} to="/register">
                Sign Up
              </Button>
              <Button color="inherit" component={Link} to="/login">
                Login
              </Button>
            </>
          )}

          {isAuthenticated && (
            <>
              <Button color="inherit" component={Link} to="/calendar">
                Calendar
              </Button>
              <IconButton
                size="large"
                color="inherit"
                aria-label="profile"
                component={Link}
                to="/profile" // Линк до Profile страната!
                sx={{ ml: 1 }}
              >
                {user?.avatarUrl ? (
                  <Avatar src={user.avatarUrl} />
                ) : (
                  <AccountCircleIcon />
                )}
              </IconButton>
            </>
          )}
        </Toolbar>
      </AppBar>

      <Container maxWidth="sm" sx={{ mt: 4 }}>
        <Routes>
          <Route path="/" element={<div>Welcome to Calendar App 👋</div>} />
          <Route path="/register" element={<RegisterForm />} />
          <Route
            path="/login"
            element={
              <LoginForm
                onLoginSuccess={(email) => handleLoginSuccess(email)}
              />
            }
          />
          <Route
            path="/calendar"
            element={
              isAuthenticated ? (
                <CalendarPage />
              ) : (
                <Navigate to="/login" replace />
              )
            }
          />
          <Route
            path="/profile"
            element={
              isAuthenticated ? <Profile /> : <Navigate to="/login" replace />
            }
          />
          <Route
            path="*"
            element={
              isAuthenticated ? (
                <Navigate to="/calendar" replace />
              ) : (
                <Navigate to="/login" replace />
              )
            }
          />
        </Routes>
      </Container>
    </>
  );
}

export default App;
