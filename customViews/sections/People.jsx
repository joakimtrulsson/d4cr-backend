import React, { useState, useEffect } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { FieldContainer, FieldLabel, TextInput, MultiSelect } from '@keystone-ui/fields';
import AddSectionButton from '../components/AddSectionButton/AddSectionButton.jsx';
import UpdateSectionButton from '../components/UpdateSectionButton/UpdateSectionButton.jsx';
import CancelButton from '../components/CancelButton/CancelButton.jsx';
import Editor from '../components/Editor/Editor';

import useFetchPeopleList from '../hooks/useFetchPeopleList.jsx';

function People({
  onCloseSection,
  sectionsData,
  onChange,
  editData,
  sectionIndex,
  setSectionsData,
}) {
  const [value, setValue] = useState('');
  const [selectedOptions, setSelectedOptions] = useState([]);
  const { peopleList } = useFetchPeopleList();

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
    if (onChange) {
      const newItem = {
        sectionType: 'PEOPLE',
        id: uuidv4(),
        title: value.title,
        preamble: value.preamble,
        people: value.people,
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
    setValue((prev) => ({
      ...prev,
      preamble,
    }));
  }

  const handleChange = (key, inputValue) => {
    setValue((prev) => ({
      ...prev,
      [key]: inputValue,
    }));
  };

  // function selectAll() {
  //   setSelectedOptions(
  //     peopleList.map((person) => ({ label: person.fullName, value: person.id }))
  //   );
  // }

  return (
    <FieldContainer>
      <div style={{ marginBottom: '1rem' }}>
        <FieldLabel>Title</FieldLabel>
        <TextInput
          label='Title'
          autoFocus
          onChange={(event) => handleChange('title', event.target.value)}
          value={value.title}
        />
      </div>
      <div style={{ marginBottom: '1rem' }}>
        <FieldLabel>Preamble</FieldLabel>
        <Editor
          onSetPreamble={setPreamble}
          editData={editData?.preamble}
          extended={false}
        />
      </div>

      <div style={{ marginBottom: '1rem' }}>
        <FieldLabel>People</FieldLabel>
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
      </div>

      <div style={{ borderTop: '1px solid #e1e5e9', paddingTop: '1rem' }}>
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
    </FieldContainer>
  );
}

export default People;
