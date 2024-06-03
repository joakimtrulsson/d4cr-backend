import { list } from '@keystone-6/core';
import { text, timestamp, relationship, file, json } from '@keystone-6/core/fields';

import { allOperations } from '@keystone-6/core/access';
import { isSignedIn, permissions, rules } from '../auth/access.js';
import triggerRevalidation from '../utils/triggerRevalidation.js';

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
  hooks: {
    afterOperation: async ({ operation, context, listKey, item }) => {
      if (operation === 'create' || operation === 'update' || operation === 'delete') {
        const { data } = await triggerRevalidation('/resources');

        if (data.revalidated) {
          console.log('NextJs Revalidation triggered successfully');
        }
      }
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
    title: text({
      isIndexed: 'unique',
      validation: { isRequired: true },
      ui: {
        description:
          'This required field represents the title of the resource. It must be unique and serves as the primary identifier for the resource.',
      },
    }),

    url: text({
      validation: { isRequired: true },
      ui: {
        description:
          'This required field specifies the URL for the resource. It will be displayed as a link on the predefined page "/resources".',
      },
    }),

    image: json({
      ui: {
        description:
          'This required field specifies the image for the resource. It will be rendered in the resource card on the predefined page "/resources". The image serves as a visual representation of the resource.',
        views: './customViews/fields/ImageLibraryField.jsx',
        createView: { fieldMode: 'edit' },
        listView: { fieldMode: 'hidden' },
        itemView: { fieldMode: 'edit' },
      },
    }),

    resourceType: relationship({
      validation: { isRequired: true },
      ref: 'ResourceType.resources',
      many: false,
      ui: {
        description:
          'This required field specifies the type of the resource. It will be rendered in the resource card on the predefined page "/resources" and allows visitors to filter resources based on their type. ',
      },
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
            let date = inputData.createdAt;
            date.setMilliseconds(0);
            return date.toISOString();
          }
        },
      },
    }),
  },
});
