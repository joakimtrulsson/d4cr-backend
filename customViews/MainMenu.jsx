import React, { useState, useEffect } from 'react';

import { v4 as uuid } from 'uuid';

import {
  FieldContainer,
  FieldLabel,
  FieldDescription,
  Select,
  TextInput,
} from '@keystone-ui/fields';

import AddEntryButton from './components/AddEntryButton/AddEntryButton';
import RemoveEntryButton from './components/RemoveEntryButton/RemoveEntryButton';

import useFetchLinkOptions from './hooks/useFetchLinkOptions';

export const Field = ({ field, value, onChange, autoFocus }) => {
  const [data, setData] = useState([
    { id: uuid(), groupTitle: '', links: [{ anchorText: '', url: '' }] },
  ]);

  const pagesOptions = useFetchLinkOptions();

  useEffect(() => {
    if (value && value !== '') {
      const parsedValue = JSON.parse(value);
      if (parsedValue.length > 0) {
        setData(parsedValue);
      }
    }
  }, [value]);

  const handleAddGroup = () => {
    setData([
      ...data,
      { id: uuid(), groupTitle: '', links: [{ anchorText: '', url: '' }] },
    ]);
  };

  const handleRemoveGroup = (id) => {
    const updatedData = data.filter((group) => group.id !== id);
    setData(data.filter((group) => group.id !== id));

    onChange(JSON.stringify(updatedData));
  };

  const handleAddLinkGroup = (groupId) => {
    const updatedData = data.map((group) => {
      if (group.id === groupId) {
        return { ...group, links: [...group.links, { anchorText: '', url: '' }] };
      }
      return group;
    });
    setData(updatedData);
  };

  const handleRemoveLinkGroup = (groupId, linkIndex) => {
    const updatedData = data.map((group) => {
      if (group.id === groupId) {
        return {
          ...group,
          links: group.links.filter((link, index) => index !== linkIndex),
        };
      }
      return group;
    });
    setData(updatedData);
    onChange(JSON.stringify(updatedData));
  };

  const handleSetGroupTitle = (groupId, groupTitle) => {
    const updatedData = data.map((group) => {
      if (group.id === groupId) {
        return { ...group, groupTitle };
      }
      return group;
    });
    setData(updatedData);
    onChange(JSON.stringify(updatedData));
  };

  const handleSetAnchorText = (groupId, linkIndex, anchorText) => {
    const updatedData = data.map((group) => {
      if (group.id === groupId) {
        return {
          ...group,
          links: group.links.map((link, index) => {
            if (index === linkIndex) {
              return { ...link, anchorText };
            }
            return link;
          }),
        };
      }
      return group;
    });
    setData(updatedData);
    onChange(JSON.stringify(updatedData));
  };

  const handleSelectChange = (groupId, linkIndex, selectedOption) => {
    const updatedData = data.map((group) => {
      if (group.id === groupId) {
        return {
          ...group,
          links: group.links.map((link, index) => {
            if (index === linkIndex) {
              return { ...link, url: selectedOption.value };
            }
            return link;
          }),
        };
      }
      return group;
    });
    setData(updatedData);
    onChange(JSON.stringify(updatedData));
  };

  return (
    <FieldContainer style={{ display: 'flex', flexDirection: 'column' }}>
      {data.map((group, index) => (
        <div
          style={{
            borderBottom: '1px solid #e1e5e9',
            paddingBottom: ' 1rem',
            marginBottom: '1rem',
          }}
          key={group.id}
        >
          <FieldLabel>Group title</FieldLabel>
          <FieldDescription>Group {index + 1}</FieldDescription>
          <TextInput
            style={{ marginBottom: '1.5rem' }}
            placeholder='Group title'
            value={data[index].groupTitle}
            onChange={(e) => handleSetGroupTitle(group.id, e.target.value)}
          ></TextInput>

          {group.links.map((link, linkIndex) => (
            <div key={linkIndex}>
              <FieldLabel style={{ marginBottom: '0.2rem' }}>
                Enter anchor text
              </FieldLabel>
              <FieldDescription>Link {linkIndex + 1}</FieldDescription>
              <TextInput
                style={{ marginBottom: '1rem' }}
                placeholder='Anchor text'
                onChange={(e) => handleSetAnchorText(group.id, linkIndex, e.target.value)}
                value={data[index]?.links[linkIndex]?.anchorText}
              ></TextInput>
              <FieldLabel style={{ marginBottom: '0.2rem' }}>
                Select a page to link to
              </FieldLabel>
              <Select
                value={pagesOptions.find(
                  (option) => option.value === data[index]?.links[linkIndex]?.url
                )}
                options={pagesOptions}
                onChange={(selectedOption) =>
                  handleSelectChange(group.id, linkIndex, selectedOption)
                }
              />
              {group.links.length > 1 && (
                <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                  <RemoveEntryButton
                    style={{ marginTop: '0.75rem', marginBottom: '1.0rem' }}
                    handleRemove={() => handleRemoveLinkGroup(group.id, linkIndex)}
                  >
                    Remove link
                  </RemoveEntryButton>
                </div>
              )}
            </div>
          ))}

          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              marginTop: '1rem',
            }}
          >
            <AddEntryButton handleAdd={() => handleAddLinkGroup(group.id)}>
              Add new link
            </AddEntryButton>
            {data.length > 1 && (
              <RemoveEntryButton handleRemove={() => handleRemoveGroup(group.id)}>
                Remove group
              </RemoveEntryButton>
            )}
          </div>
        </div>
      ))}

      <div>
        <AddEntryButton handleAdd={handleAddGroup}>Add new group</AddEntryButton>
      </div>
    </FieldContainer>
  );
};
