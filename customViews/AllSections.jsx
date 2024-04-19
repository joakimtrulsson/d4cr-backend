import React, { useState } from 'react';

import { FieldContainer, FieldLabel, FieldDescription } from '@keystone-ui/fields';
import { AlertDialog } from '@keystone-ui/modals';

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
  Principles,
  People,
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
  PRINCIPLES: Principles,
  PEOPLE: People,
};

import SelectSections from './components/SelectSections/SelectSections';
import StoredSections from './components/StoredSections/StoredSections';

export const Field = ({ field, value, onChange, autoFocus }) => {
  const [sectionsData, setSectionsData] = useState(value ? JSON.parse(value) : []);
  const [activeSection, setActiveSection] = useState('Select');
  const [isOpen, setIsOpen] = React.useState(false);
  const [sectionToDelete, setSectionToDelete] = React.useState({
    sectionId: '',
    sectionTitle: '',
  });

  const [editFormData, setEditFormData] = useState();

  const handleActiveSection = (event) => {
    setActiveSection(event.value);
  };

  const handleEditSection = (sectionId) => {
    const sectionToEditData = sectionsData.find((section) => section.id === sectionId);
    const sectionIndex = sectionsData.findIndex((section) => section.id === sectionId);

    // Om sectionType är "CHAPTERTEASER" eller "STEERINGGROUP", gör ingenting
    if (sectionToEditData.sectionType === 'CHAPTERTEASER') {
      return;
    }

    setEditFormData({ sectionData: sectionToEditData, sectionIndex });
    setActiveSection(sectionToEditData.sectionType);
  };

  const handleOpenDeleteModal = async (sectionId, sectionTitle) => {
    setSectionToDelete({ sectionId, sectionTitle });
    setIsOpen(true);

    // if (onChange) {
    //   const updatedSectionsData = sectionsData.filter((item) => item.id !== sectionId);

    //   setSectionsData(() => [...updatedSectionsData]);
    //   onChange(JSON.stringify(updatedSectionsData));
    // }
    // handleCloseSection();
  };

  const handleDelete = () => {
    // Delete the post here
    if (onChange) {
      const updatedSectionsData = sectionsData.filter(
        (item) => item.id !== sectionToDelete.sectionId
      );

      setSectionsData(() => [...updatedSectionsData]);
      onChange(JSON.stringify(updatedSectionsData));
    }
    handleCloseSection();
    setIsOpen(false);
  };

  const handleCancel = () => {
    setIsOpen(false);
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

      <FieldLabel style={{ marginTop: '2rem' }}>Stored Sections</FieldLabel>
      <FieldDescription style={{ marginTop: '0rem', marginBottom: '-0.5rem' }}>
        Sections stored in this field will be displayed in the order listed. You can
        easily reorder them by clicking and dragging. To preview how the section will
        appear in the frontend application, simply click the Preview button.
      </FieldDescription>
      {sectionsData.length === 0 ? (
        <FieldDescription>
          <p>No sections stored</p>
        </FieldDescription>
      ) : (
        <StoredSections
          sectionsData={sectionsData}
          setSectionsData={setSectionsData}
          onEditSection={handleEditSection}
          onDelete={handleOpenDeleteModal}
          onChange={onChange}
          activeSection={activeSection}
        />
      )}
      <AlertDialog
        isOpen={isOpen}
        title='Confirm Delete'
        actions={{
          confirm: {
            action: handleDelete,
            label: 'Delete',
            loading: false,
          },
          cancel: {
            action: handleCancel,
            label: 'Cancel',
          },
        }}
      >
        Are you sure you want to delete {sectionToDelete.sectionTitle}?
      </AlertDialog>
    </FieldContainer>
  );
};
