import { list } from '@keystone-6/core';
import { text, json } from '@keystone-6/core/fields';

import { allOperations } from '@keystone-6/core/access';
import { isSignedIn, permissions, rules } from '../auth/access';

export const footerJoinUsSchema = list({
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
  fields: {
    url1: text({
      validation: { isRequired: true },
      label: 'Social Media URL 1',
    }),

    icon1: json({
      label: 'Social Media Icon 1',
      ui: {
        views: './customViews/IconPickerSection.jsx',
        createView: { fieldMode: 'edit' },
        listView: { fieldMode: 'hidden' },
        itemView: { fieldMode: 'edit' },
      },
    }),

    url2: text({ validation: { isRequired: true }, label: 'Social Media URL 2' }),

    icon2: json({
      label: 'Social Media Icon 2',
      ui: {
        views: './customViews/IconPickerSection.jsx',
        createView: { fieldMode: 'edit' },
        listView: { fieldMode: 'hidden' },
        itemView: { fieldMode: 'edit' },
      },
    }),

    url3: text({ validation: { isRequired: true }, label: 'Social Media URL 3' }),

    icon3: json({
      label: 'Social Media Icon 3',
      ui: {
        views: './customViews/IconPickerSection.jsx',
        createView: { fieldMode: 'edit' },
        listView: { fieldMode: 'hidden' },
        itemView: { fieldMode: 'edit' },
      },
    }),

    url4: text({ validation: { isRequired: true }, label: 'Social Media URL 4' }),

    icon4: json({
      label: 'Social Media Icon 4',
      ui: {
        views: './customViews/IconPickerSection.jsx',
        createView: { fieldMode: 'edit' },
        listView: { fieldMode: 'hidden' },
        itemView: { fieldMode: 'edit' },
      },
    }),
  },
});
