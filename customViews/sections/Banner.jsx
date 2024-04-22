import React, { useState, useEffect } from 'react';
import { v4 as uuidv4 } from 'uuid';

import {
  FieldContainer,
  FieldLabel,
  TextInput,
  FieldDescription,
} from '@keystone-ui/fields';

import IconPicker from '../components/IconPicker/IconPicker.jsx';
import Editor from '../components/Editor/Editor.jsx';
import CallToActionForm from '../components/CallToActionForm/CallToActionForm.jsx';
import AddSectionButton from '../components/AddSectionButton/AddSectionButton.jsx';
import UpdateSectionButton from '../components/UpdateSectionButton/UpdateSectionButton.jsx';
import CancelButton from '../components/CancelButton/CancelButton.jsx';
import ImageTooltip from '../components/ImageTooltip/ImageToolTip.jsx';
import ValidationError from '../components/ValidationError/ValidationError';
import CloseSectionAlert from '../components/CloseSectionAlert/CloseSectionAlert';
import useFetchLinkOptions from '../hooks/useFetchLinkOptions.jsx';
import { useValidation } from '../hooks/useValidation';

function Banner({
  onCloseSection,
  sectionsData,
  onChange,
  autoFocus,
  editData,
  sectionIndex,
  setSectionsData,
}) {
  const [iconName, setIconName] = useState('');
  const [value, setValue] = useState({ title: '' });
  const [isOpen, setIsOpen] = useState(false);
  const pagesOptions = useFetchLinkOptions();
  const [pageValue, setPageValue] = useState('');
  const { validateFields, errors, setErrors } = useValidation([
    'sectionTitle',
    'title',
    'preamble',
    'cta',
    'iconName',
  ]);

  useEffect(() => {
    if (!editData) {
      return;
    }
    setValue(editData);
    setIconName(editData.iconName);

    if (editData.cta.url.startsWith('/')) {
      setPageValue(editData.cta.url);
      setValue((prev) => ({
        ...prev,
        cta: { ...prev.cta, url: '' },
      }));
    }
  }, [editData]);

  async function handleSave() {
    const newValue = { ...value, iconName };

    if (!validateFields(newValue)) {
      return;
    }

    if (onChange) {
      const newId = uuidv4();

      const newItem = {
        sectionType: 'BANNER',
        id: newId,
        iconName,
        ...value,
      };

      if (pageValue) {
        newItem.cta.url = pageValue;
      }

      setSectionsData((prevSectionsData) => [...prevSectionsData, newItem]);
      onChange(JSON.stringify([...sectionsData, newItem]));
      onCloseSection();
    }
  }

  async function handleSaveUpdate() {
    const newValue = { ...value, iconName };

    if (!validateFields(newValue)) {
      return;
    }

    if (onChange) {
      const updatedSection = {
        sectionType: 'BANNER',
        id: editData.id,
        ...value,
        iconName,
      };

      if (pageValue) {
        updatedSection.cta.url = pageValue;
      }

      sectionsData[sectionIndex] = updatedSection;

      onChange(JSON.stringify(sectionsData));
      onCloseSection();
    }
  }

  function setPreamble(preamble) {
    setErrors((prev) => prev.filter((error) => error !== 'preamble'));

    setValue((prev) => ({
      ...prev,
      preamble,
    }));
  }

  const handleChange = (key, inputValue) => {
    // Rensa fältets felstatus
    setErrors((prev) => prev.filter((error) => error !== key));

    if (key !== 'cta' || (inputValue.url && inputValue.anchorText)) {
      setErrors((prev) => prev.filter((error) => error !== 'cta'));
    }

    if (key === 'page') {
      setPageValue(inputValue);
    } else if (key === 'url') {
      setValue((prev) => ({
        ...prev,
        cta: { ...prev.cta, [key]: inputValue },
      }));
    } else if (key === 'anchorText') {
      setValue((prev) => ({
        ...prev,
        cta: { ...prev.cta, [key]: inputValue },
      }));
    } else {
      setValue((prev) => ({
        ...prev,
        [key]: inputValue,
      }));
    }
  };

  const handleIconNameChange = (newIconName) => {
    // Sätt det nya iconNamnet
    setIconName(newIconName);

    // Ta bort ValidationError under iconName om det nya värdet är satt
    if (newIconName && errors.includes('iconName')) {
      setErrors((prevErrors) => prevErrors.filter((error) => error !== 'iconName'));
    }
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
          Banner - <ImageTooltip type='BANNER' />
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
          This reqiured field specifies the title text of the banner.
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
          This reqiured field specifies the preamble text of the banner.
        </FieldDescription>
        <Editor
          onSetPreamble={setPreamble}
          extended={false}
          editData={editData?.preamble}
        />
        {errors.includes('preamble') && <ValidationError field='Preamble text' />}
      </div>

      <div style={{ marginBottom: '1rem' }}>
        <FieldLabel>Call to action</FieldLabel>
        <FieldDescription>
          This required field represents the anchor text for the call-to-action button
          used in the banner.
        </FieldDescription>

        <CallToActionForm
          autoFocus={autoFocus}
          anchorText={value.cta?.anchorText}
          pageValue={pageValue}
          url={value.cta?.url}
          onChange={handleChange}
          pagesOptions={pagesOptions}
          ctaIdentifier={1}
        />
        {errors.includes('cta') && <ValidationError field='Call to action' />}
      </div>

      <div style={{ marginBottom: '1rem' }}>
        <FieldLabel>Select an icon:</FieldLabel>
        <FieldDescription>
          This required field specifies the icon to be rendered in the banner.
        </FieldDescription>
        <IconPicker value={iconName} onChange={handleIconNameChange} />

        {errors.includes('iconName') && <ValidationError field='Icon' />}
      </div>

      <div
        style={{
          borderTop: '1px solid #e1e5e9',
          paddingTop: '0.5rem',
        }}
      >
        {editData ? (
          <UpdateSectionButton handleUpdate={handleSaveUpdate}>
            Update
          </UpdateSectionButton>
        ) : (
          <AddSectionButton handleSaveSection={handleSave}>
            Add Banner section
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

export default Banner;
