import React, { useState, useEffect } from 'react';
import { v4 as uuidv4 } from 'uuid';

import {
  FieldContainer,
  FieldLabel,
  FieldDescription,
  TextInput,
} from '@keystone-ui/fields';

import Wysiwyg from './components/Wysiwyg/Wysiwyg.jsx';
import ResourcesForm from './components/ResourcesForm/ResourcesForm.jsx';

import RemoveEntryButton from './components/RemoveEntryButton/RemoveEntryButton.jsx';
import AddEntryButton from './components/AddEntryButton/AddEntryButton.jsx';

export const Field = ({ field, value, onChange, autoFocus }) => {
  const [data, setData] = useState(value ? JSON.parse(value) : []);
  const [groups, setGroups] = useState(value ? JSON.parse(value).resources : []);
  const [newItems, setNewItems] = useState(value ? JSON.parse(value).resources : []);

  useEffect(() => {
    const updatedData = {
      ...data,
      resources: [...newItems],
    };

    onChange(JSON.stringify(updatedData));
  }, [data, newItems]);

  const handleChange = (key, inputValue) => {
    setData((prev) => ({
      ...prev,
      [key]: inputValue,
    }));
  };

  function setPreamble(preamble) {
    setData((prev) => ({
      ...prev,
      preamble: preamble,
    }));
  }

  const handleAddGroupDataToNewItems = (newItem) => {
    const groupIndex = newItems.findIndex(
      (item) => item.groupTitle === newItem.groupTitle
    );

    if (groupIndex !== -1) {
      const updatedGroup = newItems[groupIndex];
      newItem.resources.forEach((resource) => {
        const existingResource = updatedGroup.resources.find(
          (existingResource) => existingResource.id === resource.id
        );
        if (!existingResource) {
          updatedGroup.resources.push(resource);
        }
      });
    } else {
      setNewItems((prevNewItems) => [...prevNewItems, newItem]);
    }
    setData((prev) => ({
      ...prev,
      resources: newItems,
    }));
  };

  const handleUpdateItem = (updatedGroup) => {
    const index = newItems.findIndex((item) => item.id === updatedGroup.id);

    if (index !== -1) {
      // 2. Om den finns så ska den uppdateras.
      setNewItems((prevItems) => {
        const updatedItems = [...prevItems];
        updatedItems[index] = updatedGroup;
        return updatedItems;
      });
    } else {
      // 3. Om den inte finns så ska den läggas till i newItems[].
      setNewItems((prevItems) => [...prevItems, updatedGroup]);
    }

    setData((prev) => ({
      ...prev,
      resources: newItems,
    }));
  };

  const handleAddGroup = () => {
    setGroups((prevGroups) => [
      ...prevGroups,
      {
        id: uuidv4(),
        title: '',
        resources: [],
      },
    ]);
  };

  const handleRemoveGroup = (groupIndex) => {
    const updatedGroups = [...groups];

    updatedGroups.splice(groupIndex, 1);

    setGroups(updatedGroups);

    const updatedNewItems = [...newItems];

    updatedNewItems.splice(groupIndex, 1);

    setNewItems(updatedNewItems);

    setData((prev) => ({
      ...prev,
      resources: updatedNewItems,
    }));
  };

  return (
    <FieldContainer>
      <div style={{ marginBottom: '1rem' }}>
        <FieldLabel>Resources</FieldLabel>
        <FieldDescription>Add groups with resources</FieldDescription>
        <FieldLabel>Section Title</FieldLabel>
        <TextInput
          autoFocus={autoFocus}
          onChange={(event) => handleChange('title', event.target.value)}
          value={data?.title}
        />
      </div>

      <div style={{ marginBottom: '1rem' }}>
        <FieldLabel>Preamble</FieldLabel>

        <Wysiwyg onSetPreamble={setPreamble} editData={data?.preamble} extended={false} />
      </div>

      <div>
        {groups.map((group, index) => (
          <div key={group.id} style={{ marginBottom: '1rem' }}>
            <ResourcesForm
              autoFocus={autoFocus}
              onAddNewItem={handleAddGroupDataToNewItems}
              onUpdateItem={handleUpdateItem}
              value={group}
              editData={newItems[index]}
            />

            {groups.length > 1 && (
              <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                <RemoveEntryButton handleRemove={handleRemoveGroup} indexToRemove={index}>
                  Remove group
                </RemoveEntryButton>
              </div>
            )}
          </div>
        ))}
      </div>
      <AddEntryButton handleAdd={handleAddGroup}>Add new group</AddEntryButton>
    </FieldContainer>
  );
};
