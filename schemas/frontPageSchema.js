import { list } from '@keystone-6/core';
import { text, json, select, file } from '@keystone-6/core/fields';
import { document } from '@keystone-6/fields-document';

import { allOperations } from '@keystone-6/core/access';
import { isSignedIn, permissions, rules } from '../auth/access.js';
import triggerRevalidation from '../utils/triggerRevalidation.js';

export const frontPageSchema = list({
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
  hooks: {
    afterOperation: async ({ operation, context, listKey, item }) => {
      if (operation === 'create' || operation === 'update' || operation === 'delete') {
        const { response, data } = await triggerRevalidation('/');
        if (response.status !== 200) {
          throw new Error('Failed to trigger revalidation of the frontend application.');
        } else if (data.revalidated) {
          console.log('NextJs Revalidation triggered successfully');
        }
      }
    },
  },
  fields: {
    heroTitle: text({
      validation: { isRequired: true },
      ui: {
        description:
          'This is required and serves as the main title or headline displayed on the hero section of the front page.',
      },
    }),

    heroPreamble: document({
      validation: { isRequired: true },
      ui: {
        description:
          'This is a required component of the frontpage layout. A brief introductory text that complements the heroTitle.',
      },
      links: true,
      formatting: {
        inlineMarks: {
          bold: true,
          italic: true,
          underline: true,
          strikethrough: true,
        },
        softBreaks: true,
      },
    }),

    heroVideo: json({
      ui: {
        views: './customViews/fields/VideoLibraryField.jsx',
        createView: { fieldMode: 'edit' },
        listView: { fieldMode: 'hidden' },
        itemView: { fieldMode: 'edit' },
      },
    }),

    ctaOneAnchorText: text({
      label: 'Call to action 1',
      ui: {
        description:
          'This field represents the anchor text for the primary call-to-action button, displayed with an orange background.',
      },
    }),

    ctaOneUrl: json({
      ui: {
        views: './customViews/fields/DynamicLinkField.jsx',
        createView: { fieldMode: 'edit' },
        listView: { fieldMode: 'hidden' },
        itemView: { fieldMode: 'edit' },
      },
    }),

    ctaTwoUrlAnchorText: text({
      label: 'Call to action 2',
      ui: {
        description:
          'This field represents the anchor text for the secondary call-to-action button, displayed with an white background.',
      },
    }),

    ctaTwoUrl: json({
      ui: {
        views: './customViews/fields/DynamicLinkField.jsx',
        createView: { fieldMode: 'edit' },
        listView: { fieldMode: 'hidden' },
        itemView: { fieldMode: 'edit' },
      },
    }),

    sections: json({
      ui: {
        views: './customViews/fields/AllSectionsField.jsx',
        createView: { fieldMode: 'edit' },
        listView: { fieldMode: 'hidden' },
        itemView: { fieldMode: 'edit' },
      },
    }),
  },
});
