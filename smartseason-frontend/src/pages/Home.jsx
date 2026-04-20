import React from 'react';
import { Link } from 'react-router-dom';

const Home = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-green-500 to-blue-600 flex flex-col items-center justify-center p-4">
      <div className="text-center">
        <h1 className="text-5xl font-bold text-white mb-4">SmartSeason</h1>
        <p className="text-xl text-white mb-2">Field Monitoring System</p>
        <p className="text-lg text-gray-100 mb-8 max-w-2xl">
          Intelligent field management for modern agriculture. Monitor crop
          stages, manage field assignments, and optimize your harvest.
        </p>

        <div className="flex gap-4 justify-center">
          <Link
            to="/login"
            className="bg-white text-green-600 font-bold py-3 px-8 rounded-lg hover:bg-gray-100 transition duration-200"
          >
            Login
          </Link>
          <Link
            to="/register"
            className="bg-transparent border-2 border-white text-white font-bold py-3 px-8 rounded-lg hover:bg-white hover:text-green-600 transition duration-200"
          >
            Register
          </Link>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mt-16">
        <div className="bg-white bg-opacity-10 backdrop-blur-lg p-6 rounded-lg text-white">
          <div className="text-3xl mb-4">👨‍🌾</div>
          <h3 className="text-xl font-semibold mb-2">Field Agents</h3>
          <p>Track assigned fields, submit updates, and monitor crop stages.</p>
        </div>

        <div className="bg-white bg-opacity-10 backdrop-blur-lg p-6 rounded-lg text-white">
          <div className="text-3xl mb-4">📊</div>
          <h3 className="text-xl font-semibold mb-2">Admin Dashboard</h3>
          <p>Manage all fields, assign to agents, and view comprehensive stats.</p>
        </div>

        <div className="bg-white bg-opacity-10 backdrop-blur-lg p-6 rounded-lg text-white">
          <div className="text-3xl mb-4">🎯</div>
          <h3 className="text-xl font-semibold mb-2">Smart Status</h3>
          <p>Automatic field status: Active, At Risk, or Completed.</p>
        </div>
      </div>
    </div>
  );
};

export default Home;
