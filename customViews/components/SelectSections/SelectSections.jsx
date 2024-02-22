import React from 'react';
import { FieldDescription, Select } from '@keystone-ui/fields';

function SelectSections({ activeSection, onChangeActiveSections, options }) {
  return (
    <div
      style={{
        paddingBottom: '1rem',
        marginBottom: '1.5rem',
        borderBottom: '1px solid #e1e5e9',
      }}
    >
      <FieldDescription>Select section to add</FieldDescription>
      <Select
        onChange={onChangeActiveSections}
        value={options.find((option) => option.value === activeSection)}
        options={options}
      />
    </div>
  );
}

export default SelectSections;
