import { list } from '@keystone-6/core';
import { text, image, timestamp, integer } from '@keystone-6/core/fields';

import { allOperations } from '@keystone-6/core/access';
import { isSignedIn, permissions, rules } from '../auth/access.js';
import { validate } from 'uuid';

export const imageSchema = list({
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
  fields: {
    title: text({
      hooks: {
        resolveInput: ({ operation, resolvedData, inputData }) => {
          if (operation === 'create' && !inputData.title) {
            return resolvedData.file.id;
          }

          if (operation === 'update' && !resolvedData.title) {
            return resolvedData.file.id;
          }

          return resolvedData.title;
        },
      },
      ui: {
        description:
          'This field specifies the title of the image, which is automatically generated from the uploaded image URL.',
        itemView: {
          fieldMode: 'read',
        },
      },
    }),

    altText: text({
      validation: { isRequired: true },
      ui: {
        description:
          'This required field specifies the alternative text for the image. Alt text provides a textual description of the image, which is essential for accessibility and SEO purpose.',
      },
    }),

    file: image({ label: 'Image', storage: 'imageStorage' }),

    createdAt: timestamp({ isRequired: true, defaultValue: { kind: 'now' } }),

    size: integer({
      ui: {
        createView: {
          fieldMode: 'hidden',
        },
        itemView: {
          fieldMode: 'read',
        },
      },
      hooks: {
        resolveInput: ({ operation, resolvedData, inputData }) => {
          if (operation === 'create') {
            return resolvedData.file.filesize;
          }
        },
      },
    }),

    url: text({
      ui: {
        createView: {
          fieldMode: 'hidden',
        },
        itemView: {
          fieldMode: 'read',
        },
      },
      hooks: {
        resolveInput: ({ operation, resolvedData, inputData }) => {
          let url = process.env.IMAGE_URL;

          if (operation === 'create') {
            return `${url}/${resolvedData.file.id}.${resolvedData.file.extension}`;
          }
        },
      },
    }),
  },
});
