import React from 'react';

export const CandyCane = ({ className }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    className={className}
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M12 2c-3 0-5 2-5 4v12c0 2 2 4 5 4s5-2 5-4V6c0-2-2-4-5-4z" />
    <path d="M7 8h10" strokeDasharray="2,2" />
    <path d="M7 12h10" strokeDasharray="2,2" />
    <path d="M7 16h10" strokeDasharray="2,2" />
  </svg>
);
