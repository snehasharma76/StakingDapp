'use client'

import React, { useEffect, useState } from 'react'

const SantaSleigh = () => {
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    // Show Santa every 20 seconds
    const interval = setInterval(() => {
      setIsVisible(true)
      // Hide Santa after animation completes (10s)
      setTimeout(() => setIsVisible(false), 10000)
    }, 20000)

    // Show Santa immediately on first load
    setIsVisible(true)
    setTimeout(() => setIsVisible(false), 10000)

    return () => clearInterval(interval)
  }, [])

  if (!isVisible) return null

  return (
    <div className="fixed top-20 left-0 right-0 pointer-events-none">
      <div className="animate-fly-across">
        <div className="text-4xl whitespace-nowrap flex items-center animate-sleigh-bounce">
          <span className="transform -rotate-12">🎅</span>
          <span className="text-3xl mx-1">🦌🦌🦌</span>
          <span className="text-3xl">✨</span>
          <span className="ml-2 transform rotate-12">🎁</span>
          <span className="transform rotate-12">🎄</span>
        </div>
      </div>
    </div>
  )
}

export default SantaSleigh
