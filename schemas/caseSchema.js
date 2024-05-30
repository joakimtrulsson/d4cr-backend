import { list } from '@keystone-6/core';
import { text, json, select, timestamp, relationship } from '@keystone-6/core/fields';
import { group } from '@keystone-6/core';
import { document } from '@keystone-6/fields-document';
import { allOperations } from '@keystone-6/core/access';
import { isSignedIn, permissions, rules } from '../auth/access.js';

import { buildSlug } from '../utils/buildSlug.js';
import triggerRevalidation from '../utils/triggerRevalidation.js';

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
  hooks: {
    afterOperation: async ({ operation, context, listKey, item }) => {
      if (
        ['create', 'update', 'delete'].includes(operation) &&
        item.linkType === 'internal'
      ) {
        const url = operation === 'delete' ? '/cases' : item.url;
        const { response, data } = await triggerRevalidation(url);

        if (response.status !== 200) {
          throw new Error('Failed to trigger revalidation of the frontend application.');
        } else if (data.revalidated) {
          console.log('NextJs Revalidation triggered successfully');
        }
      }
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
    title: text({
      validation: { isRequired: true },
      ui: {
        description:
          'This required field is used to specify the title of the case, which appears at the top of the page, represents the name of the case and will also appear in the browser tab.',
      },
    }),

    linkType: select({
      isRequired: true,
      options: [
        { label: 'Internal', value: 'internal' },
        { label: 'External', value: 'external' },
        { label: 'None', value: 'none' },
      ],
      defaultValue: 'internal',
      ui: {
        description:
          'If "Internal" is selected, a separate page will be generated for the case. If "External" is selected, the case will only be rendered on the predefined "/cases" page with an external link. If "None" is selected, the case will also only be rendered on the predefined "/cases" page but without a link.',
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
      ui: {
        description:
          'This is not required component of the case layout. A brief introductory text that complements the title.',
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

    caseImage: json({
      ui: {
        description:
          'This required image will only be displayed on the predefined page "/cases". It is used to illustrate the case in a case card ',
        views: './customViews/fields/ImageLibraryField.jsx',
        createView: { fieldMode: 'edit' },
        listView: { fieldMode: 'hidden' },
        itemView: { fieldMode: 'edit' },
      },
    }),

    quote: text({
      validation: { isRequired: true },
      ui: {
        description:
          'This required quote will only be rendered on the predefined page "/cases" and will serve as the descriptive text for the case.',
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

    ...group({
      label: 'Resources',
      description:
        'Select resources to showcase in the designated resources section, consistently located at the bottom of the page. If no resources are chosen, the section will remain hidden. However, if resources are selected, completion of all fields is mandatory.',
      fields: {
        resourcesTitle: text({
          ui: {
            description: 'This field specifies the title of the resources section.',
          },
        }),
        resourcesPreamble: text({
          ui: {
            description: 'This field specifies the preamble of the resources section.',
          },
        }),
        resources: relationship({
          ref: 'Resource',
          many: true,
          ui: {
            description:
              'Choose resources to be displayed in the resources section. Selected resources will be rendered in the order they are chosen.',
          },
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
        description:
          'This field determines the current status of the case. If set to "Draft," the case will not be available in the frontend application.',
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
