export function validateStaticFields(data, requiredFields) {
  const emptyFields = requiredFields.filter((field) => {
    if (field === 'preamble') {
      // Kontrollera om preamble innehåller någon text
      return !data[field] || data[field].some((paragraph) => !paragraph.children[0].text);
    } else if (field === 'images') {
      // Kontrollera om images innehåller några bilder
      return !data[field] || data[field].length === 0;
    } else if (field === 'people') {
      return !data[field] || data[field].length === 0;
    } else {
      return !data[field];
    }
  });
  return emptyFields;
}

export function validateDynamicFields(objectList, requiredFields) {
  const emptyObjectFields = objectList
    .map((object, index) => ({
      index,
      emptyFields: requiredFields.filter((field) => {
        if (field === 'bodyText') {
          // Kontrollera om bodyText innehåller någon text
          return (
            !object[field] ||
            object[field].some((paragraph) => !paragraph.children[0].text)
          );
        } else if (field === 'groupTitle') {
          // Kontrollera om groupTitle finns
          return !object[field];
        } else if (field === 'principles') {
          // Kontrollera om principles inte är tom
          return !object[field] || object[field].length === 0;
        } else {
          return !object[field];
        }
      }),
    }))
    .filter((object) => object.emptyFields.length > 0);

  return emptyObjectFields;
}
