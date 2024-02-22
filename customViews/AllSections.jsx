import React, { useState } from 'react';

import { FieldContainer, FieldLabel, FieldDescription } from '@keystone-ui/fields';

import { options } from './utils/constants';

import * as SectionComponents from './sections';

const {
  ChapterTeaser,
  LargeBulletList,
  MediaText,
  Accordion,
  Image,
  Banner,
  NewsTeaser,
  WysiwygSection,
  Resources,
  Principles,
  SteeringGroup,
} = SectionComponents;

const SECTIONS = {
  CHAPTERTEASER: ChapterTeaser,
  MEDIATEXT: MediaText,
  ACCORDION: Accordion,
  BULLETLIST: LargeBulletList,
  IMAGE: Image,
  BANNER: Banner,
  NEWSTEASER: NewsTeaser,
  WYSIWYG: WysiwygSection,
  RESOURCES: Resources,
  PRINCIPLES: Principles,
  STEERINGGROUP: SteeringGroup,
};

import SelectSections from './components/SelectSections/SelectSections';
import StoredSections from './components/StoredSections/StoredSections';

export const Field = ({ field, value, onChange, autoFocus }) => {
  const [sectionsData, setSectionsData] = useState(value ? JSON.parse(value) : []);
  const [activeSection, setActiveSection] = useState('');

  const [editFormData, setEditFormData] = useState();

  const handleActiveSection = (event) => {
    setActiveSection(event.value);
  };

  const handleEditSection = (sectionId) => {
    const sectionToEditData = sectionsData.find((section) => section.id === sectionId);
    const sectionIndex = sectionsData.findIndex((section) => section.id === sectionId);

    // Om sectionType är "CHAPTERTEASER" eller "STEERINGGROUP", gör ingenting
    if (
      sectionToEditData.sectionType === 'CHAPTERTEASER' ||
      sectionToEditData.sectionType === 'STEERINGGROUP'
    ) {
      return;
    }

    setEditFormData({ sectionData: sectionToEditData, sectionIndex });
    setActiveSection(sectionToEditData.sectionType);
  };

  const handleDeleteSection = async (sectionId) => {
    if (onChange) {
      const updatedSectionsData = sectionsData.filter((item) => item.id !== sectionId);

      setSectionsData(() => [...updatedSectionsData]);
      onChange(JSON.stringify(updatedSectionsData));
    }
  };

  const handleCloseSection = () => {
    setEditFormData();
    setActiveSection(options[0].value);
  };

  return (
    <FieldContainer>
      <FieldLabel>{field.label}</FieldLabel>
      {!editFormData && (
        <SelectSections
          activeSection={activeSection}
          onChangeActiveSections={handleActiveSection}
          options={options}
        />
      )}

      {Object.entries(SECTIONS).map(([key, SectionComponent], index) => {
        const commonProps = {
          sectionsData,
          setSectionsData,
          onCloseSection: handleCloseSection,
          onChange,
          autoFocus,
        };

        if (!editFormData && activeSection === key) {
          return <SectionComponent key={index} {...commonProps} />;
        }

        if (editFormData && editFormData.sectionData.sectionType === key) {
          return (
            <SectionComponent
              key={index}
              {...commonProps}
              editData={editFormData.sectionData}
              sectionIndex={editFormData.sectionIndex}
            />
          );
        }

        return null;
      })}

      <FieldLabel style={{ marginTop: '1rem', marginBottom: '-1rem' }}>
        Stored Sections
      </FieldLabel>
      {sectionsData.length === 0 ? (
        <FieldDescription>
          <p>No sections stored</p>
        </FieldDescription>
      ) : (
        <StoredSections
          sectionsData={sectionsData}
          setSectionsData={setSectionsData}
          onEditSection={handleEditSection}
          onDelete={handleDeleteSection}
          onChange={onChange}
        />
      )}
    </FieldContainer>
  );
};
