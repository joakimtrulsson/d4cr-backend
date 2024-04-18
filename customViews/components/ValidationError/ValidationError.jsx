import React from 'react';

function ValidationError({ field }) {
  return <p style={{ color: '#ff0200', marginTop: '0' }}>{field} must not be empty</p>;
}

export default ValidationError;
