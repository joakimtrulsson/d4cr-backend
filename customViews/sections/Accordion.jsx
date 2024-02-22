import React, { useState, useEffect } from 'react';
import { v4 as uuidv4 } from 'uuid';

import { FieldContainer, FieldLabel, TextInput } from '@keystone-ui/fields';

import Wysiwyg from '../components/Wysiwyg/Wysiwyg';
import AddSectionButton from '../components/AddSectionButton/AddSectionButton';
import RemoveEntryButton from '../components/RemoveEntryButton/RemoveEntryButton';
import AddEntryButton from '../components/AddEntryButton/AddEntryButton';
import UpdateSectionButton from '../components/UpdateSectionButton/UpdateSectionButton';
import CancelButton from '../components/CancelButton/CancelButton';

function Accordion({
  onCloseSection,
  onChange,
  sectionsData,
  sectionIndex,
  setSectionsData,
  autoFocus,
  editData,
}) {
  const [value, setValue] = useState(() => {
    if (editData) {
      return editData;
    } else {
      return {
        title: '',
        fields: [{ heading: '', bodyText: '' }],
      };
    }
  });

  useEffect(() => {
    if (editData) {
      setValue(editData);
    }
  }, [editData]);

  function handleSave() {
    if (onChange) {
      const newItem = {
        sectionType: 'ACCORDION',
        id: uuidv4(),
        ...value,
      };
      setSectionsData((prevSectionsData) => [...prevSectionsData, newItem]);
      onChange(JSON.stringify([...sectionsData, newItem]));
      onCloseSection();
    }
  }

  async function handleSaveUpdate(event) {
    event.preventDefault();

    if (onChange) {
      const updatedSection = {
        sectionType: 'MEDIATEXT',
        id: editData.id,
        ...value,
      };

      sectionsData[sectionIndex] = updatedSection;

      onChange(JSON.stringify(sectionsData));
      onCloseSection();
    }
  }

  const handleChange = (key, inputValue) => {
    setValue((prev) => ({
      ...prev,
      [key]: inputValue,
    }));
  };

  const handleAddField = () => {
    setValue((prev) => ({
      ...prev,
      fields: [...prev.fields, { heading: '', bodyText: '' }],
    }));
  };

  const handleFieldChange = (index, fieldType, fieldValue) => {
    setValue((prev) => ({
      ...prev,
      fields: prev.fields.map((field, i) =>
        i === index ? { ...field, [fieldType]: fieldValue } : field
      ),
    }));
  };

  const handleRemoveField = (indexToRemove) => {
    setValue((prev) => ({
      ...prev,
      fields: prev.fields.filter((_, index) => index !== indexToRemove),
    }));
  };

  return (
    <FieldContainer>
      <div
        style={{
          marginBottom: '2rem',
        }}
      >
        <FieldLabel style={{ paddingTop: '0.5rem' }}>Section title</FieldLabel>
        <TextInput
          autoFocus={autoFocus}
          onChange={(event) => handleChange('title', event.target.value)}
          value={value.title}
        />
      </div>

      {value.fields.map((field, index) => (
        <div key={index} style={{ marginBottom: '1rem' }}>
          <FieldLabel
            style={{
              paddingTop: '1rem',

              borderTop: '1px solid #e1e5e9',
            }}
          >{`Heading ${index + 1}`}</FieldLabel>
          <TextInput
            style={{ marginBottom: '1rem' }}
            autoFocus={autoFocus}
            onChange={(event) => handleFieldChange(index, 'heading', event.target.value)}
            value={field.heading}
          />
          <FieldLabel>{`Body Text ${index + 1}`}</FieldLabel>

          <Wysiwyg
            onSetPreamble={(preamble) => handleFieldChange(index, 'bodyText', preamble)}
            editData={field.bodyText}
            extended={false}
          />
          {value.fields.length > 1 && (
            <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
              <RemoveEntryButton
                style={{ marginTop: '1rem' }}
                handleRemove={handleRemoveField}
                indexToRemove={index}
              >
                Remove entry
              </RemoveEntryButton>
            </div>
          )}
        </div>
      ))}

      <div style={{ borderTop: '1px solid #e1e5e9' }}>
        <AddEntryButton handleAdd={handleAddField}>Add field</AddEntryButton>

        {editData ? (
          <UpdateSectionButton handleUpdate={handleSaveUpdate}>
            Update
          </UpdateSectionButton>
        ) : (
          <AddSectionButton handleSaveSection={handleSave}>
            Add Accordion section
          </AddSectionButton>
        )}
        {editData && <CancelButton handleClose={onCloseSection}>Cancel</CancelButton>}
      </div>
    </FieldContainer>
  );
}

export default Accordion;
