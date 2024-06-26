import { list } from '@keystone-6/core';
import { relationship, integer } from '@keystone-6/core/fields';

import { allOperations } from '@keystone-6/core/access';
import { isSignedIn, permissions, rules } from '../auth/access.js';

export const principleNumberSchema = list({
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
  ui: {
    isHidden: (args) => {
      return !permissions?.canManageAllItems(args);
    },
    labelField: 'number',
  },
  fields: {
    number: integer({
      isIndexed: 'unique',
      validation: { isRequired: true },
      ui: { description: 'The numbers available to be selected for the principles.' },
    }),

    principles: relationship({
      ref: 'Principle.principleNumber',
      many: false,
      ui: {
        description: 'Principles belonging to this number.',
      },
    }),
  },
});
