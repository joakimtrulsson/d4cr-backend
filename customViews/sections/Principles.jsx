import React, { useState, useEffect } from 'react';
import { v4 as uuidv4 } from 'uuid';
import {
  FieldContainer,
  FieldLabel,
  TextInput,
  FieldDescription,
  MultiSelect,
} from '@keystone-ui/fields';

import {
  Editor,
  AddSectionButton,
  UpdateSectionButton,
  CancelButton,
  ValidationError,
  ImageToolTip,
  CloseSectionAlert,
} from '../components/index.js';

import useFetchPrinciples from '../hooks/useFetchPrinciples.jsx';
import { useValidation } from '../hooks/useValidation';

function Principles({
  onCloseSection,
  sectionsData,
  onChange,
  autoFocus,
  editData,
  sectionIndex,
  setSectionsData,
}) {
  const [value, setValue] = useState(() => {
    if (editData) {
      return editData;
    } else {
      return {
        title: '',
        preamble: '',
        principles: [],
      };
    }
  });
  const [options, setOptions] = useState([]);
  const { allPrinciples, loading, error } = useFetchPrinciples();
  const [selectedOptions, setSelectedOptions] = useState([]);
  const { validateFields, errors, setErrors } = useValidation([
    'sectionTitle',
    'title',
    'preamble',
  ]);
  const [isOpen, setIsOpen] = useState(false);

  // om editData.principles finns så sätts selectedOptions till de principer som redan finns
  useEffect(() => {
    if (editData && editData.principles) {
      const newSelectedOptions = editData.principles.map((principle) => ({
        value: principle.id,
        label: `${principle.principleNumber.number}. ${principle.title}`,
      }));
      setSelectedOptions(newSelectedOptions);
    }
  }, [editData]);

  useEffect(() => {
    if (
      allPrinciples &&
      allPrinciples.principles &&
      allPrinciples.principles.length > 0
    ) {
      // Sortera principerna efter principleNumber.number
      const sortedPrinciples = [...allPrinciples.principles].sort(
        (a, b) => a.principleNumber.number - b.principleNumber.number
      );

      const newOptions = sortedPrinciples.reduce((acc, principle) => {
        const principleItem = {
          value: principle.id,
          label: `${principle.principleNumber.number}. ${principle.title}`,
        };

        return [...acc, principleItem];
      }, []);

      setOptions(newOptions);
    }
  }, [allPrinciples]);

  async function handleSave() {
    if (!validateFields({ ...value })) {
      return;
    }
    const newItems = selectedOptions.map((selectedOption) => {
      return allPrinciples.principles.find(
        (principle) => principle.id === selectedOption.value
      );
    });

    if (onChange) {
      const newId = uuidv4();

      const newItem = {
        sectionType: 'PRINCIPLES',
        id: newId,
        ...value,
        principles: newItems,
      };

      setSectionsData((prevSectionsData) => [...prevSectionsData, newItem]);
      onChange(JSON.stringify([...sectionsData, newItem]));
      onCloseSection();
    }
  }

  async function handleSaveUpdate(event) {
    event.preventDefault();

    const newItems = selectedOptions.map((selectedOption) => {
      return allPrinciples.principles.find(
        (principle) => principle.id === selectedOption.value
      );
    });

    if (onChange) {
      const updatedSection = {
        sectionType: 'PRINCIPLES',
        id: editData.id,
        sectionTitle: value.sectionTitle,
        title: value.title,
        preamble: value.preamble,
        principles: newItems,
      };

      sectionsData[sectionIndex] = updatedSection;

      onChange(JSON.stringify(sectionsData));
      onCloseSection();
    }
  }

  const handleChange = (key, inputValue) => {
    // Rensa fältets felstatus
    setErrors((prev) => prev.filter((error) => error !== key));

    setValue((prev) => ({
      ...prev,
      [key]: inputValue,
    }));
  };

  function setPreamble(preamble) {
    setErrors((prev) => prev.filter((error) => error !== 'preamble'));
    setValue((prev) => ({
      ...prev,
      preamble: preamble,
    }));
  }

  const handleOpenModal = async () => {
    setIsOpen(true);
  };

  const handleCancel = () => {
    setIsOpen(false);
  };

  return (
    <FieldContainer
      style={{
        width: '900px',
      }}
    >
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
          Principles - <ImageToolTip type='PRINCIPLES' />
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
          This required field specifies the title text for the Principle section.
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
          This reqiured field specifies the preamble text of the Principle section.
        </FieldDescription>
        <Editor
          onSetPreamble={setPreamble}
          editData={editData?.preamble}
          extended={false}
        />
        {errors.includes('preamble') && <ValidationError field='Preamble' />}
      </div>

      <div style={{ marginBottom: '1rem' }}>
        <FieldLabel>Principles</FieldLabel>
        <FieldDescription>
          Select the principles to associate with this section. The selected principles
          will be rendered and sorted by their principle number within their respective
          categories.
        </FieldDescription>
        <MultiSelect
          options={options}
          autoFocus={autoFocus}
          onChange={(selectedOptions) => {
            setSelectedOptions(selectedOptions);
          }}
          value={selectedOptions || []}
        />
      </div>

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
            Add principles section
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

export default Principles;
