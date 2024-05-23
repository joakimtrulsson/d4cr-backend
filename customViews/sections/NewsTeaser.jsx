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

import {
  Editor,
  AddSectionButton,
  UpdateSectionButton,
  CancelButton,
  ValidationError,
  SectionImageToolTip,
  CloseSectionAlert,
} from '../components/index.js';
import useFetchChapters from '../hooks/useFetchChapters.jsx';
import useFetchCategories from '../hooks/useFetchCategories.jsx';
import { useValidation } from '../hooks/useValidation';

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
  const [isOpen, setIsOpen] = useState(false);

  const { chapters } = useFetchChapters();
  const { categories } = useFetchCategories();
  const [chaptersOptions, setChaptersOptions] = useState([]);
  const [categoriesOptions, setCategoriesOptions] = useState([]);
  const { validateFields, errors, setErrors } = useValidation([
    'sectionTitle',
    'title',
    'preamble',
  ]);

  useEffect(() => {
    if (chapters) {
      const chaptersOptions = chapters.map((chapter) => ({
        label: `${chapter.title}`,
        value: `${chapter.slug}`,
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
    if (!validateFields(value)) {
      return;
    }

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

  async function handleSaveUpdate() {
    if (!validateFields(value)) {
      return;
    }

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
    // Rensa fältets felstatus
    setErrors((prev) => prev.filter((error) => error !== key));

    setValue((prev) => ({
      ...prev,
      [key]: inputValue,
    }));
  };

  function setPreamble(preamble) {
    setErrors((prev) => prev.filter((error) => error !== 'preamble'));
    setValue((prev) => ({
      ...prev,
      preamble,
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
          News Teaser - <SectionImageToolTip type='NEWSTEASER' />
        </FieldLabel>
        <CancelButton
          handleClose={handleOpenModal}
          style={{ marginTop: 0, marginLeft: 'auto' }}
        >
          Close section
        </CancelButton>
      </div>

      <div style={{ marginBottom: '1rem' }}>
        <FieldLabel>Section identifier</FieldLabel>
        <FieldDescription>
          Unique identifier for this section, used in the sections list.
        </FieldDescription>
        <TextInput
          autoFocus={autoFocus}
          onChange={(event) => handleChange('sectionTitle', event.target.value)}
          value={value.sectionTitle}
        />
        {errors.includes('sectionTitle') && (
          <ValidationError field='Section identifier' />
        )}
      </div>

      <div style={{ marginBottom: '1rem' }}>
        <FieldLabel>Title</FieldLabel>
        <FieldDescription>
          This reqiured field specifies the title text on the News section.
        </FieldDescription>
        <TextInput
          autoFocus={autoFocus}
          onChange={(event) => handleChange('title', event.target.value)}
          value={value.title}
        />
        {errors.includes('title') && <ValidationError field='Title' />}
      </div>

      <div style={{ marginBottom: '1rem' }}>
        <FieldLabel>Preamble</FieldLabel>
        <FieldDescription>
          This reqiured field specifies the preamble text of the News section.
        </FieldDescription>
        <Editor
          onSetPreamble={setPreamble}
          editData={editData?.preamble}
          extended={false}
        />
        {errors.includes('preamble') && <ValidationError field='Preamble text' />}
      </div>

      <div style={{ marginBottom: '1rem' }}>
        <FieldLabel>News</FieldLabel>
        <FieldDescription>
          Choose news to display; only the three latest will be shown.
        </FieldDescription>
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

      <div
        style={{
          borderTop: '1px solid #e1e5e9',
          height: '4rem',
          overflow: 'auto',
          position: 'sticky',
          bottom: 0,
          backgroundColor: '#fff',
          zIndex: 100,
          display: 'flex',
          alignItems: 'center',
        }}
      >
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

      <CloseSectionAlert
        isOpen={isOpen}
        handleCancel={handleCancel}
        handleConfirm={onCloseSection}
      />
    </FieldContainer>
  );
}

export default NewsTeaser;
