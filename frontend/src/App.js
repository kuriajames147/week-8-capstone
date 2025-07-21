import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './context/AuthContext';
import Dashboard from './pages/Dashboard';
import Login from './pages/Login';
import Register from './pages/Register';
import Navbar from './components/layout/Navbar';
import { ErrorBoundary } from 'react-error-boundary';
import { useEffect, useState } from 'react';
import { Toaster } from 'react-hot-toast';
import NotFound from './pages/NotFound';
import TaskDetail from './pages/TaskDetail';
import Profile from './pages/Profile';

// Fallback UI for errors
function ErrorFallback({ error, resetErrorBoundary }) {
  return (
    <div role="alert" style={{ 
      padding: '2rem',
      background: '#ffebee',
      color: '#d32f2f',
      border: '1px solid #ef9a9a',
      borderRadius: '4px',
      maxWidth: '600px',
      margin: '2rem auto'
    }}>
      <h2 style={{ marginTop: 0 }}>Something went wrong:</h2>
      <pre style={{ whiteSpace: 'pre-wrap' }}>{error.message}</pre>
      <button 
        onClick={resetErrorBoundary}
        style={{
          padding: '0.5rem 1rem',
          background: '#d32f2f',
          color: 'white',
          border: 'none',
          borderRadius: '4px',
          cursor: 'pointer',
          marginTop: '1rem'
        }}
      >
        Try again
      </button>
    </div>
  );
}

// Loading component with animation
function AppLoader() {
  return (
    <div style={{
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      height: '100vh',
      fontSize: '1.5rem'
    }}>
      <div style={{ 
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: '1rem'
      }}>
        <div className="spinner" style={{
          width: '50px',
          height: '50px',
          border: '5px solid #f3f3f3',
          borderTop: '5px solid #3498db',
          borderRadius: '50%',
          animation: 'spin 1s linear infinite'
        }} />
        <style>{`
          @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }
        `}</style>
        Loading TaskFlow...
      </div>
    </div>
  );
}

function App() {
  const { isAuthenticated, isLoading } = useAuth();
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
    return () => setIsMounted(false);
  }, []);

  if (!isMounted || isLoading) {
    return <AppLoader />;
  }

  return (
    <ErrorBoundary 
      FallbackComponent={ErrorFallback}
      onReset={() => window.location.reload()}
    >
      <Router>
        <div style={{ 
          minHeight: '100vh', 
          display: 'flex', 
          flexDirection: 'column',
          backgroundColor: '#f5f5f5'
        }}>
          <Navbar />
          <main style={{ 
            flex: 1, 
            padding: '2rem',
            maxWidth: '1200px',
            width: '100%',
            margin: '0 auto'
          }}>
            <Routes>
              {/* Public routes */}
              <Route 
                path="/login" 
                element={!isAuthenticated ? <Login /> : <Navigate to="/" replace />} 
              />
              <Route 
                path="/register" 
                element={!isAuthenticated ? <Register /> : <Navigate to="/" replace />} 
              />
              
              {/* Protected routes */}
              <Route 
                path="/" 
                element={isAuthenticated ? <Dashboard /> : <Navigate to="/login" replace />}
              />
              <Route 
                path="/tasks/:id" 
                element={isAuthenticated ? <TaskDetail /> : <Navigate to="/login" replace />}
              />
              <Route 
                path="/profile" 
                element={isAuthenticated ? <Profile /> : <Navigate to="/login" replace />}
              />
              
              {/* 404 page */}
              <Route 
                path="/404" 
                element={<NotFound />}
              />
              
              {/* Catch-all route */}
              <Route 
                path="*" 
                element={<Navigate to={isAuthenticated ? "/404" : "/login"} replace />} 
              />
            </Routes>
          </main>
        </div>
        <Toaster 
          position="top-right"
          toastOptions={{
            duration: 4000,
            style: {
              background: '#363636',
              color: '#fff',
            },
            success: {
              duration: 3000,
              theme: {
                primary: 'green',
                secondary: 'black',
              },
            },
            error: {
              duration: 5000,
            },
          }}
        />
      </Router>
    </ErrorBoundary>
  );
}

export default App;