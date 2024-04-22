import React, { useState } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { FieldContainer, FieldDescription, FieldLabel } from '@keystone-ui/fields';
import useFetchChapters from '../hooks/useFetchChapters.jsx';
import AddSectionButton from '../components/AddSectionButton/AddSectionButton.jsx';
import ImageTooltip from '../components/ImageTooltip/ImageToolTip.jsx';
import CloseSectionAlert from '../components/CloseSectionAlert/CloseSectionAlert';
import CancelButton from '../components/CancelButton/CancelButton.jsx';

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
          marginBottom: '1rem',
          paddingBottom: '0.5rem',
          borderBottom: '1px solid #e1e5e9',
          width: '700px',
        }}
      >
        <FieldLabel
          style={{
            fontSize: '1.3rem',
          }}
        >
          Chapter Teaser - <ImageTooltip type='CHAPTERTEASER' />
        </FieldLabel>
        <CancelButton
          handleClose={handleOpenModal}
          style={{ marginTop: 0, marginLeft: 'auto' }}
        >
          Close section
        </CancelButton>
      </div>

      <FieldDescription style={{ marginBottom: '1rem' }}>
        This will add a Chapter teaser section, featuring the chapters that exist at the
        time of creation.
      </FieldDescription>

      <div
        style={{
          borderTop: '1px solid #e1e5e9',
          paddingTop: '0.5rem',
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
