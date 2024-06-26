import { list } from '@keystone-6/core';
import { text, json } from '@keystone-6/core/fields';

import { allOperations } from '@keystone-6/core/access';
import { isSignedIn, permissions, rules } from '../auth/access.js';

export const mainMenuSchema = list({
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
  isSingleton: true,
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
    navigation: json({
      ui: {
        views: './customViews/fields/MainMenuField.jsx',
        createView: { fieldMode: 'edit' },
        listView: { fieldMode: 'hidden' },
        itemView: { fieldMode: 'edit' },
      },
    }),

    ctaAnchorText: text({
      label: 'Call to action',
      validation: { isRequired: true },
      ui: {
        description:
          'This required field represents the anchor text for the call-to-action button used in the top navigation bar.',
      },
    }),

    ctaUrl: json({
      ui: {
        views: './customViews/fields/DynamicLinkField.jsx',
        createView: { fieldMode: 'edit' },
        listView: { fieldMode: 'hidden' },
        itemView: { fieldMode: 'edit' },
      },
    }),
  },
});
