import React, { useState } from 'react';
import axios from 'axios';
import logo from '../assets/logo.png';

const Login = ({ setToken }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(`${process.env.REACT_APP_API_URL}/auth/login`, {
        email,
        password,
      });
      const { token, user } = response.data;
      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify(user));
      setToken(token);
      window.location.href = '/dashboard';
    } catch (err) {
      console.error('Login error:', err.response?.data);
      setError(err.response?.data?.message || 'Login failed. Please check your credentials.');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#1a2a44] via-[#4a6fa5] to-[#d4af37] p-4">
      <div className="bg-white bg-opacity-90 backdrop-blur-md p-6 sm:p-8 rounded-xl card-shadow w-full max-w-sm sm:max-w-md border border-[#d4af37]/20">
        <div className="flex justify-center mb-6 sm:mb-8">
          <img src={logo} alt="Webbify Infotech-VMS" className="w-20 sm:w-24 transition-transform duration-300 hover:scale-105" />
        </div>
        <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-center mb-4 sm:mb-6 text-[#1a2a44] flex items-center justify-center gap-2 sm:gap-3">
          <svg className="w-6 h-6 sm:w-8 sm:h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 11c0-1.657-1.343-3-3-3s-3 1.343-3 3m6 0c0-1.657 1.343-3 3-3s3 1.343 3 3m-6 0v4m-3 0v-4m6 0v4" />
          </svg>
          Login
        </h2>
        {error && (
          <div className="bg-red-100 text-red-700 p-3 rounded-lg mb-4 sm:mb-6 flex items-center gap-2 animate-fade-in">
            <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span className="text-sm sm:text-base">{error}</span>
          </div>
        )}
        <div>
          <div className="mb-4 sm:mb-4 relative">
            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full p-3 sm:p-3 rounded-lg bg-[#f5f6fa] border border-[#4a6fa5]/30 focus:ring-2 focus:ring-[#d4af37] focus:outline-none transition-all duration-200 placeholder-[#6b7280] text-sm sm:text-base"
              required
            />
            <svg className="w-4 h-4 sm:w-5 sm:h-5 absolute right-3 top-1/2 transform -translate-y-1/2 text-[#4a6fa5]" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207" />
            </svg>
          </div>
          <div className="mb-4 sm:mb-6 relative">
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full p-3 sm:p-3 rounded-lg bg-[#f5f6fa] border border-[#4a6fa5]/30 focus:ring-2 focus:ring-[#d4af37] focus:outline-none transition-all duration-200 placeholder-[#6b7280] text-sm sm:text-base"
              required
            />
            <svg className="w-4 h-4 sm:w-5 sm:h-5 absolute right-3 top-1/2 transform -translate-y-1/2 text-[#4a6fa5]" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 11c0-1.657-1.343-3-3-3s-3 1.343-3 3m6 0c0-1.657 1.343-3 3-3s3 1.343 3 3m-6 0v4m-3 0v-4m6 0v4" />
            </svg>
          </div>
          <button
            onClick={handleSubmit}
            className="w-full btn-primary flex items-center justify-center gap-2 hover:bg-[#d4af37] hover:text-[#1a2a44] transition-colors duration-300 py-2 sm:py-3 text-sm sm:text-base"
          >
            <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 16l-4-4m0 0l4-4m-4 4h14" />
            </svg>
            Login
          </button>
        </div>
      </div>
    </div>
  );
};

export default Login;