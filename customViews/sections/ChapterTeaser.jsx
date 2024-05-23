import React, { useState } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { FieldContainer, FieldDescription, FieldLabel } from '@keystone-ui/fields';

import {
  AddSectionButton,
  ImageToolTip,
  CloseSectionAlert,
  CancelButton,
} from '../components/index.js';
import useFetchChapters from '../hooks/useFetchChapters.jsx';

function ChapterTeaser({ onCloseSection, onChange, sectionsData, setSectionsData }) {
  const { chapters } = useFetchChapters();
  const [isOpen, setIsOpen] = useState(false);

  function handleSave() {
    if (onChange) {
      const newItem = {
        sectionType: 'CHAPTERTEASER',
        id: uuidv4(),
        chapters: chapters,
      };
      setSectionsData((prevSectionsData) => [...prevSectionsData, newItem]);
      onChange(JSON.stringify([...sectionsData, newItem]));
      onCloseSection();
    }
  }

  const handleOpenModal = async () => {
    setIsOpen(true);
  };

  const handleCancel = () => {
    setIsOpen(false);
  };

  return (
    <FieldContainer>
      <div
        style={{
          display: 'flex',
          flexDirection: 'row',
          alignItems: 'center',
          borderBottom: '1px solid #e1e5e9',
          width: '900px',
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
          Chapter Teaser - <ImageToolTip type='CHAPTERTEASER' />
        </FieldLabel>
        <CancelButton
          handleClose={handleOpenModal}
          style={{ marginTop: 0, marginLeft: 'auto' }}
        >
          Close section
        </CancelButton>
      </div>

      <FieldDescription style={{ marginBottom: '2rem', marginTop: '1rem' }}>
        This will add a Chapter teaser section, featuring the chapters that exist at the
        time of creation.
      </FieldDescription>

      <div
        style={{
          borderTop: '1px solid #e1e5e9',
          height: '4rem',
          overflow: 'auto',
          position: 'sticky',
          bottom: 0,
          backgroundColor: '#fff',
          zIndex: 100,
          paddingTop: '1rem',
        }}
      >
        <AddSectionButton handleSaveSection={handleSave}>
          Add Chapter Teaser section
        </AddSectionButton>
      </div>
      <CloseSectionAlert
        isOpen={isOpen}
        handleCancel={handleCancel}
        handleConfirm={onCloseSection}
      />
    </FieldContainer>
  );
}

export default ChapterTeaser;
