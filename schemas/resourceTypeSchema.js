import { list } from '@keystone-6/core';
import { text, json, relationship } from '@keystone-6/core/fields';

import { allOperations } from '@keystone-6/core/access';
import { isSignedIn, permissions, rules } from '../auth/access.js';
import triggerRevalidation from '../utils/triggerRevalidation.js';

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
  hooks: {
    afterOperation: async ({ operation, context, listKey, item }) => {
      if (operation === 'create' || operation === 'update' || operation === 'delete') {
        const { response, data } = await triggerRevalidation('/resources');
        if (response.status !== 200) {
          throw new Error('Failed to trigger revalidation of the frontend application.');
        } else if (data.revalidated) {
          console.log('NextJs Revalidation triggered successfully');
        }
      }
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
        views: './customViews/fields/IconPickerField.jsx',
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
