import React, { useState, useEffect } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { FieldContainer, FieldLabel, TextInput } from '@keystone-ui/fields';

import Wysiwyg from '../components/Wysiwyg/Wysiwyg.jsx';
import AddSectionButton from '../components/AddSectionButton/AddSectionButton.jsx';
import UpdateSectionButton from '../components/UpdateSectionButton/UpdateSectionButton.jsx';
import CancelButton from '../components/CancelButton/CancelButton.jsx';

function WysiwygSection({
  onCloseSection,
  sectionsData,
  onChange,
  autoFocus,
  editData,
  sectionIndex,
  setSectionsData,
}) {
  const [value, setValue] = useState({ title: '' });

  useEffect(() => {
    if (!editData) {
      return;
    }
    setValue(editData);
  }, [editData]);

  async function handleSave() {
    if (onChange) {
      const newId = uuidv4();

      const newItem = {
        sectionType: 'WYSIWYG',
        id: newId,

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
        sectionType: 'WYSIWYG',
        id: editData.id,
        ...value,
      };

      sectionsData[sectionIndex] = updatedSection;

      onChange(JSON.stringify(sectionsData));
      onCloseSection();
    }
  }

  function setPreamble(preamble) {
    setValue((prev) => ({
      ...prev,
      preamble,
    }));
  }

  const handleChange = (key, inputValue) => {
    if (key === 'anchorText' || key === 'url') {
      setValue((prev) => ({
        ...prev,
        cta: { ...prev.cta, [key]: inputValue },
        // url: inputValue.toLowerCase().replace(/\s/g, '-'),
      }));
      return;
    }

    setValue((prev) => ({
      ...prev,
      [key]: inputValue,
    }));
  };

  return (
    <FieldContainer>
      <div style={{ marginBottom: '1rem' }}>
        <FieldLabel>Title</FieldLabel>
        <TextInput
          autoFocus={autoFocus}
          onChange={(event) => handleChange('title', event.target.value)}
          value={value.title}
        />
      </div>

      <div>
        <FieldLabel>Text</FieldLabel>
        <Wysiwyg
          onSetPreamble={setPreamble}
          editData={editData?.preamble}
          extended={true}
        />
      </div>

      <div style={{ margin: '1rem 0' }}>
        {editData ? (
          <UpdateSectionButton handleUpdate={handleSaveUpdate}>
            Update
          </UpdateSectionButton>
        ) : (
          <AddSectionButton handleSaveSection={handleSave}>
            Add WYSIWYG section
          </AddSectionButton>
        )}
      </div>

      <div style={{ borderTop: '1px solid #e1e5e9' }}>
        {editData && <CancelButton handleClose={onCloseSection}>Cancel</CancelButton>}
      </div>
    </FieldContainer>
  );
}

export default WysiwygSection;
