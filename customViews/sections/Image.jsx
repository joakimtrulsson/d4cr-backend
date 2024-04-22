import React, { useState, useEffect } from 'react';
import { v4 as uuidv4 } from 'uuid';

import {
  FieldContainer,
  FieldLabel,
  TextInput,
  FieldDescription,
} from '@keystone-ui/fields';

import AddSectionButton from '../components/AddSectionButton/AddSectionButton.jsx';
import UpdateSectionButton from '../components/UpdateSectionButton/UpdateSectionButton.jsx';
import CancelButton from '../components/CancelButton/CancelButton.jsx';
import ImageLibrary from '../components/ImageLibrary/ImageLibrary.jsx';
import ValidationError from '../components/ValidationError/ValidationError';
import { useValidation } from '../hooks/useValidation';
import ImageTooltip from '../components/ImageTooltip/ImageToolTip.jsx';
import CloseSectionAlert from '../components/CloseSectionAlert/CloseSectionAlert';

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
  const { validateFields, errors, setErrors } = useValidation(['sectionTitle', 'images']);
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    if (!editData) {
      return;
    }
    setTitle(editData.sectionTitle);
    setSelectedFiles(editData.images);
  }, [editData]);

  async function handleSave() {
    const fieldsToValidate = {
      sectionTitle: title,
      images: selectedFiles,
    };

    if (!validateFields(fieldsToValidate)) {
      return;
    }

    if (onChange) {
      const newId = uuidv4();

      const newItem = {
        sectionType: 'IMAGE',
        id: newId,
        sectionTitle: title,
        images: selectedFiles,
      };

      setSectionsData((prevSectionsData) => [...prevSectionsData, newItem]);
      onChange(JSON.stringify([...sectionsData, newItem]));
      onCloseSection();
    }
  }

  async function handleSaveUpdate() {
    const fieldsToValidate = {
      sectionTitle: title,
      images: selectedFiles,
    };

    if (!validateFields(fieldsToValidate)) {
      return;
    }

    if (onChange) {
      const updatedSection = {
        sectionType: 'IMAGE',
        id: editData.id,
        sectionTitle: title,
        images: selectedFiles,
      };

      sectionsData[sectionIndex] = updatedSection;

      onChange(JSON.stringify(sectionsData));
      onCloseSection();
    }
  }

  const handleChange = (key, inputValue) => {
    setTitle(inputValue);
    setErrors((prev) => prev.filter((error) => error !== key));
  };

  const handleOpenModal = async () => {
    setIsOpen(true);
  };

  const handleCancel = () => {
    setIsOpen(false);
  };

  return (
    <FieldContainer>
      <div
        style={{
          display: 'flex',
          flexDirection: 'row',
          marginBottom: '1rem',
          paddingBottom: '0.5rem',
          borderBottom: '1px solid #e1e5e9',
          width: '700px',
        }}
      >
        <FieldLabel
          style={{
            fontSize: '1.3rem',
          }}
        >
          Images - <ImageTooltip type='IMAGE' />
        </FieldLabel>
        <CancelButton
          handleClose={handleOpenModal}
          style={{ marginTop: 0, marginLeft: 'auto' }}
        >
          Close section
        </CancelButton>
      </div>

      <div style={{ marginBottom: '1rem' }}>
        <FieldLabel>Section identifier</FieldLabel>
        <FieldDescription>
          Unique identifier for this section, used in the sections list.
        </FieldDescription>
        <TextInput
          autoFocus={autoFocus}
          onChange={(event) => handleChange('sectionTitle', event.target.value)}
          value={title}
        />

        {errors.includes('sectionTitle') && (
          <ValidationError field='Section identifier' />
        )}
      </div>

      <div style={{ marginBottom: '1rem' }}>
        <ImageLibrary
          selectedFile={selectedFiles}
          setSelectedFile={setSelectedFiles}
          isMultiSelect={true}
        />
        {errors.includes('images') && <ValidationError field='Images' />}
      </div>

      <div
        style={{
          borderTop: '1px solid #e1e5e9',
          paddingTop: '0.5rem',
        }}
      >
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

      <CloseSectionAlert
        isOpen={isOpen}
        handleCancel={handleCancel}
        handleConfirm={onCloseSection}
      />
    </FieldContainer>
  );
}

export default Image;
