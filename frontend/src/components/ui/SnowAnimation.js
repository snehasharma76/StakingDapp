'use client'

import React from 'react'
import { useEffect, useState } from 'react'

const Snowflake = ({ style }) => (
  <div className="absolute animate-snow" style={style}>
    <div className="snowflake">
      <div className="snowflake-inner">
        <div className="snowflake-arm arm-1"></div>
        <div className="snowflake-arm arm-2"></div>
        <div className="snowflake-arm arm-3"></div>
        <div className="snowflake-arm arm-4"></div>
        <div className="snowflake-arm arm-5"></div>
        <div className="snowflake-arm arm-6"></div>
      </div>
    </div>
  </div>
)

const SnowAnimation = () => {
  const [snowflakes, setSnowflakes] = useState([])

  useEffect(() => {
    const createSnowflake = () => {
      const left = Math.random() * 100
      const delay = Math.random() * 5 // Random delay for start
      const animationDuration = 5 + Math.random() * 10
      const size = 10 + Math.random() * 15
      const opacity = 0.4 + Math.random() * 0.6
      const rotation = Math.random() * 360

      return {
        id: Math.random(),
        style: {
          left: `${left}%`,
          animationDelay: `${delay}s`,
          animationDuration: `${animationDuration}s`,
          width: `${size}px`,
          height: `${size}px`,
          opacity,
          transform: `rotate(${rotation}deg)`
        }
      }
    }

    // Create initial snowflakes
    const initialSnowflakes = Array.from({ length: 50 }, createSnowflake)
    setSnowflakes(initialSnowflakes)

    // Add new snowflakes periodically
    const interval = setInterval(() => {
      setSnowflakes(prev => [...prev.slice(-49), createSnowflake()])
    }, 500)

    return () => clearInterval(interval)
  }, [])

  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden">
      {snowflakes.map(snowflake => (
        <Snowflake key={snowflake.id} style={snowflake.style} />
      ))}
    </div>
  )
}

export default SnowAnimation
