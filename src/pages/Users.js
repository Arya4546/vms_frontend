import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Sidebar from '../Components/Sidebar';
import Navbar from '../Components/Navbar';

const Users = () => {
  const [user, setUser] = useState(null);
  const [users, setUsers] = useState([]);
  const [companies, setCompanies] = useState([]);
  const [newUser, setNewUser] = useState({ name: '', email: '', password: '', role: '', companyId: '' });
  const [editingUser, setEditingUser] = useState(null);
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

        setNewUser((prev) => ({
          ...prev,
          role: currentUser.role === 'company' ? 'receptionist' : 'admin',
        }));

        let usersRes;
        if (currentUser.role === 'admin') {
          usersRes = await axios.get(`${process.env.REACT_APP_API_URL}/users`, config);
        } else if (currentUser.role === 'company') {
          usersRes = await axios.get(`${process.env.REACT_APP_API_URL}/users`, config);
          usersRes.data = usersRes.data.filter(u => u.role === 'receptionist' && u.companyId === currentUser.id);
        }
        setUsers(usersRes.data);

        if (currentUser.role === 'admin') {
          const companyUsers = usersRes.data.filter(u => u.role === 'company');
          setCompanies(companyUsers);
        }
      } catch (err) {
        console.error('Error in Users fetchData:', err.response?.data || err.message);
        setError(err.response?.data?.message || err.message || 'Failed to load users data');
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

  const handleAddUser = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      const config = { headers: { Authorization: `Bearer ${token}` } };
      const userData = {
        ...newUser,
        companyId: user.role === 'company' ? user.id : (newUser.role === 'receptionist' ? newUser.companyId : undefined),
      };
      const res = await axios.post(`${process.env.REACT_APP_API_URL}/users`, userData, config);
      setUsers([...users, res.data]);
      setNewUser({ name: '', email: '', password: '', role: user.role === 'company' ? 'receptionist' : 'admin', companyId: '' });
    } catch (err) {
      console.error('Error adding user:', err.response?.data);
      alert(err.response?.data?.message || 'Failed to add user');
    }
  };

  const handleEditUser = (user) => {
    setEditingUser(user);
    setNewUser({
      name: user.name,
      email: user.email,
      password: '',
      role: user.role,
      companyId: user.companyId || '',
    });
  };

  const handleUpdateUser = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      const config = { headers: { Authorization: `Bearer ${token}` } };
      const userData = {
        ...newUser,
        companyId: newUser.role === 'receptionist' ? newUser.companyId : undefined,
      };
      const res = await axios.put(`${process.env.REACT_APP_API_URL}/users/${editingUser._id}`, userData, config);
      setUsers(users.map((u) => (u._id === editingUser._id ? res.data : u)));
      setEditingUser(null);
      setNewUser({ name: '', email: '', password: '', role: user.role === 'company' ? 'receptionist' : 'admin', companyId: '' });
    } catch (err) {
      console.error('Error updating user:', err.response?.data);
      alert(err.response?.data?.message || 'Failed to update user');
    }
  };

  const handleDeleteUser = async (id) => {
    if (!window.confirm('Are you sure you want to delete this user?')) return;
    try {
      const token = localStorage.getItem('token');
      await axios.delete(`${process.env.REACT_APP_API_URL}/users/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setUsers(users.filter((u) => u._id !== id));
    } catch (err) {
      console.error('Error deleting user:', err.response?.data);
      alert(err.response?.data?.message || 'Failed to delete user');
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
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
            </svg>
            {user.role === 'company' ? 'Receptionists' : 'Users'}
          </h1>

          <div className="bg-white p-4 sm:p-6 rounded-xl card-shadow mb-6 md:mb-8">
            <form onSubmit={editingUser ? handleUpdateUser : handleAddUser}>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                <div className="relative">
                  <input
                    type="text"
                    placeholder="Name"
                    value={newUser.name}
                    onChange={(e) => setNewUser({ ...newUser, name: e.target.value })}
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
                    value={newUser.email}
                    onChange={(e) => setNewUser({ ...newUser, email: e.target.value })}
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
                    placeholder={editingUser ? "New Password (optional)" : "Password"}
                    value={newUser.password}
                    onChange={(e) => setNewUser({ ...newUser, password: e.target.value })}
                    className="w-full p-3 sm:p-3 rounded-lg bg-gray-100 border border-gray-300 focus:ring-2 focus:ring-[#4a6fa5] focus:outline-none transition-all duration-200 text-sm sm:text-base"
                    required={!editingUser}
                  />
                  <svg className="w-4 h-4 sm:w-5 sm:h-5 absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 11c0-1.657-1.343-3-3-3s-3 1.343-3 3m6 0c0-1.657 1.343-3 3-3s3 1.343 3 3m-6 0v4m-3 0v-4m6 0v4" />
                  </svg>
                </div>
                {user.role === 'admin' && (
                  <div className="relative">
                    <select
                      value={newUser.role}
                      onChange={(e) => setNewUser({ ...newUser, role: e.target.value, companyId: e.target.value === 'receptionist' ? newUser.companyId : '' })}
                      className="w-full p-3 sm:p-3 rounded-lg bg-gray-100 border border-gray-300 focus:ring-2 focus:ring-[#4a6fa5] focus:outline-none transition-all duration-200 text-sm sm:text-base"
                      required
                    >
                      <option value="admin">Admin</option>
                      <option value="company">Company</option>
                      <option value="receptionist">Receptionist</option>
                    </select>
                    <svg className="w-4 h-4 sm:w-5 sm:h-5 absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                    </svg>
                  </div>
                )}
                {(user.role === 'admin' && newUser.role === 'receptionist') && (
                  <div className="relative">
                    <select
                      value={newUser.companyId}
                      onChange={(e) => setNewUser({ ...newUser, companyId: e.target.value })}
                      className="w-full p-3 sm:p-3 rounded-lg bg-gray-100 border border-gray-300 focus:ring-2 focus:ring-[#4a6fa5] focus:outline-none transition-all duration-200 text-sm sm:text-base"
                      required
                    >
                      <option value="">Select Company</option>
                      {companies.map((company) => (
                        <option key={company._id} value={company._id}>
                          {company.name}
                        </option>
                      ))}
                    </select>
                    <svg className="w-4 h-4 sm:w-5 sm:h-5 absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                    </svg>
                  </div>
                )}
              </div>
              <div className="mt-4 sm:mt-6 flex flex-col sm:flex-row gap-3">
                <button
                  type="submit"
                  className="btn-primary flex items-center justify-center gap-2 py-2 sm:py-3 text-sm sm:text-base w-full sm:w-auto"
                >
                  <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                  </svg>
                  {editingUser ? 'Update User' : 'Add User'}
                </button>
                {editingUser && (
                  <button
                    type="button"
                    onClick={() => {
                      setEditingUser(null);
                      setNewUser({ name: '', email: '', password: '', role: user.role === 'company' ? 'receptionist' : 'admin', companyId: '' });
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
            <table className="w-full min-w-[600px] sm:min-w-[800px] text-left">
              <thead>
                <tr className="bg-gray-100">
                  <th className="p-3 sm:p-4 text-[#1a2a44] font-semibold text-sm sm:text-base">Name</th>
                  <th className="p-3 sm:p-4 text-[#1a2a44] font-semibold text-sm sm:text-base">Email</th>
                  <th className="p-3 sm:p-4 text-[#1a2a44] font-semibold text-sm sm:text-base">Role</th>
                  {user.role === 'admin' && (
                    <th className="p-3 sm:p-4 text-[#1a2a44] font-semibold text-sm sm:text-base">Company</th>
                  )}
                  <th className="p-3 sm:p-4 text-[#1a2a44] font-semibold text-sm sm:text-base">Actions</th>
                </tr>
              </thead>
              <tbody>
                {users.map((u) => (
                  <tr key={u._id} className="border-b hover:bg-gray-50 transition-colors duration-200">
                    <td className="p-3 sm:p-4 text-[#1a2a44] text-sm sm:text-base truncate">{u.name}</td>
                    <td className="p-3 sm:p-4 text-[#1a2a44] text-sm sm:text-base truncate">{u.email}</td>
                    <td className="p-3 sm:p-4 text-[#1a2a44] text-sm sm:text-base">{u.role}</td>
                    {user.role === 'admin' && (
                      <td className="p-3 sm:p-4 text-[#1a2a44] text-sm sm:text-base truncate">
                        {u.companyId
                          ? companies.find((c) => c._id === u.companyId)?.name || 'N/A'
                          : 'N/A'}
                      </td>
                    )}
                    <td className="p-3 sm:p-4 flex flex-wrap gap-2">
                      <button
                        onClick={() => handleEditUser(u)}
                        className="btn-primary flex items-center justify-center gap-1 sm:gap-2 py-2 sm:py-2 px-2 sm:px-3 text-xs sm:text-sm w-full sm:w-auto"
                      >
                        <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                        </svg>
                        Edit
                      </button>
                      <button
                        onClick={() => handleDeleteUser(u._id)}
                        className="btn-danger flex items-center justify-center gap-1 sm:gap-2 py-2 sm:py-2 px-2 sm:px-3 text-xs sm:text-sm w-full sm:w-auto"
                      >
                        <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5-4h4M9 7h6m-5 4v6m4-6v6" />
                        </svg>
                        Delete
                      </button>
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

export default Users;