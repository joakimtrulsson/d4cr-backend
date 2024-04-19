import React from 'react';

export default function PrimaryButton({ title, type, disabled, onClick }) {
  return (
    <div>
      <button
        type={type}
        disabled={disabled}
        onClick={onClick}
        className='primary-button uppercase'
      >
        {title}
      </button>
    </div>
  );
}
