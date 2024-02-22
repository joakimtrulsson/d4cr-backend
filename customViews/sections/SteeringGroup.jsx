import React from 'react';
import { v4 as uuidv4 } from 'uuid';

import AddSectionButton from '../components/AddSectionButton/AddSectionButton.jsx';

function SteeringGroup({ onCloseSection, onChange, sectionsData, setSectionsData }) {
  function handleSave() {
    if (onChange) {
      const newItem = {
        sectionType: 'STEERINGGROUP',
        id: uuidv4(),
      };
      setSectionsData((prevSectionsData) => [...prevSectionsData, newItem]);
      onChange(JSON.stringify([...sectionsData, newItem]));
      onCloseSection();
    }
  }

  return (
    <AddSectionButton handleSaveSection={handleSave}>
      Add Steering group members section
    </AddSectionButton>
  );
}

export default SteeringGroup;
