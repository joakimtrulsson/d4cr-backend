import React from 'react';
import { Button } from '@keystone-ui/button';

function AddEntryButton({ style, handleAdd, children }) {
  return (
    <Button
      style={{ ...style, marginRight: '0.5rem' }}
      onClick={handleAdd}
      tone='positive'
      weight='bold'
      size='small'
    >
      {children}
    </Button>
  );
}

export default AddEntryButton;
