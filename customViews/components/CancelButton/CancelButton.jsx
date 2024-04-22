import React from 'react';
import { Button } from '@keystone-ui/button';

function CancelButton({ style, handleClose, children }) {
  return (
    <Button
      style={{ marginLeft: '0.5rem', ...style }}
      onClick={handleClose}
      tone='negative'
      weight='light'
      size='small'
    >
      {children}
    </Button>
  );
}

export default CancelButton;
