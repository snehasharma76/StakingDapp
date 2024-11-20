'use client'

import React from 'react'

const Navigation = () => {
  return (
    <nav className="bg-christmas-red shadow-lg">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Left side menu */}
          <div className="hidden md:flex items-center space-x-8">
            <a href="#" className="text-white hover:text-white/80 transition-colors">Home</a>
            <a href="#" className="text-white hover:text-white/80 transition-colors">About</a>
            <a href="#" className="text-white hover:text-white/80 transition-colors">Features</a>
          </div>

          {/* Logo */}
          <div className="flex-shrink-0 flex items-center">
            <span className="text-3xl">🎄</span>
            <span className="ml-2 text-xl font-bold text-white">Festive Staking</span>
          </div>

          {/* Right side menu */}
          <div className="hidden md:flex items-center space-x-8">
            <a href="#" className="text-white hover:text-white/80 transition-colors">Documentation</a>
            <a href="#" className="text-white hover:text-white/80 transition-colors">Support</a>
            <a href="#" className="text-white hover:text-white/80 transition-colors">Contact</a>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <button className="text-white">
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Christmas lights */}
      <div className="christmas-lights"></div>
    </nav>
  )
}

export default Navigation
