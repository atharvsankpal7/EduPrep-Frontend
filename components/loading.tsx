"use client"
import React from 'react'

const PWALoadingScreen = () => {
  return (
    <div className="fixed inset-0 flex items-center justify-center min-h-screen bg-gradient-to-br from-indigo-900 to-purple-800 w-full z-50">
      <div className="flex flex-col items-center space-y-8 p-8 max-w-md">
        {/* App Icon with shine effect */}
        <div className="relative">
          <div className="w-24 h-24 bg-white rounded-2xl shadow-2xl flex items-center justify-center transform rotate-0 hover:rotate-12 transition-transform duration-1000">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-12 w-12 text-indigo-600"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M13 10V3L4 14h7v7l9-11h-7z"
              />
            </svg>
          </div>
          <div className="absolute inset-0 rounded-2xl bg-white opacity-20 animate-ping-slow pointer-events-none"></div>
        </div>

        {/* App Name */}
        <h1 className="text-3xl font-bold text-white tracking-wide">
          Edu-Prep
        </h1>

        {/* Animated Progress Bar */}
        <div className="w-full bg-gray-700 rounded-full h-3 overflow-hidden">
          <div
            className="bg-white h-full rounded-full animate-progress"
            style={{
              width: '0%',
              animation: 'progressAnimation 5s ease-in-out forwards',
            }}
          ></div>
        </div>

        {/* Loading text with animation */}
        <p className="text-lg text-white opacity-90 flex space-x-2">
          <span className="animate-bounce" style={{ animationDelay: '0.1s' }}>
            L
          </span>
          <span className="animate-bounce" style={{ animationDelay: '0.2s' }}>
            o
          </span>
          <span className="animate-bounce" style={{ animationDelay: '0.3s' }}>
            a
          </span>
          <span className="animate-bounce" style={{ animationDelay: '0.4s' }}>
            d
          </span>
          <span className="animate-bounce" style={{ animationDelay: '0.5s' }}>
            i
          </span>
          <span className="animate-bounce" style={{ animationDelay: '0.6s' }}>
            n
          </span>
          <span className="animate-bounce" style={{ animationDelay: '0.7s' }}>
            g
          </span>
        </p>

        {/* Subtle footer */}
        <p className="text-sm text-white opacity-70 mt-8">
          EduPrep-Mock Test Platform ©{new Date().getFullYear()}
        </p>
      </div>

      {/* Add custom animation keyframes to your global CSS */}
      <style jsx global>{`
        @keyframes progressAnimation {
          0% {
            width: 0%;
          }
          70% {
            width: 85%;
          }
          100% {
            width: 100%;
          }
        }
        @keyframes ping-slow {
          0% {
            transform: scale(0.8);
            opacity: 0.8;
          }
          70% {
            transform: scale(1.3);
            opacity: 0;
          }
          100% {
            transform: scale(1.3);
            opacity: 0;
          }
        }
        .animate-ping-slow {
          animation: ping-slow 2s cubic-bezier(0, 0, 0.2, 1) infinite;
        }
      `}</style>
    </div>
  )
}

export default PWALoadingScreen