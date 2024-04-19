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
      <FieldLabel
        style={{
          display: 'flex',
          paddingTop: '0.5rem',
        }}
      >
        Chapter Teaser - <ImageTooltip type='CHAPTERTEASER' />
        <CancelButton
          handleClose={handleOpenModal}
          style={{ marginTop: 0, marginLeft: 'auto' }}
        >
          Close section
        </CancelButton>
      </FieldLabel>

      <FieldDescription style={{ marginBottom: '1rem' }}>
        This will add a Chapter teaser section, featuring the chapters that exist at the
        time of creation.
      </FieldDescription>
      <AddSectionButton handleSaveSection={handleSave}>
        Add Chapter Teaser section
      </AddSectionButton>

      <CloseSectionAlert
        isOpen={isOpen}
        handleCancel={handleCancel}
        handleConfirm={onCloseSection}
      />
    </FieldContainer>
  );
}

export default ChapterTeaser;
