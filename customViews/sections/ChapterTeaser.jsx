import React from 'react';
import { v4 as uuidv4 } from 'uuid';
import { FieldContainer, FieldDescription, FieldLabel } from '@keystone-ui/fields';
import useFetchChapters from '../hooks/useFetchChapters.jsx';
import AddSectionButton from '../components/AddSectionButton/AddSectionButton.jsx';
import ImageTooltip from '../components/ImageTooltip/ImageToolTip.jsx';

function ChapterTeaser({ onCloseSection, onChange, sectionsData, setSectionsData }) {
  const { chapters } = useFetchChapters();

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

  return (
    <FieldContainer>
      <FieldLabel>
        Chapter Teaser - <ImageTooltip type='CHAPTERTEASER' />
      </FieldLabel>

      <FieldDescription style={{ marginBottom: '1rem' }}>
        This will add a Chapter teaser section, featuring the chapters that exist at the
        time of creation.
      </FieldDescription>
      <AddSectionButton handleSaveSection={handleSave}>
        Add Chapter Teaser section
      </AddSectionButton>
    </FieldContainer>
  );
}

export default ChapterTeaser;
