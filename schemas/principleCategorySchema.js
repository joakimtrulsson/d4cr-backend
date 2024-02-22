import { list } from '@keystone-6/core';
import { text, timestamp, relationship } from '@keystone-6/core/fields';

import { allOperations } from '@keystone-6/core/access';
import { isSignedIn, permissions, rules } from '../auth/access';

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
  fields: {
    title: text({ isIndexed: 'unique', validation: { isRequired: true } }),

    createdAt: timestamp({
      isRequired: true,
      defaultValue: { kind: 'now' },
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
