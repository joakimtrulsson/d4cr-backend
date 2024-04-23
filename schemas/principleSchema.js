import { list } from '@keystone-6/core';
import { text, json, select, relationship } from '@keystone-6/core/fields';
import { group } from '@keystone-6/core';
import { allOperations } from '@keystone-6/core/access';
import { isSignedIn, permissions, rules } from '../auth/access.js';

import { buildSlug } from '../utils/buildSlug.js';

export const principleSchema = list({
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
    isHidden: (args) => {
      return !permissions?.canManageAllItems(args);
    },
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
          'This required field is used to specify the title of the principle, which appears at the top of the principle page, represents the name of the principle and will also appear in the browser tab.',
      },
    }),

    slug: text({
      isIndexed: 'unique',
      ui: {
        itemView: {
          fieldPosition: 'sidebar',
        },
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
    subHeader: text({
      validation: {
        isRequired: true,
      },
      ui: {
        description:
          'This required field is used to provide additional text that will be displayed beneath the title on the principle page as well as on principle sections.',
      },
    }),

    quote: text({
      ui: {
        description:
          'This field is utilized to display a quote that complements the title and subHeader at the top of the page.',
      },
    }),

    quoteAuthor: text({
      ui: {
        description:
          'This field specifies the source or author of the quote displayed alongside the title, subHeader, and quote on the principle page.',
      },
    }),

    image: json({
      ui: {
        description:
          'This field specifies the image that will be displayed beneath the quote on the page, as well as in Principle Sections. For optimal user experience, the image is recommended to have a transparent background.',
        views: './customViews/fields/ImageLibraryField.jsx',
        createView: { fieldMode: 'edit' },
        listView: { fieldMode: 'hidden' },
        itemView: { fieldMode: 'edit' },
      },
    }),

    subPrinciples: json({
      ui: {
        description:
          'This required field specifies the sub-principles associated with the main principle. These sub-principles will be displayed beneath the fields mentioned above, rendered as a list where each sub-principle is accompanied by a arrow icon pointing to the text.',
        views: './customViews/fields/SubPrinciplesField.jsx',
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

    ...group({
      label: 'Principle Taxonomy',
      description: 'Select the principle category and number for this principle.',
      fields: {
        principleCategory: relationship({
          ref: 'PrincipleCategory.principles',
          many: false,
          validation: { isRequired: true },
          ui: {
            description:
              'This required field specifies the category assigned to the principle. The principle categories will be utilized in principle sections to organize and list all principles accordingly. Principles will be sorted based on this category.',
          },
        }),

        principleNumber: relationship({
          validation: { isRequired: true },
          ref: 'PrincipleNumber.principles',
          many: false,
          ui: {
            description:
              'This required field assigns a unique number to each principle. It will be utilized in generating the principles slug and will be displayed alongside the title on the page and in principle sections. This number ensures each principle is distinctly identified and facilitates organized navigation and referencing throughout the site.',
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
          'This field determines the current status of the principle. If set to "Draft," the principle will not be available in the frontend application.',
        itemView: {
          fieldPosition: 'sidebar',
        },
        displayMode: 'segmented-control',
      },
    }),
  },
});
