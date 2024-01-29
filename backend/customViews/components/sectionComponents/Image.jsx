import React, { useState, useEffect } from 'react';
import { v4 as uuidv4 } from 'uuid';

import { FieldContainer, FieldLabel, TextInput } from '@keystone-ui/fields';
import { Button } from '@keystone-ui/button';

// import ImageUpload from './ImageUpload/ImageUpload.jsx';
import ImageUpload from '../ImageUpload/ImageUpload';

import { deleteImages } from '../../utils/deleteImages.js';
import { uploadImages } from '../../utils/uploadImages.js';

import { styles } from '../../styles.js';

function Image({
  onCloseSection,
  sectionsData,
  onChange,
  autoFocus,
  editData,
  sectionIndex,
  setSectionsData,
}) {
  const [title, setTitle] = useState();
  const [prevFiles, setPrevFiles] = useState();

  const [newFile1, setNewFile1] = useState();
  const [newFile2, setNewFile2] = useState();
  const [newFile3, setNewFile3] = useState();

  useEffect(() => {
    if (!editData) {
      return;
    }
    setTitle(editData.title);
    setPrevFiles(editData.images);
  }, [editData]);

  async function handleSave() {
    if (onChange) {
      const newId = uuidv4();

      const imageUrls = await uploadImages([newFile1, newFile2, newFile3], newId);

      const newItem = {
        sectionType: 'IMAGE',
        id: newId,
        title,
        images: imageUrls,
      };

      setSectionsData((prevSectionsData) => [...prevSectionsData, newItem]);
      onChange(JSON.stringify([...sectionsData, newItem]));
      onCloseSection();
    }
  }

  async function handleSaveUpdate(event) {
    event.preventDefault();

    // Om Files1, files2 eller files3 finns så ladda upp dem
    const filesToUpload = [newFile1, newFile2, newFile3].filter((file) => file);

    if (filesToUpload.length > 0) {
      const newImageUrl = await uploadImages(editData.id);

      // Test
      const imagesWithId = newImageUrl.map((image) => ({
        ...image,
      }));

      if (onChange) {
        const updatedSection = {
          sectionType: 'IMAGE',
          // id: editData.id,
          id: editData.id,
          title,
          images: [...prevFiles, ...imagesWithId],
        };

        sectionsData[sectionIndex] = updatedSection;

        onChange(JSON.stringify(sectionsData));
        onCloseSection();
      }
    } else {
      // Om det inte finns några nya bilder att ladda upp
      if (onChange) {
        const updatedSection = {
          sectionType: 'IMAGE',
          id: editData.id,
          title,
          images: [...prevFiles],
        };

        sectionsData[sectionIndex] = updatedSection;

        onChange(JSON.stringify(sectionsData));
        onCloseSection();
      }
    }
  }

  const handleChange = (key, inputValue) => {
    setTitle(inputValue);
  };

  const handleDeleteImage = async (indexToRemove) => {
    // Först ta bort bilden från servern
    const imagesToDelete = prevFiles[indexToRemove].imageUrls;

    const response = await deleteImages(imagesToDelete);

    // Ta bort bilden från prevFiles
    const updatedPrevFiles = [...prevFiles];
    updatedPrevFiles.splice(indexToRemove, 1);
    setPrevFiles(updatedPrevFiles);

    // Om bilden finns i files, ta bort den där också
    if (newFile1 && indexToRemove === 0) {
      setNewFile1(null);
    }
    if (newFile2 && indexToRemove === 1) {
      setNewFile2(null);
    }
    if (newFile3 && indexToRemove === 2) {
      setNewFile3(null);
    }
  };

  return (
    <FieldContainer>
      <div className={styles.form.field}>
        <FieldLabel>Title:</FieldLabel>
        <TextInput
          autoFocus={autoFocus}
          onChange={(event) => handleChange('title', event.target.value)}
          value={title}
        />
      </div>

      <div
        className={styles.form.field}
        style={{ flexDirection: 'column', alignItems: 'flex-start' }}
      >
        <div
          className={styles.form.field}
          style={{ flexDirection: 'column', alignItems: 'flex-start' }}
        >
          <FieldLabel>Image 1:</FieldLabel>
          <div style={{ display: 'flex', marginBottom: '1rem' }}>
            <ImageUpload
              file={newFile1}
              setFile={setNewFile1}
              editData={prevFiles?.[0]?.imageUrls?.large}
            />
            <Button
              onClick={() => handleDeleteImage(0)}
              style={{
                marginTop: '1rem',
                marginLeft: '0.5rem',
                backgroundColor: '#fef3f2',
                color: '#dc2627',
                alignSelf: 'flex-end',
              }}
            >
              Delete Image
            </Button>
          </div>

          <FieldLabel>Image 2:</FieldLabel>
          <div style={{ display: 'flex', marginBottom: '1rem' }}>
            <ImageUpload
              file={newFile2}
              setFile={setNewFile2}
              editData={prevFiles?.[1]?.imageUrls?.large}
            />
            <Button
              onClick={() => handleDeleteImage(1)}
              style={{
                marginTop: '1rem',
                marginLeft: '0.5rem',
                backgroundColor: '#fef3f2',
                color: '#dc2627',
                alignSelf: 'flex-end',
              }}
            >
              Delete Image
            </Button>
          </div>

          <FieldLabel>Image 3:</FieldLabel>
          <div style={{ display: 'flex', marginBottom: '1rem' }}>
            <ImageUpload
              file={newFile3}
              setFile={setNewFile3}
              editData={prevFiles?.[2]?.imageUrls?.large}
            />
            <Button
              onClick={() => handleDeleteImage(2)}
              style={{
                marginTop: '1rem',
                marginLeft: '0.5rem',
                backgroundColor: '#fef3f2',
                color: '#dc2627',
                alignSelf: 'flex-end',
              }}
            >
              Delete Image
            </Button>
          </div>
        </div>
      </div>

      {editData ? (
        <Button style={{ marginTop: '1rem' }} onClick={handleSaveUpdate}>
          Update
        </Button>
      ) : (
        <Button style={{ marginTop: '1rem' }} onClick={handleSave}>
          Add Images section
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

export default Image;