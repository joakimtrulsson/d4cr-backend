export function validateStaticFields(data, requiredFields) {
  const emptyFields = requiredFields.filter((field) => {
    if (field === 'preamble' || field === 'bodyText') {
      return (
        !data[field] ||
        data[field].length === 0 ||
        (data[field].every((item) => {
          return (
            item.type === 'paragraph' &&
            (!item.children || !item.children[0] || !item.children[0].text)
          );
        }) &&
          data[field].length > 0)
      );
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
          return (
            !object[field] ||
            object[field].every((item) => {
              // Kontrollera om varje objekt, oavsett typ, är tomt
              return (
                !item.children ||
                item.children.every((child) => !child.text || child.text.trim() === '')
              );
            })
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
