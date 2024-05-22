import React, { useState, useEffect } from 'react';
import { ReactMediaLibrary } from 'react-media-library';
import {
  FieldContainer,
  FieldLabel,
  FieldDescription,
  TextInput,
} from '@keystone-ui/fields';

import FormData from 'form-data';

import { formatFileSize } from '../../utils/formatFileSize';

import AddEntryButton from '../components/AddEntryButton/AddEntryButton';

export const Field = ({ field, value, onChange, autoFocus }) => {
  const [isMediaLibraryOpen, setIsMediaLibraryOpen] = useState(false);
  const [files, setFiles] = useState([]);
  const [selectedFile, setSelectedFile] = useState(null);
  const [search, setSearch] = useState('');
  const [isFileUploaded, setIsFileUploaded] = useState(false);
  const [filteredFiles, setFilteredFiles] = useState();
  const [lastUploadedFile, setLastUploadedFile] = useState(null);

  const loc = window.location;
  const API_URL = `${loc.protocol}//${loc.host}/api/graphql`;

  // Hämta bilderna vid första renderingen
  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    if (isFileUploaded) {
      fetchData();
      // setIsFileUploaded(false);
    }
  }, [isFileUploaded]);

  const fetchData = async () => {
    console.log('här borde');
    if (value && !isFileUploaded) {
      setSelectedFile(JSON.parse(value));
    }

    try {
      const response = await fetch(`${API_URL}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Apollo-Require-Preflight': 'true',
        },
        body: JSON.stringify({
          query: `
          query {
            images {
              createdAt
              altText
              id
              size
              url
              title
            }
          }
        `,
        }),
      });

      const result = await response.json();

      const modifiedFiles = result.data.images.map((file) => {
        return {
          ...file,
          _id: file.id,
          id: undefined,
          thumbnailUrl: file.url,
        };
      });

      setFiles(modifiedFiles);
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  const handleOpenMediaLibrary = () => {
    setIsMediaLibraryOpen((prev) => !prev);
  };

  const handleSelectFile = (file) => {
    setSelectedFile(file[0]);
    handleOpenMediaLibrary();

    onChange(JSON.stringify(file[0]));
  };

  // Export till hooks
  const handleFileUpload = async (uploadedFile) => {
    try {
      const formData = new FormData();
      formData.append(
        'operations',
        JSON.stringify({
          query: `
          mutation CreateImage($data: ImageCreateInput!) {
            createImage(data: $data) {
              id
              altText
            }
          }
        `,
          variables: {
            data: {
              title: `${uploadedFile.name}`,
              altText: `Image - ${uploadedFile.name}`,
              file: {
                upload: null,
              },
            },
          },
        })
      );
      formData.append('map', JSON.stringify({ 0: ['variables.data.file.upload'] }));
      formData.append('0', uploadedFile);

      const response = await fetch(`${API_URL}`, {
        method: 'POST',
        headers: {
          'Apollo-Require-Preflight': 'true',
        },
        body: formData,
      });

      const result = await response.json();
      // result.data.createImage.id finns bara.

      if (!result.errors) {
        setIsFileUploaded(true);
        setLastUploadedFile(result.data.createImage.id);

        return true;
      }
      return false;
    } catch (error) {
      console.error('Error uploading file:', error);
      return false;
    }
  };

  const handleSearch = (input) => {
    setSearch(input);
    const filtered = files.filter((file) => {
      return file.title.toLowerCase().includes(input.toLowerCase());
    });
    setFilteredFiles(filtered);
  };

  const searchBar = () => (
    <div style={{ padding: '0rem 1rem' }}>
      <TextInput
        placeholder='Search by titel'
        value={search}
        onChange={(event) => {
          handleSearch(event.target.value);
        }}
        style={{ marginBottom: '1rem' }}
      />
    </div>
  );

  async function handleFinishUpload() {
    // setFiles((prev) => [...prev, uploadedFile]);
    setIsFileUploaded(true);
    await fetchData();
    // setSelectedFile(lastUploadedFile);
    // i lastUploadedFile finns id på den uppladdade bilden.
    // nu behöver vi hitta den bilden i files och sätta den som selectedFile
    const foundFile = files.find((file) => file._id === lastUploadedFile);
    // console.log('foundFile', filxwes);
    setSelectedFile(foundFile);

    onChange(JSON.stringify(selectedFile));
    setIsMediaLibraryOpen(false);
  }

  return (
    <FieldContainer>
      <FieldLabel>{field.label}</FieldLabel>
      {field.description && (
        <FieldDescription style={{ marginBottom: '1rem' }}>
          {field.description}
        </FieldDescription>
      )}

      <AddEntryButton style={{ marginBottom: '1rem' }} handleAdd={handleOpenMediaLibrary}>
        Open Image Library
      </AddEntryButton>
      <div>
        <FieldDescription>Selected image:</FieldDescription>
        <div
          style={{
            width: '20rem',
          }}
        >
          {selectedFile ? (
            <>
              <img
                alt={selectedFile.title}
                src={selectedFile.thumbnailUrl}
                style={{
                  height: 'auto',
                  width: '100%',
                  borderRadius: '7px',
                  border: '1px solid #e0e5e9',
                }}
              />
              <FieldDescription>
                Title: {selectedFile?.title}
                <br />
                Filesize: {formatFileSize(selectedFile?.size)}
              </FieldDescription>
            </>
          ) : (
            <FieldDescription>No selected Images</FieldDescription>
          )}
        </div>
      </div>
      {files && (
        <ReactMediaLibrary
          acceptedTypes={['image/*']}
          modalTitle='Image Library'
          defaultSelectedItemIds={selectedFile ? [selectedFile._id] : null}
          fileLibraryList={filteredFiles ? filteredFiles : files}
          fileUploadCallback={handleFileUpload}
          // filesDeleteCallback={handleDeleteFile}
          filesSelectCallback={handleSelectFile}
          finishUploadCallback={handleFinishUpload}
          onClose={handleOpenMediaLibrary}
          isOpen={isMediaLibraryOpen}
          topBarComponent={searchBar}
        />
      )}
    </FieldContainer>
  );
};
