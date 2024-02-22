import React from 'react';
import { Button } from '@keystone-ui/button';

function RemoveEntryButton({ handleRemove, indexToRemove, children, style }) {
  return (
    <Button
      style={{ ...style, marginRight: '0.5rem' }}
      onClick={() => handleRemove(indexToRemove)}
      tone='negative'
      weight='light'
      size='small'
    >
      {children}
    </Button>
  );
}

export default RemoveEntryButton;
