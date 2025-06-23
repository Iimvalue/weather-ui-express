import React, { useState, useEffect } from 'react';
import { useNavigate, useOutletContext } from 'react-router';
import { Cloud, Sun, CloudRain, CloudSnow, Wind, Eye, Droplets, Thermometer, Clock, MapPin } from 'lucide-react';
import { Alert, AlertDescription } from '../components/ui/alert';

const API_BASE = 'https://weather-api-server-vq8x.onrender.com';

const getWeatherIcon = (description) => {
  const desc = description?.toLowerCase() || '';
  
  if (desc.includes('clear') || desc.includes('sunny')) {
    return <Sun className="w-16 h-16 text-yellow-300" />;
  } else if (desc.includes('cloud')) {
    return <Cloud className="w-16 h-16 text-white" />;
  } else if (desc.includes('rain') || desc.includes('drizzle')) {
    return <CloudRain className="w-16 h-16 text-blue-300" />;
  } else if (desc.includes('snow')) {
    return <CloudSnow className="w-16 h-16 text-blue-100" />;
  } else if (desc.includes('thunderstorm')) {
    return <CloudRain className="w-16 h-16 text-purple-300" />;
  } else if (desc.includes('mist') || desc.includes('fog')) {
    return <Wind className="w-16 h-16 text-gray-300" />;
  }
  return <Sun className="w-16 h-16 text-yellow-300" />;
};

const getWeather = async (lat, lon, token) => {
  const response = await fetch(`${API_BASE}/weather?lat=${lat}&lon=${lon}`, {
    headers: { 'Authorization': `Bearer ${token}` }
  });
  return response.json();
};

const formatToTwoDecimals = (value) => {
  if (value === '') return '';
  const num = parseFloat(value);
  if (isNaN(num)) return '';
  return num.toFixed(2);
};

const validateDecimalInput = (value) => {
  if (value === '') return true;
  
  if (value === '-') return true;
  
  const regex = /^-?\d*\.?\d{0,2}$/;
  return regex.test(value);
};

