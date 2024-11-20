'use client'

import React from 'react'

const ChristmasTree = () => {
  return (
    <div className="fixed bottom-0 right-0 pointer-events-none opacity-30 z-0">
      <svg
        width="400"
        height="600"
        viewBox="0 0 400 600"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M200 0L350 200L300 200L400 350L350 350L400 500L0 500L50 350L0 350L100 200L50 200L200 0Z"
          fill="currentColor"
          className="text-christmas-green"
        />
        <rect x="175" y="500" width="50" height="100" fill="#4A2506" />
      </svg>
    </div>
  )
}

export default ChristmasTree
