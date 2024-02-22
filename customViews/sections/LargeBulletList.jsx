import React, { useState, useEffect } from 'react';
import { v4 as uuidv4 } from 'uuid';

import { FieldContainer, FieldLabel, TextInput, Select } from '@keystone-ui/fields';

import Wysiwyg from '../components/Wysiwyg/Wysiwyg';
import AddSectionButton from '../components/AddSectionButton/AddSectionButton';
import RemoveEntryButton from '../components/RemoveEntryButton/RemoveEntryButton';
import AddEntryButton from '../components/AddEntryButton/AddEntryButton';
import UpdateSectionButton from '../components/UpdateSectionButton/UpdateSectionButton';
import CancelButton from '../components/CancelButton/CancelButton';

const listOptions = [
  { value: 'ORDERED', label: 'Numbered List' },
  { value: 'UNORDERED', label: 'Bulleted List' },
];

function BulletList({
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
        bullets: [{ bodyText: '' }],
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
        sectionType: 'BULLETLIST',
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
      bullets: [...prev.bullets, { bodyText: '' }],
    }));
  };

  const handleFieldChange = (index, fieldType, fieldValue) => {
    setValue((prev) => ({
      ...prev,
      bullets: prev.bullets.map((field, i) =>
        i === index ? { ...field, [fieldType]: fieldValue } : field
      ),
    }));
  };

  const handleRemoveField = (indexToRemove) => {
    setValue((prev) => ({
      ...prev,
      bullets: prev.bullets.filter((_, index) => index !== indexToRemove),
    }));
  };

  return (
    <FieldContainer>
      <div
        style={{
          marginBottom: '1rem',
        }}
      >
        <FieldLabel>Section title</FieldLabel>
        <TextInput
          autoFocus={autoFocus}
          onChange={(event) => handleChange('title', event.target.value)}
          value={value.title}
        />
      </div>

      <div
        style={{
          marginBottom: '1rem',
        }}
      >
        <FieldLabel>Subheader</FieldLabel>
        <TextInput
          autoFocus={autoFocus}
          onChange={(event) => handleChange('subHeader', event.target.value)}
          value={value.subHeader}
        />
      </div>

      <div>
        <FieldLabel style={{ paddingTop: '0.5rem', borderTop: '1px solid #e1e5e9' }}>
          List type
        </FieldLabel>
        <Select
          value={listOptions.find((option) => option.value === value.listType)}
          options={listOptions}
          onChange={(selectedOption) => handleChange('listType', selectedOption.value)}
        />
      </div>

      {value.bullets.map((field, index) => {
        return (
          <div key={index} style={{ marginBottom: '1rem', marginTop: '1rem' }}>
            <FieldLabel>{`Body Text ${index + 1}`}</FieldLabel>

            <Wysiwyg
              onSetPreamble={(preamble) => handleFieldChange(index, 'bodyText', preamble)}
              editData={field.bodyText}
              extended={false}
            />
            {value.bullets.length > 1 && (
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
        );
      })}

      <div>
        <AddEntryButton handleAdd={handleAddField}>Add field</AddEntryButton>

        {editData ? (
          <UpdateSectionButton handleUpdate={handleSaveUpdate}>
            Update
          </UpdateSectionButton>
        ) : (
          <AddSectionButton handleSaveSection={handleSave}>
            Add Bullet List section
          </AddSectionButton>
        )}
        {editData && <CancelButton handleClose={onCloseSection}>Cancel</CancelButton>}
      </div>
    </FieldContainer>
  );
}

export default BulletList;
