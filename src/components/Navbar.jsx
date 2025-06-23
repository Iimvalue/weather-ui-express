import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router';
import { Sun, History, User, LogOut, Menu, X, Cloud } from 'lucide-react';

const Navbar = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [user, setUser] = useState(null); 
  const location = useLocation();
  const navigate = useNavigate();

  const currentPage = location.pathname;

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const handleLogout = () => {
    setUser(null);
    localStorage.removeItem('user');
    localStorage.removeItem('token');
    setIsMobileMenuOpen(false);
    navigate('/');
  };

  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false);
  };

  React.useEffect(() => {
    const savedUser = localStorage.getItem('user');
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }
  }, []);

  return (
    <nav className="bg-white/20 backdrop-blur-md border-b border-white/30 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link
              to="/"
              className="flex items-center space-x-2 text-white hover:text-white/80 transition-colors"
            >
              <Cloud className="w-8 h-8 text-white" />
              <h1 className="text-2xl font-bold">WeatherApp</h1>
            </Link>
          </div>

          <div className="hidden md:flex items-center space-x-4">
            {user ? (
              <>
                <Link
                  to="/weather"
                  className={`flex items-center px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                    currentPage === '/weather' 
                      ? 'bg-white/30 text-white shadow-lg' 
                      : 'text-white/80 hover:text-white hover:bg-white/20'
                  }`}
                >
                  <Sun className="w-4 h-4 mr-2" />
                  Weather
                </Link>
                
                <Link
                  to="/history"
                  className={`flex items-center px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                    currentPage === '/history' 
                      ? 'bg-white/30 text-white shadow-lg' 
                      : 'text-white/80 hover:text-white hover:bg-white/20'
                  }`}
                >
                  <History className="w-4 h-4 mr-2" />
                  History
                </Link>

                <div className="flex items-center text-white/80 px-3 py-2 bg-white/10 rounded-md">
                  <User className="w-4 h-4 mr-2" />
                  <span className="max-w-32 truncate text-sm">{user.email}</span>
                </div>

                <button
                  onClick={handleLogout}
                  className="flex items-center px-3 py-2 rounded-md text-sm font-medium text-white/80 hover:text-white hover:bg-red-500/20 transition-colors"
                >
                  <LogOut className="w-4 h-4 mr-2" />
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link
                  to="/"
                  className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                    currentPage === '/' 
                      ? 'bg-white/30 text-white shadow-lg' 
                      : 'text-white/80 hover:text-white hover:bg-white/20'
                  }`}
                >
                  Home
                </Link>
                
                <Link
                  to="/login"
                  className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                    currentPage === '/login' 
                      ? 'bg-white text-blue-600 shadow-lg' 
                      : 'text-white hover:bg-white/20'
                  }`}
                >
                  Login
                </Link>
                
                <Link
                  to="/register"
                  className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                    currentPage === '/register' 
                      ? 'bg-white text-blue-600 shadow-lg' 
                      : 'text-white hover:bg-white/20'
                  }`}
                >
                  Register
                </Link>
              </>
            )}
          </div>

          {/* Mobile Menu */}
          <div className="md:hidden flex items-center">
            <button
              onClick={toggleMobileMenu}
              className="text-white hover:text-white/80 focus:outline-none focus:text-white transition-colors p-2"
              aria-label="Toggle mobile menu"
            >
              {isMobileMenuOpen ? (
                <X className="w-6 h-6" />
              ) : (
                <Menu className="w-6 h-6" />
              )}
            </button>
          </div>
        </div>

        {isMobileMenuOpen && (
          <div className="md:hidden border-t border-white/20">
            <div className="px-2 pt-2 pb-3 space-y-1 bg-white/10 backdrop-blur-md rounded-b-lg mt-2">
              {user ? (
                <>
                  <div className="flex items-center px-3 py-2 text-white/80 border-b border-white/20 mb-2">
                    <User className="w-4 h-4 mr-2" />
                    <span className="text-sm font-medium">{user.email}</span>
                  </div>

                  <Link
                    to="/weather"
                    onClick={closeMobileMenu}
                    className={`w-full text-left flex items-center px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                      currentPage === '/weather' 
                        ? 'bg-white/30 text-white' 
                        : 'text-white/80 hover:text-white hover:bg-white/20'
                    }`}
                  >
                    <Sun className="w-4 h-4 mr-3" />
                    Weather
                  </Link>
                  
                  <Link
                    to="/history"
                    onClick={closeMobileMenu}
                    className={`w-full text-left flex items-center px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                      currentPage === '/history' 
                        ? 'bg-white/30 text-white' 
                        : 'text-white/80 hover:text-white hover:bg-white/20'
                    }`}
                  >
                    <History className="w-4 h-4 mr-3" />
                    History
                  </Link>

                  <button
                    onClick={handleLogout}
                    className="w-full text-left flex items-center px-3 py-2 rounded-md text-sm font-medium text-white/80 hover:text-white hover:bg-red-500/20 transition-colors border-t border-white/20 mt-2 pt-3"
                  >
                    <LogOut className="w-4 h-4 mr-3" />
                    Logout
                  </button>
                </>
              ) : (
                <>
                  <Link
                    to="/"
                    onClick={closeMobileMenu}
                    className={`w-full text-left px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                      currentPage === '/' 
                        ? 'bg-white/30 text-white' 
                        : 'text-white/80 hover:text-white hover:bg-white/20'
                    }`}
                  >
                    Home
                  </Link>
                  
                  <Link
                    to="/login"
                    onClick={closeMobileMenu}
                    className={`w-full text-left px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                      currentPage === '/login' 
                        ? 'bg-white text-blue-600' 
                        : 'text-white/80 hover:text-white hover:bg-white/20'
                    }`}
                  >
                    Login
                  </Link>
                  
                  <Link
                    to="/register"
                    onClick={closeMobileMenu}
                    className={`w-full text-left px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                      currentPage === '/register' 
                        ? 'bg-white text-blue-600' 
                        : 'text-white/80 hover:text-white hover:bg-white/20'
                    }`}
                  >
                    Register
                  </Link>
                </>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;