import React, { useState } from 'react';
import { v4 as uuidv4 } from 'uuid';

import { FieldContainer, FieldLabel, TextInput } from '@keystone-ui/fields';

import Wysiwyg from '../components/Wysiwyg/Wysiwyg.jsx';
import ResourcesForm from '../components/ResourcesForm/ResourcesForm.jsx';
import AddSectionButton from '../components/AddSectionButton/AddSectionButton.jsx';
import RemoveEntryButton from '../components/RemoveEntryButton/RemoveEntryButton.jsx';
import AddEntryButton from '../components/AddEntryButton/AddEntryButton.jsx';
import UpdateSectionButton from '../components/UpdateSectionButton/UpdateSectionButton.jsx';
import CancelButton from '../components/CancelButton/CancelButton.jsx';

function Resources({
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
        resources: [],
      };
    }
  });
  const [groups, setGroups] = useState(() => {
    if (editData) {
      return editData.resources || [];
    } else {
      return [
        {
          id: uuidv4(),
          title: '',
          resources: [],
        },
      ];
    }
  });
  const [newItems, setNewItems] = useState([]);

  async function handleSave() {
    if (onChange) {
      const newId = uuidv4();

      const newItem = {
        sectionType: 'RESOURCES',
        id: newId,
        ...value,
        resources: newItems,
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
        sectionType: 'RESOURCES',
        id: editData.id,
        ...value,
        resources:
          newItems.length > 0 ? [...value.resources, ...newItems] : [...value.resources],
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

  function setPreamble(preamble) {
    setValue((prev) => ({
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
  };

  const handleUpdateItem = (updatedGroup) => {
    setValue((prev) => {
      const updatedResources = prev.resources.map((resource) => {
        if (resource.id === updatedGroup.id) {
          return updatedGroup;
        }
        return resource;
      });

      if (!updatedResources.some((resource) => resource.id === updatedGroup.id)) {
        setNewItems((prevNewItems) => [...prevNewItems, updatedGroup]);
      }

      return {
        ...prev,
        resources: updatedResources,
      };
    });
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
    const groupToRemove = groups[groupIndex];

    setGroups((prevGroups) => {
      const updatedGroups = [...prevGroups];
      updatedGroups.splice(groupIndex, 1);
      return updatedGroups;
    });

    setNewItems((prevNewItems) => {
      const updatedNewItems = prevNewItems.filter((item) => item.id !== groupToRemove.id);
      return updatedNewItems;
    });

    setValue((prev) => ({
      ...prev,
      resources: prev.resources.filter((resource) => resource.id !== groupToRemove.id),
    }));
  };

  return (
    <FieldContainer>
      <div style={{ marginBottom: '1rem' }}>
        <FieldLabel>Title</FieldLabel>
        <TextInput
          autoFocus={autoFocus}
          onChange={(event) => handleChange('title', event.target.value)}
          value={value.title}
        />
      </div>

      <div style={{ marginBottom: '1rem' }}>
        <FieldLabel>Preamble</FieldLabel>

        <Wysiwyg
          onSetPreamble={setPreamble}
          editData={editData?.preamble}
          extended={false}
        />
      </div>

      <div>
        {groups.map((group, index) => (
          <div key={group.id}>
            <ResourcesForm
              autoFocus={autoFocus}
              onAddNewItem={handleAddGroupDataToNewItems}
              onUpdateItem={handleUpdateItem}
              value={group}
              editData={editData?.resources[index]}
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

      {editData ? (
        <UpdateSectionButton handleUpdate={handleSaveUpdate}>Update</UpdateSectionButton>
      ) : (
        // <Button onClick={handleSaveUpdate}>Update</Button>
        <AddSectionButton handleSaveSection={handleSave}>
          Add resources section
        </AddSectionButton>
      )}
      {editData && <CancelButton handleClose={onCloseSection}>Cancel</CancelButton>}
    </FieldContainer>
  );
}

export default Resources;
