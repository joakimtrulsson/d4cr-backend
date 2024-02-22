import React, { useState, useEffect } from 'react';
import { v4 as uuidv4 } from 'uuid';

import {
  FieldContainer,
  FieldLabel,
  FieldDescription,
  TextInput,
} from '@keystone-ui/fields';

import Wysiwyg from './components/Wysiwyg/Wysiwyg.jsx';
import PrinciplesForm from './components/PrinciplesForm/PrinciplesForm.jsx';

import RemoveEntryButton from './components/RemoveEntryButton/RemoveEntryButton.jsx';
import AddEntryButton from './components/AddEntryButton/AddEntryButton.jsx';

export const Field = ({ field, value, onChange, autoFocus }) => {
  const [data, setData] = useState(value ? JSON.parse(value) : []);
  const [groups, setGroups] = useState(
    value
      ? JSON.parse(value).groups
      : [
          {
            id: uuidv4(),
            title: '',
            groups: [],
          },
        ]
  );
  const [newItems, setNewItems] = useState(value ? JSON.parse(value).groups : []);
  // Nytillagd
  const [isAddAndResetVisible, setIsAddAndResetVisible] = useState(true);

  useEffect(() => {
    const updatedData = {
      ...data,
      groups: [...newItems],
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
      newItem.principles.forEach((principle) => {
        const existingGroup = updatedGroup.principles.find(
          (existingGroup) => existingGroup.id === principle.id
        );
        if (!existingGroup) {
          updatedGroup.principles.push(principle);
        }
      });
    } else {
      setNewItems((prevNewItems) => [...prevNewItems, newItem]);
    }
    setData((prev) => ({
      ...prev,
      groups: newItems,
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
      groups: newItems,
    }));
  };

  const handleAddGroup = () => {
    setGroups((prevGroups) => [
      ...prevGroups,
      {
        id: uuidv4(),
        title: '',
        groups: [],
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
      groups: updatedNewItems,
    }));
  };

  return (
    <FieldContainer>
      <div style={{ marginBottom: '1rem' }}>
        <FieldLabel>Principles</FieldLabel>
        <FieldDescription>Add groups with principles</FieldDescription>
        <FieldLabel>Title</FieldLabel>
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
            <PrinciplesForm
              autoFocus={autoFocus}
              onAddNewItem={handleAddGroupDataToNewItems}
              onUpdateItem={handleUpdateItem}
              value={group}
              editData={newItems[index]}
              isAddAndResetVisible={isAddAndResetVisible}
              setIsAddAndResetVisible={setIsAddAndResetVisible}
              groups={groups}
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
      {isAddAndResetVisible && (
        <AddEntryButton handleAdd={handleAddGroup}>Add new group</AddEntryButton>
      )}
    </FieldContainer>
  );
};
