import { list } from '@keystone-6/core';
import { text } from '@keystone-6/core/fields';
import { document } from '@keystone-6/fields-document';

import { allOperations } from '@keystone-6/core/access';
import { isSignedIn, permissions, rules } from '../auth/access.js';

export const footerBannerSchema = list({
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
    title: text({
      validation: { isRequired: true },
      ui: {
        description:
          'This required field is used to specify the title of the footer banner, which appears at the just above of the footer.',
      },
    }),

    preamble: document({
      validation: { isRequired: true },
      ui: {
        description:
          'This required field is used to specify the preamble of the footer banner.',
      },
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
