'use client'

import React from 'react'

const ChristmasLights = () => {
  const colors = ['#ff0000', '#00ff00', '#0000ff', '#ffff00', '#ff00ff', '#00ffff']
  const lights = Array.from({ length: 20 }, (_, i) => ({
    id: i,
    color: colors[i % colors.length]
  }))

  return (
    <div className="absolute -top-4 left-0 right-0 flex justify-around">
      {lights.map((light) => (
        <div
          key={light.id}
          className="w-3 h-3 rounded-full animate-twinkle"
          style={{
            backgroundColor: light.color,
            boxShadow: `0 0 10px ${light.color}, 0 0 20px ${light.color}`,
            animation: `twinkle ${1 + Math.random()}s ease-in-out infinite`
          }}
        />
      ))}
    </div>
  )
}

export default ChristmasLights
