import React from 'react';
import { Button } from '@keystone-ui/button';

function CancelButton({ handleClose, children }) {
  return (
    <Button
      style={{ marginTop: '1rem', marginLeft: '0.5rem' }}
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
