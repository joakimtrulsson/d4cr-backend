import React, { useEffect, useState } from 'react';
import {
  FieldLabel,
  TextInput,
  FieldDescription,
  MultiSelect,
} from '@keystone-ui/fields';
import { v4 as uuidv4 } from 'uuid';

import useFetchResources from '../../hooks/useFetchResources';

function ResourcesForm({ autoFocus, onAddNewItem, onUpdateItem, editData }) {
  const [options, setOptions] = useState([]);
  const { allResources, loading, error } = useFetchResources();
  const [resourcesData, setResourcesData] = useState([]);
  const [selectedOptions, setSelectedOptions] = useState([]);
  const [groupTitle, setGroupTitle] = useState('');

  const newId = uuidv4();

  // När editData finns så sätts groupTitle och resourcesData
  useEffect(() => {
    if (editData) {
      setGroupTitle(editData.groupTitle);
      setResourcesData(editData.resources);

      const newSelectedOptions = editData.resources.map((resource) => ({
        value: resource.id,
        label: resource.title,
      }));
      setSelectedOptions(newSelectedOptions);
    }
  }, [editData]);

  // När allResources finns så skapas options till MultiSelect
  useEffect(() => {
    if (allResources.resourceCategories) {
      const newOptions = allResources.resourceCategories.reduce(
        (acc, resourceCategory) => {
          const resources = resourceCategory.resources.map((resource) => ({
            value: resource.id,
            label: resource.title,
          }));

          return [...acc, ...resources];
        },
        []
      );

      setOptions(newOptions);
    }
  }, [allResources]);

  // När grouptitle och resources finns så skickas det tillbaka.
  useEffect(() => {
    // Här måste vi kontrollera om editData finns, då ska inte id uppdateras, dvs den ska bli samma som editData.id
    if (editData && groupTitle && resourcesData.length > 0) {
      const updatedItem = {
        id: editData.id,
        groupTitle: groupTitle,
        resources: resourcesData,
      };
      onUpdateItem(updatedItem);
    } else if (!editData && groupTitle && resourcesData.length > 0) {
      const newItem = {
        id: newId,
        groupTitle: groupTitle,
        resources: resourcesData,
      };
      onAddNewItem(newItem);
    }
  }, [groupTitle, resourcesData]);

  const addValuesToNewData = (key, value) => {
    if (key === 'selectedOptions') {
      // Value innehåller resources id och titel

      const allResouceData = value.map((selectedOption) => {
        const resource = allResources.resourceCategories
          .map((resourceCategory) => resourceCategory.resources)
          .flat()
          .find((resource) => resource.id === selectedOption.value);

        return resource;
      });

      setResourcesData(allResouceData);
    } else if (key === 'groupTitle') {
      setGroupTitle(value);
    }
  };

  return (
    <>
      <div style={{ marginBottom: '1rem' }}>
        <FieldLabel>Group title</FieldLabel>
        <FieldDescription>
          Assign a title to categorize this group of resources
        </FieldDescription>
        <div style={{ marginBottom: '1rem' }}>
          <TextInput
            autoFocus={autoFocus}
            onChange={(event) => addValuesToNewData('groupTitle', event.target.value)}
            value={groupTitle}
          />
        </div>
      </div>
      <div style={{ marginBottom: '1rem' }}>
        <FieldLabel>Resources</FieldLabel>
        <FieldDescription>
          Select resources associated with the group title
        </FieldDescription>
        <div style={{ marginBottom: '1rem' }}>
          <MultiSelect
            options={options}
            autoFocus={autoFocus}
            onChange={(selectedOptions) => {
              setSelectedOptions(selectedOptions);
              addValuesToNewData('selectedOptions', selectedOptions);
            }}
            value={selectedOptions || []}
          />
        </div>
      </div>
    </>
  );
}

export default ResourcesForm;
