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
        const { data } = await triggerRevalidation('/resources');
      }
    },
  },
  ui: {
    description: 'This list is used to categorize resources based on their types.',
    labelField: 'type',
    hideCreate: (args) => !permissions.canCreateItems(args),
    hideDelete: (args) => !permissions.canManageAllItems(args),
    itemView: {
      defaultFieldMode: ({ session, item }) => {
        if (session?.data.role?.canManageAllItems) return 'edit';

        return 'read';
      },
    },
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

    resources: relationship({
      ref: 'Resource.resourceType',
      many: true,
      ui: {
        description: 'Resources belonging to this type.',
      },
    }),
  },
});
