import { list } from '@keystone-6/core';
import { text, json } from '@keystone-6/core/fields';

import { allOperations } from '@keystone-6/core/access';
import { isSignedIn, permissions, rules } from '../auth/access.js';

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
      ui: {
        description: 'This field is used to specify the URL of the social media 1.',
      },
    }),

    icon1: json({
      label: 'Social Media Icon 1',
      validation: { isRequired: true },
      ui: {
        description:
          'This field specifies the icon that represents the button to the social media link 1.',
        views: './customViews/fields/IconPickerField.jsx',
        createView: { fieldMode: 'edit' },
        listView: { fieldMode: 'hidden' },
        itemView: { fieldMode: 'edit' },
      },
    }),

    url2: text({
      label: 'Social Media URL 2',
      ui: {
        description: 'This field is used to specify the URL of the social media 2.',
      },
    }),

    icon2: json({
      label: 'Social Media Icon 2',
      ui: {
        description:
          'This field specifies the icon that represents the button to the social media link 2.',
        views: './customViews/fields/IconPickerField.jsx',
        createView: { fieldMode: 'edit' },
        listView: { fieldMode: 'hidden' },
        itemView: { fieldMode: 'edit' },
      },
    }),

    url3: text({
      label: 'Social Media URL 3',
      ui: {
        description: 'This field is used to specify the URL of the social media 3.',
      },
    }),

    icon3: json({
      label: 'Social Media Icon 3',
      ui: {
        description:
          'This field specifies the icon that represents the button to the social media link 3.',
        views: './customViews/fields/IconPickerField.jsx',
        createView: { fieldMode: 'edit' },
        listView: { fieldMode: 'hidden' },
        itemView: { fieldMode: 'edit' },
      },
    }),

    url4: text({
      label: 'Social Media URL 4',
      ui: {
        description: 'This field is used to specify the URL of the social media 4.',
      },
    }),

    icon4: json({
      label: 'Social Media Icon 4',
      ui: {
        description:
          'This field specifies the icon that represents the button to the social media link 4.',
        views: './customViews/fields/IconPickerField.jsx',
        createView: { fieldMode: 'edit' },
        listView: { fieldMode: 'hidden' },
        itemView: { fieldMode: 'edit' },
      },
    }),
  },
});
