import React, { useState, useEffect } from 'react';
import { ReactMediaLibrary } from 'react-media-library';
import {
  FieldContainer,
  FieldLabel,
  FieldDescription,
  TextInput,
} from '@keystone-ui/fields';
import { Button } from '@keystone-ui/button';
import FormData from 'form-data';

import { formatFileSize } from '../utils/formatFileSize';

export const Field = ({ field, value, onChange, autoFocus }) => {
  const [isMediaLibraryOpen, setIsMediaLibraryOpen] = useState(false);
  const [files, setFiles] = useState([]);
  const [selectedFile, setSelectedFile] = useState(null);
  const [search, setSearch] = useState('');
  const [isFileUploaded, setIsFileUploaded] = useState(false);
  const [filteredFiles, setFilteredFiles] = useState();

  const loc = window.location;
  const API_URL = `${loc.protocol}//${loc.host}/api/graphql`;

  // Hämta bilderna vid första renderingen
  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    if (isFileUploaded) {
      fetchData();
      setIsFileUploaded(false);
    }
  }, [isFileUploaded]);

  const fetchData = async () => {
    if (value) {
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
            videos {
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

      const modifiedFiles = result.data.videos.map((file) => {
        return {
          ...file,
          _id: file.id,
          id: undefined,
          // Detta ska ändras när thumbnailUrl(bild) finns
          thumbnailUrl: file.url,
          // url: undefined,
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

    file[0].thumbnailUrl = undefined;

    onChange(JSON.stringify(file[0]));
  };

  // Export till hooks?
  const handleFileUpload = async (uploadedFile) => {
    try {
      const formData = new FormData();
      formData.append(
        'operations',
        JSON.stringify({
          query: `
          mutation CreateVideo($data: VideoCreateInput!) {
            createVideo(data: $data) {
              id
            }
          }
        `,
          variables: {
            data: {
              title: `${uploadedFile.name}`,
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

      setFiles((prev) => [...prev, uploadedFile]);

      const result = await response.json();
      // result.data.createImage.id finns bara.

      if (!result.errors) {
        setIsFileUploaded(true);
        return true;
      }
      return false;
    } catch (error) {
      console.error('Error uploading file:', error);
      return false;
    }
  };

  // Export till hooks
  const handleDeleteFile = async (file) => {
    try {
      const response = await fetch(`${API_URL}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Apollo-Require-Preflight': 'true',
        },
        body: JSON.stringify({
          query: `
          mutation DeleteVideo($id: ID!) {
            deleteImage(where: { id: $id }) {
              id
            }
          }
    `,
          variables: {
            id: file[0]._id,
          },
        }),
      });

      const result = await response.json();

      if (!result.errors) return true;
      return false;
    } catch (error) {
      console.error('Error deleting file:', error);
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

  return (
    <FieldContainer>
      <FieldLabel>{field.label}</FieldLabel>

      <Button
        style={{ marginBottom: '1rem' }}
        type='small'
        onClick={handleOpenMediaLibrary}
      >
        Open Video Library
      </Button>
      <div>
        <FieldDescription>Selected video:</FieldDescription>
        <div
          style={{
            width: '20rem',
          }}
        >
          {selectedFile ? (
            <>
              <video controls style={{ height: '150px' }}>
                <source src={selectedFile.url} type='video/mp4' />
                Your browser does not support the video tag.
              </video>
              <FieldDescription>
                Title: {selectedFile?.title}
                <br />
                Filesize: {formatFileSize(selectedFile?.size)}
              </FieldDescription>
            </>
          ) : (
            <FieldDescription>No selected video</FieldDescription>
          )}
        </div>
      </div>
      {files && (
        <ReactMediaLibrary
          acceptedTypes={['video/*']}
          // defaultSelectedItemIds={[files[0]._id]}
          fileLibraryList={filteredFiles ? filteredFiles : files}
          // fileLibraryList={filteredFiles}
          modalTitle='Video Library'
          fileUploadCallback={handleFileUpload}
          // filesDeleteCallback={handleDeleteFile}
          filesSelectCallback={handleSelectFile}
          finishUploadCallback={function noRefCheck() {}}
          onClose={handleOpenMediaLibrary}
          isOpen={isMediaLibraryOpen}
          topBarComponent={searchBar}
        />
      )}
    </FieldContainer>
  );
};
