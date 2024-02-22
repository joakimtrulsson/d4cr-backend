import { list } from '@keystone-6/core';
import { text, timestamp, relationship, file, json } from '@keystone-6/core/fields';

import { allOperations } from '@keystone-6/core/access';
import { isSignedIn, permissions, rules } from '../auth/access';

export const resourceSchema = list({
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
    labelField: 'title',
    listView: {
      initialColumns: ['title', 'category', 'type', 'createdAt'],
      initialSort: { field: 'title', direction: 'ASC' },
      pageSize: 50,
    },
  },
  fields: {
    title: text({ isIndexed: 'unique', validation: { isRequired: true } }),

    url: text({ validation: { isRequired: true } }),

    image: json({
      ui: {
        views: './customViews/ImageLibrary.jsx',
        createView: { fieldMode: 'edit' },
        listView: { fieldMode: 'hidden' },
        itemView: { fieldMode: 'edit' },
      },
    }),

    category: relationship({
      validation: { isRequired: true },
      ref: 'ResourceCategory.resources',
      many: false,
      ui: {
        description: 'Reference to a category.',
      },
    }),

    resourceType: relationship({
      validation: { isRequired: true },
      ref: 'ResourceType.resources',
      many: false,
      ui: {
        description: 'Reference to a type.',
      },
    }),

    createdAt: timestamp({
      isRequired: true,
      defaultValue: { kind: 'now' },
    }),
  },
});
