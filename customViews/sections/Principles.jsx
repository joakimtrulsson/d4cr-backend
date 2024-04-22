import React, { useState } from 'react';
import { v4 as uuidv4 } from 'uuid';

import {
  FieldContainer,
  FieldLabel,
  TextInput,
  FieldDescription,
} from '@keystone-ui/fields';

import Editor from '../components/Editor/Editor.jsx';
import PrinciplesForm from '../components/PrinciplesForm/PrinciplesForm.jsx';
import AddSectionButton from '../components/AddSectionButton/AddSectionButton.jsx';
import RemoveEntryButton from '../components/RemoveEntryButton/RemoveEntryButton.jsx';
import AddEntryButton from '../components/AddEntryButton/AddEntryButton.jsx';
import UpdateSectionButton from '../components/UpdateSectionButton/UpdateSectionButton.jsx';
import CancelButton from '../components/CancelButton/CancelButton.jsx';
import ValidationError from '../components/ValidationError/ValidationError';
import ImageTooltip from '../components/ImageTooltip/ImageToolTip.jsx';
import CloseSectionAlert from '../components/CloseSectionAlert/CloseSectionAlert';
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
        groups: [],
      };
    }
  });
  const [groups, setGroups] = useState(() => {
    if (editData) {
      return editData.groups || [];
    } else {
      return [
        {
          id: uuidv4(),
          title: '',
          groups: [],
        },
      ];
    }
  });
  const [newItems, setNewItems] = useState([]);
  const [isAddAndResetVisible, setIsAddAndResetVisible] = useState(true);
  const { validateFields, errors, setErrors } = useValidation([
    'sectionTitle',
    'title',
    'preamble',
  ]);
  const [isOpen, setIsOpen] = useState(false);

  async function handleSave() {
    if (!validateFields({ ...value, groups })) {
      return;
    }

    if (onChange) {
      const newId = uuidv4();

      const newItem = {
        sectionType: 'PRINCIPLES',
        id: newId,
        ...value,
        groups: newItems,
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
        sectionType: 'PRINCIPLES',
        id: editData.id,
        sectionTitle: value.sectionTitle,
        title: value.title,
        preamble: value.preamble,
        groups: newItems.length > 0 ? [...value.groups, ...newItems] : [...value.groups],
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

  const handleAddGroupDataToNewItems = (newItem) => {
    const groupIndex = newItems.findIndex(
      (item) => item.groupTitle === newItem.groupTitle
    );
    if (groupIndex !== -1) {
      const updatedGroup = newItems[groupIndex];
      newItem.principles.forEach((group) => {
        const existingGroups = updatedGroup.principles.find(
          (existingGroup) => existingGroup.id === group.id
        );
        if (!existingGroups) {
          updatedGroup.principles.push(group);
        }
      });
    } else {
      setNewItems((prevNewItems) => [...prevNewItems, newItem]);
    }
  };

  const handleUpdateItem = (updatedGroup) => {
    setValue((prev) => {
      const updatedGroups = prev.groups.map((group) => {
        if (group.id === updatedGroup.id) {
          return updatedGroup;
        }
        return group;
      });

      if (!updatedGroups.some((resource) => resource.id === updatedGroup.id)) {
        setNewItems((prevNewItems) => [...prevNewItems, updatedGroup]);
      }

      return {
        ...prev,
        groups: updatedGroups,
      };
    });
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
      resources: prev.groups.filter((resource) => resource.id !== groupToRemove.id),
    }));
  };

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
          Principles - <ImageTooltip type='PRINCIPLES' />
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
        {groups.map((group, index) => (
          <div key={group.id}>
            <PrinciplesForm
              autoFocus={autoFocus}
              onAddNewItem={handleAddGroupDataToNewItems}
              onUpdateItem={handleUpdateItem}
              value={group}
              editData={editData?.groups[index]}
              isAddAndResetVisible={isAddAndResetVisible}
              setIsAddAndResetVisible={setIsAddAndResetVisible}
              groups={groups}
            />

            {groups.length > 1 && (
              <div
                style={{
                  display: 'flex',
                  flexDirection: 'row',
                  justifyContent: 'flex-end',
                }}
              >
                <RemoveEntryButton
                  style={{ marginBottom: '1rem' }}
                  handleRemove={handleRemoveGroup}
                  indexToRemove={index}
                >
                  Remove group
                </RemoveEntryButton>
              </div>
            )}
          </div>
        ))}
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
        {isAddAndResetVisible && (
          <AddEntryButton handleAdd={handleAddGroup}>Add new group</AddEntryButton>
        )}

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
