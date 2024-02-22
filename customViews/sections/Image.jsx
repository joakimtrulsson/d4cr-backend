import React, { useState, useEffect } from 'react';
import { v4 as uuidv4 } from 'uuid';

import { FieldContainer, FieldLabel, TextInput } from '@keystone-ui/fields';

import AddSectionButton from '../components/AddSectionButton/AddSectionButton.jsx';
import UpdateSectionButton from '../components/UpdateSectionButton/UpdateSectionButton.jsx';
import CancelButton from '../components/CancelButton/CancelButton.jsx';

import ImageLibrary from '../components/ImageLibrary/ImageLibrary.jsx';

function Image({
  onCloseSection,
  sectionsData,
  onChange,
  autoFocus,
  editData,
  sectionIndex,
  setSectionsData,
}) {
  const [title, setTitle] = useState();
  const [selectedFiles, setSelectedFiles] = useState([]);

  useEffect(() => {
    if (!editData) {
      return;
    }
    setTitle(editData.title);
    setSelectedFiles(editData.images);
  }, [editData]);

  async function handleSave() {
    if (onChange) {
      const newId = uuidv4();

      const newItem = {
        sectionType: 'IMAGE',
        id: newId,
        title,
        images: selectedFiles,
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
        sectionType: 'IMAGE',
        id: editData.id,
        title,
        images: selectedFiles,
      };

      sectionsData[sectionIndex] = updatedSection;

      onChange(JSON.stringify(sectionsData));
      onCloseSection();
    }
  }

  const handleChange = (key, inputValue) => {
    setTitle(inputValue);
  };

  return (
    <FieldContainer>
      <div style={{ marginBottom: '1rem' }}>
        <FieldLabel>Title</FieldLabel>
        <TextInput
          autoFocus={autoFocus}
          onChange={(event) => handleChange('title', event.target.value)}
          value={title}
        />
      </div>

      <ImageLibrary
        selectedFile={selectedFiles}
        setSelectedFile={setSelectedFiles}
        isMultiSelect={true}
      />

      <div style={{ paddingTop: '1rem', borderTop: '1px solid #e1e5e9' }}>
        {editData ? (
          <UpdateSectionButton handleUpdate={handleSaveUpdate}>
            Update
          </UpdateSectionButton>
        ) : (
          <AddSectionButton handleSaveSection={handleSave}>
            Add Image section
          </AddSectionButton>
        )}

        {editData && <CancelButton handleClose={onCloseSection}>Cancel</CancelButton>}
      </div>
    </FieldContainer>
  );
}

export default Image;
