import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Sidebar from '../Components/Sidebar';
import Navbar from '../Components/Navbar';

const Settings = () => {
  const [user, setUser] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const token = localStorage.getItem('token');
        if (!token) throw new Error('No token found');

        const config = { headers: { Authorization: `Bearer ${token}` } };

        const storedUser = JSON.parse(localStorage.getItem('user'));
        let currentUser;
        if (storedUser) {
          currentUser = storedUser;
        } else {
          const userRes = await axios.get(`${process.env.REACT_APP_API_URL}/auth/me`, config);
          currentUser = userRes.data;
        }
        setUser(currentUser);
        setFormData({
          name: currentUser.name,
          email: currentUser.email,
          password: '',
        });
      } catch (err) {
        console.error('Error in Settings fetchData:', err.response?.data || err.message);
        setError(err.response?.data?.message || err.message || 'Failed to load settings data');
        if (err.response?.status === 401) {
          localStorage.removeItem('token');
          localStorage.removeItem('user');
          window.location.href = '/login';
        }
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      const config = { headers: { Authorization: `Bearer ${token}` } };
      const updateData = {
        name: formData.name,
        email: formData.email,
      };
      if (formData.password) {
        updateData.password = formData.password;
      }
      const res = await axios.put(`${process.env.REACT_APP_API_URL}/users/me`, updateData, config);
      setUser(res.data);
      localStorage.setItem('user', JSON.stringify(res.data));
      setFormData({
        name: res.data.name,
        email: res.data.email,
        password: '',
      });
      setSuccess('Profile updated successfully');
      setTimeout(() => setSuccess(null), 3000);
    } catch (err) {
      console.error('Error updating profile:', err.response?.data);
      setError(err.response?.data?.message || 'Failed to update profile');
      setTimeout(() => setError(null), 3000);
    }
  };

  if (loading) {
    return <div className="flex justify-center items-center h-screen text-[#1a2a44] text-lg md:text-xl">Loading...</div>;
  }

  if (error && !success) {
    return <div className="flex justify-center items-center h-screen text-red-500 text-lg md:text-xl">Error: {error}</div>;
  }

  if (!user) {
    return <div className="flex justify-center items-center h-screen text-[#1a2a44] text-lg md:text-xl">No user data available</div>;
  }

  return (
    <div className="flex min-h-screen bg-[#f5f6fa]">
      <Sidebar role={user.role} />
      <div className="flex-1 flex flex-col">
        <Navbar user={user} />
        <div className="p-4 sm:p-6 md:p-8 flex-1 mt-16 md:ml-64">
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-6 md:mb-8 text-[#1a2a44] flex items-center gap-2 md:gap-3">
            <svg className="w-6 h-6 sm:w-8 sm:h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37a1.724 1.724 0 002.572-1.065z" />
            </svg>
            Settings
          </h1>

          <div className="bg-white p-4 sm:p-6 rounded-xl card-shadow max-w-lg">
            {success && (
              <div className="bg-green-100 text-green-700 p-3 rounded-lg mb-4 sm:mb-6 flex items-center gap-2 animate-fade-in">
                <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                </svg>
                <span className="text-sm sm:text-base">{success}</span>
              </div>
            )}
            {error && (
              <div className="bg-red-100 text-red-700 p-3 rounded-lg mb-4 sm:mb-6 flex items-center gap-2 animate-fade-in">
                <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span className="text-sm sm:text-base">{error}</span>
              </div>
            )}
            <form onSubmit={handleUpdateProfile}>
              <div className="grid grid-cols-1 gap-4">
                <div className="relative">
                  <input
                    type="text"
                    placeholder="Name"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full p-3 sm:p-3 rounded-lg bg-gray-100 border border-gray-300 focus:ring-2 focus:ring-[#4a6fa5] focus:outline-none transition-all duration-200 text-sm sm:text-base"
                    required
                  />
                  <svg className="w-4 h-4 sm:w-5 sm:h-5 absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                </div>
                <div className="relative">
                  <input
                    type="email"
                    placeholder="Email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full p-3 sm:p-3 rounded-lg bg-gray-100 border border-gray-300 focus:ring-2 focus:ring-[#4a6fa5] focus:outline-none transition-all duration-200 text-sm sm:text-base"
                    required
                  />
                  <svg className="w-4 h-4 sm:w-5 sm:h-5 absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207" />
                  </svg>
                </div>
                <div className="relative">
                  <input
                    type="password"
                    placeholder="New Password (optional)"
                    value={formData.password}
                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                    className="w-full p-3 sm:p-3 rounded-lg bg-gray-100 border border-gray-300 focus:ring-2 focus:ring-[#4a6fa5] focus:outline-none transition-all duration-200 text-sm sm:text-base"
                  />
                  <svg className="w-4 h-4 sm:w-5 sm:h-5 absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 11c0-1.657-1.343-3-3-3s-3 1.343-3 3m6 0c0-1.657 1.343-3 3-3s3 1.343 3 3m-6 0v4m-3 0v-4m6 0v4" />
                  </svg>
                </div>
              </div>
              <div className="mt-4 sm:mt-6">
                <button
                  type="submit"
                  className="btn-primary flex items-center justify-center gap-2 py-2 sm:py-3 text-sm sm:text-base w-full sm:w-auto"
                >
                  <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                  </svg>
                  Update Profile
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Settings;