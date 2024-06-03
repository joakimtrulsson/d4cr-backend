import { list } from '@keystone-6/core';
import { text } from '@keystone-6/core/fields';
import { document } from '@keystone-6/fields-document';

import { allOperations } from '@keystone-6/core/access';
import { isSignedIn, permissions, rules } from '../auth/access.js';

import validateEmail from '../utils/validateEmail.js';
import triggerRevalidation from '../utils/triggerRevalidation.js';

export const formEmailSchema = list({
  ui: {
    label: 'Form - Contact us',
  },
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
      ui: {
        description:
          'This required field is utilized on the predefined page "/contact-us" to specify the email address to which the form submissions on that page should be sent.',
      },
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

    contactUsPreamble: document({
      ui: {
        description:
          'This field is required and is used to specify a short introductory text to the contact form.',
      },
      hooks: {
        afterOperation: async ({ operation, context, listKey, item }) => {
          if (operation === 'create' || operation === 'update') {
            const { data } = await triggerRevalidation('/contact-us');
          }
        },
      },
      validation: { isRequired: true },
      links: true,
      formatting: {
        inlineMarks: {
          bold: true,
          italic: true,
          underline: true,
          strikethrough: true,
        },
        softBreaks: true,
      },
    }),

    shareStoryEmail: text({
      validation: { isRequired: true },
      ui: {
        description:
          'This required field is used to define the email address that will receive submitted stories through the "Share Story" Modal form.',
      },
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

    shareStoryPreamble: document({
      ui: {
        description:
          'This field is required and is used to specify a short introductory text to the contact form.',
      },
      validation: { isRequired: true },
      links: true,
      formatting: {
        inlineMarks: {
          bold: true,
          italic: true,
          underline: true,
          strikethrough: true,
        },
        softBreaks: true,
      },
    }),

    joinSlackEmail: text({
      validation: { isRequired: true },
      ui: {
        description:
          'This required field is used to define the email address that will receive submitted stories through the "Join our Slack" Modal form.',
      },
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

    joinSlackPreamble: document({
      ui: {
        description:
          'This field is required and is used to specify a short introductory text to the contact form.',
      },
      validation: { isRequired: true },
      links: true,
      formatting: {
        inlineMarks: {
          bold: true,
          italic: true,
          underline: true,
          strikethrough: true,
        },
        softBreaks: true,
      },
    }),
  },
});
