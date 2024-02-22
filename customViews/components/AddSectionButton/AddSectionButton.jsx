import React from 'react';
import { Button } from '@keystone-ui/button';

function AddSectionButton({ handleSaveSection, children }) {
  return (
    <Button onClick={handleSaveSection} tone='active' weight='bold' size='small'>
      {children}
    </Button>
  );
}

export default AddSectionButton;
