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
  const [data, setData] = useState([{ id: uuid(), anchorText: '', url: '' }]);

  const pagesOptions = useFetchLinkOptions();

  useEffect(() => {
    if (value && value !== '') {
      const parsedValue = JSON.parse(value);
      if (parsedValue.length > 0) {
        setData(parsedValue);
      }
    }
  }, [value]);

  const handleAddLinkGroup = () => {
    const newLinkGroup = { id: uuid(), anchorText: '', url: '' };
    setData([...data, newLinkGroup]);
  };

  const handleRemoveLinkGroup = (linkIndex) => {
    const updatedData = data.filter((_, index) => index !== linkIndex);
    setData(updatedData);
    onChange(JSON.stringify(updatedData));
  };

  const handleSetAnchorText = (linkIndex, anchorText) => {
    const updatedData = data.map((link, index) => {
      if (index === linkIndex) {
        return { ...link, anchorText };
      }
      return link;
    });
    setData(updatedData);
    onChange(JSON.stringify(updatedData));
  };

  const handleSelectChange = (linkIndex, selectedOption) => {
    const updatedData = data.map((link, index) => {
      if (index === linkIndex) {
        return { ...link, url: selectedOption.value };
      }
      return link;
    });
    setData(updatedData);
    onChange(JSON.stringify(updatedData));
  };

  return (
    <FieldContainer style={{ display: 'flex', flexDirection: 'column' }}>
      {data.map((link, linkIndex) => (
        <div
          key={link.id}
          style={{
            borderBottom: '1px solid #e1e5e9',
            paddingBottom: ' 1rem',
            marginBottom: '1rem',
          }}
        >
          <FieldLabel style={{ marginBottom: '0.2rem' }}>Enter anchor text</FieldLabel>
          <FieldDescription>Link {linkIndex + 1}</FieldDescription>
          <TextInput
            style={{ marginBottom: '1rem' }}
            placeholder='Anchor text'
            value={link.anchorText}
            onChange={(e) => handleSetAnchorText(linkIndex, e.target.value)}
          />
          <FieldLabel style={{ marginBottom: '0.2rem' }}>
            Select a page to link to
          </FieldLabel>
          <Select
            value={pagesOptions.find((option) => option.value === link.url)}
            options={pagesOptions}
            onChange={(selectedOption) => handleSelectChange(linkIndex, selectedOption)}
          />
          {data.length > 1 && (
            <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
              <RemoveEntryButton
                style={{ marginTop: '0.75rem', marginBottom: '1.0rem' }}
                handleRemove={() => handleRemoveLinkGroup(linkIndex)}
              >
                Remove link
              </RemoveEntryButton>
            </div>
          )}
        </div>
      ))}

      <div
        style={{ display: 'flex', justifyContent: 'space-between', marginTop: '1rem' }}
      >
        <AddEntryButton handleAdd={handleAddLinkGroup}>Add new link</AddEntryButton>
      </div>
    </FieldContainer>
  );
};
