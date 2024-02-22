import { list } from '@keystone-6/core';
import { text, image, timestamp, integer } from '@keystone-6/core/fields';

import { allOperations } from '@keystone-6/core/access';
import { isSignedIn, permissions, rules } from '../auth/access';

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
    title: text(),

    altText: text(),

    file: image({ storage: 'imageStorage' }),

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
