import React from 'react';

const Landing = () => {
  return (
    <div className="min-h-screen bg-gradient-to-r from-blue-100 to-blue-300 flex items-center justify-center p-6">
      <div className="max-w-2xl text-center bg-white p-10 rounded-2xl shadow-xl">
        <h1 className="text-4xl md:text-5xl font-bold text-blue-800 mb-4">
          Welcome to NCTV 360
        </h1>
        <p className="text-gray-700 text-lg mb-6">
          N-Compass TV’s business model boasts high revenue potential and low startup costs, making it an attractive option for aspiring entrepreneurs.
        </p>
        <button className="px-6 py-3 bg-blue-700 text-white font-semibold rounded-xl hover:bg-blue-800 transition">
          Get Started
        </button>
      </div>
    </div>
  );
};

export default Landing;
