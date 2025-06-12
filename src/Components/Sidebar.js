import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import logo from '../assets/logo.jpg';

const Sidebar = ({ role }) => {
  const location = useLocation();
  const [isOpen, setIsOpen] = useState(false);

  const isActive = (path) => (location.pathname === path ? 'bg-[#d4af37] text-[#1a2a44]' : 'text-gray-200 hover:bg-[#d4af37] hover:text-[#1a2a44]');

  const toggleSidebar = () => setIsOpen(!isOpen);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    window.location.href = '/login';
  };

  return (
    <>
      {/* Hamburger button for small screens */}
      <button
        className="lg:hidden fixed top-4 left-4 z-50 p-2 bg-[#d4af37] text-[#1a2a44] rounded-full focus:outline-none card-shadow"
        onClick={toggleSidebar}
      >
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d={isOpen ? "M6 18L18 6M6 6l12 12" : "M4 6h16M4 12h16M4 18h16"} />
        </svg>
      </button>

      {/* Sidebar */}
      <div
        className={`fixed top-0 left-0 h-screen bg-[#1a2a44] text-white p-6 transform transition-transform duration-300 ease-in-out z-40
          ${isOpen ? 'translate-x-0' : '-translate-x-full'} lg:translate-x-0 lg:w-64 w-3/4 lg:flex lg:flex-col`}
      >
        <div className="pt-16 lg:pt-0 flex flex-col h-full">
          <div className="mb-8 flex justify-center">
            <img src={logo} alt="Webbify Infotech-VMS" className="w-20 transition-transform duration-300 hover:scale-105" />
          </div>
          <nav className="flex flex-col gap-3 flex-1">
            <Link
              to="/dashboard"
              className={`flex items-center gap-3 py-3 px-4 rounded-lg transition-colors duration-200 ${isActive('/dashboard')}`}
              onClick={() => setIsOpen(false)}
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 12l2-2m0 0l7-7 7 7m-9-5v12m-4-8h12" />
              </svg>
              Dashboard
            </Link>
            {role === 'admin' && (
              <>
                <Link
                  to="/users"
                  className={`flex items-center gap-3 py-3 px-4 rounded-lg transition-colors duration-200 ${isActive('/users')}`}
                  onClick={() => setIsOpen(false)}
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                  </svg>
                  Users
                </Link>
                <Link
                  to="/access-control"
                  className={`flex items-center gap-3 py-3 px-4 rounded-lg transition-colors duration-200 ${isActive('/access-control')}`}
                  onClick={() => setIsOpen(false)}
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 11c0-2.21-1.79-4-4-4S4 8.79 4 11m8 0c0-2.21 1.79-4 4-4s4 1.79 4 4m-8 0v4m-4 0v-4m8 0v4" />
                  </svg>
                  Access Control
                </Link>
              </>
            )}
            {role === 'company' && (
              <Link
                to="/users"
                className={`flex items-center gap-3 py-3 px-4 rounded-lg transition-colors duration-200 ${isActive('/users')}`}
                onClick={() => setIsOpen(false)}
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                </svg>
                Receptionists
              </Link>
            )}
            <Link
              to="/visitors"
              className={`flex items-center gap-3 py-3 px-4 rounded-lg transition-colors duration-200 ${isActive('/visitors')}`}
              onClick={() => setIsOpen(false)}
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7v-2a3 3 0 005.356-1.857M17 20H7m10 0v-8a3 3 0 00-3-3h-4a3 3 0 00-3 3v8m-2-8h12" />
              </svg>
              Visitors
            </Link>
            <Link
              to="/analytics"
              className={`flex items-center gap-3 py-3 px-4 rounded-lg transition-colors duration-200 ${isActive('/analytics')}`}
              onClick={() => setIsOpen(false)}
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
              Analytics
            </Link>
            {role === 'admin' && (
              <Link
                to="/settings"
                className={`flex items-center gap-3 py-3 px-4 rounded-lg transition-colors duration-200 ${isActive('/settings')}`}
                onClick={() => setIsOpen(false)}
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                Settings
              </Link>
            )}
          </nav>
          <div className="mt-auto p-4 border-t border-gray-600">
            <button
              onClick={handleLogout}
              className="w-full btn-danger flex items-center gap-3 justify-center"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
              </svg>
              Log Out
            </button>
          </div>
        </div>
      </div>

      {/* Overlay for small screens when sidebar is open */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-30 lg:hidden"
          onClick={toggleSidebar}
        />
      )}
    </>
  );
};

export default Sidebar;