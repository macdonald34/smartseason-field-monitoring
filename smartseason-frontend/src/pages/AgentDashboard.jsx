import React, { useState, useEffect } from 'react';
import { fieldsAPI, updatesAPI } from '../services/api';
import { useAuth } from '../context/AuthContext';

const AgentDashboard = () => {
  const [fields, setFields] = useState([]);
  const [stats, setStats] = useState({
    total: 0,
    active: 0,
    atRisk: 0,
    completed: 0,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedField, setSelectedField] = useState(null);
  const [updates, setUpdates] = useState([]);
  const [formData, setFormData] = useState({ notes: '', stage: 'Planted' });
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

  const handleFieldSelect = async (field) => {
    setSelectedField(field);
    try {
      const response = await updatesAPI.getFieldUpdates(field._id);
      setUpdates(response.data);
    } catch (err) {
      console.error('Failed to fetch updates', err);
    }
  };

  const handleSubmitUpdate = async (e) => {
    e.preventDefault();
    if (!selectedField) return;

    try {
      await updatesAPI.create({
        fieldId: selectedField._id,
        notes: formData.notes,
        stage: formData.stage,
      });

      // Refresh fields
      await fetchFields();
      setFormData({ notes: '', stage: 'Planted' });
      setSelectedField(null);
      alert('Update submitted successfully');
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to submit update');
    }
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
          <h1 className="text-3xl font-bold text-gray-800">Agent Dashboard</h1>
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
              ASSIGNED FIELDS
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

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Fields List */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow overflow-hidden">
              <div className="px-6 py-4 bg-gray-100 border-b">
                <h2 className="text-lg font-semibold text-gray-800">
                  My Fields
                </h2>
              </div>

              <div className="divide-y max-h-96 overflow-y-auto">
                {fields.length === 0 ? (
                  <div className="px-6 py-4 text-center text-gray-500">
                    No fields assigned
                  </div>
                ) : (
                  fields.map((field) => (
                    <div
                      key={field._id}
                      onClick={() => handleFieldSelect(field)}
                      className={`px-6 py-4 cursor-pointer hover:bg-gray-50 ${
                        selectedField?._id === field._id ? 'bg-blue-50' : ''
                      }`}
                    >
                      <div className="flex justify-between items-start">
                        <div>
                          <h3 className="font-semibold text-gray-800">
                            {field.name}
                          </h3>
                          <p className="text-sm text-gray-600">{field.cropType}</p>
                        </div>
                        <span
                          className={`px-2 py-1 rounded text-xs font-semibold ${getStatusColor(
                            field.status
                          )}`}
                        >
                          {field.status}
                        </span>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>

          {/* Update Form */}
          <div className="lg:col-span-2">
            {selectedField ? (
              <div className="bg-white rounded-lg shadow overflow-hidden">
                <div className="px-6 py-4 bg-gray-100 border-b">
                  <h2 className="text-lg font-semibold text-gray-800">
                    {selectedField.name}
                  </h2>
                </div>

                <div className="p-6">
                  <div className="grid grid-cols-2 gap-4 mb-6">
                    <div>
                      <p className="text-sm text-gray-600">Crop Type</p>
                      <p className="font-semibold">{selectedField.cropType}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Current Stage</p>
                      <p className="font-semibold">{selectedField.stage}</p>
                    </div>
                  </div>

                  <form onSubmit={handleSubmitUpdate} className="space-y-4">
                    <div>
                      <label className="block text-gray-700 font-semibold mb-2">
                        Update Notes
                      </label>
                      <textarea
                        value={formData.notes}
                        onChange={(e) =>
                          setFormData({ ...formData, notes: e.target.value })
                        }
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                        rows="4"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-gray-700 font-semibold mb-2">
                        Stage
                      </label>
                      <select
                        value={formData.stage}
                        onChange={(e) =>
                          setFormData({ ...formData, stage: e.target.value })
                        }
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                      >
                        <option value="Planted">Planted</option>
                        <option value="Growing">Growing</option>
                        <option value="Ready">Ready</option>
                        <option value="Harvested">Harvested</option>
                      </select>
                    </div>

                    <button
                      type="submit"
                      className="w-full bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-4 rounded-lg transition duration-200"
                    >
                      Submit Update
                    </button>
                  </form>

                  {/* Recent Updates */}
                  <div className="mt-8">
                    <h3 className="font-semibold text-gray-800 mb-4">
                      Recent Updates
                    </h3>
                    <div className="space-y-4">
                      {updates.length === 0 ? (
                        <p className="text-gray-500">No updates yet</p>
                      ) : (
                        updates.map((update) => (
                          <div
                            key={update._id}
                            className="bg-gray-50 p-4 rounded-lg"
                          >
                            <p className="text-sm text-gray-600">
                              {new Date(update.createdAt).toLocaleDateString()}
                            </p>
                            <p className="text-gray-800">{update.notes}</p>
                          </div>
                        ))
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <div className="bg-white rounded-lg shadow p-8 text-center">
                <p className="text-gray-500">
                  Select a field to view details and submit updates
                </p>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
};

export default AgentDashboard;
