import React from 'react';
import { FaExclamationTriangle, FaHome } from 'react-icons/fa';
import { Link } from 'react-router-dom';

const NotFound = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 flex items-center justify-center px-4">
      <div className="max-w-md w-full bg-gray-800 rounded-lg shadow-xl p-8 text-center">
        <div className="flex justify-center mb-6">
          <div className="relative">
            <div className="absolute inset-0 bg-red-500 rounded-full opacity-75 animate-ping"></div>
            <FaExclamationTriangle className="text-red-500 text-5xl relative z-10" />
          </div>
        </div>
        
        <h1 className="text-4xl font-bold text-white mb-2">404</h1>
        <h2 className="text-2xl font-semibold text-gray-200 mb-4">Page Not Found</h2>
        
        <p className="text-gray-400 mb-8">
          Oops! The page you're looking for seems to have wandered off into the digital void.
        </p>
        
        <Link 
          to="/"
          className="inline-flex items-center px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors duration-300"
        >
          <FaHome className="mr-2" />
          Return Home
        </Link>
        
        <div className="mt-8 pt-6 border-t border-gray-700">
          <p className="text-sm text-gray-500">
            If you believe this is an error, please try again later.
          </p>
        </div>
      </div>
    </div>
  );
};

export default NotFound;