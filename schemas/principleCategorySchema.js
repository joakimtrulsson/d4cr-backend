import { list } from '@keystone-6/core';
import { text, timestamp, relationship } from '@keystone-6/core/fields';

import { allOperations } from '@keystone-6/core/access';
import { isSignedIn, permissions, rules } from '../auth/access.js';

export const principleCategorySchema = list({
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
    hideCreate: (args) => !permissions.canCreateItems(args),
    hideDelete: (args) => !permissions.canManageAllItems(args),
    itemView: {
      defaultFieldMode: ({ session, item }) => {
        if (session?.data.role?.canManageAllItems) return 'edit';

        return 'read';
      },
    },
  },
  fields: {
    title: text({
      isIndexed: 'unique',
      validation: { isRequired: true },
      ui: { description: 'The categories available to be selected for the principles.' },
    }),

    createdAt: timestamp({
      ui: {
        itemView: {
          fieldPosition: 'sidebar',
        },
        description:
          'The date and time the news was created. If not supplied, the current date and time will be used.',
      },
      isRequired: true,
      hooks: {
        resolveInput: ({ operation, resolvedData, inputData }) => {
          if (operation === 'create' && !inputData.createdAt) {
            let date = new Date();
            date.setMilliseconds(0);
            return date.toISOString();
          } else if (operation === 'update' && inputData.createdAt) {
            let date = new Date(inputData.createdAt);
            date.setMilliseconds(0);
            return date.toISOString();
          } else {
            return resolvedData.createdAt;
          }
        },
      },
    }),

    principles: relationship({
      ref: 'Principle.principleCategory',
      many: true,
      ui: {
        description: 'Principles belonging to this category.',
      },
    }),
  },
});
