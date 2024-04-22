import React, { useState, useEffect } from 'react';
import { v4 as uuidv4 } from 'uuid';

import {
  FieldContainer,
  FieldLabel,
  FieldDescription,
  TextInput,
} from '@keystone-ui/fields';

import Editor from '../components/Editor/Editor';
import AddSectionButton from '../components/AddSectionButton/AddSectionButton';
import RemoveEntryButton from '../components/RemoveEntryButton/RemoveEntryButton';
import AddEntryButton from '../components/AddEntryButton/AddEntryButton';
import UpdateSectionButton from '../components/UpdateSectionButton/UpdateSectionButton';
import CancelButton from '../components/CancelButton/CancelButton';
import ValidationError from '../components/ValidationError/ValidationError';
import { useValidation } from '../hooks/useValidation';
import ImageTooltip from '../components/ImageTooltip/ImageToolTip';
import CloseSectionAlert from '../components/CloseSectionAlert/CloseSectionAlert';

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
        accordionTitle: '',
        fields: [{ heading: '', bodyText: '' }],
      };
    }
  });
  const { validateFields, errors, objectErrors } = useValidation(
    ['sectionTitle', 'title'],
    ['heading', 'bodyText']
  );
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    if (editData) {
      setValue(editData);
    }
  }, [editData]);

  function handleSave() {
    if (!validateFields(value)) {
      return;
    }

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

    if (!validateFields(value)) {
      return;
    }

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
          alignItems: 'center',
          borderBottom: '1px solid #e1e5e9',
          width: '900px',
          height: '4rem',
          position: 'sticky',
          top: 0,
          backgroundColor: '#fff',
          zIndex: 100,
        }}
      >
        <FieldLabel
          style={{
            fontSize: '1.3rem',
          }}
        >
          Accordion - <ImageTooltip type='ACCORDION' />
        </FieldLabel>
        <CancelButton
          handleClose={handleOpenModal}
          style={{ marginTop: 0, marginLeft: 'auto' }}
        >
          Close section
        </CancelButton>
      </div>

      <div style={{ marginBottom: '1rem', marginTop: '1rem' }}>
        <FieldLabel>Section identifier</FieldLabel>
        <FieldDescription>
          Unique identifier for this section, used in the sections list.
        </FieldDescription>
        <TextInput
          valid={true}
          autoFocus={autoFocus}
          onChange={(event) => handleChange('sectionTitle', event.target.value)}
          value={value.sectionTitle}
        />
        {errors.includes('sectionTitle') && (
          <ValidationError field='Section identifier' />
        )}
      </div>

      <div style={{ marginBottom: '1rem' }}>
        <FieldLabel>Accordion title</FieldLabel>
        <FieldDescription>
          This required field specifies the title of the accordion.
        </FieldDescription>
        <TextInput
          autoFocus={autoFocus}
          onChange={(event) => handleChange('title', event.target.value)}
          value={value.title}
        />
        {errors.includes('title') && <ValidationError field='Accordion title' />}
      </div>

      {value.fields.map((field, index) => (
        <div key={index} style={{ marginBottom: '1rem' }}>
          <FieldLabel style={{}}>{`Content title ${index + 1}`}</FieldLabel>
          <FieldDescription>
            This field specifies the content title of the accordion.
          </FieldDescription>
          <TextInput
            style={{ marginBottom: '1rem' }}
            autoFocus={autoFocus}
            onChange={(event) => handleFieldChange(index, 'heading', event.target.value)}
            value={field.heading}
          />
          {objectErrors.some(
            (obj) => obj.index === index && obj.emptyFields.includes('heading')
          ) && <ValidationError field={`Content title ${index + 1}`} />}

          <FieldLabel>{`Body Text ${index + 1}`}</FieldLabel>
          <FieldDescription>
            This field specifies the text to the content title.
          </FieldDescription>
          <Editor
            onSetPreamble={(preamble) => handleFieldChange(index, 'bodyText', preamble)}
            editData={field.bodyText}
            extended={false}
          />

          {objectErrors.some(
            (obj) => obj.index === index && obj.emptyFields.includes('bodyText')
          ) && <ValidationError field={`Body Text ${index + 1}`} />}

          {value.fields.length > 1 && (
            <div style={{ display: 'flex', justifyContent: 'flex-start' }}>
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
      <AddEntryButton style={{ marginBottom: '1rem' }} handleAdd={handleAddField}>
        Add field
      </AddEntryButton>
      <div
        style={{
          borderTop: '1px solid #e1e5e9',
          height: '4rem',
          overflow: 'auto',
          position: 'sticky',
          bottom: 0,
          backgroundColor: '#fff',
          zIndex: 100,
          display: 'flex',
          alignItems: 'center',
        }}
      >
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

      <CloseSectionAlert
        isOpen={isOpen}
        handleCancel={handleCancel}
        handleConfirm={onCloseSection}
      />
    </FieldContainer>
  );
}

export default Accordion;
