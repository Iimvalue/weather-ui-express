import React, { useState, useEffect } from 'react';
import { Outlet } from 'react-router';
import Navbar from '../components/Navbar';

const getWeatherBackground = (description) => {
  const desc = description?.toLowerCase() || '';
  
  if (desc.includes('clear') || desc.includes('sunny')) {
    return 'bg-gradient-to-br from-blue-400 via-blue-500 to-blue-600';
  } else if (desc.includes('cloud')) {
    return 'bg-gradient-to-br from-gray-400 via-gray-500 to-gray-600';
  } else if (desc.includes('rain') || desc.includes('drizzle')) {
    return 'bg-gradient-to-br from-blue-700 via-blue-800 to-gray-800';
  } else if (desc.includes('snow')) {
    return 'bg-gradient-to-br from-blue-100 via-blue-200 to-blue-300';
  } else if (desc.includes('thunderstorm')) {
    return 'bg-gradient-to-br from-purple-800 via-gray-800 to-black';
  } else if (desc.includes('mist') || desc.includes('fog')) {
    return 'bg-gradient-to-br from-gray-300 via-gray-400 to-gray-500';
  }
  return 'bg-gradient-to-br from-blue-400 via-blue-500 to-blue-600';
};

const Layout = () => {
  const [weatherDescription, setWeatherDescription] = useState('clear sky');

  useEffect(() => {
    const handleWeatherUpdate = (event) => {
      if (event.detail && event.detail.description) {
        setWeatherDescription(event.detail.description);
      }
    };

    window.addEventListener('weatherUpdate', handleWeatherUpdate);

    return () => {
      window.removeEventListener('weatherUpdate', handleWeatherUpdate);
    };
  }, []);

  const backgroundClass = getWeatherBackground(weatherDescription);

  return (
    <div className={`min-h-screen w-full transition-all duration-1000 ${backgroundClass}`}>
      <Navbar />
      <main className="w-full">
        <Outlet context={{ setWeatherDescription }} />
      </main>
    </div>
  );
};

export default Layout;