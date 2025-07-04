import React, { useState } from 'react';
import { useNavigate } from 'react-router';
import { Alert, AlertDescription } from '../components/ui/alert';

const API_BASE = 'https://weather-api-server-vq8x.onrender.com';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const signIn = async (email, password) => {
    const response = await fetch(`${API_BASE}/auth/signin`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password })
    });
    return response.json();
  };

  const handleSubmit = async () => {
    setLoading(true);
    setError('');
    
    try {
      const data = await signIn(email, password);
      
      if (data.status === 'success') {
        localStorage.setItem('user', JSON.stringify(data.data.user));
        localStorage.setItem('token', data.data.accessToken);
        
        navigate('/weather');
        
        window.location.reload();
      } else {
        setError(data.message || 'Login failed');
      }
    } catch (err) {
      setError('Network error. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[calc(100vh-64px)] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div className="bg-white/20 backdrop-blur-md p-8 rounded-2xl shadow-2xl border border-white/30">
          <div className="text-center">
            <h2 className="text-3xl font-bold text-white mb-8">Sign In</h2>
          </div>
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-white/90 mb-2">
                Email
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSubmit()}
                required
                className="w-full px-4 py-3 bg-white/20 border border-white/30 rounded-lg text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-white/50 focus:border-transparent"
                placeholder="Enter your email"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-white/90 mb-2">
                Password
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSubmit()}
                required
                className="w-full px-4 py-3 bg-white/20 border border-white/30 rounded-lg text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-white/50 focus:border-transparent"
                placeholder="Enter your password"
              />
            </div>
            {error && (
              <Alert className="bg-red-500/20 border-red-500/50">
                <AlertDescription className="text-white">
                  {error}
                </AlertDescription>
              </Alert>
            )}
            <button
              type="button"
              onClick={handleSubmit}
              disabled={loading}
              className="w-full bg-white/30 hover:bg-white/40 text-white font-medium py-3 px-4 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Loading...' : 'Sign In'}
            </button>
            <div className="text-center">
              <p className="text-white/70 text-sm">
                Don't have an account?{' '}
                <button
                  onClick={() => navigate('/register')}
                  className="text-white hover:text-white/80 underline"
                >
                  Sign up here
                </button>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;