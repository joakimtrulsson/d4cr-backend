import React, { useState, useEffect } from 'react';

import { FieldContainer, FieldLabel, FieldDescription } from '@keystone-ui/fields';

import IconPicker from '../components/IconPicker/IconPicker.jsx';

export const Field = ({ field, value, onChange, autoFocus }) => {
  const [iconName, setIconName] = useState('');

  useEffect(() => {
    if (!value) {
      return;
    }
    setIconName(JSON.parse(value).iconName);
  }, [value]);

  const handleSave = (iconName) => {
    setIconName(iconName);
    onChange(JSON.stringify({ iconName }));
  };

  return (
    <FieldContainer>
      <FieldLabel>{field.label}</FieldLabel>
      <FieldDescription>{field.description}</FieldDescription>
      <IconPicker value={iconName} onChange={handleSave} />
    </FieldContainer>
  );
};
