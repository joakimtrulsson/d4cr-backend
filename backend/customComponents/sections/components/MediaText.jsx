import React, { useState, useEffect } from 'react';
import FormData from 'form-data';
import { v4 as uuidv4 } from 'uuid';

import { FieldContainer, FieldLabel, TextInput, Select } from '@keystone-ui/fields';
import { Button } from '@keystone-ui/button';

import SimpleWysiwyg from './SimpleWysiwyg/SimpleWysiwyg.jsx';
import ImageUpload from './ImageUpload/ImageUpload.jsx';

import { styles } from '../styles.js';

function MediaText({
  onCloseSection,
  sectionsData,
  onChange,
  autoFocus,
  editData,
  sectionIndex,
  setSectionsData,
}) {
  const [value, setValue] = useState({});
  const [file, setFile] = useState(editData?.image || {});

  const [colorOptions] = useState([
    { value: 'ORANGE', label: 'Orange' },
    { value: 'YELLOW', label: 'Yellow' },
  ]);

  const [imageOptions] = useState([
    { value: 'LEFT', label: 'Left' },
    { value: 'RIGHT', label: 'Right' },
  ]);

  const [borderOptions] = useState([
    { value: 'TOPBOTTOM', label: 'Top & Bottom' },
    { value: 'TOP', label: 'Top Only' },
    { value: 'BOTTOM', label: 'Bottom Only' },
  ]);

  useEffect(() => {
    if (!editData) {
      return;
    }
    setValue(editData);
  }, [editData]);

  async function uploadImage(id) {
    if (!file) {
      return;
    }

    const formData = new FormData();
    formData.append('image', file.file);
    formData.append('id', id);

    try {
      const response = await fetch('http://localhost:3000/api/imageupload', {
        method: 'PATCH',
        headers: {
          ...(formData instanceof FormData ? {} : { 'Content-Type': 'application/json' }),
        },
        body: formData,
      });

      const data = await response.json();

      if (data.success === 'true') {
        return data.imageUrl;
      }
    } catch (error) {
      return error.message;
    }
  }

  async function handleSave() {
    if (onChange) {
      const newId = uuidv4();
      if (!file) {
        return;
      }

      const imageUrl = await uploadImage(newId);

      // Kontrollera att fält i är ifyllda innan du lägger till i sectionsData

      const newItem = {
        sectionType: 'MEDIATEXT',
        id: newId,
        imageUrl,
        ...value,
      };

      setSectionsData((prevSectionsData) => [...prevSectionsData, newItem]);
      onChange(JSON.stringify([...sectionsData, newItem]));
      onCloseSection();
    }
  }

  async function handleSaveUpdate(event) {
    event.preventDefault();
    const imageUrl = await uploadImage(editData.id);
    if (onChange) {
      const updatedSection = {
        sectionType: 'MEDIATEXT',
        id: editData.id,
        ...value,
        imageUrl,
      };

      sectionsData[sectionIndex] = updatedSection;

      onChange(JSON.stringify(sectionsData));
      onCloseSection();
    }
  }

  function setPremble(premble) {
    setValue((prev) => ({
      ...prev,
      premble,
    }));
  }

  const handleChange = (key, inputValue) => {
    setValue((prev) => ({
      ...prev,
      [key]: inputValue,
    }));
  };

  return (
    <FieldContainer>
      <div className={styles.form.field}>
        <FieldLabel>Title:</FieldLabel>
        <TextInput
          autoFocus={autoFocus}
          onChange={(event) => handleChange('title', event.target.value)}
          value={value.title}
        />
      </div>
      <div className={styles.form.field}>
        <FieldLabel>Subheading:</FieldLabel>
        <TextInput
          autoFocus={autoFocus}
          onChange={(event) => handleChange('subHeading', event.target.value)}
          value={value.subHeading}
        />
      </div>

      <div className={styles.form.field}>
        <FieldLabel>Background color:</FieldLabel>
        <Select
          value={colorOptions.find((option) => option.value === value.backgroundColor)}
          options={colorOptions}
          onChange={(selectedOption) =>
            handleChange('backgroundColor', selectedOption.value)
          }
        />
      </div>

      <div className={styles.form.field}>
        <FieldLabel>Border:</FieldLabel>
        <Select
          value={borderOptions.find((option) => option.value === value.border)}
          options={borderOptions}
          onChange={(selectedOption) => handleChange('border', selectedOption.value)}
        />
      </div>

      <div className={styles.form.field}>
        <FieldLabel>Image position:</FieldLabel>

        <Select
          value={imageOptions.find((option) => option.value === value.imagePosition)}
          options={imageOptions}
          onChange={(selectedOption) =>
            handleChange('imagePosition', selectedOption.value)
          }
        />
      </div>

      <div
        className={styles.form.field}
        style={{ flexDirection: 'column', alignItems: 'flex-start' }}
      >
        <FieldLabel>Image:</FieldLabel>

        <ImageUpload file={file} setFile={setFile} editData={editData?.imageUrl} />
      </div>

      <div
        style={{ flexDirection: 'column', alignItems: 'flex-start' }}
        className={styles.form.field}
      >
        <FieldLabel style={{ marginRight: 'auto' }}>Preamble:</FieldLabel>
        <SimpleWysiwyg onSetPremble={setPremble} editData={editData?.premble} />
      </div>
      {editData ? (
        <Button style={{ marginTop: '1rem' }} onClick={handleSaveUpdate}>
          Update
        </Button>
      ) : (
        <Button style={{ marginTop: '1rem' }} onClick={handleSave}>
          Add Media + Text Section
        </Button>
      )}
      {editData && (
        <Button
          style={{
            marginTop: '1rem',
            marginLeft: '0.5rem',
            backgroundColor: '#fef3f2',
            color: '#dc2627',
          }}
          onClick={onCloseSection}
        >
          Cancel
        </Button>
      )}
    </FieldContainer>
  );
}

export default MediaText;
