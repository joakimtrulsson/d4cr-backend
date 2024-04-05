import { list } from '@keystone-6/core';
import { text, json, select, relationship, virtual } from '@keystone-6/core/fields';
import { document } from '@keystone-6/fields-document';
import { allOperations } from '@keystone-6/core/access';
import { isSignedIn, permissions, rules } from '../auth/access.js';
import { graphql } from '@keystone-6/core';

import { languageCodesData } from '../utils/languageCodes.js';
import { buildSlug } from '../utils/buildSlug.js';

export const chapterSchema = list({
  access: {
    operation: {
      ...allOperations(isSignedIn),
      create: permissions.canCreateItems,
      query: () => true,
    },
    filter: {
      query: () => true,
      update: rules.canManageItems,
      delete: rules.canManageItems,
    },
  },
  ui: {
    hideCreate: (args) => !permissions.canCreateChapters(args),
    hideDelete: (args) => !permissions.canManageAllItems(args),
    // Om användaren har canManageAllItems så kan de redigera alla Chapters.
    // Annars så kan de bara uppdatera sitt egna Chapters.
    itemView: {
      defaultFieldMode: ({ session, item }) => {
        if (session?.data.role?.canManageAllItems) return 'edit';

        if (session.data.chapters[0].id === item.id) return 'edit';

        return 'read';
      },
    },
    labelField: 'title',
    listView: {
      initialColumns: [
        'title',
        'slug',
        'contentOwner',
        'chapterLanguage',
        'translatedChapters',
        'status',
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
        itemView: {
          fieldMode: ({ session, item }) => {
            if (session?.data.role?.canManageAllItems) return 'edit';

            if (session.data.chapters[0].id === item.id) return 'edit';

            return 'hidden';
          },
        },
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
        // itemView: { fieldMode: 'edit' },
        itemView: {
          fieldMode: ({ session, item }) => {
            if (session?.data.role?.canManageAllItems) return 'edit';

            if (session.data.chapters[0].id === item.id) return 'edit';

            return 'hidden';
          },
        },
      },
    }),

    news: virtual({
      field: (lists) =>
        graphql.field({
          type: graphql.list(lists.News.types.output),
          async resolve(item, args, context) {
            const newsData = await context.query.News.findMany({
              where: { relatedChapters: { some: { slug: { equals: item.slug } } } },
              orderBy: [{ createdAt: 'desc' }],
              query:
                'id status createdAt newsCategory {categoryTitle} title slug image sections',
            });

            newsData.forEach((newsItem) => {
              if (typeof newsItem.createdAt === 'string') {
                newsItem.createdAt = new Date(newsItem.createdAt);
              }
            });
            return newsData;
          },
        }),
      ui: {
        listView: {
          fieldMode: 'hidden',
        },
        itemView: {
          fieldMode: 'hidden',
        },
      },
    }),
    contentOwner: relationship({
      ref: 'User.chapters',
      many: true,
      ui: {
        createView: {
          fieldMode: (args) => (permissions.canManageAllItems(args) ? 'edit' : 'hidden'),
        },
        itemView: {
          fieldMode: (args) => (permissions.canManageAllItems(args) ? 'edit' : 'read'),
        },
      },
      // Defaulta alltid nya items till den nuvarande användaren; detta är viktigt eftersom användare utan rättigheten canManageAllItems inte ser detta fält när de skapar nya.
      // hooks: {
      //   resolveInput({ operation, resolvedData, context }) {
      //     if (operation === 'create' && !resolvedData.contentOwner && context.session) {

      //       return { connect: { id: context.session.itemId } };
      //     }
      //     return resolvedData.assignedTo;
      //   },
      // },
    }),
  },
});
