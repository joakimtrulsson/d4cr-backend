import { list } from '@keystone-6/core';
import { text, timestamp, relationship } from '@keystone-6/core/fields';

import { allOperations } from '@keystone-6/core/access';
import { isSignedIn, permissions, rules } from '../auth/access.js';

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
    categoryTitle: text({
      isIndexed: 'unique',
      validation: { isRequired: true },
      ui: {
        description:
          'This required and unique field specifies the title of the news category. It will be used to categorize news articles and allow users to filter news based on categories.',
      },
    }),

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
