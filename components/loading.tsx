import React from 'react'

interface Props {}

const LoadingComponent = () => {
  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-r from-blue-500 to-purple-600">
      <div className="flex flex-col items-center space-y-4">
        <div className="w-16 h-16 border-t-4 border-white border-solid rounded-full animate-spin"></div>
        <p className="text-xl text-white font-semibold">Loading...</p>
      </div>
    </div>
  )
}

export default LoadingComponent