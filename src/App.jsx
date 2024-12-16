import './App.css'

import React from 'react';
import SystemDashboard from './SystemDashboard';

function App() {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        <SystemDashboard />
      </div>
    </div>
  );
}

export default App;