import { list } from '@keystone-6/core';
import { text, json, select } from '@keystone-6/core/fields';
import { document } from '@keystone-6/fields-document';

import { allOperations } from '@keystone-6/core/access';
import { isSignedIn, permissions, rules } from '../auth/access.js';

import { buildSlug } from '../utils/buildSlug.js';
import triggerRevalidation from '../utils/triggerRevalidation.js';

export const pageSchema = list({
  access: {
    operation: {
      ...allOperations(isSignedIn),
      create: permissions.canCreateItems,
      query: () => true,
    },
    filter: {
      query: ({ session }) => {
        if (session) {
          return true;
        }

        return { status: { equals: 'published' } };
      },
      // query: rules.canReadItems,
      update: rules.canManageItems,
      delete: rules.canManageItems,
    },
  },
  hooks: {
    afterOperation: async ({ operation, context, listKey, item }) => {
      if (operation === 'create' || operation === 'update') {
        const { data } = await triggerRevalidation(item.slug);
      }
    },
  },
  ui: {
    isHidden: (args) => {
      return !permissions?.canManageAllItems(args);
    },
    labelField: 'title',
    listView: {
      initialColumns: ['title', 'slug', 'status'],
      initialSort: { field: 'title', direction: 'ASC' },
      pageSize: 50,
    },
  },
  fields: {
    title: text({
      validation: { isRequired: true },
      ui: {
        description:
          'This required field is used to specify the title of the page, which appears at the top of the page, represents the name of the page and will also appear in the browser tab.',
      },
    }),

    slug: text({
      isIndexed: 'unique',
      ui: {
        itemView: {
          fieldPosition: 'sidebar',
        },
        description:
          'The path name for the page. Must be unique. If not supplied, it will be generated from the title.',
      },
      hooks: {
        resolveInput: ({ operation, resolvedData, inputData }) => {
          if (operation === 'create' && !inputData.slug) {
            return buildSlug(inputData.title);
          }

          if (operation === 'create' && inputData.slug) {
            return buildSlug(inputData.slug);
          }

          if (operation === 'update' && inputData.slug) {
            return buildSlug(inputData.slug);
          }

          // if (operation === 'update' && !inputData.slug && inputData.title) {
          //   return buildSlug(inputData.title, 'chapters');
          // }
        },
      },
    }),

    heroPreamble: document({
      ui: {
        description:
          'This is not required component of the page layout. A brief introductory text that complements the title.',
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

    ctaOneAnchorText: text({
      label: 'Call to action 1',
      ui: {
        description:
          'This field is not required and represents the anchor text for the primary call-to-action button, displayed with an orange background.',
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
          'This field is not required and represents the anchor text for the secondary call-to-action button, displayed with an white background.',
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

    status: select({
      options: [
        { label: 'Published', value: 'published' },
        { label: 'Draft', value: 'draft' },
      ],
      validation: { isRequired: true },
      defaultValue: 'draft',
      ui: {
        description:
          'This field determines the current status of the page. If set to "Draft," the page will not be available in the frontend application.',
        itemView: {
          fieldPosition: 'sidebar',
        },
        displayMode: 'segmented-control',
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
