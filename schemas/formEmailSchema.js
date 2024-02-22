import { list } from '@keystone-6/core';
import { text } from '@keystone-6/core/fields';

import { allOperations } from '@keystone-6/core/access';
import { isSignedIn, permissions, rules } from '../auth/access';

import validateEmail from '../utils/validateEmail';

export const formEmailSchema = list({
  access: {
    operation: {
      ...allOperations(isSignedIn),
      create: permissions.canCreateItems,
      query: () => true,
    },
    filter: {
      query: () => true,
      // query: rules.canReadItems,
      update: rules.canManageItems,
      delete: rules.canManageItems,
    },
  },
  isSingleton: true,
  fields: {
    contactEmail: text({
      validation: { isRequired: true },
      hooks: {
        validateInput: ({ addValidationError, resolvedData, fieldKey }) => {
          const email = resolvedData[fieldKey];
          const isEmailValid = validateEmail(email);

          if (email !== undefined && email !== null && !isEmailValid) {
            addValidationError(
              `The email address ${email} provided for the field ${fieldKey} must be a valid email address.`
            );
          }
        },
      },
    }),

    shareStoryEmail: text({
      validation: { isRequired: true },
      hooks: {
        validateInput: ({ addValidationError, resolvedData, fieldKey }) => {
          const email = resolvedData[fieldKey];
          const isEmailValid = validateEmail(email);

          if (email !== undefined && email !== null && !isEmailValid) {
            addValidationError(
              `The email address ${email} provided for the field ${fieldKey} must be a valid email address.`
            );
          }
        },
      },
    }),

    joinSlackEmail: text({
      validation: { isRequired: true },
      hooks: {
        validateInput: ({ addValidationError, resolvedData, fieldKey }) => {
          const email = resolvedData[fieldKey];
          const isEmailValid = validateEmail(email);

          if (email !== undefined && email !== null && !isEmailValid) {
            addValidationError(
              `The email address ${email} provided for the field ${fieldKey} must be a valid email address.`
            );
          }
        },
      },
    }),
  },
});
