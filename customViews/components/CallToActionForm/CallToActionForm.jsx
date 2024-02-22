import React from 'react';
import { FieldDescription, Select, TextInput } from '@keystone-ui/fields';

const CallToActionForm = ({
  autoFocus,
  anchorText,
  pageValue,
  url,
  onChange,
  pagesOptions,
  ctaIdentifier,
}) => {
  return (
    <div>
      <FieldDescription>Anchor text:</FieldDescription>
      <TextInput
        autoFocus={autoFocus}
        onChange={(event) => onChange('anchorText', event.target.value, ctaIdentifier)}
        value={anchorText}
        style={{ marginBottom: '0.5rem' }}
      />

      <FieldDescription>Page:</FieldDescription>
      <Select
        value={pagesOptions.find((option) => option.value === pageValue)}
        onChange={(selectedOption) =>
          onChange('page', selectedOption.value, ctaIdentifier)
        }
        options={pagesOptions}
      />
      <FieldDescription style={{ marginTop: '1rem' }}>Or External Url:</FieldDescription>
      <TextInput
        style={{ marginBottom: '1rem' }}
        autoFocus={autoFocus}
        onChange={(event) => onChange('url', event.target.value, ctaIdentifier)}
        value={url}
      />
    </div>
  );
};

export default CallToActionForm;
