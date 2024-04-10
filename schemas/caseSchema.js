import { list } from '@keystone-6/core';
import { text, json, select, timestamp, relationship } from '@keystone-6/core/fields';
import { group } from '@keystone-6/core';
import { document } from '@keystone-6/fields-document';
import { allOperations } from '@keystone-6/core/access';
import { isSignedIn, permissions, rules } from '../auth/access.js';

import { buildSlug } from '../utils/buildSlug.js';

export const caseSchema = list({
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
  ui: {
    labelField: 'title',
    listView: {
      initialColumns: ['title', 'principleNumber', 'principleCategory', 'slug', 'status'],
      initialSort: { field: 'title', direction: 'ASC' },
      pageSize: 50,
    },
  },
  fields: {
    title: text({ validation: { isRequired: true } }),

    linkType: select({
      isRequired: true,
      options: [
        { label: 'Internal', value: 'internal' },
        { label: 'External', value: 'external' },
        { label: 'None', value: 'none' },
      ],
      defaultValue: 'internal',
      ui: {
        displayMode: 'segmented-control',
      },
    }),

    url: text({
      ui: {
        itemView: {
          fieldPosition: 'form',
        },
        description:
          'If Link type is external, this field must be filled with the URL of the external page. If Link type is internal, this field will be generated from the title.',
      },
      hooks: {
        resolveInput: ({ operation, resolvedData, inputData, item }) => {
          // Dessa bygger en slug baserat på titel om linkType är internal
          if (operation === 'create' && resolvedData.linkType === 'internal') {
            return buildSlug(inputData.title, 'cases');
          }

          if (
            operation === 'update' &&
            resolvedData.linkType === 'internal' &&
            !inputData.url
          ) {
            return buildSlug(item.title, 'cases');
          } else if (
            operation === 'update' &&
            resolvedData.linkType === 'internal' &&
            inputData.url
          ) {
            return buildSlug(inputData.title, 'cases');
          }

          // Dessa tömmer url om linkType är none
          if (operation === 'create' && resolvedData.linkType === 'none') {
            return '';
          }

          if (operation === 'update' && resolvedData.linkType === 'none') {
            return '';
          }

          // Om linkType är external så ska inputData.url vara url
          if (operation === 'create' && resolvedData.linkType === 'external') {
            return inputData.url;
          }

          if (operation === 'update' && resolvedData.linkType === 'external') {
            return inputData.url;
          }
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

    caseImage: json({
      ui: {
        views: './customViews/ImageLibrary.jsx',
        createView: { fieldMode: 'edit' },
        listView: { fieldMode: 'hidden' },
        itemView: { fieldMode: 'edit' },
      },
    }),

    quote: text({}),

    sections: json({
      ui: {
        views: './customViews/AllSections.jsx',
        createView: { fieldMode: 'edit' },
        listView: { fieldMode: 'hidden' },
        itemView: { fieldMode: 'edit' },
      },
    }),

    principles: json({
      ui: {
        views: './customViews/Principles.jsx',
        createView: { fieldMode: 'edit' },
        listView: { fieldMode: 'hidden' },
        itemView: { fieldMode: 'edit' },
      },
    }),

    ...group({
      label: 'Resources',
      description: 'Select resources to be displayed in the resources section.',
      fields: {
        resourcesTitle: text({}),
        resourcesPreamble: text({}),
        resources: relationship({
          ref: 'Resource',
          many: true,
        }),
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
        itemView: {
          fieldPosition: 'sidebar',
        },
        displayMode: 'segmented-control',
      },
    }),

    createdAt: timestamp({
      isRequired: true,
      defaultValue: { kind: 'now' },
      ui: {
        itemView: {
          fieldPosition: 'sidebar',
        },
      },
    }),
  },
});
