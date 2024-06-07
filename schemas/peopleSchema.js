import { list } from '@keystone-6/core';
import { text, timestamp, json } from '@keystone-6/core/fields';

import { allOperations } from '@keystone-6/core/access';
import { isSignedIn, permissions, rules } from '../auth/access.js';

export const peopleSchema = list({
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
  graphql: {
    plural: 'PeopleList',
  },
  ui: {
    hideCreate: (args) => !permissions.canCreateItems(args),
    hideDelete: (args) => !permissions.canManageAllItems(args),
    itemView: {
      defaultFieldMode: ({ session, item }) => {
        if (session?.data.role?.canManageAllItems) return 'edit';

        return 'read';
      },
    },
    listView: {
      initialColumns: ['fullName', 'role', 'city', 'country'],
      initialSort: { field: 'fullName', direction: 'ASC' },
      pageSize: 50,
    },
  },

  fields: {
    fullName: text({ validation: { isRequired: true } }),

    role: text({
      validation: { isRequired: true },
      ui: {
        description:
          'This required field specifies the role or position of the person, which will be rendered beneath the name on the Person Card. ',
      },
    }),

    company: text({
      ui: {
        description:
          'This required field specifies the company of the person, which will be rendered beneath the role on the Person Card. ',
      },
    }),

    city: text({ validation: { isRequired: true } }),

    country: text({ validation: { isRequired: true } }),

    image: json({
      ui: {
        description: 'This field specifies the image of the person.',
        views: './customViews/fields/ImageLibraryField.jsx',
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
        description: 'This field specifies the icon for the first social media link.',
        views: './customViews/fields/IconPickerField.jsx',
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
        description: 'This field specifies the icon for the second social media link.',
        views: './customViews/fields/IconPickerField.jsx',
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
