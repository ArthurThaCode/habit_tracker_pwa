'use client';

import React from 'react';

const SplashScreen: React.FC = () => {
  return (
    <div
      data-testid="splash-screen"
      className="fixed inset-0 flex flex-col items-center justify-center bg-white z-50 animate-in fade-in duration-500"
    >
      <div className="text-center">
        <h1 className="text-4xl font-bold text-blue-600 mb-2">Habit Tracker</h1>
        <p className="text-gray-500 text-lg">Build better habits, one day at a time.</p>
      </div>
    </div>
  );
};

export default SplashScreen;
