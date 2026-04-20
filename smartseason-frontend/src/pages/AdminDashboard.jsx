import React, { useState, useEffect } from 'react';
import { fieldsAPI } from '../services/api';
import { useAuth } from '../context/AuthContext';

const AdminDashboard = () => {
  const [fields, setFields] = useState([]);
  const [stats, setStats] = useState({
    total: 0,
    active: 0,
    atRisk: 0,
    completed: 0,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const { logout } = useAuth();

  useEffect(() => {
    fetchFields();
  }, []);

  const fetchFields = async () => {
    try {
      setLoading(true);
      const response = await fieldsAPI.getAll();
      setFields(response.data);
      calculateStats(response.data);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to fetch fields');
    } finally {
      setLoading(false);
    }
  };

  const calculateStats = (fieldsList) => {
    const stats = {
      total: fieldsList.length,
      active: 0,
      atRisk: 0,
      completed: 0,
    };

    fieldsList.forEach((field) => {
      if (field.status === 'Active') stats.active++;
      if (field.status === 'At Risk') stats.atRisk++;
      if (field.status === 'Completed') stats.completed++;
    });

    setStats(stats);
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'Active':
        return 'bg-green-100 text-green-800';
      case 'At Risk':
        return 'bg-red-100 text-red-800';
      case 'Completed':
        return 'bg-blue-100 text-blue-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-xl font-semibold">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 py-6 flex justify-between items-center">
          <h1 className="text-3xl font-bold text-gray-800">Admin Dashboard</h1>
          <button
            onClick={logout}
            className="bg-red-500 hover:bg-red-600 text-white font-semibold py-2 px-4 rounded"
          >
            Logout
          </button>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-8">
        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
            {error}
          </div>
        )}

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-white p-6 rounded-lg shadow">
            <div className="text-gray-500 text-sm font-semibold mb-2">
              TOTAL FIELDS
            </div>
            <div className="text-3xl font-bold text-gray-800">{stats.total}</div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow">
            <div className="text-green-600 text-sm font-semibold mb-2">
              ACTIVE
            </div>
            <div className="text-3xl font-bold text-green-600">{stats.active}</div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow">
            <div className="text-red-600 text-sm font-semibold mb-2">
              AT RISK
            </div>
            <div className="text-3xl font-bold text-red-600">{stats.atRisk}</div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow">
            <div className="text-blue-600 text-sm font-semibold mb-2">
              COMPLETED
            </div>
            <div className="text-3xl font-bold text-blue-600">{stats.completed}</div>
          </div>
        </div>

        {/* Fields Table */}
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <div className="px-6 py-4 bg-gray-100 border-b">
            <h2 className="text-lg font-semibold text-gray-800">All Fields</h2>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b">
                <tr>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">
                    Name
                  </th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">
                    Crop
                  </th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">
                    Stage
                  </th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">
                    Assigned Agent
                  </th>
                </tr>
              </thead>
              <tbody>
                {fields.length === 0 ? (
                  <tr>
                    <td colSpan="5" className="px-6 py-4 text-center text-gray-500">
                      No fields found
                    </td>
                  </tr>
                ) : (
                  fields.map((field) => (
                    <tr key={field._id} className="border-b hover:bg-gray-50">
                      <td className="px-6 py-4 text-sm text-gray-800">{field.name}</td>
                      <td className="px-6 py-4 text-sm text-gray-800">
                        {field.cropType}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-800">
                        {field.stage}
                      </td>
                      <td className="px-6 py-4">
                        <span
                          className={`px-3 py-1 rounded-full text-sm font-semibold ${getStatusColor(
                            field.status
                          )}`}
                        >
                          {field.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-800">
                        {field.assignedAgentId
                          ? field.assignedAgentId.name
                          : 'Unassigned'}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </main>
    </div>
  );
};

export default AdminDashboard;
