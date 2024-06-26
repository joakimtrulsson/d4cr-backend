import React, { useState } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { FieldContainer, FieldLabel, FieldDescription } from '@keystone-ui/fields';

import { Editor, AddEntryButton, RemoveEntryButton } from '../components/index.js';

export const Field = ({ field, value, onChange, autoFocus }) => {
  const [values, setValues] = useState(
    value ? JSON.parse(value) : [{ id: uuidv4(), text: '' }]
  );

  const handleInputChange = (index, data) => {
    setValues((prev) => {
      const newState = [...prev];
      newState[index].text = data;
      return newState;
    });
    onChange(JSON.stringify(values));
  };

  const handleAddField = () => {
    const newId = uuidv4();

    setValues((prev) => [...prev, { id: newId, text: '' }]);
  };

  const handleRemoveField = (idToRemove) => {
    // Skapa en ny array utan objektet som har det angivna id
    const updatedValues = values.filter((item) => item.id !== idToRemove);

    // Uppdatera values och anropa onChange
    setValues(updatedValues);
    onChange(JSON.stringify(updatedValues));
  };

  return (
    <FieldContainer>
      <FieldLabel>Principle Bulletpoint</FieldLabel>
      {field.description && <FieldDescription>{field.description}</FieldDescription>}

      {values.map((subprinciple, index) => {
        return (
          <div key={subprinciple.id} style={{ marginBottom: '1rem', marginTop: '1rem' }}>
            <FieldLabel>{`Bulletpoint ${index + 1}`}</FieldLabel>
            <Editor
              onSetPreamble={(value) => handleInputChange(index, value)}
              editData={values[index].text}
              extended={false}
              height={'100'}
            />
            <RemoveEntryButton
              handleRemove={handleRemoveField}
              indexToRemove={subprinciple.id}
              style={{ marginTop: '1rem' }}
            >
              Remove entry
            </RemoveEntryButton>
          </div>
        );
      })}

      <AddEntryButton handleAdd={handleAddField}>Add new point</AddEntryButton>
    </FieldContainer>
  );
};
