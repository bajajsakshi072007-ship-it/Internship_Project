import React from 'react'
import { Link } from 'react-router-dom'

const NotFound = () => {
  return (
    <div className="min-h-[80vh] flex flex-col items-center justify-center text-center p-6 space-y-4 animate-fade-in">
      <h1 className="text-8xl font-extrabold text-primary-500 font-heading tracking-widest">404</h1>
      <h2 className="text-2xl font-bold text-gray-900">Page Not Found</h2>
      <p className="text-gray-500 max-w-md">
        The page you are looking for might have been removed, had its name changed, or is temporarily unavailable.
      </p>
      <Link to="/" className="btn btn-primary btn-lg">
        Go Back Home
      </Link>
    </div>
  )
}

export default NotFound
