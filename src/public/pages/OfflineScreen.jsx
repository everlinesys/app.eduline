import React from 'react';
import { WifiOff } from 'lucide-react'; // Using lucide-react for a clean app feel

export default function OfflineScreen({ onRetry }) {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 px-8">
      {/* Decorative Icon Container */}
      <div className="mb-8 p-6 bg-white rounded-3xl shadow-sm border border-gray-100 relative">
        <div className="absolute -top-2 -right-2 w-4 h-4 bg-red-500 rounded-full border-2 border-white" />
        <WifiOff size={48} className="text-gray-400" />
      </div>

      {/* Text Content */}
      <div className="space-y-2 mb-10">
        <h1 className="text-2xl font-bold text-gray-900 tracking-tight">
          Oops! Connection Lost
        </h1>
        <p className="text-gray-500 text-base leading-relaxed max-w-xs mx-auto">
          It looks like you're offline. Check your Wi-Fi or mobile data and give it another shot.
        </p>
      </div>

      {/* Interactive Actions */}
      <div className="w-full max-w-xs space-y-3">
        <button
          onClick={onRetry}
          className="w-full bg-indigo-600 hover:bg-indigo-700 active:scale-[0.98] text-white font-medium py-4 rounded-2xl transition-all shadow-md shadow-indigo-100"
        >
          Try Again
        </button>
        
        <button 
          className="w-full bg-transparent text-gray-400 text-sm font-medium py-2"
          onClick={() => window.location.reload()}
        >
          Refresh Page
        </button>
      </div>

      {/* Subtle Bottom Hint */}
      <p className="mt-12 text-xs text-gray-300 uppercase tracking-widest font-semibold">
        Offline Mode v1.0
      </p>
    </div>
  );
}