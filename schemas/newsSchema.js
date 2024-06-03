import { list } from '@keystone-6/core';
import { text, timestamp, relationship, select, json } from '@keystone-6/core/fields';
import { group } from '@keystone-6/core';
import { allOperations } from '@keystone-6/core/access';
import { isSignedIn, permissions, rules } from '../auth/access.js';

import { buildSlug } from '../utils/buildSlug.js';
import triggerRevalidation from '../utils/triggerRevalidation.js';

export const newsSchema = list({
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
  graphql: {
    plural: 'NewsItems',
  },
  hooks: {
    afterOperation: async ({ operation, context, listKey, item }) => {
      if (operation === 'create' || operation === 'update' || operation === 'delete') {
        const url = operation === 'delete' ? '/news' : item.slug;

        const { data } = await triggerRevalidation(url);

        if (data.revalidated) console.log('NextJs Revalidation triggered successfully');
      }
    },
  },
  ui: {
    label: 'News',
    singular: 'News',
    plural: 'News Items',
    path: 'news',
    labelField: 'title',
    listView: {
      initialColumns: ['title', 'newsCategory', 'createdAt'],
      initialSort: { field: 'createdAt', direction: 'DESC' },
      pageSize: 50,
    },
  },
  fields: {
    title: text({
      isIndexed: 'unique',
      validation: { isRequired: true },
      ui: {
        description:
          'This required field is used to specify the title of the news, which appears at the top of the page, represents the name of the news and will also appear in the browser tab. Must be unique.',
      },
    }),

    slug: text({
      isIndexed: 'unique',
      ui: {
        itemView: {
          fieldPosition: 'sidebar',
        },
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
        description:
          'This required field specifies the category assigned to the news. The news categories will be utilized in news sections, rendererd above the title on the news page and on the predefined page "/news" the user will be able to sort based on this category.',
      },
    }),

    relatedChapters: relationship({
      ref: 'Chapter',
      many: true,
      ui: {
        description:
          'This field allows the editor to associate a news article with a specific chapter. By selecting related chapters, the news article becomes linked to the corresponding chapter.',
      },
    }),

    image: json({
      ui: {
        description:
          'This required field specifies the image for the news article. It will be rendered at the top of the news page and also in the news card on the predefined page "/news". ',
        views: './customViews/fields/ImageLibraryField.jsx',
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

    ...group({
      label: 'Resources',
      description:
        'Select resources to showcase in the designated resources section, consistently located at the bottom of the page. If no resources are chosen, the section will remain hidden.',
      fields: {
        resources: relationship({
          ref: 'Resource',
          many: true,
          ui: {
            hideCreate: true,
            description:
              'Choose resources to be displayed in the resources section. Selected resources will be rendered in the order they are chosen.',
          },
        }),
      },
    }),

    createdAt: timestamp({
      ui: {
        itemView: {
          fieldPosition: 'sidebar',
        },
        description:
          'The date and time the news was created. If not supplied, the current date and time will be used.',
      },
      isRequired: true,
      hooks: {
        resolveInput: ({ operation, resolvedData, inputData }) => {
          if (operation === 'create' && !inputData.createdAt) {
            let date = new Date();
            date.setMilliseconds(0);
            return date.toISOString();
          } else if (operation === 'update' && inputData.createdAt) {
            let date = new Date(inputData.createdAt);
            date.setMilliseconds(0);
            return date.toISOString();
          } else {
            let date = inputData.createdAt;
            date.setMilliseconds(0);
            return date.toISOString();
          }
        },
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
          'This field determines the current status of the news. If set to "Draft," the news will not be available in the frontend application.',
        itemView: {
          fieldPosition: 'sidebar',
        },
        displayMode: 'segmented-control',
      },
    }),
  },
});
