import React from 'react';

import { FieldContainer } from '@keystone-ui/fields';
import Editor from '../components/Editor/Editor.jsx';

export const Field = ({ field, value, onChange, autoFocus }) => {
  return (
    <FieldContainer style={{ display: 'flex', flexDirection: 'column' }}>
      <Editor onChange={onChange} value={value} extended={true} />
    </FieldContainer>
  );
};
