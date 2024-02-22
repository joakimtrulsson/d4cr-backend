import React from 'react';
import { v4 as uuidv4 } from 'uuid';

import useFetchChapters from '../hooks/useFetchChapters.jsx';
import AddSectionButton from '../components/AddSectionButton/AddSectionButton.jsx';

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
    <AddSectionButton handleSaveSection={handleSave}>
      Add Chapter Teaser section
    </AddSectionButton>
  );
}

export default ChapterTeaser;
