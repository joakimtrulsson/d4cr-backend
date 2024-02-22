import { list } from '@keystone-6/core';
import { text, timestamp, relationship } from '@keystone-6/core/fields';

import { allOperations } from '@keystone-6/core/access';
import { isSignedIn, permissions, rules } from '../auth/access';

export const newsCategorySchema = list({
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
    labelField: 'categoryTitle',
    listView: {
      initialColumns: ['categoryTitle', 'createdAt'],
      initialSort: { field: 'categoryTitle', direction: 'ASC' },
      pageSize: 50,
    },
  },
  fields: {
    categoryTitle: text({ isIndexed: 'unique', validation: { isRequired: true } }),

    createdAt: timestamp({
      isRequired: true,
      defaultValue: { kind: 'now' },
    }),

    relatedNews: relationship({
      ref: 'News.newsCategory',
      many: true,
      ui: {
        description: 'News belonging to this category.',
      },
    }),
  },
});
