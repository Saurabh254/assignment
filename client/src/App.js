import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, Link as RouterLink } from 'react-router-dom';
import { ThemeProvider, createTheme, CssBaseline } from '@mui/material';
import { AuthProvider, useAuth } from './context/AuthContext.js';
import Login from './components/Login.js';
import Register from './components/Register.js';
import CreateExam from './components/CreateExam.js';
import Results from './components/Results.js';
import Dashboard from './components/Dashboard';
import { AppBar, Toolbar, Typography, Button, Box, Container } from '@mui/material';
import SchoolIcon from '@mui/icons-material/School';


const theme = createTheme({
  palette: {
    primary: {
      main: '#3f51b5',
    },
    secondary: {
      main: '#f50057',
    },
    background: {
      default: '#f5f5f5',
    },
  },
  typography: {
    fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
    h1: {
      fontWeight: 500,
    },
    h2: {
      fontWeight: 500,
    },
    h3: {
      fontWeight: 500,
    },
    h4: {
      fontWeight: 500,
    },
    h5: {
      fontWeight: 500,
    },
    h6: {
      fontWeight: 500,
    },
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 8,
          textTransform: 'none',
          fontWeight: 500,
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          borderRadius: 12,
          boxShadow: '0 4px 12px rgba(0,0,0,0.05)',
        },
      },
    },
  },
});

const PrivateRoute = ({ children, roles }) => {
  const { user } = useAuth();

  if (!user) {
    return <Navigate to="/login" />;
  }

  if (roles && !roles.includes(user.role)) {
    return <Navigate to="/dashboard" />;
  }

  return <>{children}</>;
};

const Navigation = () => {
  const { user, logout } = useAuth();

  if (!user) return null;

  return (
    <AppBar position="static" elevation={0} sx={{ backgroundColor: 'white', color: 'text.primary' }}>
      <Container maxWidth="lg">
        <Toolbar disableGutters>
          <SchoolIcon sx={{ display: 'flex', mr: 1, color: 'primary.main' }} />
          <Typography
            variant="h6"
            noWrap
            component={RouterLink}
            to="/dashboard"
            sx={{
              mr: 2,
              display: 'flex',
              fontFamily: 'monospace',
              fontWeight: 700,
              letterSpacing: '.2rem',
              color: 'primary.main',
              textDecoration: 'none',
            }}
          >
            EXAM SYSTEM
          </Typography>
          <Box sx={{ flexGrow: 1, display: 'flex', justifyContent: 'center' }}>
            <Button
              component={RouterLink}
              to="/dashboard"
              sx={{ my: 2, color: 'text.primary', display: 'block', mx: 1 }}
            >
              Dashboard
            </Button>
            {user.role === 'teacher' && (
              <>
                <Button
                  component={RouterLink}
                  to="/create-exam"
                  sx={{ my: 2, color: 'text.primary', display: 'block', mx: 1 }}
                >
                  Create Exam
                </Button>

              </>
            )}
          </Box>
          <Box sx={{ flexGrow: 0 }}>
            <Typography variant="body2" sx={{ mr: 2, display: 'inline' }}>
              {user.name} ({user.role})
            </Typography>
            <Button
              variant="outlined"
              color="primary"
              onClick={logout}
              sx={{ borderRadius: 20 }}
            >
              Logout
            </Button>
          </Box>
        </Toolbar>
      </Container>
    </AppBar>
  );
};

const App = () => {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <AuthProvider>
        <Router>
          <Navigation />
          <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
            <Routes>
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route
                path="/dashboard"
                element={
                  <PrivateRoute>
                    <Dashboard />
                  </PrivateRoute>
                }
              />
              <Route
                path="/create-exam"
                element={
                  <PrivateRoute roles={['teacher']}>
                    <CreateExam />
                  </PrivateRoute>
                }
              />


              <Route
                path="/results/:resultId"
                element={
                  <PrivateRoute>
                    <Results />
                  </PrivateRoute>
                }
              />
              <Route path="/" element={<Navigate to="/dashboard" />} />
            </Routes>
          </Container>
        </Router>
      </AuthProvider>
    </ThemeProvider>
  );
};

export default App;
