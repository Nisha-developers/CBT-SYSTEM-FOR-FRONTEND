import React from 'react';
import {Menu} from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';

const Navbar = ({handlegetstart, checkingva}) => {
     const schooDetail = JSON.parse(localStorage.getItem('setupSchoolApi'));
     const navigate = useNavigate();
  return (
    <header className="border-b border-gray-200 sticky top-0 bg-white z-50">
        <div className="max-w-7xl mx-auto px-4 lg:px-6">
          
          {/* Top Row: Logo + Search + Login + CTA */}
          <div className="flex items-center justify-between py-4 border-b border-gray-100">
            {/* Logo */}
            <div className="flex items-center gap-2 cursor-pointer" onClick={() => navigate('/')}>
              <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center">
                <span className="text-white font-bold text-sm">
                  {schooDetail?.name?.charAt(0) || 'C'}
                </span>
              </div>
              <span className="font-bold text-lg text-gray-900 tracking-tight">
                {schooDetail?.name || 'CBT System'}
              </span>
            </div>

            {/* Right Side Actions */}
            <div className="flex items-center gap-4">
              <button 
                onClick={() => navigate('/login')}
                className="hidden sm:flex items-center gap-1 text-sm font-medium text-gray-700 hover:text-blue-600 transition-colors"
              >
                Login
              </button>
              <Link to="/help">
              <button className="text-xs font-semibold tracking-wider text-white bg-blue-600 px-4 py-2 rounded-md hover:bg-blue-700 transition-colors uppercase"
              >
               Help
              </button>
              </Link>
              <button className="lg:hidden text-gray-600">
                <Menu className="w-6 h-6" />
              </button>
            </div>
          </div>

          {/* Bottom Row: Category Nav */}
         
        </div>
      </header>
  )
}

export default Navbar
