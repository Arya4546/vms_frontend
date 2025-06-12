import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Sidebar from '../Components/Sidebar';
import Navbar from '../Components/Navbar';

const Visitors = () => {
  const [user, setUser] = useState(null);
  const [visitors, setVisitors] = useState([]);
  const [newVisitor, setNewVisitor] = useState({
    name: '',
    email: '',
    phone: '',
    purpose: '',
    companyId: '',
  });
  const [editingVisitor, setEditingVisitor] = useState(null);
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

        setNewVisitor((prev) => ({
          ...prev,
          companyId: currentUser.role === 'company' || currentUser.role === 'receptionist' ? currentUser.id : '',
        }));

        let visitorsRes;
        if (currentUser.role === 'admin') {
          visitorsRes = await axios.get(`${process.env.REACT_APP_API_URL}/visitors`, config);
        } else {
          visitorsRes = await axios.get(`${process.env.REACT_APP_API_URL}/visitors`, config);
          visitorsRes.data = visitorsRes.data.filter(v => v.companyId === currentUser.id);
        }
        setVisitors(visitorsRes.data);
      } catch (err) {
        console.error('Error in Visitors fetchData:', err.response?.data || err.message);
        setError(err.response?.data?.message || err.message || 'Failed to load visitors data');
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

  const handleAddVisitor = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      const config = { headers: { Authorization: `Bearer ${token}` } };
      const visitorData = {
        ...newVisitor,
        companyId: user.role === 'company' || user.role === 'receptionist' ? user.id : newVisitor.companyId,
      };
      const res = await axios.post(`${process.env.REACT_APP_API_URL}/visitors`, visitorData, config);
      setVisitors([...visitors, res.data]);
      setNewVisitor({ name: '', email: '', phone: '', purpose: '', companyId: user.role === 'company' || user.role === 'receptionist' ? user.id : '' });
    } catch (err) {
      console.error('Error adding visitor:', err.response?.data);
      alert(err.response?.data?.message || 'Failed to add visitor');
    }
  };

  const handleEditVisitor = (visitor) => {
    setEditingVisitor(visitor);
    setNewVisitor({
      name: visitor.name,
      email: visitor.email,
      phone: visitor.phone,
      purpose: visitor.purpose,
      companyId: visitor.companyId || '',
    });
  };

  const handleUpdateVisitor = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      const config = { headers: { Authorization: `Bearer ${token}` } };
      const visitorData = {
        ...newVisitor,
        companyId: user.role === 'company' || user.role === 'receptionist' ? user.id : newVisitor.companyId,
      };
      const res = await axios.put(`${process.env.REACT_APP_API_URL}/visitors/${editingVisitor._id}`, visitorData, config);
      setVisitors(visitors.map((v) => (v._id === editingVisitor._id ? res.data : v)));
      setEditingVisitor(null);
      setNewVisitor({ name: '', email: '', phone: '', purpose: '', companyId: user.role === 'company' || user.role === 'receptionist' ? user.id : '' });
    } catch (err) {
      console.error('Error updating visitor:', err.response?.data);
      alert(err.response?.data?.message || 'Failed to update visitor');
    }
  };

  const handleDeleteVisitor = async (id) => {
    if (!window.confirm('Are you sure you want to delete this visitor?')) return;
    try {
      const token = localStorage.getItem('token');
      await axios.delete(`${process.env.REACT_APP_API_URL}/visitors/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setVisitors(visitors.filter((v) => v._id !== id));
    } catch (err) {
      console.error('Error deleting visitor:', err.response?.data);
      alert(err.response?.data?.message || 'Failed to delete visitor');
    }
  };

  const handleCheckOut = async (id) => {
    try {
      const token = localStorage.getItem('token');
      const config = { headers: { Authorization: `Bearer ${token}` } };
      const res = await axios.put(`${process.env.REACT_APP_API_URL}/visitors/${id}/checkout`, {}, config);
      setVisitors(visitors.map((v) => (v._id === id ? res.data : v)));
    } catch (err) {
      console.error('Error checking out visitor:', err.response?.data);
      alert(err.response?.data?.message || 'Failed to check out visitor');
    }
  };

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
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7v-2a3 3 0 005.356-1.857M17 20H7m10 0v-8a3 3 0 00-3-3h-4a3 3 0 00-3 3v8m-2-8h12" />
            </svg>
            Visitors
          </h1>

          <div className="bg-white p-4 sm:p-6 rounded-xl card-shadow mb-6 md:mb-8">
            <form onSubmit={editingVisitor ? handleUpdateVisitor : handleAddVisitor}>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="relative">
                  <input
                    type="text"
                    placeholder="Name"
                    value={newVisitor.name}
                    onChange={(e) => setNewVisitor({ ...newVisitor, name: e.target.value })}
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
                    value={newVisitor.email}
                    onChange={(e) => setNewVisitor({ ...newVisitor, email: e.target.value })}
                    className="w-full p-3 sm:p-3 rounded-lg bg-gray-100 border border-gray-300 focus:ring-2 focus:ring-[#4a6fa5] focus:outline-none transition-all duration-200 text-sm sm:text-base"
                    required
                  />
                  <svg className="w-4 h-4 sm:w-5 sm:h-5 absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207" />
                  </svg>
                </div>
                <div className="relative">
                  <input
                    type="tel"
                    placeholder="Phone"
                    value={newVisitor.phone}
                    onChange={(e) => setNewVisitor({ ...newVisitor, phone: e.target.value })}
                    className="w-full p-3 sm:p-3 rounded-lg bg-gray-100 border border-gray-300 focus:ring-2 focus:ring-[#4a6fa5] focus:outline-none transition-all duration-200 text-sm sm:text-base"
                    required
                  />
                  <svg className="w-4 h-4 sm:w-5 sm:h-5 absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                  </svg>
                </div>
                <div className="relative">
                  <input
                    type="text"
                    placeholder="Purpose"
                    value={newVisitor.purpose}
                    onChange={(e) => setNewVisitor({ ...newVisitor, purpose: e.target.value })}
                    className="w-full p-3 sm:p-3 rounded-lg bg-gray-100 border border-gray-300 focus:ring-2 focus:ring-[#4a6fa5] focus:outline-none transition-all duration-200 text-sm sm:text-base"
                    required
                  />
                  <svg className="w-4 h-4 sm:w-5 sm:h-5 absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                </div>
              </div>
              <div className="mt-4 sm:mt-6 flex flex-col sm:flex-row gap-3">
                <button
                  type="submit"
                  className="btn-primary flex items-center justify-center gap-2 py-2 sm:py-3 text-sm sm:text-base w-full sm:w-auto"
                >
                  <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                  </svg>
                  {editingVisitor ? 'Update Visitor' : 'Add Visitor'}
                </button>
                {editingVisitor && (
                  <button
                    type="button"
                    onClick={() => {
                      setEditingVisitor(null);
                      setNewVisitor({ name: '', email: '', phone: '', purpose: '', companyId: user.role === 'company' || user.role === 'receptionist' ? user.id : '' });
                    }}
                    className="btn-secondary flex items-center justify-center gap-2 py-2 sm:py-3 text-sm sm:text-base w-full sm:w-auto"
                  >
                    <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                    </svg>
                    Cancel
                  </button>
                )}
              </div>
            </form>
          </div>

          <div className="overflow-x-auto bg-white rounded-xl card-shadow">
            <table className="w-full min-w-[800px] text-left">
              <thead>
                <tr className="bg-gray-100">
                  <th className="p-3 sm:p-4 text-[#1a2a44] font-semibold text-sm sm:text-base">Name</th>
                  <th className="p-3 sm:p-4 text-[#1a2a44] font-semibold text-sm sm:text-base">Email</th>
                  <th className="p-3 sm:p-4 text-[#1a2a44] font-semibold text-sm sm:text-base">Phone</th>
                  <th className="p-3 sm:p-4 text-[#1a2a44] font-semibold text-sm sm:text-base">Purpose</th>
                  <th className="p-3 sm:p-4 text-[#1a2a44] font-semibold text-sm sm:text-base">Check-In</th>
                  <th className="p-3 sm:p-4 text-[#1a2a44] font-semibold text-sm sm:text-base">Check-Out</th>
                  <th className="p-3 sm:p-4 text-[#1a2a44] font-semibold text-sm sm:text-base">Actions</th>
                </tr>
              </thead>
              <tbody>
                {visitors.map((v) => (
                  <tr key={v._id} className="border-b hover:bg-gray-50 transition-colors duration-200">
                    <td className="p-3 sm:p-4 text-[#1a2a44] text-sm sm:text-base truncate">{v.name}</td>
                    <td className="p-3 sm:p-4 text-[#1a2a44] text-sm sm:text-base truncate">{v.email}</td>
                    <td className="p-3 sm:p-4 text-[#1a2a44] text-sm sm:text-base">{v.phone}</td>
                    <td className="p-3 sm:p-4 text-[#1a2a44] text-sm sm:text-base truncate">{v.purpose}</td>
                    <td className="p-3 sm:p-4 text-[#1a2a44] text-sm sm:text-base">
                      {new Date(v.checkIn).toLocaleString()}
                    </td>
                    <td className="p-3 sm:p-4 text-[#1a2a44] text-sm sm:text-base">
                      {v.checkOut ? new Date(v.checkOut).toLocaleString() : 'N/A'}
                    </td>
                    <td className="p-3 sm:p-4 flex flex-wrap gap-2">
                      <button
                        onClick={() => handleEditVisitor(v)}
                        className="btn-primary flex items-center justify-center gap-1 sm:gap-2 py-2 sm:py-2 px-2 sm:px-3 text-xs sm:text-sm w-full sm:w-auto"
                      >
                        <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                        </svg>
                        Edit
                      </button>
                      <button
                        onClick={() => handleDeleteVisitor(v._id)}
                        className="btn-danger flex items-center justify-center gap-1 sm:gap-2 py-2 sm:py-2 px-2 sm:px-3 text-xs sm:text-sm w-full sm:w-auto"
                      >
                        <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5-4h4M9 7h6m-5 4v6m4-6v6" />
                        </svg>
                        Delete
                      </button>
                      {!v.checkOut && (
                        <button
                          onClick={() => handleCheckOut(v._id)}
                          className="btn-secondary flex items-center justify-center gap-1 sm:gap-2 py-2 sm:py-2 px-2 sm:px-3 text-xs sm:text-sm w-full sm:w-auto"
                        >
                          <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                          </svg>
                          Check Out
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Visitors;