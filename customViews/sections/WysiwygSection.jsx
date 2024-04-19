import React, { useState, useEffect } from 'react';
import { v4 as uuidv4 } from 'uuid';
import {
  FieldContainer,
  FieldLabel,
  TextInput,
  FieldDescription,
} from '@keystone-ui/fields';

import Editor from '../components/Editor/Editor.jsx';
import AddSectionButton from '../components/AddSectionButton/AddSectionButton.jsx';
import UpdateSectionButton from '../components/UpdateSectionButton/UpdateSectionButton.jsx';
import CancelButton from '../components/CancelButton/CancelButton.jsx';
import ValidationError from '../components/ValidationError/ValidationError';
import CloseSectionAlert from '../components/CloseSectionAlert/CloseSectionAlert';
import ImageTooltip from '../components/ImageTooltip/ImageToolTip.jsx';
import { useValidation } from '../hooks/useValidation';

function WysiwygSection({
  onCloseSection,
  sectionsData,
  onChange,
  autoFocus,
  editData,
  sectionIndex,
  setSectionsData,
}) {
  const [value, setValue] = useState({ sectionTitle: '' });
  const { validateFields, errors, setErrors } = useValidation([
    'sectionTitle',
    'preamble',
  ]);
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    if (!editData) {
      return;
    }
    setValue(editData);
  }, [editData]);

  async function handleSave() {
    if (!validateFields(value)) {
      return;
    }

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

  async function handleSaveUpdate() {
    if (!validateFields(value)) {
      return;
    }

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
    setErrors((prev) => prev.filter((error) => error !== 'preamble'));
    setValue((prev) => ({
      ...prev,
      preamble,
    }));
  }

  const handleChange = (key, inputValue) => {
    // Rensa fältets felstatus
    setErrors((prev) => prev.filter((error) => error !== key));

    setValue((prev) => ({
      ...prev,
      [key]: inputValue,
    }));
  };

  const handleOpenModal = async () => {
    setIsOpen(true);
  };

  const handleCancel = () => {
    setIsOpen(false);
  };

  return (
    <FieldContainer>
      <div style={{ marginBottom: '1rem' }}>
        <FieldLabel
          style={{
            display: 'flex',
            paddingTop: '0.5rem',
          }}
        >
          WYSIWYG - <ImageTooltip type='WYSIWYG' />
          <CancelButton
            handleClose={handleOpenModal}
            style={{ marginTop: 0, marginLeft: 'auto' }}
          >
            Close section
          </CancelButton>
        </FieldLabel>
        <FieldLabel style={{ paddingTop: '0.5rem' }}>Section identifier</FieldLabel>
        <FieldDescription>
          Unique identifier for this section, used in the sections list.
        </FieldDescription>
        <TextInput
          autoFocus={autoFocus}
          onChange={(event) => handleChange('sectionTitle', event.target.value)}
          value={value.sectionTitle}
        />
        {errors.includes('sectionTitle') && (
          <ValidationError field='Section identifier' />
        )}
      </div>

      <div>
        <FieldLabel>Text</FieldLabel>
        <Editor
          onSetPreamble={setPreamble}
          extended={true}
          editData={editData?.preamble}
        />
        {errors.includes('preamble') && <ValidationError field='Preamble text' />}
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

      <CloseSectionAlert
        isOpen={isOpen}
        handleCancel={handleCancel}
        handleConfirm={onCloseSection}
      />
    </FieldContainer>
  );
}

export default WysiwygSection;