const Weather = () => {
  const [weather, setWeather] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [location, setLocation] = useState({ lat: '', lon: '' });
  const navigate = useNavigate();
  const { setWeatherDescription } = useOutletContext() || {};

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/login');
    }
  }, [navigate]);

  const handleLatitudeChange = (e) => {
    const value = e.target.value;
    if (validateDecimalInput(value)) {
      setLocation({ ...location, lat: value });
    }
  };

  const handleLongitudeChange = (e) => {
    const value = e.target.value;
    if (validateDecimalInput(value)) {
      setLocation({ ...location, lon: value });
    }
  };

  const handleLatitudeBlur = (e) => {
    const value = e.target.value;
    if (value !== '' && value !== '-') {
      const formattedValue = formatToTwoDecimals(value);
      setLocation({ ...location, lat: formattedValue });
    }
  };

  const handleLongitudeBlur = (e) => {
    const value = e.target.value;
    if (value !== '' && value !== '-') {
      const formattedValue = formatToTwoDecimals(value);
      setLocation({ ...location, lon: formattedValue });
    }
  };

  const getCurrentLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setLocation({
            lat: position.coords.latitude.toFixed(2),
            lon: position.coords.longitude.toFixed(2)
          });
        },
        (error) => {
          setError('Failed to get current location');
        }
      );
    } else {
      setError('Geolocation is not supported by this browser');
    }
  };

  const fetchWeather = async () => {
    if (!location.lat || !location.lon) {
      setError('Please enter coordinates or get current location');
      return;
    }

    const lat = parseFloat(location.lat);
    const lon = parseFloat(location.lon);
    
    if (lat < -90 || lat > 90) {
      setError('Latitude must be between -90 and 90');
      return;
    }
    
    if (lon < -180 || lon > 180) {
      setError('Longitude must be between -180 and 180');
      return;
    }

    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/login');
      return;
    }

    setLoading(true);
    setError('');
    
    try {
      const data = await getWeather(location.lat, location.lon, token);
      setWeather(data);
      
      if (setWeatherDescription) {
        setWeatherDescription(data.description);
      }
      
      window.dispatchEvent(new CustomEvent('weatherUpdate', {
        detail: { description: data.description }
      }));
      
    } catch (err) {
      setError('Failed to fetch weather data');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[calc(100vh-64px)] py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white/20 backdrop-blur-md p-8 rounded-2xl shadow-2xl border border-white/30 mb-8">
          <h2 className="text-3xl font-bold text-white mb-8 text-center">Weather Forecast</h2>
          
          <div className="grid md:grid-cols-2 gap-4 mb-6">
            <div>
              <label className="block text-sm font-medium text-white/90 mb-2">
                Latitude
                <span className="text-white/60 text-xs ml-2">(-90.00 to 90.00)</span>
              </label>
              <input
                type="text"
                value={location.lat}
                onChange={handleLatitudeChange}
                onBlur={handleLatitudeBlur}
                className="w-full px-4 py-3 bg-white/20 border border-white/30 rounded-lg text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-white/50"
                placeholder="24.71"
                inputMode="decimal"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-white/90 mb-2">
                Longitude
                <span className="text-white/60 text-xs ml-2">(-180.00 to 180.00)</span>
              </label>
              <input
                type="text"
                value={location.lon}
                onChange={handleLongitudeChange}
                onBlur={handleLongitudeBlur}
                className="w-full px-4 py-3 bg-white/20 border border-white/30 rounded-lg text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-white/50"
                placeholder="46.68"
                inputMode="decimal"
              />
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 mb-6">
            <button
              onClick={getCurrentLocation}
              className="flex-1 bg-white/30 hover:bg-white/40 text-white font-medium py-3 px-4 rounded-lg transition-colors flex items-center justify-center"
            >
              <MapPin className="w-4 h-4 mr-2" />
              Get Current Location
            </button>
            <button
              onClick={fetchWeather}
              disabled={loading}
              className="flex-1 bg-white/30 hover:bg-white/40 text-white font-medium py-3 px-4 rounded-lg transition-colors disabled:opacity-50 flex items-center justify-center"
            >
              {loading ? (
                'Loading...'
              ) : (
                <>
                  <Eye className="w-4 h-4 mr-2" />
                  Get Weather
                </>
              )}
            </button>
          </div>

          {error && (
            <Alert className="bg-red-500/20 border-red-500/50 mb-6">
              <AlertDescription className="text-white">{error}</AlertDescription>
            </Alert>
          )}
        </div>

        {weather && (
          <div className="bg-white/20 backdrop-blur-md p-8 rounded-2xl shadow-2xl border border-white/30">
            <div className="text-center mb-8">
              <div className="flex justify-center mb-4">
                {getWeatherIcon(weather.description)}
              </div>
              <h3 className="text-4xl font-bold text-white mb-2 drop-shadow-lg">{weather.tempC}°C</h3>
              <p className="text-xl text-white/95 capitalize font-medium drop-shadow-md bg-black/20 px-4 py-2 rounded-lg backdrop-blur-sm">
                {weather.description}
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              <div className="bg-white/10 p-6 rounded-xl backdrop-blur-md border border-white/20">
                <div className="flex items-center mb-4">
                  <Droplets className="w-6 h-6 text-blue-300 mr-3 drop-shadow-md" />
                  <span className="text-white font-medium drop-shadow-sm">Humidity</span>
                </div>
                <p className="text-2xl font-bold text-white drop-shadow-md">{weather.humidity}%</p>
              </div>

              <div className="bg-white/10 p-6 rounded-xl backdrop-blur-md border border-white/20">
                <div className="flex items-center mb-4">
                  <MapPin className="w-6 h-6 text-green-300 mr-3 drop-shadow-md" />
                  <span className="text-white font-medium drop-shadow-sm">Coordinates</span>
                </div>
                <p className="text-lg text-white drop-shadow-sm">
                  {weather.coordinates.lat}, {weather.coordinates.lon}
                </p>
              </div>

              <div className="bg-white/10 p-6 rounded-xl backdrop-blur-md border border-white/20">
                <div className="flex items-center mb-4">
                  <Cloud className="w-6 h-6 text-gray-300 mr-3 drop-shadow-md" />
                  <span className="text-white font-medium drop-shadow-sm">Source</span>
                </div>
                <p className="text-lg text-white capitalize drop-shadow-sm">{weather.source}</p>
              </div>

              <div className="bg-white/10 p-6 rounded-xl backdrop-blur-md border border-white/20">
                <div className="flex items-center mb-4">
                  <Clock className="w-6 h-6 text-yellow-300 mr-3 drop-shadow-md" />
                  <span className="text-white font-medium drop-shadow-sm">Fetched At</span>
                </div>
                <p className="text-lg text-white drop-shadow-sm">
                  {new Date(weather.fetchedAt).toLocaleString()}
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Weather;