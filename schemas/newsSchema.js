import { list } from '@keystone-6/core';
import { text, timestamp, relationship, select, json } from '@keystone-6/core/fields';

import { allOperations } from '@keystone-6/core/access';
import { isSignedIn, permissions, rules } from '../auth/access';

import { buildSlug } from '../utils/buildSlug';

export const newsSchema = list({
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
  graphql: {
    plural: 'NewsItems',
  },
  ui: {
    label: 'News',
    singular: 'News',
    plural: 'News Items',
    path: 'news',
    labelField: 'title',
    listView: {
      initialColumns: ['title', 'newsCategory', 'newsNumber'],
      initialSort: { field: 'title', direction: 'ASC' },
      pageSize: 50,
    },
  },
  fields: {
    title: text({ isIndexed: 'unique', validation: { isRequired: true } }),

    slug: text({
      isIndexed: 'unique',
      ui: {
        description:
          'The path name for the news. Must be unique. If not supplied, it will be generated from the title.',
      },
      hooks: {
        resolveInput: ({ operation, resolvedData, inputData }) => {
          if (operation === 'create' && !inputData.slug) {
            return buildSlug(inputData.title, 'news');
          }

          if (operation === 'create' && inputData.slug) {
            return buildSlug(inputData.slug, 'news');
          }

          if (operation === 'update' && inputData.slug) {
            return buildSlug(inputData.slug, 'news');
          }

          // if (operation === 'update' && !inputData.slug && inputData.title) {
          //   return buildSlug(inputData.title, 'chapters');
          // }
        },
      },
    }),

    newsCategory: relationship({
      validation: { isRequired: true },
      ref: 'NewsCategory.relatedNews',
      many: false,
      ui: {
        description: 'Reference to a news category.',
      },
    }),

    relatedChapters: relationship({
      ref: 'Chapter',
      many: true,
      ui: {
        description: 'Reference to chapters.',
      },
    }),

    image: json({
      ui: {
        views: './customViews/ImageLibrary.jsx',
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
      ui: { displayMode: 'segmented-control' },
    }),

    sections: json({
      ui: {
        views: './customViews/AllSections.jsx',
        createView: { fieldMode: 'edit' },
        listView: { fieldMode: 'hidden' },
        itemView: { fieldMode: 'edit' },
      },
    }),

    createdAt: timestamp({
      isRequired: true,
      defaultValue: { kind: 'now' },
    }),
  },
});
