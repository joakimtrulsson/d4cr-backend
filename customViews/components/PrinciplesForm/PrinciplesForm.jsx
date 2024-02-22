import React, { useEffect, useState } from 'react';
import {
  FieldLabel,
  TextInput,
  FieldDescription,
  MultiSelect,
} from '@keystone-ui/fields';
import { v4 as uuidv4 } from 'uuid';

import useFetchPrinciples from '../../hooks/useFetchPrinciples';
import AddEntryButton from '../AddEntryButton/AddEntryButton';
import RemoveEntryButton from '../RemoveEntryButton/RemoveEntryButton';

function PrinciplesForm({
  autoFocus,
  onAddNewItem,
  onUpdateItem,
  editData,
  isAddAndResetVisible,
  setIsAddAndResetVisible,
  groups,
}) {
  const [options, setOptions] = useState([]);
  const { allPrinciples, loading, error } = useFetchPrinciples();
  const [resourcesData, setResourcesData] = useState([]);
  const [selectedOptions, setSelectedOptions] = useState([]);
  const [groupTitle, setGroupTitle] = useState('');

  const newId = uuidv4();

  // När editData finns så sätts groupTitle och resourcesData
  useEffect(() => {
    if (editData && editData.groupTitle === 'AllPrinciples') {
      setIsAddAndResetVisible(false);
      setGroupTitle(editData.groupTitle);

      setSelectedOptions(
        editData.principles.flatMap((principle) =>
          principle.principles.map((subPrinciple) => ({
            value: subPrinciple.id,
            label: subPrinciple.title,
          }))
        )
      );
    } else if (editData) {
      setGroupTitle(editData.groupTitle);
      setResourcesData(editData.principles);

      const newSelectedOptions = editData.principles.map((resource) => ({
        value: resource.id,
        label: resource.title,
      }));
      setSelectedOptions(newSelectedOptions);
    }
  }, [editData]);

  useEffect(() => {
    if (
      allPrinciples &&
      allPrinciples.principles &&
      allPrinciples.principles.length > 0
    ) {
      const newOptions = allPrinciples.principles.reduce((acc, principle) => {
        const resource = {
          value: principle.id,
          label: principle.title,
        };

        return [...acc, resource];
      }, []);

      setOptions(newOptions);
    }
  }, [allPrinciples]);

  // När grouptitle och resources finns så skickas det tillbaka till Resources.jsx
  useEffect(() => {
    // Här måste vi kontrollera om editData finns, då ska inte id uppdateras, dvs den ska bli samma som editData.id
    if (editData && groupTitle && resourcesData.length > 0) {
      const updatedItem = {
        id: editData.id,
        groupTitle: groupTitle,
        principles: resourcesData,
      };
      onUpdateItem(updatedItem);
    } else if (!editData && groupTitle && resourcesData.length > 0) {
      const newItem = {
        id: newId,
        groupTitle: groupTitle,
        principles: resourcesData,
      };
      onAddNewItem(newItem);
    }
  }, [groupTitle, resourcesData]);

  const addValuesToNewData = (key, value) => {
    if (key === 'selectedOptions') {
      // Value innehåller resources id och titel

      const allPrinciplesData = value.map((selectedOption) => {
        const principle = allPrinciples.principles
          .map((principle) => principle)
          .flat()
          .find((principle) => principle.id === selectedOption.value);

        return principle;
      });

      setResourcesData(allPrinciplesData);
    } else if (key === 'groupTitle') {
      setGroupTitle(value);
    }
  };

  const addAllPriciples = () => {
    const allPrinciplesData = allPrinciples.principles;

    const categories = allPrinciplesData.reduce((acc, principle) => {
      if (!acc[principle.principleCategory[0].title]) {
        acc[principle.principleCategory[0].title] = [];
      }
      acc[principle.principleCategory[0].title].push(principle);
      return acc;
    }, {});

    const newPrinciplesData = Object.keys(categories).map((category) => ({
      cateogoryTitle: category,
      principles: categories[category],
    }));

    setResourcesData(newPrinciplesData);
    setSelectedOptions(
      allPrinciplesData.map((resource) => ({
        value: resource.id,
        label: resource.title,
      }))
    );

    setGroupTitle('AllPrinciples');

    setIsAddAndResetVisible(false);
  };

  const resetForm = () => {
    setResourcesData([]);
    setSelectedOptions([]);
    setGroupTitle('');
    setIsAddAndResetVisible(true);
  };

  return (
    <>
      <div style={{ marginBottom: '1rem' }}>
        <FieldLabel>Group title</FieldLabel>
        <FieldDescription>
          Assign a title to categorize this group of principles
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
        <FieldLabel>Principles</FieldLabel>
        <FieldDescription>
          Select principles associated with the group title
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
          {isAddAndResetVisible && groups.length === 1 ? (
            <AddEntryButton style={{ marginTop: '1rem' }} handleAdd={addAllPriciples}>
              Add all principles sorted by category
            </AddEntryButton>
          ) : (
            groups.length === 1 && (
              <div
                style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '1rem' }}
              >
                <RemoveEntryButton handleRemove={resetForm}>Reset form</RemoveEntryButton>
              </div>
            )
          )}
        </div>
      </div>
    </>
  );
}

export default PrinciplesForm;
