import { list } from '@keystone-6/core';
import { text, json, image, select, relationship } from '@keystone-6/core/fields';
import { document } from '@keystone-6/fields-document';
import { allOperations } from '@keystone-6/core/access';
import { isSignedIn, permissions, rules } from '../auth/access';

import { languageCodesData } from '../data/languageCodes';
import { buildSlug } from '../utils/buildSlug';

export const chapterSchema = list({
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
  ui: {
    labelField: 'title',
    listView: {
      initialColumns: [
        'title',
        'slug',
        'status',
        'chapterLanguage',
        'translatedChapters',
      ],
      initialSort: { field: 'title', direction: 'ASC' },
      pageSize: 50,
    },
  },
  fields: {
    title: text({ validation: { isRequired: true } }),

    slug: text({
      isIndexed: 'unique',
      ui: {
        description:
          'The path name for the chapter. Must be unique. If not supplied, it will be generated from the title.',
      },
      hooks: {
        resolveInput: ({ operation, resolvedData, inputData }) => {
          if (operation === 'create' && !inputData.slug) {
            return buildSlug(inputData.title, 'chapters');
          }

          if (operation === 'create' && inputData.slug) {
            return buildSlug(inputData.slug, 'chapters');
          }

          if (operation === 'update' && inputData.slug) {
            return buildSlug(inputData.slug, 'chapters');
          }

          // if (operation === 'update' && !inputData.slug && inputData.title) {
          //   return buildSlug(inputData.title, 'chapters');
          // }
        },
      },
    }),

    preamble: document({
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

    heroImage: json({
      ui: {
        views: './customViews/ImageLibrary.jsx',
        createView: { fieldMode: 'edit' },
        listView: { fieldMode: 'hidden' },
        itemView: { fieldMode: 'edit' },
      },
    }),

    chapterLanguage: select({
      type: 'string',
      defaultValue: 'EN-GB',
      options: languageCodesData,
    }),

    translatedChapters: relationship({
      ref: 'Chapter',
      many: true,
      ui: {
        description: 'Reference to the translated versions of this chapter.',
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
  },
});
