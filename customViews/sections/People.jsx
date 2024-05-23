import React, { useState, useEffect } from 'react';
import { v4 as uuidv4 } from 'uuid';
import {
  FieldContainer,
  FieldLabel,
  TextInput,
  MultiSelect,
  FieldDescription,
} from '@keystone-ui/fields';

import {
  AddSectionButton,
  UpdateSectionButton,
  CancelButton,
  Editor,
  SectionImageToolTip,
  ValidationError,
  CloseSectionAlert,
} from '../components/index.js';
import { useValidation } from '../hooks/useValidation';
import useFetchPeopleList from '../hooks/useFetchPeopleList.jsx';

function People({
  onCloseSection,
  sectionsData,
  onChange,
  editData,
  sectionIndex,
  setSectionsData,
  autoFocus,
}) {
  const [value, setValue] = useState('');
  const [selectedOptions, setSelectedOptions] = useState([]);
  const [isOpen, setIsOpen] = useState(false);
  const { peopleList } = useFetchPeopleList();
  const { validateFields, errors, setErrors } = useValidation([
    'sectionTitle',
    'title',
    'preamble',
    'people',
  ]);

  useEffect(() => {
    if (!editData) {
      return;
    }

    const allIdsExist = editData.people.every((personId) =>
      peopleList.some((person) => person.id === personId)
    );
    if (allIdsExist) {
      setValue(editData);

      const selectedPeople = peopleList.filter((person) =>
        editData.people.includes(person.id)
      );
      setSelectedOptions(
        selectedPeople.map((person) => ({ label: person.fullName, value: person.id }))
      );
    } else if (!allIdsExist) {
      const filteredPeople = editData.people.filter((personId) =>
        peopleList.some((person) => person.id === personId)
      );
      setValue({
        ...editData,
        people: filteredPeople,
      });
    }

    setPreamble(editData.preamble);
  }, [editData, peopleList]);

  useEffect(() => {
    if (selectedOptions) {
      setValue((prev) => ({
        ...prev,
        people: selectedOptions.map((option) => option.value),
      }));
    }
  }, [selectedOptions]);

  function handleSave() {
    if (!validateFields(value)) {
      return;
    }

    if (onChange) {
      const newItem = {
        sectionType: 'PEOPLE',
        id: uuidv4(),
        sectionTitle: value.sectionTitle,
        title: value.title,
        preamble: value.preamble,
        people: value.people,
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
        sectionType: 'PEOPLE',
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
          People - <SectionImageToolTip type='PEOPLE' />
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
          This required field specifies the title text for the People section, such as
          &quot;Steering Group&quot;.
        </FieldDescription>
        <TextInput
          label='Title'
          autoFocus
          onChange={(event) => handleChange('title', event.target.value)}
          value={value.title}
        />
        {errors.includes('title') && <ValidationError field='Title' />}
      </div>

      <div style={{ marginBottom: '1rem' }}>
        <FieldLabel>Preamble</FieldLabel>
        <FieldDescription>
          This reqiured field specifies the preamble text of the People section.
        </FieldDescription>
        <Editor
          onSetPreamble={setPreamble}
          editData={editData?.preamble}
          extended={false}
        />
        {errors.includes('preamble') && <ValidationError field='Preamble' />}
      </div>

      <div style={{ marginBottom: '1rem' }}>
        <FieldLabel>People</FieldLabel>
        <FieldDescription>
          This required field specifies the list of people to be displayed in the People
          section.
        </FieldDescription>
        {Array.isArray(peopleList) && (
          <MultiSelect
            onChange={setSelectedOptions}
            options={peopleList.map((person) => ({
              label: person.fullName,
              value: person.id,
            }))}
            value={selectedOptions}
          />
        )}
        {errors.includes('people') && <ValidationError field='People' />}
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
            Add People Section
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

export default People;
