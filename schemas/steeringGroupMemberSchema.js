import { list } from '@keystone-6/core';
import { text, timestamp, json } from '@keystone-6/core/fields';

import { allOperations } from '@keystone-6/core/access';
import { isSignedIn, permissions, rules } from '../auth/access';

export const steeringGroupMemberSchema = list({
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
  labelField: 'fullName',
  ui: {
    listView: {
      initialColumns: ['fullName', 'role', 'city', 'country'],
      initialSort: { field: 'fullName', direction: 'ASC' },
      pageSize: 50,
    },
  },

  fields: {
    fullName: text({ validation: { isRequired: true } }),

    role: text({ validation: { isRequired: true } }),

    city: text({ validation: { isRequired: true } }),

    country: text({ validation: { isRequired: true } }),

    image: json({
      ui: {
        views: './customViews/ImageLibrary.jsx',
        createView: { fieldMode: 'edit' },
        listView: { fieldMode: 'hidden' },
        itemView: { fieldMode: 'edit' },
      },
    }),

    socialMediaUrl1: text({
      label: 'Socialmedia Link 1',
      ui: {
        description: 'Url',
      },
    }),

    socialMediaIcon1: json({
      label: 'Socialmedia icon 1',
      ui: {
        views: './customViews/IconPickerSection.jsx',
        createView: { fieldMode: 'edit' },
        listView: { fieldMode: 'hidden' },
        itemView: { fieldMode: 'edit' },
      },
    }),

    socialMediaUrl2: text({
      label: 'Socialmedia Link 2',
      ui: {
        description: 'Url',
      },
    }),

    socialMediaIcon2: json({
      label: 'Socialmedia icon 2',
      ui: {
        views: './customViews/IconPickerSection.jsx',
        createView: { fieldMode: 'edit' },
        listView: { fieldMode: 'hidden' },
        itemView: { fieldMode: 'edit' },
      },
    }),

    createdAt: timestamp({
      ui: {
        itemView: { fieldMode: 'hidden' },
      },
      isRequired: true,
      defaultValue: { kind: 'now' },
    }),
  },
});
