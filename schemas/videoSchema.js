import { list } from '@keystone-6/core';
import { text, file, timestamp, integer } from '@keystone-6/core/fields';

import { allOperations } from '@keystone-6/core/access';
import { isSignedIn, permissions, rules } from '../auth/access';

export const videoSchema = list({
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

    file: file({
      storage: 'videoStorage',
    }),

    createdAt: timestamp({ isRequired: true, defaultValue: { kind: 'now' } }),

    size: integer({
      hooks: {
        resolveInput: ({ operation, resolvedData, inputData }) => {
          if (operation === 'create') {
            return resolvedData.file.filesize;
          }
        },
      },
    }),

    thumbnailUrl: text({}),

    url: text({
      ui: {
        itemView: {
          fieldMode: 'read',
        },
      },
      hooks: {
        resolveInput: ({ operation, resolvedData, inputData }) => {
          let url = process.env.MEDIA_URL;

          if (operation === 'create') {
            return `${url}/${resolvedData.file.filename}`;
          }
        },
      },
    }),
  },
});
