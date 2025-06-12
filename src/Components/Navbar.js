import React from 'react';

const Navbar = ({ user }) => {
  return (
    <div className="bg-white shadow-md p-4 sm:p-5 flex justify-between items-center fixed top-0 left-0 right-0 z-50 md:ml-64">
      <h1 className="text-lg sm:text-xl md:text-2xl font-semibold text-[#1a2a44]">
        Welcome, {user?.name || 'User'}
      </h1>
      <div className="flex items-center gap-2 sm:gap-3">
        <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-[#d4af37] flex items-center justify-center text-white font-semibold text-sm sm:text-base">
          {user?.name?.charAt(0).toUpperCase() || 'U'}
        </div>
        <span className="text-[#1a2a44] text-sm sm:text-base capitalize hidden sm:block">
          {user?.role || 'Role'}
        </span>
      </div>
    </div>
  );
};

export default Navbar;