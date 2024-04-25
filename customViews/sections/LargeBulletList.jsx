import React, { useState, useEffect } from 'react';
import { v4 as uuidv4 } from 'uuid';

import {
  FieldContainer,
  FieldLabel,
  TextInput,
  Select,
  FieldDescription,
} from '@keystone-ui/fields';

import Editor from '../components/Editor/Editor';
import AddSectionButton from '../components/AddSectionButton/AddSectionButton';
import RemoveEntryButton from '../components/RemoveEntryButton/RemoveEntryButton';
import AddEntryButton from '../components/AddEntryButton/AddEntryButton';
import UpdateSectionButton from '../components/UpdateSectionButton/UpdateSectionButton';
import CancelButton from '../components/CancelButton/CancelButton';
import { useValidation } from '../hooks/useValidation';
import ValidationError from '../components/ValidationError/ValidationError';
import ImageTooltip from '../components/ImageTooltip/ImageToolTip';
import CloseSectionAlert from '../components/CloseSectionAlert/CloseSectionAlert';

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
        listType: 'ORDERED',
        bullets: [{ bodyText: '' }],
      };
    }
  });
  const { validateFields, errors, setErrors, objectErrors } = useValidation(
    ['sectionTitle', 'listType'],
    ['bodyText'],
    'bullets'
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

    if (!validateFields(value)) {
      return;
    }

    if (onChange) {
      const updatedSection = {
        sectionType: 'BULLETLIST',
        id: editData.id,
        ...value,
      };

      sectionsData[sectionIndex] = updatedSection;

      onChange(JSON.stringify(sectionsData));
      onCloseSection();
    }
  }

  const handleChange = (key, inputValue) => {
    setErrors((prev) => prev.filter((error) => error !== key));
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

  const handleOpenModal = async () => {
    setIsOpen(true);
  };

  const handleCancel = () => {
    setIsOpen(false);
  };

  return (
    <FieldContainer style={{ width: '900px' }}>
      <div
        style={{
          display: 'flex',
          flexDirection: 'row',
          alignItems: 'center',
          borderBottom: '1px solid #e1e5e9',
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
          Large bullet list - <ImageTooltip type='LARGEBULLETLIST' />
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
          value={value.sectionTitle}
        />
        {errors.includes('sectionTitle') && (
          <ValidationError field='Section identifier' />
        )}
      </div>

      <div style={{ marginBottom: '1rem' }}>
        <FieldLabel>Title</FieldLabel>
        <FieldDescription>
          This reqiured field specifies the title text on the Large Bullet List section.
        </FieldDescription>
        <TextInput
          autoFocus={autoFocus}
          onChange={(event) => handleChange('title', event.target.value)}
          value={value.title}
        />
        {errors.includes('title') && <ValidationError field='Title' />}
      </div>

      <div style={{ marginBottom: '1rem' }}>
        <FieldLabel>Preamble</FieldLabel>
        <FieldDescription>
          This required field specifies a brief description of the list, which will be
          rendered below the title.
        </FieldDescription>
        <TextInput
          autoFocus={autoFocus}
          onChange={(event) => handleChange('subHeader', event.target.value)}
          value={value.subHeader}
        />
        {errors.includes('subHeader') && <ValidationError field='Preamble text' />}
      </div>

      <div style={{ marginBottom: '1rem' }}>
        <FieldLabel style={{}}>List type</FieldLabel>
        <FieldDescription>
          This required field specifies the type of list. If Numbered List is selected, it
          will be a numbered list. If Bulleted List is chosen, it will be a bulleted list
          with arrow icons.
        </FieldDescription>
        <Select
          value={listOptions.find((option) => option.value === value.listType)}
          options={listOptions}
          onChange={(selectedOption) => handleChange('listType', selectedOption.value)}
        />
        {errors.includes('listType') && <ValidationError field='List type' />}
      </div>

      {value.bullets.map((field, index) => {
        return (
          <div key={index} style={{ marginBottom: '1rem', marginTop: '1rem' }}>
            <FieldLabel>{`Body Text ${index + 1}`}</FieldLabel>
            <FieldDescription>
              This required field represents the main body text content of the list item.
              It allows for the addition of detailed information or description related to
              the list item.
            </FieldDescription>

            <Editor
              onSetPreamble={(preamble) => handleFieldChange(index, 'bodyText', preamble)}
              extended={true}
              editData={field?.bodyText}
            />

            {objectErrors.some(
              (obj) => obj.index === index && obj.emptyFields.includes('bodyText')
            ) && <ValidationError field={`Body Text ${index + 1}`} />}

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
            Add Bullet List section
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

export default BulletList;
