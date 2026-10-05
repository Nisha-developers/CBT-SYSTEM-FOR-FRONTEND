import React from 'react';
import { Link } from 'react-router-dom';
import { 
  Home, 
  AlertTriangle,
  Compass
} from 'lucide-react';

const Error = ({ 
  code = '404', 
  title = 'Page Not Found', 
  message = "The page you're looking for doesn't exist or has been moved. Check the URL or head back to safety."
}) => {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4 lg:p-6">
      
      <div className="w-full max-w-md">
        
        {/* ========================================================= */}
        {/* MAIN ERROR CARD */}
        {/* ========================================================= */}
        <div className="bg-white rounded-2xl border border-gray-200 shadow-xl shadow-blue-600/20 overflow-hidden">


          <div className="p-8 lg:p-10 text-center">
            
            {/* Error Icon */}
            <div className="flex justify-center mb-6">
              <div className="relative">
                <div className="relative w-20 h-20 rounded-full bg-blue-50 border border-blue-100 flex items-center justify-center">
                  <Compass className="w-9 h-9 text-blue-600" />
                  <div className="absolute -bottom-1 -right-1 w-7 h-7 rounded-full bg-amber-100 border-2 border-white flex items-center justify-center">
                    <AlertTriangle className="w-3.5 h-3.5 text-amber-600" />
                  </div>
                </div>
              </div>
            </div>

            {/* Error Code */}
            <div className="mb-3">
              <span className="inline-block text-6xl lg:text-7xl font-bold text-blue-600 tracking-tight">
                {code}
              </span>
            </div>

            {/* Title */}
            <h1 className="text-xl lg:text-2xl font-bold text-gray-900 mb-3">
              {title}
            </h1>

            {/* Message */}
            <p className="text-sm text-gray-500 leading-relaxed max-w-sm mx-auto mb-8">
              {message}
            </p>

            {/* Primary Action */}
            <Link
              to="/"
              className="inline-flex items-center justify-center gap-2 px-6 py-2.5 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors shadow-sm"
            >
              <Home className="w-4 h-4" />
              Go to Homepage
            </Link>

          </div>

        </div>

      </div>

    </div>
  );
};

export default Error;