import React, { useState, useEffect } from 'react';
import { v4 as uuidv4 } from 'uuid';

import {
  FieldContainer,
  FieldLabel,
  FieldLegend,
  TextInput,
  Select,
  FieldDescription,
} from '@keystone-ui/fields';

import Wysiwyg from '../components/Wysiwyg/Wysiwyg.jsx';
import AddSectionButton from '../components/AddSectionButton/AddSectionButton.jsx';
import UpdateSectionButton from '../components/UpdateSectionButton/UpdateSectionButton.jsx';
import CancelButton from '../components/CancelButton/CancelButton.jsx';
import useFetchChapters from '../hooks/useFetchChapters.jsx';
import useFetchCategories from '../hooks/useFetchCategories.jsx';

function NewsTeaser({
  onCloseSection,
  sectionsData,
  onChange,
  autoFocus,
  editData,
  sectionIndex,
  setSectionsData,
}) {
  const [value, setValue] = useState(() => {
    if (editData) {
      return editData;
    } else {
      return {
        title: '',
        subHeading: '',
        selectedNews: {
          chapter: 'ALLCHAPTERS',
          category: 'ALL',
        },
      };
    }
  });

  const { chapters } = useFetchChapters();
  const { categories } = useFetchCategories();
  const [chaptersOptions, setChaptersOptions] = useState([]);
  const [categoriesOptions, setCategoriesOptions] = useState([]);

  useEffect(() => {
    if (chapters) {
      const chaptersOptions = chapters.map((chapter) => ({
        label: `${chapter.title}`,
        value: `${chapter.title}`,
      }));

      chaptersOptions.unshift({ value: 'ALLCHAPTERS', label: 'All Chapters' });

      setChaptersOptions(chaptersOptions);
    }

    if (categories) {
      const categoriesOptions = categories.map((category) => ({
        label: `${category.categoryTitle}`,
        value: `${category.categoryTitle}`,
      }));

      categoriesOptions.unshift({ value: 'ALL', label: 'All categories' });

      setCategoriesOptions(categoriesOptions);
    }
  }, [chapters, categories]);

  useEffect(() => {
    if (!editData) {
      return;
    }
    setValue(editData);
  }, [editData]);

  async function handleSave() {
    if (onChange) {
      const newId = uuidv4();

      const newItem = {
        sectionType: 'NEWSTEASER',
        id: newId,
        ...value,
      };

      setSectionsData((prevSectionsData) => [...prevSectionsData, newItem]);
      onChange(JSON.stringify([...sectionsData, newItem]));
      onCloseSection();
    }
  }

  async function handleSaveUpdate(event) {
    event.preventDefault();

    if (onChange) {
      const updatedSection = {
        sectionType: 'NEWSTEASER',
        id: editData.id,
        ...value,
      };

      sectionsData[sectionIndex] = updatedSection;

      onChange(JSON.stringify(sectionsData));
      onCloseSection();
    }
  }

  const handleChange = (key, inputValue) => {
    setValue((prev) => ({
      ...prev,
      [key]: inputValue,
    }));
  };

  function setPreamble(preamble) {
    setValue((prev) => ({
      ...prev,
      subHeading: preamble,
    }));
  }

  const handleChapterChange = (selectedOption) => {
    setValue((prev) => ({
      ...prev,
      selectedNews: {
        ...prev.selectedNews,
        chapter: selectedOption.value,
      },
    }));
  };

  const handleCategoryChange = (selectedOption) => {
    setValue((prev) => ({
      ...prev,
      selectedNews: {
        ...prev.selectedNews,
        category: selectedOption.value,
      },
    }));
  };

  return (
    <FieldContainer>
      <div style={{ marginBottom: '1rem' }}>
        <FieldLabel>Title</FieldLabel>
        <TextInput
          autoFocus={autoFocus}
          onChange={(event) => handleChange('title', event.target.value)}
          value={value.title}
        />
      </div>

      <div style={{ marginBottom: '1rem' }}>
        <FieldLabel>Subheading</FieldLabel>
        <Wysiwyg
          onSetPreamble={setPreamble}
          editData={editData?.subHeading}
          extended={false}
        />
      </div>

      <div style={{ marginBottom: '1rem' }}>
        <FieldLabel>News</FieldLabel>
        <FieldDescription>Select news to display</FieldDescription>
        <div style={{ marginBottom: '1rem' }}>
          <FieldLegend>Chapters</FieldLegend>
          <Select
            value={chaptersOptions.find(
              (chapter) => chapter.value === value.selectedNews.chapter
            )}
            options={chaptersOptions}
            onChange={handleChapterChange}
          />
        </div>
        <div style={{ marginBottom: '1rem' }}>
          <FieldLegend>Categories</FieldLegend>
          <Select
            value={categoriesOptions.find(
              (category) => category.value === value.selectedNews.category
            )}
            options={categoriesOptions}
            onChange={handleCategoryChange}
          />
        </div>
      </div>

      <div style={{ borderTop: '1px solid #e1e5e9' }}>
        {editData ? (
          <UpdateSectionButton handleUpdate={handleSaveUpdate}>
            Update
          </UpdateSectionButton>
        ) : (
          <AddSectionButton handleSaveSection={handleSave}>
            Add News Teaser section
          </AddSectionButton>
        )}
        {editData && <CancelButton handleClose={onCloseSection}>Cancel</CancelButton>}
      </div>
    </FieldContainer>
  );
}

export default NewsTeaser;
