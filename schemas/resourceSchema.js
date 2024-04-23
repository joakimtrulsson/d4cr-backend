import { list } from '@keystone-6/core';
import { text, timestamp, relationship, file, json } from '@keystone-6/core/fields';

import { allOperations } from '@keystone-6/core/access';
import { isSignedIn, permissions, rules } from '../auth/access.js';

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
      isRequired: true,
      defaultValue: { kind: 'now' },
    }),
  },
});
