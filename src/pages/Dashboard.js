import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Sidebar from '../Components/Sidebar';
import Navbar from '../Components/Navbar';
import Chart from '../Components/Chart';

const Dashboard = () => {
  const [user, setUser] = useState(null);
  const [stats, setStats] = useState(null);
  const [visitorTrends, setVisitorTrends] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

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

        const statsRes = await axios.get(`${process.env.REACT_APP_API_URL}/analytics/stats`, config);
        setStats(statsRes.data);

        try {
          const trendsRes = await axios.get(`${process.env.REACT_APP_API_URL}/analytics/visitors/trend`, config);
          setVisitorTrends(trendsRes.data);
        } catch (trendsErr) {
          console.error('Error fetching visitor trends:', {
            status: trendsErr.response?.status,
            message: trendsErr.response?.data || trendsErr.message,
            url: `${process.env.REACT_APP_API_URL}/analytics/visitors/trend`,
          });
          const mockTrends = [
            { date: '2025-05-20', visitors: 120 },
            { date: '2025-05-21', visitors: 150 },
            { date: '2025-05-22', visitors: 100 },
            { date: '2025-05-23', visitors: 180 },
            { date: '2025-05-24', visitors: 200 },
          ];
          setVisitorTrends(mockTrends);
        }
      } catch (err) {
        console.error('Error in Dashboard fetchData:', {
          status: err.response?.status,
          message: err.response?.data || err.message,
        });
        setError(err.response?.data?.message || err.message || 'Failed to load dashboard data');
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

  if (loading) {
    return <div className="flex justify-center items-center h-screen text-[#1a2a44] text-lg md:text-xl">Loading...</div>;
  }

  if (error) {
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
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 12l2-2m0 0l7-7 7 7m-9-5v12m-4-8h12" />
            </svg>
            Dashboard
          </h1>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
            <div className="bg-white p-4 sm:p-6 rounded-xl card-shadow flex items-center gap-3 sm:gap-4">
              <svg className="w-8 h-8 sm:w-10 sm:h-10 text-[#d4af37] flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
              </svg>
              <div className="flex-1">
                <h2 className="text-base sm:text-lg md:text-xl font-semibold text-[#1a2a44] truncate">Total Users</h2>
                <p className="text-xl sm:text-2xl md:text-3xl text-[#1a2a44]">{stats?.totalUsers || 0}</p>
              </div>
            </div>
            <div className="bg-white p-4 sm:p-6 rounded-xl card-shadow flex items-center gap-3 sm:gap-4">
              <svg className="w-8 h-8 sm:w-10 sm:h-10 text-[#d4af37] flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7v-2a3 3 0 005.356-1.857M17 20H7m10 0v-8a3 3 0 00-3-3h-4a3 3 0 00-3 3v8m-2-8h12" />
              </svg>
              <div className="flex-1">
                <h2 className="text-base sm:text-lg md:text-xl font-semibold text-[#1a2a44] truncate">Total Visitors</h2>
                <p className="text-xl sm:text-2xl md:text-3xl text-[#1a2a44]">{stats?.totalVisitors || 0}</p>
              </div>
            </div>
            <div className="bg-white p-4 sm:p-6 rounded-xl card-shadow flex items-center gap-3 sm:gap-4">
              <svg className="w-8 h-8 sm:w-10 sm:h-10 text-[#d4af37] flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
              </svg>
              <div className="flex-1">
                <h2 className="text-base sm:text-lg md:text-xl font-semibold text-[#1a2a44] truncate">Active Visitors</h2>
                <p className="text-xl sm:text-2xl md:text-3xl text-[#1a2a44]">{stats?.activeVisitors || 0}</p>
              </div>
            </div>
          </div>
          {visitorTrends.length > 0 ? (
            <div className="mt-6 sm:mt-8">
              <Chart data={visitorTrends} />
            </div>
          ) : (
            <p className="text-gray-500 mt-6 sm:mt-8 text-sm sm:text-base">No visitor trend data available.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;