import React from 'react';
import { Sun, History, MapPin } from 'lucide-react';

const Home = () => (
  <div className="min-h-[calc(100vh-64px)] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
    <div className="max-w-4xl mx-auto text-center">
      <div className="bg-white/20 backdrop-blur-md p-12 rounded-2xl shadow-2xl border border-white/30">
        <div className="flex justify-center mb-8">
          <Sun className="w-24 h-24 text-yellow-300" />
        </div>
        <h1 className="text-5xl font-bold text-white mb-6">Welcome to WeatherApp</h1>
        <p className="text-xl text-white/80 mb-8 leading-relaxed">
          Get real-time weather information for any location around the world. 
          Sign up or log in to access weather data and view your search history.
        </p>
        <div className="grid md:grid-cols-3 gap-6 text-left">
          <div className="bg-white/10 p-6 rounded-xl">
            <Sun className="w-8 h-8 text-yellow-300 mb-4" />
            <h3 className="text-lg font-semibold text-white mb-2">Real-time Weather</h3>
            <p className="text-white/70">Get current weather conditions for any coordinates</p>
          </div>
          <div className="bg-white/10 p-6 rounded-xl">
            <History className="w-8 h-8 text-blue-300 mb-4" />
            <h3 className="text-lg font-semibold text-white mb-2">Search History</h3>
            <p className="text-white/70">Keep track of all your weather searches</p>
          </div>
          <div className="bg-white/10 p-6 rounded-xl">
            <MapPin className="w-8 h-8 text-green-300 mb-4" />
            <h3 className="text-lg font-semibold text-white mb-2">Location-based</h3>
            <p className="text-white/70">Use your current location or enter coordinates</p>
          </div>
        </div>
      </div>
    </div>
  </div>
);

export default Home;