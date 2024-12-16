import React, { useState, useEffect } from 'react';
import { 
  User, 
  Clock, 
  Cpu, 
  Battery, 
  BarChart2, 
  MapPin, 
  Server 
} from 'lucide-react';

const SystemDashboard = () => {
  const [systemInfo, setSystemInfo] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Debugging: Log environment variables
  console.log('Environment Variables:', {
    VITE_BACKEND_URL: import.meta.env.VITE_BACKEND_URL
  });

  // Get backend URL from environment or use a default
  const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || 'https://replit.com/@aa0680/system-dashboard-backend';

  useEffect(() => {
    const fetchSystemInfo = async () => {
      try {
        console.log(`Fetching from URL: ${BACKEND_URL}/system-info`);

        const response = await fetch(`${BACKEND_URL}/system-info`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            // Add any necessary CORS or authentication headers
          }
        });

        console.log('Response status:', response.status);

        if (!response.ok) {
          const errorText = await response.text();
          throw new Error(`Network response was not ok: ${errorText}`);
        }

        const data = await response.json();
        console.log('Received system info:', data);

        setSystemInfo(data);
        setLoading(false);
      } catch (err) {
        console.error('Fetch error:', err);
        setError(err.message);
        setLoading(false);
      }
    };

    // Initial fetch
    fetchSystemInfo();

    // Periodic update every 5 seconds
    const intervalId = setInterval(fetchSystemInfo, 5000);

    // Cleanup interval on component unmount
    return () => clearInterval(intervalId);
  }, [BACKEND_URL]);

  // Debugging: Log state changes
  useEffect(() => {
    console.log('Current loading state:', loading);
    console.log('Current error state:', error);
    console.log('Current systemInfo:', systemInfo);
  }, [loading, error, systemInfo]);

  // Detailed error rendering
  if (loading) return (
    <div className="flex justify-center items-center h-screen text-2xl">
      Loading system information...
    </div>
  );

  if (error) return (
    <div className="text-red-500 p-4">
      <h2 className="text-2xl font-bold mb-4">Error Fetching System Information</h2>
      <p>Details: {error}</p>
      <p>Possible reasons:</p>
      <ul className="list-disc pl-5">
        <li>Backend server is not running</li>
        <li>Network connectivity issues</li>
        <li>Incorrect backend URL</li>
        <li>CORS (Cross-Origin Resource Sharing) restrictions</li>
      </ul>
      <p className="mt-4">
        Please check:
        1. Backend URL is correct
        2. Backend server is running
        3. No network blocking
      </p>
    </div>
  );

  // Fallback if systemInfo is null
  if (!systemInfo) return (
    <div className="text-yellow-500 p-4">
      No system information available. Please check your backend.
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-4xl mx-auto bg-white shadow-lg rounded-lg p-6">
        <h1 className="text-3xl font-bold mb-6 text-center">System Resource Dashboard</h1>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {/* Current Time */}
          <div className="bg-blue-100 p-4 rounded-lg flex items-center">
            <Clock className="mr-4 text-blue-600" />
            <div>
              <h2 className="font-semibold">Current Time</h2>
              <p>{systemInfo.current_time || 'N/A'}</p>
            </div>
          </div>

          {/* Python Version */}
          <div className="bg-green-100 p-4 rounded-lg flex items-center">
            <User className="mr-4 text-green-600" />
            <div>
              <h2 className="font-semibold">Python Version</h2>
              <p>{systemInfo.python_version || 'N/A'}</p>
            </div>
          </div>

          {/* Battery Status */}
          <div className="bg-yellow-100 p-4 rounded-lg flex items-center">
            <Battery className="mr-4 text-yellow-600" />
            <div>
              <h2 className="font-semibold">Battery</h2>
              <p>
                {systemInfo.battery?.percent !== null 
                  ? `${systemInfo.battery.percent}%` 
                  : 'N/A'}
                {systemInfo.battery?.power_plugged !== null 
                  ? ` (${systemInfo.battery.power_plugged ? 'Charging' : 'Not Charging'})` 
                  : ''}
              </p>
            </div>
          </div>

          {/* CPU Usage */}
          <div className="bg-purple-100 p-4 rounded-lg flex items-center">
            <Cpu className="mr-4 text-purple-600" />
            <div>
              <h2 className="font-semibold">CPU</h2>
              <p>Usage: {systemInfo.cpu?.usage || 'N/A'}%</p>
              <p>
                Temperature: {systemInfo.cpu?.temperature !== null 
                  ? `${systemInfo.cpu.temperature}°C` 
                  : 'N/A'}
              </p>
            </div>
          </div>

          {/* RAM Usage */}
          <div className="bg-indigo-100 p-4 rounded-lg flex items-center">
            <Server className="mr-4 text-indigo-600" />
            <div>
              <h2 className="font-semibold">RAM</h2>
              <p>Used: {systemInfo.ram?.used ? systemInfo.ram.used.toFixed(2) : 'N/A'} GB</p>
              <p>Total: {systemInfo.ram?.total ? systemInfo.ram.total.toFixed(2) : 'N/A'} GB</p>
              <p>Usage: {systemInfo.ram?.percent || 'N/A'}%</p>
            </div>
          </div>

          {/* GPU Usage */}
          <div className="bg-red-100 p-4 rounded-lg flex items-center">
            <BarChart2 className="mr-4 text-red-600" />
            <div>
              <h2 className="font-semibold">GPU</h2>
              {systemInfo.gpu ? (
                <>
                  <p>Name: {systemInfo.gpu.name || 'N/A'}</p>
                  <p>Load: {systemInfo.gpu.load ? systemInfo.gpu.load.toFixed(2) : 'N/A'}%</p>
                  <p>Memory: {systemInfo.gpu.memory_used || 'N/A'} / {systemInfo.gpu.memory_total || 'N/A'} MB</p>
                </>
              ) : (
                <p>No GPU detected</p>
              )}
            </div>
          </div>

          {/* Location */}
          <div className="bg-teal-100 p-4 rounded-lg flex items-center col-span-full">
            <MapPin className="mr-4 text-teal-600" />
            <div>
              <h2 className="font-semibold">Location</h2>
              <p>
                {systemInfo.location?.city || 'Unknown'}, 
                {systemInfo.location?.region || 'Unknown'}, 
                {systemInfo.location?.country || 'Unknown'}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SystemDashboard;