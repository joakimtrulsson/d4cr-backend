import { useState } from 'react';
import { validateStaticFields, validateDynamicFields } from '../utils/validateFields';

export function useValidation(
  staticFields,
  dynamicFields = [],
  dynamicFieldKey = 'fields'
) {
  const [errors, setErrors] = useState([]);
  const [objectErrors, setObjectErrors] = useState([]);

  function validateFields(value) {
    const emptyFields = validateStaticFields(value, staticFields);
    let emptyObjectFields = [];

    // if (dynamicFields.length > 0 && value.fields) {
    //   emptyObjectFields = validateDynamicFields(value.fields, dynamicFields);
    // }
    if (dynamicFields.length > 0 && value[dynamicFieldKey]) {
      emptyObjectFields = validateDynamicFields(value[dynamicFieldKey], dynamicFields);
    }

    if (emptyFields.length > 0 || emptyObjectFields.length > 0) {
      setErrors(emptyFields);
      setObjectErrors(emptyObjectFields);
      return false;
    }

    return true;
  }

  return { validateFields, errors, setErrors, objectErrors };
}
