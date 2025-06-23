import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router';
import { History, Clock, MapPin, Thermometer, Cloud, Eye } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';

const API_BASE = 'https://weather-api-server-vq8x.onrender.com';

const getHistory = async (token, skip = 0, limit = 10) => {
  const response = await fetch(`${API_BASE}/history?skip=${skip}&limit=${limit}&sort=-requestedAt`, {
    headers: { 'Authorization': `Bearer ${token}` }
  });
  return response.json();
};

const HistoryPage = () => {
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [pagination, setPagination] = useState({ skip: 0, limit: 10 });
  const [hasMore, setHasMore] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/login');
      return;
    }
    fetchHistory(true);
  }, [navigate]);

  const fetchHistory = async (reset = false) => {
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/login');
      return;
    }

    setLoading(true);
    setError('');
    
    try {
      const currentSkip = reset ? 0 : pagination.skip;
      const data = await getHistory(token, currentSkip, pagination.limit);
      
      if (reset) {
        setHistory(data);
        setPagination({ skip: 0, limit: 10 });
      } else {
        setHistory(prev => [...prev, ...data]);
      }
      
      setHasMore(data.length === pagination.limit);
      
    } catch (err) {
      if (err.message?.includes('401') || err.message?.includes('unauthorized')) {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        navigate('/login');
      } else {
        setError('Failed to fetch history');
      }
    } finally {
      setLoading(false);
    }
  };

  const loadMore = () => {
    setPagination(prev => ({ ...prev, skip: prev.skip + prev.limit }));
  };

  useEffect(() => {
    if (pagination.skip > 0) {
      fetchHistory(false);
    }
  }, [pagination.skip]);

  return (
    <div className="min-h-[calc(100vh-64px)] py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        <div className="bg-white/20 backdrop-blur-md p-8 rounded-2xl shadow-2xl border border-white/30 mb-8">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-3xl font-bold text-white">Weather History</h2>
            <button
              onClick={() => fetchHistory(true)}
              disabled={loading}
              className="bg-white/30 hover:bg-white/40 text-white font-medium py-2 px-4 rounded-lg transition-colors disabled:opacity-50"
            >
              {loading ? 'Loading...' : 'Refresh'}
            </button>
          </div>

          {error && (
            <Alert className="bg-red-500/20 border-red-500/50 mb-6">
              <AlertDescription className="text-white">{error}</AlertDescription>
            </Alert>
          )}

          {history.length === 0 && !loading ? (
            <div className="text-center py-12">
              <History className="w-16 h-16 text-white/50 mx-auto mb-4" />
              <p className="text-xl text-white/70">No weather history found</p>
              <p className="text-sm text-white/50 mt-2">Search for weather data to see your history here</p>
              <button
                onClick={() => navigate('/weather')}
                className="mt-4 bg-white/30 hover:bg-white/40 text-white font-medium py-2 px-4 rounded-lg transition-colors"
              >
                Get Weather Data
              </button>
            </div>
          ) : (
            <>
              <div className="space-y-4 mb-6">
                {history.map((item, index) => (
                  <div key={`${item.lat}-${item.lon}-${item.requestedAt}-${index}`} className="bg-white/10 p-6 rounded-xl">
                    <div className="flex flex-col md:flex-row md:items-center justify-between mb-4">
                      <div className="flex items-center mb-2 md:mb-0">
                        <MapPin className="w-5 h-5 text-green-300 mr-2" />
                        <span className="text-white font-medium">
                          {item.lat}, {item.lon}
                        </span>
                      </div>
                      <div className="flex items-center">
                        <Clock className="w-4 h-4 text-yellow-300 mr-2" />
                        <span className="text-white/80 text-sm">
                          {new Date(item.requestedAt).toLocaleString()}
                        </span>
                      </div>
                    </div>
                    
                    <div className="grid md:grid-cols-3 gap-4">
                      <div className="flex items-center">
                        <Thermometer className="w-5 h-5 text-red-300 mr-2" />
                        <span className="text-white">
                          {item.weather.tempC}°C
                        </span>
                      </div>
                      <div className="flex items-center">
                        <Cloud className="w-5 h-5 text-blue-300 mr-2" />
                        <span className="text-white capitalize">
                          {item.weather.description}
                        </span>
                      </div>
                      <div className="flex items-center">
                        <Eye className="w-5 h-5 text-purple-300 mr-2" />
                        <span className="text-white/80 text-sm">
                          Source: {item.weather.source}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              
              {hasMore && (
                <div className="text-center">
                  <button
                    onClick={loadMore}
                    disabled={loading}
                    className="bg-white/30 hover:bg-white/40 text-white font-medium py-2 px-6 rounded-lg transition-colors disabled:opacity-50"
                  >
                    {loading ? 'Loading...' : 'Load More'}
                  </button>
                </div>
              )}
              
              {!hasMore && history.length > 0 && (
                <div className="text-center">
                  <p className="text-white/60 text-sm">No more history to load</p>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default HistoryPage;