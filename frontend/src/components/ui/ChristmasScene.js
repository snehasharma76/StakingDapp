'use client'

import React from 'react'

const ChristmasScene = () => {
  return (
    <div className="fixed inset-0 pointer-events-none z-0">
      {/* Stars */}
      <div className="absolute inset-0">
        {[...Array(40)].map((_, i) => (
          <div
            key={i}
            className="absolute w-1 h-1 bg-white rounded-full animate-twinkle"
            style={{
              top: `${Math.random() * 40}%`,
              left: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 2}s`,
              opacity: Math.random() * 0.7 + 0.3,
              transform: `scale(${Math.random() * 0.5 + 0.5})`
            }}
          ></div>
        ))}
      </div>
    </div>
  )
}

export default ChristmasScene
