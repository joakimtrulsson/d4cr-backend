import { list } from '@keystone-6/core';
import { text, json, select, relationship } from '@keystone-6/core/fields';
import { allOperations } from '@keystone-6/core/access';
import { isSignedIn, permissions, rules } from '../auth/access';

import { buildSlug } from '../utils/buildSlug';

export const principleSchema = list({
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
      initialColumns: ['title', 'principleNumber', 'principleCategory', 'slug', 'status'],
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
          'The path name for the principle. Must be unique. If not supplied, it will be generated from the principle number.',
      },
      hooks: {
        resolveInput: async ({ operation, resolvedData, inputData, item }) => {
          let principleNumber = null;

          try {
            const response = await fetch(process.env.API_URL, {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
              },
              body: JSON.stringify({
                query: `
                  query Query($where: PrincipleNumberWhereUniqueInput!) {
                    principleNumber(where: $where) {
                      number
                    }
                  }
                `,
                variables: {
                  where: {
                    id: inputData.principleNumber?.connect?.id || item.principleNumberId,
                  },
                },
              }),
            });

            const { data } = await response.json();

            principleNumber = data.principleNumber.number;
          } catch (error) {
            console.error(error);
          }

          if (operation === 'create' && !inputData.slug) {
            return buildSlug(`principle-${principleNumber.toString()}`);
          }

          if (operation === 'create' && inputData.slug) {
            return buildSlug(inputData.slug);
          }

          if (operation === 'update' && inputData.slug) {
            return buildSlug(inputData.slug);
          }

          if (operation === 'update' && !inputData.slug) {
            return buildSlug(`principle-${principleNumber.toString()}`);
          }
        },
      },
    }),
    subHeader: text({}),

    quote: text({}),

    quoteAuthor: text({}),

    image: json({
      ui: {
        views: './customViews/ImageLibrary.jsx',
        createView: { fieldMode: 'edit' },
        listView: { fieldMode: 'hidden' },
        itemView: { fieldMode: 'edit' },
      },
    }),

    subPrinciples: json({
      ui: {
        views: './customViews/SubPrinciples.jsx',
        createView: { fieldMode: 'edit' },
        listView: { fieldMode: 'hidden' },
        itemView: { fieldMode: 'edit' },
      },
    }),

    resources: json({
      ui: {
        views: './customViews/Resources.jsx',
        createView: { fieldMode: 'edit' },
        listView: { fieldMode: 'hidden' },
        itemView: { fieldMode: 'edit' },
      },
    }),

    principleCategory: relationship({
      ref: 'PrincipleCategory.principles',
      many: true,
      ui: {
        description: 'Reference to principle category.',
      },
    }),

    principleNumber: relationship({
      validation: { isRequired: true },
      ref: 'PrincipleNumber.principles',
      many: false,
      ui: {
        description: 'Reference to principle number.',
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
  },
});
