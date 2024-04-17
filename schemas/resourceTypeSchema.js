import { list } from '@keystone-6/core';
import { text, json, relationship } from '@keystone-6/core/fields';

import { allOperations } from '@keystone-6/core/access';
import { isSignedIn, permissions, rules } from '../auth/access.js';

export const resourceTypeSchema = list({
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
    description: 'This list is used to categorize resources based on their types.',
    labelField: 'type',
    listView: {
      initialColumns: ['type', 'icon'],
      initialSort: { field: 'type', direction: 'ASC' },
      pageSize: 50,
    },
  },
  fields: {
    type: text({
      validation: { isRequired: true },
      ui: {
        description:
          'This required field specifies the type of resource. It will be used to categorize resources and allow users to filter resources based on types.',
      },
    }),

    icon: json({
      label: 'Icon',
      validation: { isRequired: true },
      ui: {
        description:
          'This required field specifies the icon that represents the type of resource.',
        views: './customViews/IconPickerSection.jsx',
        createView: { fieldMode: 'edit' },
        listView: { fieldMode: 'hidden' },
        itemView: { fieldMode: 'edit' },
      },
    }),

    resources: relationship({
      ref: 'Resource.resourceType',
      many: true,
      ui: {
        description: 'Resources belonging to this type.',
      },
    }),
  },
});
