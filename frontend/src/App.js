import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './context/AuthContext';
import Dashboard from './pages/Dashboard';
import Login from './pages/Login';
import Register from './pages/Register';
import Navbar from './components/layout/Navbar';
import { ErrorBoundary } from 'react-error-boundary';
import { useEffect, useState } from 'react';

// Fallback UI for errors
function ErrorFallback({ error }) {
  return (
    <div style={{ 
      padding: '2rem',
      background: '#ffebee',
      color: '#d32f2f',
      border: '1px solid #ef9a9a',
      borderRadius: '4px'
    }}>
      <h2>Something went wrong:</h2>
      <pre>{error.message}</pre>
    </div>
  );
}

// Loading component
function AppLoader() {
  return (
    <div style={{
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      height: '100vh',
      fontSize: '1.5rem'
    }}>
      Loading TaskFlow App...
    </div>
  );
}

function App() {
  const { isAuthenticated } = useAuth();
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) {
    return <AppLoader />;
  }

  return (
    <ErrorBoundary FallbackComponent={ErrorFallback}>
      <Router>
        <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
          <Navbar />
          <main style={{ flex: 1, padding: '2rem' }}>
            <Routes>
              {/* Public routes - redirect to dashboard if already authenticated */}
              <Route 
                path="/login" 
                element={!isAuthenticated ? <Login /> : <Navigate to="/" replace />} 
              />
              <Route 
                path="/register" 
                element={!isAuthenticated ? <Register /> : <Navigate to="/" replace />} 
              />
              
              {/* Protected route - redirect to login if not authenticated */}
              <Route 
                path="/" 
                element={isAuthenticated ? <Dashboard /> : <Navigate to="/login" replace />}
              />
              
              {/* Catch-all route with proper redirect */}
              <Route 
                path="*" 
                element={<Navigate to={isAuthenticated ? "/" : "/login"} replace />} 
              />
            </Routes>
          </main>
        </div>
      </Router>
    </ErrorBoundary>
  );
}

export default App;