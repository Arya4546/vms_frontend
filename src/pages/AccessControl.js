import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Sidebar from '../Components/Sidebar';
import Navbar from '../Components/Navbar';

const AccessControl = () => {
  const [user, setUser] = useState(null);
  const [rules, setRules] = useState([]);
  const [newRule, setNewRule] = useState({ role: '', resource: '', actions: [] });
  const [editingRule, setEditingRule] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const pages = ['dashboard', 'users', 'access-control', 'visitors', 'analytics', 'settings'];
  const roles = ['admin', 'company', 'receptionist'];
  const possibleActions = ['read', 'write'];

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

        const rulesRes = await axios.get(`${process.env.REACT_APP_API_URL}/access-control`, config);
        setRules(rulesRes.data);
      } catch (err) {
        console.error('Error in AccessControl fetchData:', err.response?.data || err.message);
        setError(err.response?.data?.message || err.message || 'Failed to load access control data');
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

  const handleAddRule = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      const config = { headers: { Authorization: `Bearer ${token}` } };
      const ruleData = {
        role: newRule.role,
        resource: newRule.resource,
        actions: newRule.actions,
      };
      const res = await axios.post(`${process.env.REACT_APP_API_URL}/access-control`, ruleData, config);
      setRules([...rules, res.data]);
      setNewRule({ role: '', resource: '', actions: [] });
    } catch (err) {
      console.error('Error adding rule:', err.response?.data);
      alert(err.response?.data?.message || 'Failed to add rule');
    }
  };

  const handleEditRule = (rule) => {
    setEditingRule(rule);
    setNewRule({
      role: rule.role,
      resource: rule.resource,
      actions: rule.actions || [rule.action],
    });
  };

  const handleUpdateRule = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      const config = { headers: { Authorization: `Bearer ${token}` } };
      const ruleData = {
        role: newRule.role,
        resource: newRule.resource,
        actions: newRule.actions,
      };
      const res = await axios.put(`${process.env.REACT_APP_API_URL}/access-control/${editingRule._id}`, ruleData, config);
      setRules(rules.map((r) => (r._id === editingRule._id ? res.data : r)));
      setEditingRule(null);
      setNewRule({ role: '', resource: '', actions: [] });
    } catch (err) {
      console.error('Error updating rule:', err.response?.data);
      alert(err.response?.data?.message || 'Failed to update rule');
    }
  };

  const handleDeleteRule = async (id) => {
    if (!window.confirm('Are you sure you want to delete this rule?')) return;
    try {
      const token = localStorage.getItem('token');
      await axios.delete(`${process.env.REACT_APP_API_URL}/access-control/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setRules(rules.filter((r) => r._id !== id));
    } catch (err) {
      console.error('Error deleting rule:', err.response?.data);
      alert(err.response?.data?.message || 'Failed to delete rule');
    }
  };

  const handleActionChange = (action) => {
    setNewRule((prev) => {
      const actions = prev.actions.includes(action)
        ? prev.actions.filter((a) => a !== action)
        : [...prev.actions, action];
      return { ...prev, actions };
    });
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
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 11c0-1.657-1.343-3-3-3s-3 1.343-3 3m6 0c0-1.657 1.343-3 3-3s3 1.343 3 3m-6 0v4m-3 0v-4m6 0v4" />
            </svg>
            Access Control
          </h1>

          <div className="bg-white p-4 sm:p-6 rounded-xl card-shadow mb-6 md:mb-8">
            <form onSubmit={editingRule ? handleUpdateRule : handleAddRule}>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                <div className="relative">
                  <select
                    value={newRule.role}
                    onChange={(e) => setNewRule({ ...newRule, role: e.target.value })}
                    className="w-full p-3 sm:p-3 rounded-lg bg-gray-100 border border-gray-300 focus:ring-2 focus:ring-[#4a6fa5] focus:outline-none transition-all duration-200 text-sm sm:text-base"
                    required
                  >
                    <option value="">Select Role</option>
                    {roles.map((role) => (
                      <option key={role} value={role}>
                        {role.charAt(0).toUpperCase() + role.slice(1)}
                      </option>
                    ))}
                  </select>
                  <svg className="w-4 h-4 sm:w-5 sm:h-5 absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                  </svg>
                </div>
                <div className="relative">
                  <select
                    value={newRule.resource}
                    onChange={(e) => setNewRule({ ...newRule, resource: e.target.value })}
                    className="w-full p-3 sm:p-3 rounded-lg bg-gray-100 border border-gray-300 focus:ring-2 focus:ring-[#4a6fa5] focus:outline-none transition-all duration-200 text-sm sm:text-base"
                    required
                  >
                    <option value="">Select Resource</option>
                    {pages.map((page) => (
                      <option key={page} value={page}>
                        {page.charAt(0).toUpperCase() + page.slice(1).replace('-', ' ')}
                      </option>
                    ))}
                  </select>
                  <svg className="w-4 h-4 sm:w-5 sm:h-5 absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                  </svg>
                </div>
                <div className="flex items-center gap-4">
                  {possibleActions.map((action) => (
                    <label key={action} className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        checked={newRule.actions.includes(action)}
                        onChange={() => handleActionChange(action)}
                        className="form-checkbox h-5 w-5 text-[#4a6fa5] rounded focus:ring-[#4a6fa5]"
                      />
                      <span className="text-[#1a2a44] text-sm sm:text-base">{action.charAt(0).toUpperCase() + action.slice(1)}</span>
                    </label>
                  ))}
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
                  {editingRule ? 'Update Rule' : 'Add Rule'}
                </button>
                {editingRule && (
                  <button
                    type="button"
                    onClick={() => {
                      setEditingRule(null);
                      setNewRule({ role: '', resource: '', actions: [] });
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
            <table className="w-full min-w-[600px] text-left">
              <thead>
                <tr className="bg-gray-100">
                  <th className="p-3 sm:p-4 text-[#1a2a44] font-semibold text-sm sm:text-base">Role</th>
                  <th className="p-3 sm:p-4 text-[#1a2a44] font-semibold text-sm sm:text-base">Resource</th>
                  <th className="p-3 sm:p-4 text-[#1a2a44] font-semibold text-sm sm:text-base">Actions</th>
                  <th className="p-3 sm:p-4 text-[#1a2a44] font-semibold text-sm sm:text-base">Actions</th>
                </tr>
              </thead>
              <tbody>
                {rules.map((rule) => (
                  <tr key={rule._id} className="border-b hover:bg-gray-50 transition-colors duration-200">
                    <td className="p-3 sm:p-4 text-[#1a2a44] text-sm sm:text-base">{rule.role.charAt(0).toUpperCase() + rule.role.slice(1)}</td>
                    <td className="p-3 sm:p-4 text-[#1a2a44] text-sm sm:text-base">{rule.resource.charAt(0).toUpperCase() + rule.resource.slice(1).replace('-', ' ')}</td>
                    <td className="p-3 sm:p-4 text-[#1a2a44] text-sm sm:text-base">
                      {Array.isArray(rule.actions)
                        ? rule.actions.map(a => a.charAt(0).toUpperCase() + a.slice(1)).join(', ')
                        : (rule.action ? rule.action.charAt(0).toUpperCase() + rule.action.slice(1) : 'N/A')}
                    </td>
                    <td className="p-3 sm:p-4 flex flex-wrap gap-2">
                      <button
                        onClick={() => handleEditRule(rule)}
                        className="btn-primary flex items-center justify-center gap-1 sm:gap-2 py-2 sm:py-2 px-2 sm:px-3 text-xs sm:text-sm w-full sm:w-auto"
                      >
                        <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                        </svg>
                        Edit
                      </button>
                      <button
                        onClick={() => handleDeleteRule(rule._id)}
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

export default AccessControl;