import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Search, User } from 'lucide-react';

const Navbar = () => {
  // This should be replaced with actual authentication logic
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  
  useEffect(()=>{
    
        const token = localStorage.getItem('accessToken')
        if(token){
        setIsAuthenticated(token)
       }
  })

  return (
    <nav className="bg-white shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex-shrink-0 flex items-center">
            <Link to="/" className="text-2xl font-bold text-indigo-600">
              E-Shop Bot
            </Link>
          </div>
          <div className="flex items-center space-x-4">
            {isAuthenticated ? (
              <>
                <div className="relative">
                  <input
                    type="text"
                    placeholder="Search..."
                    className="bg-gray-100 px-4 py-2 pr-10 rounded-full focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                  <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                </div>
                <Link to="/profile" className="text-gray-700 hover:text-indigo-600">
                  <User size={24} />
                </Link>
              </>
            ) : (
              <>
                <Link to="/login" className="text-gray-700 hover:text-indigo-600">
                  Login
                </Link>
                <Link
                  to="/register"
                  className="bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700 transition-colors"
                >
                  Register
                </Link>
              </>
            )}
            <Link to="/history" className="text-gray-700 hover:text-indigo-600">
              History
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
